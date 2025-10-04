/*
  # Allow public access to roadmap tables for development
  
  This migration temporarily allows public access to roadmap tables
  since the app is using mock authentication instead of real Supabase auth.
  
  Changes:
  - Drop existing restrictive policies
  - Add permissive policies that allow all operations
  
  Note: In production, you should use real Supabase authentication
  and restore the restrictive policies that check auth.uid()
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all projects" ON roadmap_projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON roadmap_projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON roadmap_projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON roadmap_projects;

-- Create permissive policies for development
CREATE POLICY "Allow all to view projects"
  ON roadmap_projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to create projects"
  ON roadmap_projects FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all to update projects"
  ON roadmap_projects FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete projects"
  ON roadmap_projects FOR DELETE
  TO public
  USING (true);

-- Same for milestones
DROP POLICY IF EXISTS "Users can view milestones" ON roadmap_milestones;
DROP POLICY IF EXISTS "Users can create milestones" ON roadmap_milestones;
DROP POLICY IF EXISTS "Users can update milestones" ON roadmap_milestones;
DROP POLICY IF EXISTS "Users can delete milestones" ON roadmap_milestones;

CREATE POLICY "Allow all to view milestones"
  ON roadmap_milestones FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to create milestones"
  ON roadmap_milestones FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all to update milestones"
  ON roadmap_milestones FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete milestones"
  ON roadmap_milestones FOR DELETE
  TO public
  USING (true);

-- Same for comments
DROP POLICY IF EXISTS "Users can view comments" ON roadmap_comments;
DROP POLICY IF EXISTS "Users can create comments" ON roadmap_comments;

CREATE POLICY "Allow all to view comments"
  ON roadmap_comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to create comments"
  ON roadmap_comments FOR INSERT
  TO public
  WITH CHECK (true);

-- Same for approvals
DROP POLICY IF EXISTS "Users can view approvals" ON roadmap_approvals;
DROP POLICY IF EXISTS "Users can create approvals" ON roadmap_approvals;

CREATE POLICY "Allow all to view approvals"
  ON roadmap_approvals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to create approvals"
  ON roadmap_approvals FOR INSERT
  TO public
  WITH CHECK (true);

-- Same for versions
DROP POLICY IF EXISTS "Users can view versions" ON roadmap_versions;
DROP POLICY IF EXISTS "System can create versions" ON roadmap_versions;

CREATE POLICY "Allow all to view versions"
  ON roadmap_versions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to create versions"
  ON roadmap_versions FOR INSERT
  TO public
  WITH CHECK (true);

-- Same for ideas
DROP POLICY IF EXISTS "Users can view ideas" ON roadmap_ideas;
DROP POLICY IF EXISTS "Users can create ideas" ON roadmap_ideas;
DROP POLICY IF EXISTS "Users can update ideas" ON roadmap_ideas;

CREATE POLICY "Allow all to view ideas"
  ON roadmap_ideas FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow all to create ideas"
  ON roadmap_ideas FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow all to update ideas"
  ON roadmap_ideas FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
