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
    console.log('💾 savePreferences called with:', { userId, hiddenItems });

    const { data: existing, error: selectError } = await supabase
      .from('user_navigation_preferences')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('💾 Existing record:', existing, 'Error:', selectError);

    if (existing) {
      console.log('💾 Updating existing record...');
      const { data, error } = await supabase
        .from('user_navigation_preferences')
        .update({
          hidden_items: hiddenItems,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select();

      console.log('💾 Update result:', data, 'Error:', error);

      if (error) {
        console.error('❌ Error updating navigation preferences:', error);
        alert(`Update failed: ${error.message}`);
        return false;
      }
    } else {
      console.log('💾 Creating new record...');
      const { data, error } = await supabase
        .from('user_navigation_preferences')
        .insert({
          user_id: userId,
          hidden_items: hiddenItems
        })
        .select();

      console.log('💾 Insert result:', data, 'Error:', error);

      if (error) {
        console.error('❌ Error creating navigation preferences:', error);
        alert(`Insert failed: ${error.message}`);
        return false;
      }
    }

    console.log('✅ Save successful!');
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
