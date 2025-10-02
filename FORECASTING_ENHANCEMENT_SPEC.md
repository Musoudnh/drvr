# Advanced Forecasting & Planning System - Technical Specification

## Executive Summary

This document outlines the technical specifications for enhancing the existing budgeting system with advanced forecasting and planning capabilities including rolling forecasts, dual planning architecture (top-down and bottom-up), and comprehensive role-based permissions.

---

## 1. Rolling Forecasts Implementation

### 1.1 Overview
Transform the current fixed yearly forecast into a dynamic rolling 12-month forecast that automatically updates as time progresses.

### 1.2 Database Schema Changes

#### New Table: `rolling_forecast_periods`
```sql
CREATE TABLE rolling_forecast_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_start_date date NOT NULL,
  period_end_date date NOT NULL,
  months_forward integer DEFAULT 12,
  is_current boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_current_period UNIQUE (is_current) WHERE is_current = true
);
```

#### Modified Table: `forecast_line_items`
Add rolling forecast support:
```sql
ALTER TABLE forecast_line_items
  ADD COLUMN period_date date,
  ADD COLUMN period_offset integer,
  ADD COLUMN is_rolling_forecast boolean DEFAULT false,
  ADD COLUMN rolling_period_id uuid REFERENCES rolling_forecast_periods(id);

CREATE INDEX idx_forecast_period_date ON forecast_line_items(period_date);
CREATE INDEX idx_forecast_rolling_period ON forecast_line_items(rolling_period_id);
```

#### New Table: `rolling_forecast_snapshots`
Track historical rolling forecast states:
```sql
CREATE TABLE rolling_forecast_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date date NOT NULL,
  rolling_period_id uuid REFERENCES rolling_forecast_periods(id),
  data jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_snapshots_date ON rolling_forecast_snapshots(snapshot_date);
```

### 1.3 Business Logic

#### Rolling Period Calculation
- **Current Period**: Always starts from the first day of the current month
- **Forward Looking**: Projects 12 months forward from current period
- **Auto-Advance**: Automatically advances on the 1st of each month
- **Historical Lock**: Previous months can be locked when actuals are entered

#### Data Migration Strategy
1. Convert existing yearly forecasts to rolling format
2. Calculate period_offset for each month (0 = current month, 1 = next month, etc.)
3. Maintain backward compatibility with fixed yearly views
4. Create snapshots of current state before migration

### 1.4 UI Integration Points

#### New Components
- `RollingForecastView.tsx` - Main rolling forecast grid
- `PeriodSelector.tsx` - Select and manage forecast periods
- `RollingVsStaticToggle.tsx` - Switch between rolling and fixed views
- `PeriodAdvanceModal.tsx` - Manual period advancement controls

#### Existing Component Modifications
- `Forecasting.tsx`: Add rolling forecast mode toggle
- Add period selector in header
- Modify month columns to show relative periods (M+0, M+1, M+2, etc.)
- Add "Roll Forward" action button

---

## 2. Dual Planning Architecture

### 2.1 Overview
Enable both top-down (corporate-level planning distributed downward) and bottom-up (department-level planning rolled up) planning methodologies.

### 2.2 Database Schema

#### New Table: `departments`
```sql
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  parent_department_id uuid REFERENCES departments(id),
  cost_center text,
  budget_holder_id uuid REFERENCES auth.users(id),
  organization_id uuid NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_departments_parent ON departments(parent_department_id);
CREATE INDEX idx_departments_budget_holder ON departments(budget_holder_id);
```

#### New Table: `budget_planning_cycles`
```sql
CREATE TABLE budget_planning_cycles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  fiscal_year integer NOT NULL,
  planning_type text NOT NULL CHECK (planning_type IN ('top_down', 'bottom_up', 'hybrid')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'submitted', 'approved', 'locked')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  submission_deadline date,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_planning_cycles_year ON budget_planning_cycles(fiscal_year);
CREATE INDEX idx_planning_cycles_status ON budget_planning_cycles(status);
```

#### New Table: `department_budgets`
```sql
CREATE TABLE department_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planning_cycle_id uuid REFERENCES budget_planning_cycles(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  gl_code text NOT NULL,
  gl_name text NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  budgeted_amount numeric(15, 2) NOT NULL DEFAULT 0,
  allocated_amount numeric(15, 2),
  planning_source text CHECK (planning_source IN ('top_down', 'bottom_up')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  notes text,
  submitted_by uuid REFERENCES auth.users(id),
  submitted_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_dept_budget UNIQUE (planning_cycle_id, department_id, gl_code, month, year)
);

CREATE INDEX idx_dept_budgets_cycle ON department_budgets(planning_cycle_id);
CREATE INDEX idx_dept_budgets_dept ON department_budgets(department_id);
CREATE INDEX idx_dept_budgets_status ON department_budgets(status);
```

#### New Table: `budget_allocations`
Top-down allocations from corporate to departments:
```sql
CREATE TABLE budget_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planning_cycle_id uuid REFERENCES budget_planning_cycles(id) ON DELETE CASCADE,
  from_department_id uuid REFERENCES departments(id),
  to_department_id uuid REFERENCES departments(id),
  gl_code text NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  allocated_amount numeric(15, 2) NOT NULL,
  allocation_method text CHECK (allocation_method IN ('percentage', 'fixed', 'driver_based')),
  allocation_driver text,
  allocation_percentage numeric(5, 2),
  notes text,
  allocated_by uuid REFERENCES auth.users(id),
  allocated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_allocation UNIQUE (planning_cycle_id, to_department_id, gl_code, month, year)
);

CREATE INDEX idx_allocations_cycle ON budget_allocations(planning_cycle_id);
CREATE INDEX idx_allocations_to_dept ON budget_allocations(to_department_id);
```

#### New Table: `budget_reconciliation`
Track differences between top-down and bottom-up:
```sql
CREATE TABLE budget_reconciliation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planning_cycle_id uuid REFERENCES budget_planning_cycles(id) ON DELETE CASCADE,
  department_id uuid REFERENCES departments(id),
  gl_code text NOT NULL,
  month text NOT NULL,
  year integer NOT NULL,
  top_down_amount numeric(15, 2),
  bottom_up_amount numeric(15, 2),
  variance_amount numeric(15, 2),
  variance_percentage numeric(10, 2),
  reconciled_amount numeric(15, 2),
  reconciliation_status text DEFAULT 'pending' CHECK (reconciliation_status IN ('pending', 'reviewing', 'resolved', 'escalated')),
  reconciliation_notes text,
  reconciled_by uuid REFERENCES auth.users(id),
  reconciled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT unique_reconciliation UNIQUE (planning_cycle_id, department_id, gl_code, month, year)
);

CREATE INDEX idx_reconciliation_cycle ON budget_reconciliation(planning_cycle_id);
CREATE INDEX idx_reconciliation_status ON budget_reconciliation(reconciliation_status);
```

### 2.3 Planning Workflows

#### Top-Down Planning Flow
1. **Corporate Level**: CFO/Finance team creates high-level budget targets
2. **Allocation**: System distributes budgets to departments based on allocation rules
3. **Department Review**: Department heads review and adjust allocated budgets
4. **Approval**: Finance approves departmental adjustments
5. **Lock**: Finalized budgets are locked for the cycle

#### Bottom-Up Planning Flow
1. **Department Draft**: Department heads create detailed budgets
2. **Department Submit**: Budgets submitted for review
3. **Finance Review**: Finance team reviews submissions
4. **Consolidation**: System rolls up all department budgets
5. **Approval/Rejection**: Finance approves or sends back for revision

#### Hybrid/Reconciliation Flow
1. Both top-down and bottom-up processes run in parallel
2. System identifies variances automatically
3. Reconciliation workflow for resolving differences
4. Final approved budget incorporates both approaches

### 2.4 UI Components

#### New Pages/Components
- `PlanningCycleDashboard.tsx` - Overview of active planning cycles
- `TopDownPlanning.tsx` - Corporate-level budget planning
- `BottomUpPlanning.tsx` - Department-level budget submission
- `BudgetAllocationTool.tsx` - Allocate budgets to departments
- `BudgetReconciliation.tsx` - Reconcile top-down vs bottom-up
- `DepartmentBudgetView.tsx` - Department-specific budget view
- `SubmissionWorkflow.tsx` - Department budget submission interface

---

## 3. Role-Based Permissions System

### 3.1 Overview
Implement granular role-based access control with four primary roles and flexible permission assignments.

### 3.2 Database Schema

#### New Table: `user_roles`
```sql
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_type text NOT NULL CHECK (role_type IN ('viewer', 'team_member', 'admin', 'super_user')),
  department_id uuid REFERENCES departments(id),
  organization_id uuid NOT NULL,
  is_active boolean DEFAULT true,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  CONSTRAINT unique_user_role_dept UNIQUE (user_id, role_type, department_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_dept ON user_roles(department_id);
CREATE INDEX idx_user_roles_type ON user_roles(role_type);
```

#### New Table: `role_permissions`
```sql
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_type text NOT NULL,
  resource_type text NOT NULL,
  action text NOT NULL CHECK (action IN ('view', 'create', 'edit', 'delete', 'approve', 'submit', 'allocate')),
  scope text NOT NULL CHECK (scope IN ('own', 'department', 'all')),
  conditions jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_type);
CREATE INDEX idx_role_permissions_resource ON role_permissions(resource_type);
```

#### New Table: `permission_grants`
Custom permission grants beyond standard roles:
```sql
CREATE TABLE permission_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  resource_id uuid,
  action text NOT NULL,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  reason text,
  is_active boolean DEFAULT true
);

CREATE INDEX idx_permission_grants_user ON permission_grants(user_id);
CREATE INDEX idx_permission_grants_resource ON permission_grants(resource_type, resource_id);
```

### 3.3 Role Definitions

#### 1. Viewer (Regular User)
**Permissions:**
- View forecasts and budgets for their department only
- View approved budgets across departments (read-only)
- View reports and dashboards with department-level filtering
- No edit capabilities

**Database Policies:**
```sql
-- Example policy for viewers
CREATE POLICY "Viewers can view department budgets"
  ON department_budgets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_type = 'viewer'
      AND ur.department_id = department_budgets.department_id
      AND ur.is_active = true
    )
  );
```

#### 2. Team Member
**Permissions:**
- All Viewer permissions
- Create and edit budget line items within assigned department(s)
- Submit department budgets for approval
- Add comments and notes to budget items
- View budget submission status

**Restrictions:**
- Cannot approve budgets
- Cannot delete submitted budgets
- Cannot access other departments' draft budgets

#### 3. Admin
**Permissions:**
- View all departments and budgets
- Edit any budget line item across all departments
- Save and lock forecast versions
- Approve/reject department budget submissions
- Create and manage planning cycles
- View all audit trails and change logs

**Restrictions:**
- Cannot create scenarios (reserved for Super Users)
- Cannot modify system-wide settings

#### 4. Super User
**Permissions:**
- All Admin permissions
- Create, edit, and delete scenarios
- Compare multiple forecast versions
- Configure allocation rules and drivers
- Manage departments and organizational structure
- Grant/revoke permissions to other users
- Access to all system settings

### 3.4 Permission Matrix

| Resource | Viewer | Team Member | Admin | Super User |
|----------|--------|-------------|-------|------------|
| **Forecasts** |
| View Own Dept | ✓ | ✓ | ✓ | ✓ |
| View All Depts | - | - | ✓ | ✓ |
| Edit Own Dept | - | ✓ | ✓ | ✓ |
| Edit All Depts | - | - | ✓ | ✓ |
| Save Version | - | - | ✓ | ✓ |
| **Budgets** |
| View Own Dept | ✓ | ✓ | ✓ | ✓ |
| Create Line Items | - | ✓ (own dept) | ✓ | ✓ |
| Edit Line Items | - | ✓ (own dept) | ✓ | ✓ |
| Submit Budget | - | ✓ | ✓ | ✓ |
| Approve Budget | - | - | ✓ | ✓ |
| **Scenarios** |
| View Scenarios | ✓ | ✓ | ✓ | ✓ |
| Create Scenarios | - | - | - | ✓ |
| Edit Scenarios | - | - | - | ✓ |
| Delete Scenarios | - | - | - | ✓ |
| Apply Scenarios | - | - | - | ✓ |
| **Planning** |
| Top-Down Planning | - | - | ✓ | ✓ |
| Budget Allocation | - | - | ✓ | ✓ |
| Reconciliation | - | - | ✓ | ✓ |
| **Admin** |
| Manage Departments | - | - | - | ✓ |
| Manage Users | - | - | - | ✓ |
| System Settings | - | - | - | ✓ |

### 3.5 RLS Policies Implementation

#### Forecast Versions
```sql
-- Super Users and Admins can create versions
CREATE POLICY "Admins can create forecast versions"
  ON forecast_versions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_type IN ('admin', 'super_user')
      AND is_active = true
    )
  );

-- Team members can view their department forecasts
CREATE POLICY "Team members can view department forecasts"
  ON forecast_versions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_type IN ('team_member', 'viewer')
      AND is_active = true
    )
  );
```

#### Department Budgets
```sql
-- Team members can create budget items for their department
CREATE POLICY "Team members can create department budget items"
  ON department_budgets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_type IN ('team_member', 'admin', 'super_user')
      AND ur.department_id = department_budgets.department_id
      AND ur.is_active = true
    )
  );

-- Team members can edit draft budgets in their department
CREATE POLICY "Team members can edit department budget items"
  ON department_budgets FOR UPDATE
  TO authenticated
  USING (
    department_budgets.status = 'draft'
    AND EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_type IN ('team_member', 'admin', 'super_user')
      AND ur.department_id = department_budgets.department_id
      AND ur.is_active = true
    )
  )
  WITH CHECK (
    department_budgets.status = 'draft'
    AND EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role_type IN ('team_member', 'admin', 'super_user')
      AND ur.department_id = department_budgets.department_id
      AND ur.is_active = true
    )
  );

-- Only admins can approve budgets
CREATE POLICY "Admins can approve budgets"
  ON department_budgets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_type IN ('admin', 'super_user')
      AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_type IN ('admin', 'super_user')
      AND is_active = true
    )
  );
```

#### Scenarios
```sql
-- Only Super Users can manage scenarios
CREATE POLICY "Super users can create scenarios"
  ON applied_scenarios FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_type = 'super_user'
      AND is_active = true
    )
  );

CREATE POLICY "Super users can edit scenarios"
  ON applied_scenarios FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_type = 'super_user'
      AND is_active = true
    )
  );

CREATE POLICY "Everyone can view scenarios"
  ON applied_scenarios FOR SELECT
  TO authenticated
  USING (true);
```

---

## 4. API Integration Points

### 4.1 New API Endpoints

#### Rolling Forecasts
```typescript
// Get current rolling forecast period
GET /api/rolling-forecasts/current

// Get rolling forecast data
GET /api/rolling-forecasts/:periodId

// Create new rolling period
POST /api/rolling-forecasts/periods

// Advance rolling period
POST /api/rolling-forecasts/advance

// Create snapshot
POST /api/rolling-forecasts/snapshots
```

#### Planning Cycles
```typescript
// List planning cycles
GET /api/planning-cycles

// Create planning cycle
POST /api/planning-cycles

// Get cycle details
GET /api/planning-cycles/:id

// Update cycle status
PATCH /api/planning-cycles/:id/status

// Submit department budget
POST /api/planning-cycles/:id/departments/:deptId/submit

// Approve department budget
POST /api/planning-cycles/:id/departments/:deptId/approve
```

#### Budget Allocation
```typescript
// Allocate budget top-down
POST /api/budget-allocations

// Get department allocations
GET /api/departments/:id/allocations

// Update allocation
PATCH /api/budget-allocations/:id
```

#### Reconciliation
```typescript
// Get reconciliation items
GET /api/reconciliation/:cycleId

// Resolve variance
POST /api/reconciliation/:id/resolve

// Escalate issue
POST /api/reconciliation/:id/escalate
```

#### Permissions
```typescript
// Check user permissions
GET /api/permissions/check

// Get user roles
GET /api/users/:id/roles

// Grant role
POST /api/users/:id/roles

// Revoke role
DELETE /api/users/:id/roles/:roleId

// Get role permissions
GET /api/roles/:roleType/permissions
```

### 4.2 Service Layer Updates

Create new service files:
- `rollingForecastService.ts` - Rolling forecast logic
- `planningCycleService.ts` - Planning cycle management
- `budgetAllocationService.ts` - Budget allocation logic
- `reconciliationService.ts` - Variance reconciliation
- `permissionService.ts` - Permission checking and validation

---

## 5. UI Integration Strategy

### 5.1 Navigation Updates

Add new menu items:
```typescript
{
  path: '/forecasting/rolling',
  label: 'Rolling Forecast',
  icon: 'TrendingUp',
  permissions: ['view_forecasts']
},
{
  path: '/planning/cycles',
  label: 'Planning Cycles',
  icon: 'Calendar',
  permissions: ['view_planning']
},
{
  path: '/planning/top-down',
  label: 'Top-Down Planning',
  icon: 'ArrowDown',
  permissions: ['admin', 'super_user']
},
{
  path: '/planning/bottom-up',
  label: 'My Department Budget',
  icon: 'ArrowUp',
  permissions: ['team_member', 'admin', 'super_user']
},
{
  path: '/planning/reconciliation',
  label: 'Budget Reconciliation',
  icon: 'GitMerge',
  permissions: ['admin', 'super_user']
}
```

### 5.2 Component Architecture

#### Shared Components
- `PermissionGate.tsx` - Wrap components with permission checks
- `DepartmentSelector.tsx` - Select department for filtered views
- `BudgetStatus.tsx` - Display budget submission status
- `ApprovalWorkflow.tsx` - Visual approval workflow component
- `VarianceIndicator.tsx` - Highlight variances between plans

#### Context Providers
```typescript
// PermissionContext.tsx
interface PermissionContextType {
  hasPermission: (resource: string, action: string) => boolean;
  userRoles: UserRole[];
  userDepartments: Department[];
  canAccess: (path: string) => boolean;
}

// PlanningContext.tsx
interface PlanningContextType {
  activeCycle: PlanningCycle | null;
  cycleStatus: string;
  canSubmit: boolean;
  canApprove: boolean;
  submitBudget: () => Promise<void>;
  approveBudget: () => Promise<void>;
}
```

### 5.3 Existing Component Modifications

#### Forecasting.tsx
```typescript
// Add rolling forecast toggle
const [forecastMode, setForecastMode] = useState<'fixed' | 'rolling'>('fixed');

// Add permission checks
const { hasPermission } = usePermissions();
const canEdit = hasPermission('forecast_line_items', 'edit');
const canSave = hasPermission('forecast_versions', 'create');

// Filter data by department if team member
const filteredData = useMemo(() => {
  if (userRole === 'team_member' || userRole === 'viewer') {
    return forecastData.filter(item =>
      userDepartments.includes(item.department_id)
    );
  }
  return forecastData;
}, [forecastData, userRole, userDepartments]);
```

---

## 6. Data Validation & Approval Workflows

### 6.1 Validation Rules

#### Budget Submission Validation
```typescript
interface BudgetValidationRules {
  requiresAllMonthsPopulated: boolean;
  requiresNotes: boolean;
  requiresMinimumAmount: number;
  requiresMaximumAmount: number;
  requiresApproverReview: boolean;
  allowsNegativeValues: boolean;
}

// Validation function
async function validateBudgetSubmission(
  budget: DepartmentBudget,
  rules: BudgetValidationRules
): Promise<ValidationResult> {
  const errors: string[] = [];

  // Check all months populated
  if (rules.requiresAllMonthsPopulated) {
    const months = ['Jan', 'Feb', 'Mar', ...];
    const populatedMonths = budget.items.map(i => i.month);
    const missing = months.filter(m => !populatedMonths.includes(m));
    if (missing.length > 0) {
      errors.push(`Missing budget for months: ${missing.join(', ')}`);
    }
  }

  // Check amounts
  budget.items.forEach(item => {
    if (item.amount < rules.requiresMinimumAmount) {
      errors.push(`Amount too low for ${item.glCode} in ${item.month}`);
    }
    if (!rules.allowsNegativeValues && item.amount < 0) {
      errors.push(`Negative values not allowed for ${item.glCode}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

### 6.2 Approval Workflow States

```typescript
enum BudgetStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUESTED = 'revision_requested',
  LOCKED = 'locked'
}

interface ApprovalWorkflow {
  status: BudgetStatus;
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  revisionNotes?: string;
}
```

### 6.3 Approval Process Flow

```typescript
// Department Head submits budget
async function submitDepartmentBudget(
  deptId: string,
  cycleId: string
): Promise<void> {
  // Validate budget
  const validation = await validateBudgetSubmission(budget, rules);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  // Update status
  await supabase
    .from('department_budgets')
    .update({
      status: 'submitted',
      submitted_by: user.id,
      submitted_at: new Date()
    })
    .eq('department_id', deptId)
    .eq('planning_cycle_id', cycleId);

  // Notify approvers
  await notifyApprovers(deptId, cycleId);
}

// Admin approves budget
async function approveDepartmentBudget(
  deptId: string,
  cycleId: string,
  notes?: string
): Promise<void> {
  // Check permissions
  if (!hasPermission('department_budgets', 'approve')) {
    throw new Error('Insufficient permissions');
  }

  // Update status
  await supabase
    .from('department_budgets')
    .update({
      status: 'approved',
      approved_by: user.id,
      approved_at: new Date(),
      notes
    })
    .eq('department_id', deptId)
    .eq('planning_cycle_id', cycleId);

  // Notify department head
  await notifyDepartmentHead(deptId, 'approved');
}
```

---

## 7. Migration & Rollout Plan

### 7.1 Phase 1: Database Schema (Week 1)
1. Create all new tables with migrations
2. Add indexes and constraints
3. Implement RLS policies
4. Create database functions for calculations
5. Test data integrity

### 7.2 Phase 2: Permission System (Week 2)
1. Implement user_roles table and policies
2. Create permission checking service
3. Update AuthContext with role information
4. Add PermissionGate component
5. Update existing RLS policies to use roles

### 7.3 Phase 3: Rolling Forecasts (Week 3)
1. Implement rolling_forecast_periods table
2. Create rolling forecast service
3. Build RollingForecastView component
4. Add period advancement logic
5. Create snapshot functionality
6. Migrate existing data

### 7.4 Phase 4: Planning System (Week 4-5)
1. Implement departments and planning_cycles tables
2. Create department_budgets table
3. Build top-down planning interface
4. Build bottom-up planning interface
5. Implement budget allocation logic
6. Create reconciliation interface

### 7.5 Phase 5: Testing & Refinement (Week 6)
1. Integration testing across all features
2. Permission boundary testing
3. Data validation testing
4. Performance optimization
5. User acceptance testing

### 7.6 Phase 6: Documentation & Training (Week 7)
1. User documentation for each role
2. Admin guide for setup
3. API documentation
4. Training materials
5. Video tutorials

---

## 8. Security Considerations

### 8.1 Data Access Controls
- All queries filtered by user role and department
- Sensitive financial data encrypted at rest
- Audit logging for all financial changes
- Session timeout for inactive users

### 8.2 API Security
- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention through parameterized queries

### 8.3 Audit Trail
Every action tracked with:
- User ID
- Timestamp
- Action type
- Before/after values
- IP address
- User agent

---

## 9. Performance Optimization

### 9.1 Database Optimization
- Materialized views for rollup calculations
- Partitioning for large historical data
- Query optimization with proper indexes
- Connection pooling

### 9.2 Frontend Optimization
- Virtual scrolling for large data grids
- Lazy loading of department data
- Caching of permission checks
- Debounced search and filter operations

### 9.3 Caching Strategy
- Redis cache for permission checks
- Browser cache for static lookups
- Service worker for offline capability

---

## 10. Testing Strategy

### 10.1 Unit Tests
- Service layer functions
- Permission checking logic
- Data validation rules
- Calculation functions

### 10.2 Integration Tests
- End-to-end planning workflows
- Role-based access scenarios
- Data rollup and aggregation
- Approval workflows

### 10.3 Permission Tests
```typescript
describe('Permission System', () => {
  it('should allow team members to edit their department budget', async () => {
    const result = await canEditBudget(teamMemberUser, deptId);
    expect(result).toBe(true);
  });

  it('should prevent team members from editing other departments', async () => {
    const result = await canEditBudget(teamMemberUser, otherDeptId);
    expect(result).toBe(false);
  });

  it('should allow admins to edit all departments', async () => {
    const result = await canEditBudget(adminUser, anyDeptId);
    expect(result).toBe(true);
  });

  it('should only allow super users to create scenarios', async () => {
    const result = await canCreateScenario(teamMemberUser);
    expect(result).toBe(false);

    const superUserResult = await canCreateScenario(superUser);
    expect(superUserResult).toBe(true);
  });
});
```

---

## 11. Implementation Checklist

### Database
- [ ] Create all new tables with migrations
- [ ] Implement RLS policies for all tables
- [ ] Create database indexes
- [ ] Create database functions
- [ ] Set up audit triggers
- [ ] Create materialized views

### Backend Services
- [ ] rollingForecastService.ts
- [ ] planningCycleService.ts
- [ ] budgetAllocationService.ts
- [ ] reconciliationService.ts
- [ ] permissionService.ts
- [ ] departmentService.ts

### Frontend Components
- [ ] RollingForecastView.tsx
- [ ] PlanningCycleDashboard.tsx
- [ ] TopDownPlanning.tsx
- [ ] BottomUpPlanning.tsx
- [ ] BudgetAllocationTool.tsx
- [ ] BudgetReconciliation.tsx
- [ ] DepartmentBudgetView.tsx
- [ ] PermissionGate.tsx

### Context & Hooks
- [ ] PermissionContext.tsx
- [ ] PlanningContext.tsx
- [ ] usePermissions hook
- [ ] useRollingForecast hook
- [ ] usePlanningCycle hook

### Testing
- [ ] Unit tests for all services
- [ ] Integration tests for workflows
- [ ] Permission boundary tests
- [ ] UI component tests
- [ ] E2E tests

### Documentation
- [ ] User guide for each role
- [ ] Admin setup guide
- [ ] API documentation
- [ ] Database schema documentation
- [ ] Permission matrix documentation

---

## 12. Maintenance & Support

### 12.1 Monitoring
- Track query performance
- Monitor API response times
- Alert on failed budget submissions
- Track user adoption metrics

### 12.2 Backup & Recovery
- Daily database backups
- Point-in-time recovery capability
- Snapshot retention for 90 days
- Disaster recovery procedures

### 12.3 Future Enhancements
- Machine learning for budget predictions
- Integration with ERP systems
- Mobile app for budget approvals
- Advanced scenario modeling
- What-if analysis tools
- Collaborative commenting on budget items

---

## Conclusion

This specification provides a comprehensive roadmap for implementing advanced forecasting and planning capabilities while maintaining the existing UI/UX design. The phased approach ensures manageable implementation with clear milestones and deliverables.

Key Success Factors:
1. Robust permission system ensures data security
2. Flexible planning architecture supports multiple methodologies
3. Rolling forecasts provide continuous visibility
4. Clear workflows improve collaboration
5. Comprehensive audit trails ensure compliance

The implementation prioritizes data integrity, user experience, and scalability to support growing organizational needs.
