/*
  # Fix hiring roles user_id constraint

  1. Changes
    - Make user_id nullable and remove foreign key constraint
*/

ALTER TABLE hiring_roles ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE hiring_roles DROP CONSTRAINT IF EXISTS hiring_roles_user_id_fkey;
