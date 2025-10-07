# Forecast Comments Feature Guide

## Overview

A comprehensive commenting and change management system has been added to the Forecasting page, enabling team collaboration directly on forecast cells.

## Features

### 1. Inline Cell Comments

Click on any forecast cell to add comments directly to specific values. This works on both forecast values AND actual values.

**Features:**
- Threaded discussions with replies
- Mention team members using @username
- Mark discussions as resolved
- Delete your own comments
- Real-time updates
- Separate comment threads for actuals vs forecasts

**How to Use:**

**For Forecast Values:**
1. Right-click on any forecast cell (the main forecasted amount)
2. Select "Add Comment" from the context menu
3. Type your comment (use @username to mention others)
4. Click "Comment" to post

**For Actual Values:**
1. Right-click on any actual value (shown in gray boxes above forecast values)
2. Select "Comment on Actual" from the context menu
3. Add your commentary on the actual performance
4. Click "Comment" to post

**Visual Indicators:**
- Actual values show with a **gray background** and are labeled with "Act:" in the row header
- Hover over actual values to see the tooltip "Right-click to comment on actual"
- Actual values have a blue highlight on hover to indicate they're interactive

### 2. Change Requests

Propose changes to forecast values that require approval from designated approvers.

**Note:** Change requests are only available for **forecast values**, not actuals. Actuals are historical data and cannot be changed through the forecast system.

**Features:**
- Submit value change proposals with justification
- Approval workflow (pending/approved/rejected)
- Review notes from approvers
- Automatic notifications to approvers

**How to Use:**
1. Right-click on a forecast cell (not an actual value)
2. Select "Request Change"
3. Enter proposed value and justification
4. Submit for approval

**Approval Process:**
- Change requests are sent to users with "Approver" or "Admin" roles
- Approvers can accept or reject with notes
- Requesters are notified of the decision

### 3. Activity Feed

View all forecast-related activities in one place.

**Features:**
- Real-time activity log
- Filter by activity type (comments, edits, approvals, change requests)
- Timestamped entries with user information
- Quick navigation to related items

**How to Access:**
Click the "Activity Feed" button in the Comments section

### 4. Notifications

Stay informed about important updates.

**Features:**
- In-app notification bell with unread count
- Email notifications (configurable)
- Mention alerts
- Comment alerts
- Weekly digest option
- Change request notifications

**Notification Types:**
- Mentions: When someone tags you with @username
- Comments: New comments on cells you're watching
- Approvals: Status updates on your change requests
- Change Requests: New requests requiring your approval

**How to Configure:**
1. Click the bell icon in the top navigation
2. Click the settings icon
3. Toggle your notification preferences

### 5. Comment Filtering

Find specific comments quickly using filters.

**Available Filters:**
- Category (e.g., Revenue, Marketing, OPEX)
- Date range (from/to)
- User
- Resolution status (show only unresolved)

**How to Use:**
1. Click "Filter Comments" button
2. Set your filter criteria
3. Comments update automatically

### 6. Role-Based Permissions

Access control ensures proper governance.

**Roles:**
- **Viewer**: Can view comments only
- **Editor**: Can add and edit their own comments
- **Approver**: Can review and approve/reject change requests
- **Admin**: Full access to all features including role management

**Permission Levels:**
- All authenticated users can view comments
- Users can only edit/delete their own comments
- Only approvers can review change requests
- Activity logs are read-only for regular users

## Database Tables

The feature uses these new tables:
- `forecast_comments`: Stores all comments and replies
- `forecast_change_requests`: Tracks change proposals
- `forecast_activity_log`: Records all activities
- `user_roles`: Manages user permissions
- `notification_preferences`: User notification settings
- `notifications`: Notification delivery

## Best Practices

1. **Be Specific**: Reference exact values or time periods in comments
2. **Use Mentions**: Tag relevant team members for faster responses
3. **Resolve Threads**: Mark discussions as resolved once addressed
4. **Provide Context**: Include justification when requesting changes
5. **Regular Reviews**: Check activity feed regularly for updates
6. **Set Preferences**: Configure notifications based on your needs

## Tips

- Hold Shift while clicking to select multiple cells for bulk operations
- Use the "Show/Hide Comments" toggle to focus on data
- Activity feed automatically refreshes every 30 seconds
- Comments support markdown formatting
- Unresolved comments show with blue border, resolved with green

## Keyboard Shortcuts

- Right-click: Open cell context menu
- Escape: Close open modals/panels
- Ctrl/Cmd + Click: Multi-select cells

## Getting Started

1. Enable comments by clicking "Show Comments" button
2. Right-click any forecast cell to explore options
3. Add your first comment or change request
4. Configure notification preferences
5. Check the activity feed to see team updates

For technical details, refer to:
- `/src/services/commentService.ts` - API service layer
- `/src/components/Forecasting/` - UI components
- `/supabase/migrations/create_forecast_comments_system.sql` - Database schema
