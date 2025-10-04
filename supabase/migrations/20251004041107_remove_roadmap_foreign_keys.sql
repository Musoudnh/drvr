/*
  # Remove foreign key constraints for development
  
  Removes foreign key constraints that reference auth.users
  to allow mock authentication to work
*/

-- Drop foreign key constraints
ALTER TABLE roadmap_projects DROP CONSTRAINT IF EXISTS roadmap_projects_user_id_fkey;
ALTER TABLE roadmap_milestones DROP CONSTRAINT IF EXISTS roadmap_milestones_user_id_fkey;
ALTER TABLE roadmap_comments DROP CONSTRAINT IF EXISTS roadmap_comments_user_id_fkey;
ALTER TABLE roadmap_approvals DROP CONSTRAINT IF EXISTS roadmap_approvals_user_id_fkey;
ALTER TABLE roadmap_versions DROP CONSTRAINT IF EXISTS roadmap_versions_changed_by_fkey;
ALTER TABLE roadmap_ideas DROP CONSTRAINT IF EXISTS roadmap_ideas_user_id_fkey;
