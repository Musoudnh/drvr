# Sales Scenario Drivers - User Guide

## Overview

The Sales Scenario Drivers system enables comprehensive revenue modeling with 8 specialized driver types. This allows you to model complex business scenarios by combining multiple revenue drivers and seeing their compound impact in real-time.

## Accessing the Feature

1. Navigate to **Forecasting > Scenario Planning**
2. Click the **"Sales Scenario"** button (green button with dollar sign icon)
3. The Sales Scenario Builder modal will open

## Driver Types

### 1. Volume vs Price Split
**Purpose**: Separate growth from unit volume vs. average selling price (ASP)

**Use Case**: Understanding whether growth comes from selling more units or increasing prices

**Parameters**:
- Volume Growth %: Percentage increase in units sold
- Price Growth %: Percentage increase in average price
- Base Units: Starting number of units
- Base Price: Starting price per unit

**Example**: 10% sales growth could be 5% more units + 5% higher prices

### 2. Customer Acquisition (CAC)
**Purpose**: Tie sales to CAC and marketing spend

**Use Case**: Planning customer acquisition campaigns and understanding payback periods

**Parameters**:
- Marketing Spend (Monthly): Total marketing budget
- Customers Acquired: Number of new customers per month
- Avg Revenue Per Customer: Average revenue from each customer
- CAC Payback (Months): Time to recover acquisition cost

**Example**: $50k marketing → 100 customers → $1k each = $100k revenue with 12-month payback

### 3. Retention & Churn
**Purpose**: Forecast revenue changes from retention rates or customer churn

**Use Case**: SaaS companies modeling MRR growth through churn reduction

**Parameters**:
- Current Churn Rate %: Existing monthly churn
- Target Churn Rate %: Desired churn rate
- Current MRR: Monthly recurring revenue
- Avg Customer Count: Total active customers

**Example**: Reducing churn from 5% to 3% increases MRR over time

### 4. Conversion Funnel
**Purpose**: Model leads → opportunities → closed deals conversion

**Use Case**: B2B sales teams with defined sales stages

**Parameters**:
- Leads Per Month: Top of funnel volume
- Avg Deal Size: Revenue per closed deal
- Sales Cycle (Months): Time from lead to close
- Conversion Stages: Customizable stages with rates

**Example**: 1,000 leads → 40% MQL → 50% SQL → 60% Opp → 25% Closed = 30 deals

### 5. Seasonality
**Purpose**: Adjust for seasonal patterns, quarters, or holiday periods

**Use Case**: Retail, e-commerce, or any seasonal business

**Parameters**:
- Baseline Revenue: Base monthly revenue
- Monthly Multipliers: Adjustment factor for each month (e.g., 1.3 for December)

**Example**: December multiplier of 1.3 means 30% higher revenue than baseline

### 6. Contract Terms & Renewals
**Purpose**: Model contract length and renewal rates for recurring revenue

**Use Case**: Subscription businesses with annual contracts

**Parameters**:
- Avg Contract Length (Months): Typical contract duration
- Renewal Rate %: Percentage of contracts that renew
- Expansion Revenue %: Upsell at renewal
- New ARR: Annual recurring revenue from new sales

**Example**: 12-month contracts with 85% renewal and 15% expansion revenue

### 7. Sales Rep Productivity
**Purpose**: Tie sales to headcount with per-rep quotas

**Use Case**: Inside sales teams with quota-carrying reps

**Parameters**:
- Number of Reps: Current sales team size
- Quota Per Rep (Monthly): Expected monthly revenue per rep
- Attainment %: Percentage of quota typically achieved
- New Hires: Additional reps being added
- Ramp Time (Months): Time for new reps to reach full productivity

**Example**: 10 reps × $50k quota × 85% attainment = $425k monthly

### 8. Discounting & Promotions
**Purpose**: Model how discounts affect sales volume vs. margins

**Use Case**: Promotional campaigns or pricing strategy changes

**Parameters**:
- Discount %: Average discount offered
- Volume Lift %: Sales increase from discount
- Affected Revenue %: Portion of revenue discounted
- Margin Impact %: Effect on profit margins

**Example**: 10% discount on 30% of revenue drives 20% volume increase

## Building a Scenario

### Step 1: Overview Tab
1. Enter a descriptive **Scenario Name** (e.g., "Q2 Growth Plan")
2. Set **Base Revenue** (your starting monthly revenue)
3. Add a **Description** of assumptions
4. Select **Start/End Months** and **Year**

### Step 2: Drivers Tab
1. Click **"Add Driver"** to see the driver library
2. Select driver types relevant to your scenario
3. For each driver:
   - Configure parameters based on your business
   - Set when the driver applies (start/end months)
   - Toggle active/inactive to test scenarios
   - Expand/collapse to edit details

**Tips**:
- Add multiple drivers to model compound effects
- Drivers can overlap in time periods
- Each driver calculates independently then combines
- Inactive drivers are preserved but don't affect calculations

### Step 3: Preview Tab
View real-time results as you adjust drivers:

- **Summary Cards**: Base revenue, total impact, final revenue
- **Waterfall Chart**: Visual breakdown of each driver's contribution
- **Monthly Breakdown Table**: Month-by-month revenue projections
- **Driver Breakdown**: See individual driver impacts

## Real-Time Calculations

The system calculates impacts in real-time as you adjust parameters:

1. Each driver calculates its impact independently
2. Impacts combine additively (drivers don't multiply)
3. Preview updates immediately when you change values
4. Waterfall chart shows contribution of each driver

## Saving Scenarios

1. Review all three tabs to ensure accuracy
2. Click **"Save Scenario"** at the bottom
3. Scenario is saved to your database
4. Accessible from Scenario Planning page

## Database Schema

### Tables Created
- `sales_scenarios`: Scenario metadata
- `sales_drivers`: Individual driver configurations
- `sales_driver_results`: Cached calculation results

All tables have Row Level Security enabled for authenticated users.

## Best Practices

### Modeling Tips
1. **Start Simple**: Add 1-2 drivers first, then layer in complexity
2. **Validate Assumptions**: Compare with historical data
3. **Test Sensitivity**: Adjust parameters to see impact ranges
4. **Document Context**: Use description field for key assumptions

### Common Scenarios
- **Aggressive Growth**: CAC + Rep Productivity + Volume/Price
- **Efficiency Focus**: Retention + Funnel Optimization
- **Seasonal Business**: Seasonality + Contract Terms
- **Promotional Campaign**: Discounting + CAC

### Avoiding Conflicts
- Don't double-count (e.g., volume/price AND rep productivity on same revenue)
- Use date ranges to prevent driver overlap
- Document which drivers affect which revenue streams

## Calculations

All calculations are performed by `SalesDriverService`:

```typescript
// Each driver type has dedicated calculation methods
calculateVolumePriceImpact()
calculateCACImpact()
calculateRetentionImpact()
// ... etc

// Combined in calculateScenarioImpacts()
```

Calculations account for:
- Time-based ramping (drivers increase impact over months)
- Start/end month boundaries
- Compounding vs. additive effects
- Active/inactive states

## Integration Points

The sales drivers integrate with:
- Scenario Planning page (main access point)
- Forecast versioning system (scenarios can be saved as forecast versions)
- Revenue runway planning
- Financial reporting

## Technical Details

### Key Files
- `/src/types/salesDriver.ts`: Type definitions
- `/src/services/salesDriverService.ts`: Calculation engine
- `/src/components/Forecasting/SalesScenarioModal.tsx`: Main UI
- `/src/components/Forecasting/DriverImpactWaterfall.tsx`: Visualization
- `/supabase/migrations/*_create_sales_scenario_drivers_system.sql`: Database schema

### API Methods
```typescript
// Save scenario
SalesDriverService.saveScenario(scenario)

// Add driver to scenario
SalesDriverService.saveDriver(driver)

// Calculate impacts
SalesDriverService.calculateScenarioImpacts(scenario)

// Get saved scenarios
SalesDriverService.getAllScenarios()
```

## Future Enhancements

Potential additions:
- AI-recommended driver combinations
- Industry benchmarks for driver parameters
- Scenario stress testing
- Driver correlation analysis
- Export to Excel with formulas
- What-if scenario comparison
- Driver effectiveness scoring

---

For questions or issues, refer to the source code or contact the development team.
