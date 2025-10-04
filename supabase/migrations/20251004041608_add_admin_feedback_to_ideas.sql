/*
  # Add admin feedback to ideas table
  
  Adds admin_feedback column to roadmap_ideas table to allow
  admins to provide comments when requesting more input
*/

ALTER TABLE roadmap_ideas ADD COLUMN IF NOT EXISTS admin_feedback text DEFAULT '';
