/*
  # Remove Foreign Key from Navigation Preferences

  1. Changes
    - Drop foreign key constraint to auth.users
    - This allows demo app with mock user IDs to work
*/

ALTER TABLE user_navigation_preferences DROP CONSTRAINT IF EXISTS user_navigation_preferences_user_id_fkey;
