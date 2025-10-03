# Sales Scenario Integration - What Happens Now

## When You Save a Sales Scenario

After clicking "Save Scenario" in the Sales Scenario Builder modal, here's what happens:

### 1. **Scenario Appears in Applied Scenarios List**

The scenario will immediately show up in the "Applied Scenarios" section under the GL code you selected.

**What You'll See:**
```
Scenarios for [GL Code Name]
├─ [Quick Scenario] [Sales Drivers]
└─ Applied Scenarios:
   └─ ┌────────────────────────────────────┐
      │ 📊 Your Scenario Name          [Active] │
      │ Description or driver list              │
      │ Jan - Dec • X% change                   │
      │                            [Edit] button │
      └────────────────────────────────────────┘
```

### 2. **Real Impact Calculations**

The system:
- Calculates actual impacts from all your drivers
- Computes month-by-month revenue changes
- Determines the average percentage impact
- Applies this to the forecast data

**Example:**
- You add Volume/Price driver with 10% volume growth
- System calculates exact impact per month
- Shows as "15.2% change" in the applied scenario
- Updates forecast numbers in the grid

### 3. **Forecast Data Updates**

The monthly forecast numbers in the grid automatically update based on:
- The specific months you selected (Start → End)
- The calculated impact from your drivers
- Each driver's contribution adds up

**Before Scenario:**
```
Jan: $100,000
Feb: $100,000
Mar: $100,000
```

**After Scenario (with 15% growth drivers):**
```
Jan: $115,000  (+15%)
Feb: $115,000  (+15%)
Mar: $115,000  (+15%)
```

### 4. **Scenario Details Shown**

The applied scenario displays:

**Name:** Your scenario name (e.g., "Q2 Growth Plan")

**Description:** Either:
- Your custom description, OR
- Auto-generated: "3 drivers: Volume vs Price Split, CAC, Retention & Churn"

**Time Period:** "Jan - Dec" (your selected range)

**Impact:** "X% change" (calculated from all drivers combined)

**Status Badge:**
- Green "Active" - scenario is applied
- Gray "Inactive" - scenario saved but not affecting numbers

### 5. **Edit Options**

Click the **[Edit]** button on the scenario to:
- Toggle Active/Inactive
- View scenario details
- Remove the scenario
- (Future: Re-open in full driver editor)

## Example Workflow

### Step-by-Step Example:

**1. You Create:**
```
Scenario: "Aggressive Q2 Push"
Base Revenue: $200,000
Drivers:
  - CAC (Marketing: $50k, Customers: 100)
  - Seasonality (June: 1.2x, July: 1.3x)
Period: Apr - Sep
```

**2. System Calculates:**
```
Total Annual Impact: $240,000
Base Annual Revenue: $2,400,000
Average Impact: 10%
```

**3. Scenario Appears:**
```
┌─────────────────────────────────────────────┐
│ 📊 Aggressive Q2 Push              [Active] │
│ 2 drivers: CAC, Seasonality                │
│ Apr - Sep • 10% change                      │
│                                       [Edit] │
└─────────────────────────────────────────────┘
```

**4. Forecast Updates:**
```
GL Code: 4000 - Product Sales

Before:
Apr: $200,000   Jul: $200,000
May: $200,000   Aug: $200,000
Jun: $200,000   Sep: $200,000

After (with scenario):
Apr: $220,000 (+10%)   Jul: $260,000 (+30% from seasonality)
May: $220,000 (+10%)   Aug: $220,000 (+10%)
Jun: $240,000 (+20%)   Sep: $220,000 (+10%)
```

## Important Notes

### About the Calculations

**Intelligent Impact:**
- Each driver calculates its specific impact
- Impacts combine (add together)
- Month-by-month precision
- Based on your exact parameters

**Not Simple Multiplication:**
- Volume/Price driver: Calculates units × price changes
- CAC driver: Considers payback periods
- Seasonality: Applies monthly multipliers
- Funnel: Models stage-by-stage conversions

### Multiple Scenarios

You can:
- Add multiple scenarios to the same GL code
- Each appears in the list
- Impacts stack (combine)
- Toggle each on/off independently

### Persistence

**Saved to:**
- ✅ Sales scenarios database table
- ✅ Applied scenarios list (in memory)
- ✅ Forecast data updates

**When you refresh:**
- Forecast data resets (scenarios need to be saved as forecast versions)
- Use "Save Forecast" to persist changes permanently

## Troubleshooting

### "I saved but don't see it"

**Check:**
1. Look under the **same GL code** you clicked "Sales Drivers" from
2. Make sure the GL code section is **expanded** (arrow pointing down)
3. Scroll down in the scenarios section
4. Scenario should appear immediately after clicking "Save"

### "Impact shows 0%"

**Possible reasons:**
1. No drivers were added
2. All drivers are set to "Inactive"
3. Base revenue is 0
4. Date range doesn't overlap with forecast period

**Fix:**
- Go back, add active drivers
- Ensure parameters are filled in
- Check date ranges match

### "Numbers don't look right"

**Verify:**
1. Check the percentage shown in the scenario
2. Calculate: Base × (1 + Percentage/100)
3. Example: $100k × (1 + 15/100) = $115k
4. If still wrong, check driver parameters

### "Want to edit the drivers"

**Current limitation:**
- Once saved, you see a summary
- Edit button shows simple options
- To change drivers: Create a new scenario

**Workaround:**
1. Note your driver settings
2. Remove the scenario
3. Create new scenario with adjusted drivers

## What's Next?

After applying scenarios:

1. **Review the numbers** in the forecast grid
2. **Add more scenarios** to other GL codes
3. **Save the forecast** to make changes permanent
4. **Compare versions** to see before/after
5. **Export reports** with updated projections

## Tips

### Best Practices

**Start Small:**
- Test with one driver first
- Verify the math makes sense
- Then add more drivers

**Use Descriptive Names:**
- "Q2 Marketing Push" ✅
- "Scenario 1" ❌

**Document Assumptions:**
- Use the description field
- Note why you chose specific parameters
- Helps others understand your logic

**Check the Preview:**
- Review Preview tab before saving
- Waterfall chart shows driver contributions
- Monthly table shows exact impacts

### Advanced Usage

**Layering Scenarios:**
- Create conservative, realistic, optimistic versions
- Apply/remove to see ranges
- Compare outcomes

**Seasonal Planning:**
- Use Seasonality driver for retail/e-commerce
- Set multipliers for peak months
- Apply to relevant revenue streams

**Growth Modeling:**
- Combine CAC + Rep Productivity + Funnel
- Model investment → growth relationship
- Adjust to hit revenue targets

---

**Summary**: When you save a sales scenario, it automatically appears in the Applied Scenarios list with the calculated impact, updates your forecast numbers, and can be toggled on/off or removed as needed!
