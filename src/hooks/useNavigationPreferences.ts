import { useState, useEffect, useCallback } from 'react';
import { navigationPreferencesService } from '../services/navigationPreferencesService';
import { useAuth } from '../context/AuthContext';

export const useNavigationPreferences = () => {
  const { user } = useAuth();
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    }
  }, [user?.id]);

  const loadPreferences = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const preferences = await navigationPreferencesService.getPreferences(user.id);
      setHiddenItems(preferences);
    } catch (error) {
      console.error('Error loading navigation preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = useCallback(async (newHiddenItems: string[]) => {
    if (!user?.id) return false;

    console.log('🟢 [HOOK] savePreferences called with:', newHiddenItems);
    console.log('🟢 [HOOK] Current hiddenItems state:', hiddenItems);

    setSaving(true);
    try {
      const success = await navigationPreferencesService.savePreferences(user.id, newHiddenItems);
      console.log('🟢 [HOOK] Service returned:', success);
      if (success) {
        console.log('🟢 [HOOK] Updating hiddenItems state to:', newHiddenItems);
        setHiddenItems([...newHiddenItems]);
        console.log('🟢 [HOOK] State updated!');
      }
      return success;
    } catch (error) {
      console.error('Error saving navigation preferences:', error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id, hiddenItems]);

  const toggleItemVisibility = useCallback((path: string) => {
    setHiddenItems(prev => {
      if (prev.includes(path)) {
        return prev.filter(item => item !== path);
      } else {
        return [...prev, path];
      }
    });
  }, []);

  const isItemVisible = useCallback((path: string) => {
    const visible = !hiddenItems.includes(path);
    console.log(`🔍 [HOOK] isItemVisible(${path}):`, visible, 'hiddenItems:', hiddenItems);
    return visible;
  }, [hiddenItems]);

  const resetToDefault = useCallback(async () => {
    if (!user?.id) return false;

    setSaving(true);
    try {
      const success = await navigationPreferencesService.resetPreferences(user.id);
      if (success) {
        setHiddenItems([]);
      }
      return success;
    } catch (error) {
      console.error('Error resetting navigation preferences:', error);
      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id]);

  return {
    hiddenItems,
    loading,
    saving,
    savePreferences,
    toggleItemVisibility,
    isItemVisible,
    resetToDefault
  };
};
