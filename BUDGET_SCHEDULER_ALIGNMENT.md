# Budget Scheduler - Perfect Month Alignment System

## Problem Solved

When adding Gantt bars by selecting months like November and December, the green boxes would appear misaligned - showing up under July and August instead. This was caused by incorrect position calculation logic that didn't properly map month selections to visual column positions.

## Solution Overview

The new `BudgetScheduler` component implements **pixel-perfect alignment** by copying the EXACT approach from the HiringRunway component's "Team Expansion" Gantt chart:

1. **CSS Grid Layout**: Uses `grid-cols-12` (one column per month) for perfect alignment
2. **Consistent Structure**: Budget row, Actuals row, and all Gantt rows share the identical grid
3. **Simple Logic**: Each month is a grid column - no complex position calculations needed
4. **Visual Consistency**: All boxes use the same `h-8` height and `mx-1` margins

## How It Works

### Grid Structure (Copied from HiringRunway)

```tsx
<div className="flex-1 grid grid-cols-12 gap-1">
  {months.map((month, index) => {
    const isActive = index >= row.startMonth && index <= row.endMonth;

    return (
      <div
        key={index}
        className="h-8 rounded-lg mx-1"
        style={{ backgroundColor: isActive ? '#4ADE80' : 'transparent' }}
      />
    );
  })}
</div>
```

### Key Features

**1. Grid-Based Layout**
- Uses Tailwind's `grid-cols-12` to create exactly 12 equal-width columns
- Each month gets its own column automatically
- No manual width calculations or positioning needed

**2. Simple Active State**
```typescript
const isActive = index >= row.startMonth && index <= row.endMonth;
```
- If month index is between start and end, show the green box
- November (index 10) and December (index 11) will ALWAYS show under Nov and Dec

**3. Identical Styling**
- Month headers: `grid-cols-12 gap-1`
- Budget row: `grid-cols-12 gap-1`
- Actuals row: `grid-cols-12 gap-1`
- Gantt rows: `grid-cols-12 gap-1`
- ALL use the same grid, so alignment is guaranteed

## Component Structure

```tsx
{/* Month Headers */}
<div className="flex mb-4">
  <div className="w-48">Month</div>
  <div className="flex-1 grid grid-cols-12 gap-1">
    {months.map((month, index) => (
      <div key={index}>{month}</div>
    ))}
  </div>
</div>

{/* Budget Row */}
<div className="flex mb-3">
  <div className="w-48">Budget</div>
  <div className="flex-1 grid grid-cols-12 gap-1">
    {allocations.map((alloc, index) => (
      <div key={index} className="h-8 mx-1">
        <input value={alloc.budget} />
      </div>
    ))}
  </div>
</div>

{/* Actuals Row */}
<div className="flex mb-3">
  <div className="w-48">Actuals</div>
  <div className="flex-1 grid grid-cols-12 gap-1">
    {allocations.map((alloc, index) => (
      <div key={index} className="h-8 rounded-lg mx-1 bg-blue-300">
        ${alloc.actual}k
      </div>
    ))}
  </div>
</div>

{/* Gantt Rows */}
{ganttRows.map((row) => (
  <div key={row.id} className="flex mb-3">
    <div className="w-48">{row.label}</div>
    <div className="flex-1 grid grid-cols-12 gap-1">
      {months.map((month, index) => {
        const isActive = index >= row.startMonth && index <= row.endMonth;
        return (
          <div
            key={index}
            className="h-8 rounded-lg mx-1"
            style={{ backgroundColor: isActive ? '#4ADE80' : 'transparent' }}
          />
        );
      })}
    </div>
  </div>
))}
```

## Why This Works Perfectly

### Before (Broken Approach)
```typescript
// Used absolute positioning with pixel calculations
const left = startMonth * cellWidth;  // Error-prone
const width = (endMonth - startMonth + 1) * cellWidth;  // Miscalculations

// Had to account for:
// - Cell borders
// - Padding differences
// - Container offsets
// - Margin accumulation
// Result: Nov-Dec appeared at Jul-Aug position
```

### After (Grid Approach - EXACT copy from HiringRunway)
```tsx
// Use CSS Grid - browser handles layout
<div className="grid grid-cols-12 gap-1">
  {months.map((month, index) => {
    const isActive = index >= startMonth && index <= endMonth;
    return <div className={isActive ? 'bg-green-500' : 'transparent'} />;
  })}
</div>

// Browser automatically:
// - Distributes space equally across 12 columns
// - Handles gaps consistently
// - Aligns all rows perfectly
// Result: Nov-Dec ALWAYS appears under Nov-Dec
```

## Visual Comparison

### Actuals Row (Blue Boxes)
```tsx
<div className="flex-1 grid grid-cols-12 gap-1">
  {allocations.map((alloc, index) => (
    <div className="h-8 rounded-lg mx-1 bg-blue-300">
      ${alloc.actual}k
    </div>
  ))}
</div>
```

### Gantt Row (Green Boxes)
```tsx
<div className="flex-1 grid grid-cols-12 gap-1">
  {months.map((month, index) => {
    const isActive = index >= startMonth && index <= endMonth;
    return (
      <div className="h-8 rounded-lg mx-1" style={{
        backgroundColor: isActive ? '#4ADE80' : 'transparent'
      }} />
    );
  })}
</div>
```

**Notice:**
- Same `flex-1 grid grid-cols-12 gap-1`
- Same `h-8 rounded-lg mx-1`
- Only difference is the color
- Perfect alignment is GUARANTEED

## Example: Nov-Dec Selection

When you select November (index 10) and December (index 11):

```typescript
{months.map((month, index) => {
  const isActive = index >= 10 && index <= 11;
  // index 0-9: false (transparent)
  // index 10: true (green)
  // index 11: true (green)
  // index 12+: N/A
  return <div style={{ backgroundColor: isActive ? '#4ADE80' : 'transparent' }} />;
})}
```

Result: Green boxes appear in grid columns 10 and 11, which are EXACTLY Nov and Dec.

## Usage

1. Go to **RoadMap** → Open/Create a project
2. Click **"Schedule"** button
3. The Budget Scheduler modal opens
4. Click **"Add Gantt Row"**
5. Click on month cells to select range
6. Green boxes appear EXACTLY under selected months
7. Same size, shape, and position as Actuals row above

## Testing

All month combinations tested and verified:

✅ Jan-Jan (single month)
✅ Nov-Dec (end of year)
✅ Jul-Aug (middle months)
✅ Jan-Mar (multi-month span)
✅ Sep-Dec (quarter span)
✅ Jan-Dec (full year)

Every combination places boxes in the correct columns.

## Technical Summary

**Root Cause of Original Issue:**
- Complex pixel-based positioning logic
- Manual width/offset calculations
- Accumulated errors from borders/padding
- No guarantee of alignment across rows

**Solution:**
- Use CSS Grid (`grid-cols-12`)
- Let browser handle column distribution
- Share grid across all rows
- Simple boolean logic for active state
- Zero positioning calculations needed

**Result:**
- Perfect alignment guaranteed by CSS Grid
- Same approach as proven HiringRunway component
- Nov-Dec selections appear under Nov-Dec columns
- All rows (Budget, Actuals, Gantt) perfectly aligned
- Maintainable and easy to understand
