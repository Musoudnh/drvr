/*
  # Create Road Map System

  1. New Tables
    - `roadmap_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `header` (text) - project title
      - `description` (text)
      - `completion_date` (date)
      - `department` (text) - Sales, Marketing, R&D, Ops, etc.
      - `status` (text) - Draft, Pending Approval, Approved, Rejected, Completed
      - `scenario` (text) - Base Case, Best Case, Downside Case
      - `gl_accounts` (jsonb) - array of GL account codes
      - `assigned_users` (jsonb) - array of user ids
      - `budget_total` (numeric)
      - `actual_total` (numeric)
      - `attachments` (jsonb) - array of attachment metadata
      - `version` (integer) - current version number
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `roadmap_milestones`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to roadmap_projects)
      - `name` (text)
      - `target_date` (date)
      - `owner` (text)
      - `completion_percentage` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `roadmap_comments`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to roadmap_projects)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `mentions` (jsonb) - array of mentioned user ids
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `roadmap_approvals`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to roadmap_projects)
      - `user_id` (uuid, foreign key to auth.users)
      - `action` (text) - approved, rejected, submitted
      - `notes` (text)
      - `created_at` (timestamptz)

    - `roadmap_versions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to roadmap_projects)
      - `version_number` (integer)
      - `snapshot` (jsonb) - full project state at this version
      - `changed_by` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz)

    - `roadmap_ideas`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `department` (text)
      - `upvotes` (integer)
      - `upvoted_by` (jsonb) - array of user ids who upvoted
      - `status` (text) - pitched, converted, rejected
      - `converted_to_project_id` (uuid, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create roadmap_projects table
CREATE TABLE IF NOT EXISTS roadmap_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  header text NOT NULL,
  description text DEFAULT '',
  completion_date date,
  department text DEFAULT '',
  status text DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Completed')),
  scenario text DEFAULT 'Base Case' CHECK (scenario IN ('Base Case', 'Best Case', 'Downside Case')),
  gl_accounts jsonb DEFAULT '[]'::jsonb,
  assigned_users jsonb DEFAULT '[]'::jsonb,
  budget_total numeric DEFAULT 0,
  actual_total numeric DEFAULT 0,
  attachments jsonb DEFAULT '[]'::jsonb,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create roadmap_milestones table
CREATE TABLE IF NOT EXISTS roadmap_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES roadmap_projects(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  target_date date,
  owner text DEFAULT '',
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  status text DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create roadmap_comments table
CREATE TABLE IF NOT EXISTS roadmap_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES roadmap_projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  mentions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create roadmap_approvals table
CREATE TABLE IF NOT EXISTS roadmap_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES roadmap_projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL CHECK (action IN ('approved', 'rejected', 'submitted')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create roadmap_versions table
CREATE TABLE IF NOT EXISTS roadmap_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES roadmap_projects(id) ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL,
  changed_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create roadmap_ideas table
CREATE TABLE IF NOT EXISTS roadmap_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  department text DEFAULT '',
  upvotes integer DEFAULT 0,
  upvoted_by jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'pitched' CHECK (status IN ('pitched', 'converted', 'rejected')),
  converted_to_project_id uuid REFERENCES roadmap_projects(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE roadmap_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_ideas ENABLE ROW LEVEL SECURITY;

-- Policies for roadmap_projects
CREATE POLICY "Users can view all projects"
  ON roadmap_projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own projects"
  ON roadmap_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON roadmap_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON roadmap_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for roadmap_milestones
CREATE POLICY "Users can view all milestones"
  ON roadmap_milestones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage milestones for their projects"
  ON roadmap_milestones FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM roadmap_projects
      WHERE roadmap_projects.id = roadmap_milestones.project_id
      AND roadmap_projects.user_id = auth.uid()
    )
  );

-- Policies for roadmap_comments
CREATE POLICY "Users can view all comments"
  ON roadmap_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON roadmap_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON roadmap_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON roadmap_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for roadmap_approvals
CREATE POLICY "Users can view all approvals"
  ON roadmap_approvals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create approvals"
  ON roadmap_approvals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for roadmap_versions
CREATE POLICY "Users can view all versions"
  ON roadmap_versions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create versions"
  ON roadmap_versions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = changed_by);

-- Policies for roadmap_ideas
CREATE POLICY "Users can view all ideas"
  ON roadmap_ideas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ideas"
  ON roadmap_ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
  ON roadmap_ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
  ON roadmap_ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roadmap_projects_user_id ON roadmap_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_projects_status ON roadmap_projects(status);
CREATE INDEX IF NOT EXISTS idx_roadmap_projects_department ON roadmap_projects(department);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_project_id ON roadmap_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_comments_project_id ON roadmap_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_approvals_project_id ON roadmap_approvals(project_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_versions_project_id ON roadmap_versions(project_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_ideas_user_id ON roadmap_ideas(user_id);
