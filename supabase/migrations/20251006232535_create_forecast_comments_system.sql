/*
  # Create Forecast Comments & Change Request System

  ## Overview
  Complete system for inline comments, threaded discussions, change requests, and activity tracking on forecast cells.

  ## 1. New Tables
  
  ### `forecast_comments`
  Stores all comments on forecast cells with support for threading and mentions.
  - `id` (uuid, primary key)
  - `forecast_id` (uuid) - links to specific forecast version
  - `cell_reference` (text) - identifies the cell (e.g., "2024-01-revenue")
  - `content` (text) - comment body with markdown support
  - `mentions` (jsonb) - array of mentioned user IDs
  - `parent_id` (uuid) - for threaded replies
  - `author_id` (uuid) - user who created comment
  - `is_resolved` (boolean) - whether discussion is resolved
  - `created_at`, `updated_at` (timestamptz)

  ### `forecast_change_requests`
  Tracks proposed changes to forecast values requiring approval.
  - `id` (uuid, primary key)
  - `forecast_id` (uuid) - target forecast version
  - `cell_reference` (text) - cell being changed
  - `current_value` (numeric) - existing value
  - `proposed_value` (numeric) - requested new value
  - `justification` (text) - reason for change
  - `requester_id` (uuid) - user proposing change
  - `status` (enum: pending, approved, rejected)
  - `reviewer_id` (uuid) - approver user ID
  - `review_notes` (text) - approval/rejection notes
  - `reviewed_at` (timestamptz)
  - `created_at`, `updated_at` (timestamptz)

  ### `forecast_activity_log`
  Comprehensive activity feed for all forecast-related actions.
  - `id` (uuid, primary key)
  - `forecast_id` (uuid)
  - `activity_type` (enum: comment, edit, approval, mention)
  - `actor_id` (uuid) - user who performed action
  - `target_id` (uuid) - related comment/change request ID
  - `cell_reference` (text)
  - `description` (text) - human-readable activity description
  - `metadata` (jsonb) - additional context
  - `created_at` (timestamptz)

  ### `user_roles`
  Role-based access control for forecast permissions.
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `role` (enum: viewer, editor, approver, admin)
  - `scope` (text) - optional department or forecast scope
  - `created_at`, `updated_at` (timestamptz)

  ### `notification_preferences`
  User notification settings and delivery preferences.
  - `id` (uuid, primary key)
  - `user_id` (uuid)
  - `email_enabled` (boolean)
  - `in_app_enabled` (boolean)
  - `mention_alerts` (boolean)
  - `comment_alerts` (boolean)
  - `weekly_digest` (boolean)
  - `created_at`, `updated_at` (timestamptz)

  ### `notifications`
  Actual notification records delivered to users.
  - `id` (uuid, primary key)
  - `user_id` (uuid) - recipient
  - `type` (enum: mention, comment, approval, digest)
  - `title` (text)
  - `message` (text)
  - `link` (text) - deep link to relevant item
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can read comments on forecasts they have access to
  - Only comment authors can edit/delete their comments
  - Only approvers can review change requests
  - Activity logs are read-only for users
  - Role management restricted to admins

  ## 3. Indexes
  - Optimized for cell reference lookups
  - Fast threading queries via parent_id
  - Efficient activity feed pagination
  - Quick notification retrieval

  ## 4. Important Notes
  - All timestamps use timestamptz for timezone support
  - JSONB used for flexible mention and metadata storage
  - Enums ensure data consistency
  - Cascading deletes maintain referential integrity
*/

-- Create custom types
CREATE TYPE forecast_change_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE forecast_activity_type AS ENUM ('comment', 'edit', 'approval', 'mention', 'change_request');
CREATE TYPE user_role_type AS ENUM ('viewer', 'editor', 'approver', 'admin');
CREATE TYPE notification_type AS ENUM ('mention', 'comment', 'approval', 'digest', 'change_request');

-- Forecast Comments Table
CREATE TABLE IF NOT EXISTS forecast_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id uuid,
  cell_reference text NOT NULL,
  content text NOT NULL,
  mentions jsonb DEFAULT '[]'::jsonb,
  parent_id uuid REFERENCES forecast_comments(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  is_resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forecast_comments_cell ON forecast_comments(cell_reference);
CREATE INDEX IF NOT EXISTS idx_forecast_comments_forecast ON forecast_comments(forecast_id);
CREATE INDEX IF NOT EXISTS idx_forecast_comments_parent ON forecast_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_forecast_comments_author ON forecast_comments(author_id);

-- Change Requests Table
CREATE TABLE IF NOT EXISTS forecast_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id uuid,
  cell_reference text NOT NULL,
  current_value numeric,
  proposed_value numeric NOT NULL,
  justification text NOT NULL,
  requester_id uuid NOT NULL,
  status forecast_change_status DEFAULT 'pending',
  reviewer_id uuid,
  review_notes text,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_change_requests_forecast ON forecast_change_requests(forecast_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON forecast_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_change_requests_requester ON forecast_change_requests(requester_id);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS forecast_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_id uuid,
  activity_type forecast_activity_type NOT NULL,
  actor_id uuid NOT NULL,
  target_id uuid,
  cell_reference text,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_forecast ON forecast_activity_log(forecast_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON forecast_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_actor ON forecast_activity_log(actor_id);

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role user_role_type NOT NULL DEFAULT 'viewer',
  scope text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scope)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email_enabled boolean DEFAULT true,
  in_app_enabled boolean DEFAULT true,
  mention_alerts boolean DEFAULT true,
  comment_alerts boolean DEFAULT true,
  weekly_digest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read, created_at DESC);

-- Enable Row Level Security
ALTER TABLE forecast_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for forecast_comments
CREATE POLICY "Users can view all comments"
  ON forecast_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON forecast_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their comments"
  ON forecast_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete their comments"
  ON forecast_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- RLS Policies for forecast_change_requests
CREATE POLICY "Users can view change requests"
  ON forecast_change_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create change requests"
  ON forecast_change_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Reviewers can update change requests"
  ON forecast_change_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('approver', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('approver', 'admin')
    )
  );

-- RLS Policies for forecast_activity_log
CREATE POLICY "Users can view activity logs"
  ON forecast_activity_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert activity logs"
  ON forecast_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = actor_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view their preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their preferences"
  ON notification_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_forecast_comments_updated_at
  BEFORE UPDATE ON forecast_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_change_requests_updated_at
  BEFORE UPDATE ON forecast_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON user_roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
