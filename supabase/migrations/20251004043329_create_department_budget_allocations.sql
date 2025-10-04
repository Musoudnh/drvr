/*
  # Create Department Budget Allocation and Tracking System

  1. New Tables
    - department_budget_allocations: Annual budget pools per department
    - project_approval_workflow: Track approval progress through threshold tiers

  2. Updates to Existing Tables
    - roadmap_projects: Add independent scenario budgets and fiscal year fields

  3. Security
    - Enable RLS with appropriate policies
*/

-- Create department budget allocations table
CREATE TABLE IF NOT EXISTS department_budget_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  fiscal_year integer NOT NULL,
  scenario text NOT NULL CHECK (scenario IN ('Base Case', 'Best Case', 'Downside Case')),
  allocated_budget numeric NOT NULL DEFAULT 0,
  committed_budget numeric DEFAULT 0,
  spent_budget numeric DEFAULT 0,
  available_budget numeric GENERATED ALWAYS AS (allocated_budget - committed_budget - spent_budget) STORED,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(department_id, fiscal_year, scenario)
);

-- Create project approval workflow tracking table
CREATE TABLE IF NOT EXISTS project_approval_workflow (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES roadmap_projects(id) ON DELETE CASCADE,
  threshold_tier_id uuid REFERENCES approval_thresholds(id),
  current_step integer DEFAULT 1,
  total_steps integer DEFAULT 1,
  required_approvers text[] DEFAULT '{}',
  completed_approvers text[] DEFAULT '{}',
  pending_approvers text[] DEFAULT '{}',
  workflow_status text DEFAULT 'pending' CHECK (workflow_status IN ('pending', 'in_progress', 'approved', 'rejected', 'revision_requested')),
  submitted_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  sla_deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add new columns to roadmap_projects for independent scenario budgets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'budget_base_case'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN budget_base_case numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'budget_best_case'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN budget_best_case numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'budget_downside_case'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN budget_downside_case numeric DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'fiscal_year'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN fiscal_year integer DEFAULT EXTRACT(YEAR FROM CURRENT_DATE);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'project_visibility'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN project_visibility text DEFAULT 'private_draft';
    UPDATE roadmap_projects SET project_visibility = 'private_draft' WHERE project_visibility IS NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN submitted_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roadmap_projects' AND column_name = 'approved_at'
  ) THEN
    ALTER TABLE roadmap_projects ADD COLUMN approved_at timestamptz;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE department_budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_approval_workflow ENABLE ROW LEVEL SECURITY;

-- Policies for department_budget_allocations
CREATE POLICY "Users can view their department budgets"
  ON department_budget_allocations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage department budgets"
  ON department_budget_allocations FOR ALL
  TO authenticated
  USING (true);

-- Policies for project_approval_workflow
CREATE POLICY "Users can view approval workflows"
  ON project_approval_workflow FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage workflows"
  ON project_approval_workflow FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dept_budget_dept_year ON department_budget_allocations(department_id, fiscal_year);
CREATE INDEX IF NOT EXISTS idx_dept_budget_scenario ON department_budget_allocations(scenario);
CREATE INDEX IF NOT EXISTS idx_project_workflow_project ON project_approval_workflow(project_id);
CREATE INDEX IF NOT EXISTS idx_project_workflow_status ON project_approval_workflow(workflow_status);
CREATE INDEX IF NOT EXISTS idx_roadmap_projects_fiscal_year ON roadmap_projects(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_roadmap_projects_visibility ON roadmap_projects(project_visibility);
