import { supabase } from '../lib/supabase';

export interface NavigationPreferences {
  id?: string;
  user_id: string;
  hidden_items: string[];
  created_at?: string;
  updated_at?: string;
}

export const navigationPreferencesService = {
  async getPreferences(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_navigation_preferences')
      .select('hidden_items')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching navigation preferences:', error);
      return [];
    }

    return data?.hidden_items || [];
  },

  async savePreferences(userId: string, hiddenItems: string[]): Promise<boolean> {
    console.log('🔵 [SERVICE] savePreferences called', { userId, hiddenItems });

    const { data: existing, error: selectError } = await supabase
      .from('user_navigation_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('🔵 [SERVICE] Existing check:', { existing, selectError });

    if (selectError) {
      console.error('Error checking for existing preferences:', selectError);
      return false;
    }

    if (existing) {
      console.log('🔵 [SERVICE] Updating existing record...');
      const { error } = await supabase
        .from('user_navigation_preferences')
        .update({
          hidden_items: hiddenItems,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      console.log('🔵 [SERVICE] Update error:', error);

      if (error) {
        console.error('Error updating navigation preferences:', error);
        return false;
      }
    } else {
      console.log('🔵 [SERVICE] Inserting new record...');
      const { error } = await supabase
        .from('user_navigation_preferences')
        .insert({
          user_id: userId,
          hidden_items: hiddenItems
        });

      console.log('🔵 [SERVICE] Insert error:', error);

      if (error) {
        console.error('Error creating navigation preferences:', error);
        return false;
      }
    }

    console.log('🔵 [SERVICE] Save successful, returning true');
    return true;
  },

  async resetPreferences(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_navigation_preferences')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error resetting navigation preferences:', error);
      return false;
    }

    return true;
  }
};
