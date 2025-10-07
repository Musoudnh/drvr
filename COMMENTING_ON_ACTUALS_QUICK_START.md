# Quick Start: Commenting on Actuals

## What Are Actuals?

Actuals are the real, historical values that already occurred (e.g., January's actual revenue that was recorded). They appear in **gray boxes** above the forecast values.

## How to Add Comments to Actuals

### Step 1: Locate an Actual Value
Look for cells with gray backgrounds in your forecast table. These show the actual performance for past periods.

Example:
```
Revenue - Jan 2025
┌─────────────┐
│ Act: $50K   │ ← This is the actual value (gray box)
├─────────────┤
│ Fct: $48K   │ ← This is the forecast value
└─────────────┘
```

### Step 2: Right-Click on the Actual Value
- Move your cursor over the gray box with the actual value
- You'll see a blue highlight appear when you hover
- Right-click to open the context menu

### Step 3: Select "Comment on Actual"
From the context menu, click **"Comment on Actual"**

### Step 4: Add Your Comment
A comment dialog will appear where you can:
- Explain why actuals differ from forecast
- Add context about what happened
- Mention team members using @username
- Start a discussion thread

Example comments:
- "Revenue spike due to large enterprise deal closed mid-month"
- "Lower than forecast because of holiday slowdown @sales-manager"
- "Actual includes one-time bonus from Q4 spiff"

## Why Comment on Actuals?

Commenting on actuals helps you:
1. **Document variance explanations** - Record why actual performance differed from forecast
2. **Share insights** - Help team members understand what really happened
3. **Improve future forecasts** - Build institutional knowledge for better predictions
4. **Track patterns** - Identify recurring trends or one-time events

## Difference: Actuals vs Forecasts

| Feature | Actuals | Forecasts |
|---------|---------|-----------|
| **Background** | Gray | White/colored |
| **Right-click menu** | "Comment on Actual" | "Add Comment" + "Request Change" |
| **Can request changes?** | No (historical data) | Yes |
| **Cell reference** | `GLCODE-MONTH-actual` | `GLCODE-MONTH` |
| **Purpose** | Explain what happened | Discuss predictions |

## Visual Cues

When you hover over an actual value:
- Background changes from gray to **light blue**
- A **blue ring** appears around the cell
- Tooltip shows: **"Right-click to comment on actual"**

## Comment Threading

Comments on actuals support the same features as forecast comments:
- **Replies**: Team members can respond to your comment
- **Mentions**: Tag people with @username
- **Resolution**: Mark discussions as resolved
- **History**: All comments are timestamped and tracked

## Example Workflow

### Scenario: Actual Revenue Differs from Forecast

1. **Notice variance**: Jan actual is $52K vs forecast of $48K
2. **Right-click** on the $52K actual value (gray box)
3. **Select** "Comment on Actual"
4. **Add comment**: "Beat forecast by $4K due to accelerated Q1 enterprise renewals. @cfo We should adjust Q2 forecast based on this momentum."
5. **CFO receives notification** and can reply in the thread
6. **Mark resolved** once discussed and forecast adjusted

## Finding Your Actual Comments

All comments (including those on actuals) appear in:
- **Activity Feed**: Click "Activity Feed" button to see all recent activity
- **Comment Filters**: Use filters to find actuals comments by:
  - Date range
  - Category (Revenue, OPEX, etc.)
  - User who commented
  - Resolution status

## Best Practices

1. **Comment promptly**: Add context while the information is fresh
2. **Be specific**: Include numbers, dates, and concrete details
3. **Tag relevant people**: Use @mentions for stakeholders who need to know
4. **Link to sources**: Reference reports, emails, or documents
5. **Mark resolved**: Clean up once the variance is explained and understood

## Keyboard Shortcuts

- **Right-click**: Open context menu on any cell
- **Escape**: Close comment dialog
- **Enter**: Submit comment (or Ctrl+Enter in text area)

## Troubleshooting

**Q: I don't see the right-click menu**
- Make sure you're right-clicking directly on the gray actual value box
- Check that comments are enabled (click "Show Comments" button)

**Q: The cell doesn't have a gray box**
- That period may not have actual data yet (future period)
- Actuals are only shown for past months with recorded data

**Q: I can't request a change on an actual**
- Correct! Actuals are historical and cannot be changed
- You can only comment on them to provide context

## Need Help?

See the full guide: `FORECAST_COMMENTS_GUIDE.md`
