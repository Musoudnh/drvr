# Sales Scenario Quick Start Guide

## How to Access

1. **Navigate to Forecasting**
   - Go to the main navigation sidebar
   - Click on "Forecasting" section
   - Select "Scenario Planning"

2. **Create a Sales Scenario**
   - Look for the **"Create Sales Scenario"** button (blue/teal button with plus icon)
   - Click it to open the Sales Scenario Builder modal

## What You'll See

### Three Main Tabs

#### 1. **Overview Tab** (Info icon)
This is where you set up the basics:

- **Scenario Name**: Give it a descriptive name like "Q2 Growth Plan"
- **Base Revenue**: Your starting monthly revenue (e.g., $100,000)
- **Description**: Notes about your assumptions
- **Time Period**: Select start month, end month, and year

#### 2. **Drivers Tab** (Lightning bolt icon with number badge)
This is the powerful new functionality:

**Driver Library**
- Click "Add Driver" button to see all 8 driver types
- Each driver shows:
  - Icon (unique to each driver type)
  - Name (e.g., "Volume vs Price Split")
  - Description (what it does)

**Available Drivers:**
1. 📈 **Volume vs Price Split** - Separate unit growth from price increases
2. 👥 **Customer Acquisition (CAC)** - Marketing spend to revenue modeling
3. 🔄 **Retention & Churn** - MRR growth through retention
4. 🔽 **Conversion Funnel** - Multi-stage sales funnel
5. 📅 **Seasonality** - Monthly revenue multipliers
6. 📄 **Contract Terms & Renewals** - Subscription renewals
7. 👤 **Sales Rep Productivity** - Quota-based modeling
8. 💯 **Discounting & Promotions** - Discount impact analysis

**After Adding a Driver:**
- Driver appears in an expandable card
- Click the chevron to expand and see parameters
- Each driver has custom input fields for its specific parameters
- Toggle "Active" checkbox to enable/disable
- Set "Apply From" and "Apply Until" months
- Click trash icon to remove

**Multiple Drivers:**
- Add as many drivers as you need
- They combine to show compound impact
- Each calculates independently

#### 3. **Preview Tab** (Bar chart icon)
See real-time results:

**Summary Cards (Top):**
- 🔵 **Base Revenue**: Annual baseline (monthly × 12)
- 🟢 **Total Impact**: Combined effect from all drivers
- 🟣 **Final Revenue**: Base + Impact with growth percentage

**Waterfall Chart:**
- Visual breakdown showing each driver's contribution
- Base bar (gray) → Driver bars (colored) → Final bar (green/red)
- Hover to see exact values
- Connecting lines show flow

**Monthly Breakdown Table:**
- Month-by-month projection for the year
- Columns: Month, Base, Impact, Final, Growth %
- Scrollable to see all 12 months

**Driver Breakdown List:**
- Each driver listed with its color
- Shows dollar impact per driver
- Sorted by impact size

## Example Workflow

### Scenario: Planning Q2 Growth

**Step 1: Overview**
```
Name: Q2 Aggressive Growth
Base Revenue: $150,000
Description: Combining marketing push with sales team expansion
Period: Jan - Dec 2025
```

**Step 2: Add Drivers**

1. **Add "Customer Acquisition (CAC)"**
   - Marketing Spend: $50,000/month
   - Customers Acquired: 100
   - Avg Revenue Per Customer: $1,000
   - CAC Payback: 12 months
   - Apply: Apr - Dec

2. **Add "Sales Rep Productivity"**
   - Number of Reps: 8
   - Quota Per Rep: $60,000/month
   - Attainment: 85%
   - New Hires: 3
   - Ramp Time: 3 months
   - Apply: May - Dec

3. **Add "Seasonality"**
   - Baseline: $150,000
   - Adjust multipliers: Jun (1.2), Jul (1.3), Aug (1.2)
   - Apply: Jan - Dec

**Step 3: Preview**
- See combined impact of all three drivers
- Waterfall shows: Base → CAC Impact → Rep Impact → Seasonality → Final
- Monthly table shows growth building over time
- Total annual impact: ~$2.4M additional revenue

**Step 4: Save**
- Click "Save Scenario" button
- Scenario stored in database
- Can edit or clone later

## Tips for Success

### Getting Started
1. **Start with 1 driver** to understand how it works
2. **Preview immediately** - calculations are instant
3. **Experiment** - adjust parameters and see changes
4. **Build up complexity** - add more drivers gradually

### Common Combinations
- **Growth Mode**: CAC + Rep Productivity + Volume/Price
- **Optimization**: Retention + Funnel + Discounting
- **Seasonal Business**: Seasonality + Contract Terms
- **Enterprise Sales**: Funnel + Rep Productivity

### Parameter Guidance
- **Be Conservative**: Start with realistic numbers
- **Validate**: Compare with historical data
- **Document**: Use description to note assumptions
- **Test Range**: Try low/medium/high versions

### Avoiding Issues
- Don't add conflicting drivers (e.g., both modeling same revenue)
- Use date ranges to separate driver periods
- Toggle inactive rather than delete (preserves config)
- Save often (scenarios persist to database)

## Visual Elements

### Color Coding
- **Blue**: Base revenue / general metrics
- **Green**: Positive impacts / growth
- **Red**: Negative impacts / declines
- **Purple**: Final results / aggregates
- **Custom**: Each driver type has unique color in charts

### Icons
- ℹ️ Overview tab
- ⚡ Drivers tab (shows count badge)
- 📊 Preview tab
- ➕ Add driver button
- 🗑️ Delete driver
- ✓ Active toggle
- 💾 Save scenario

## Troubleshooting

**"No driver impacts shown"**
- Ensure driver is set to "Active"
- Check that date range overlaps with scenario period
- Verify parameters are filled in

**"Preview shows zeros"**
- Add at least one active driver
- Check base revenue is set
- Ensure parameters are non-zero

**"Can't see all parameters"**
- Click chevron (▶) to expand driver card
- Scroll down within driver card
- Some drivers have many fields (e.g., Funnel has stages)

**"Results seem wrong"**
- Review each driver's contribution in breakdown
- Check monthly table for step changes
- Verify parameter units (%, $, count)
- Ensure no double-counting between drivers

## What's Next

After creating scenarios:
- **Compare**: Create multiple scenarios and compare outcomes
- **Export**: Download results for sharing
- **Refine**: Edit and adjust based on feedback
- **Track**: Monitor actuals vs. scenario over time

## Need Help?

- Review individual driver descriptions in the library
- Check SALES_DRIVERS_GUIDE.md for detailed documentation
- Each driver has help text showing what it models
- Preview tab updates live - use it to understand impacts

---

**Remember**: This is a modeling tool. Start simple, validate assumptions, and build confidence gradually. The power is in combining multiple drivers to see compound effects!
