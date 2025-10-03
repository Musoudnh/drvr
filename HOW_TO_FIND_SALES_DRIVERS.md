# How to Find the Sales Drivers Feature

## Option 1: From the Forecasting Grid (Main Budget Page)

This is likely where you are now!

### Steps:
1. **Navigate to**: Forecasting (main budget/forecast page)
2. **Find any revenue GL code** (e.g., "Product Sales", "Service Revenue")
3. **Click the arrow/chevron** next to the GL code to expand it
4. **Look for the button section** - you'll see TWO buttons:
   - **"Quick Scenario"** (gray button) - Simple adjustments
   - **"Sales Drivers"** (teal/blue button with dollar sign $) - THIS IS THE NEW FEATURE!

### Visual Location:
```
Forecasting Grid
└─ Revenue GL Code (e.g., "4000 - Product Sales")
   ├─ Click arrow to expand ▼
   └─ Scenarios section
      ├─ [Quick Scenario] [Sales Drivers] ← TWO BUTTONS HERE
      └─ Applied scenarios list
```

### What You'll See:
When you click **"Sales Drivers"**, a large modal opens with:
- **3 Tabs**: Overview, Drivers, Preview
- **Driver Library**: All 8 driver types
- **Real-time calculations**

---

## Option 2: From Scenario Planning Page

### Steps:
1. **Navigate to**: Forecasting → Scenario Planning
2. **Look for the button** at the top right
3. **Click "Create Sales Scenario"** (teal button with plus icon)

### Visual Location:
```
Scenario Planning Page (Top Right)
├─ [AI Insights] (purple button)
└─ [Create Sales Scenario] (teal button) ← CLICK HERE
```

---

## Inside the Sales Scenario Builder

Once you open the modal, you'll see:

### Tab 1: Overview (ℹ️ Info Icon)
- Scenario Name
- Base Revenue
- Description
- Date Range

### Tab 2: Drivers (⚡ Lightning Bolt Icon)
**This is where the magic happens!**

1. Click **"Add Driver"** button
2. A library panel opens showing 8 cards:

```
┌─────────────────┬─────────────────┐
│ 📈 Volume vs    │ 👥 Customer     │
│    Price Split  │    Acquisition  │
├─────────────────┼─────────────────┤
│ 🔄 Retention    │ 🔽 Conversion   │
│    & Churn      │    Funnel       │
├─────────────────┼─────────────────┤
│ 📅 Seasonality  │ 📄 Contract     │
│                 │    Terms        │
├─────────────────┼─────────────────┤
│ 👤 Sales Rep    │ 💯 Discounting  │
│    Productivity │    & Promotions │
└─────────────────┴─────────────────┘
```

3. Click any card to add that driver
4. Driver appears below with expandable form
5. Click chevron (▶) to expand and configure
6. Fill in parameters specific to that driver

### Tab 3: Preview (📊 Bar Chart Icon)
- Summary cards showing impact
- **Waterfall chart** showing each driver's contribution
- Monthly breakdown table
- Driver impact list

---

## Troubleshooting

### "I don't see the Sales Drivers button"
**Check these:**
1. Are you on the **Forecasting** page (main budget grid)?
2. Did you **expand a GL code** by clicking the arrow/chevron?
3. Look in the **gray section** that appears when expanded
4. There should be **TWO buttons** side by side

### "I only see one button"
- Make sure you're looking at a **Revenue** GL code (not expense)
- The buttons are in the expanded section, not on the main row
- Look for: `[Quick Scenario] [Sales Drivers]` together

### "The modal opens but I don't see 8 drivers"
1. Make sure you're on the **Drivers** tab (lightning bolt icon)
2. Click the **"Add Driver"** button
3. A blue panel should appear with all 8 driver cards
4. If you don't see it, scroll down - it appears below the "Active Drivers" heading

### "I added a driver but don't see parameters"
- Click the **chevron (▶)** on the left of the driver card
- It will expand to show ▼ and reveal all parameters
- Scroll within the card to see all fields

---

## Quick Test

Want to verify it's working? Try this:

1. Go to **Forecasting** page
2. Find **"4000 - Product Sales"** (or any revenue line)
3. Click the arrow to **expand** it
4. Click **"Sales Drivers"** (teal button with $ icon)
5. In the modal:
   - Tab 1: Enter name "Test"
   - Tab 1: Set base revenue $100,000
   - Tab 2: Click "Add Driver"
   - Tab 2: Click "Volume vs Price Split"
   - Tab 2: Expand the driver card with ▶
   - Tab 2: Adjust the sliders
   - Tab 3: See the preview update in real-time!

---

## Visual Indicators

### Buttons Colors:
- **Gray/White** = Quick Scenario (simple)
- **Teal/Blue** = Sales Drivers (advanced) ← THIS ONE!

### Icons:
- **$** (Dollar sign) = Sales Drivers button
- **⚡** (Lightning) = Drivers tab (with number badge showing count)
- **ℹ️** (Info) = Overview tab
- **📊** (Chart) = Preview tab

---

## Still Can't Find It?

### Double-check your location:
Run through this checklist:

- [ ] I'm on the **Forecasting** page (main budget/forecast grid)
- [ ] I see GL codes like "4000 - Product Sales" listed
- [ ] I clicked the **arrow/chevron** next to a revenue GL code
- [ ] I see a **gray section** with "Scenarios for [GL Name]"
- [ ] I see **TWO buttons** in that section
- [ ] The right button says **"Sales Drivers"** and has a **$** icon
- [ ] When I click it, a **large modal** opens
- [ ] The modal has **3 tabs** at the top

If you checked all boxes, you're in the right place!

---

## Alternative Access Points

### From Any Page:
The Sales Drivers feature is specifically accessed from:

1. **Forecasting Page** → Expand GL Code → Click "Sales Drivers"
2. **Scenario Planning Page** → Click "Create Sales Scenario"

It's NOT on:
- Dashboard
- Reports
- Settings
- Individual GL code detail pages

---

## What If I Still Don't See It?

If after following all these steps you still don't see the buttons:

1. **Refresh the page** (Ctrl+R or Cmd+R)
2. **Clear cache** and reload
3. Make sure you're looking in the **expanded GL code section**, not the collapsed row
4. Try a different revenue GL code (some might have different configurations)

The feature is definitely there - it was successfully built and integrated into the Forecasting page!

---

**Need more help?** Check the detailed guides:
- SALES_SCENARIO_QUICK_START.md
- SALES_DRIVERS_GUIDE.md
