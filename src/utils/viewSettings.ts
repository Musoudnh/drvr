export interface ViewSettings {
  hideEmptyAccounts: boolean;
  showAccountCodes: boolean;
  showActualsAsAmount: boolean;
  numberFormat: 'actual' | 'thousands' | 'millions';
}

const VIEW_SETTINGS_KEY = 'forecast_view_settings';

const defaultSettings: ViewSettings = {
  hideEmptyAccounts: false,
  showAccountCodes: true,
  showActualsAsAmount: false,
  numberFormat: 'actual',
};

export const getViewSettings = (): ViewSettings => {
  try {
    const stored = localStorage.getItem(VIEW_SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading view settings:', error);
  }
  return defaultSettings;
};

export const saveViewSettings = (settings: Partial<ViewSettings>): void => {
  try {
    const current = getViewSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(VIEW_SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving view settings:', error);
  }
};

export const updateViewSetting = <K extends keyof ViewSettings>(
  key: K,
  value: ViewSettings[K]
): void => {
  saveViewSettings({ [key]: value });
};
