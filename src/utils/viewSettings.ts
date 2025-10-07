export interface ViewSettings {
  hideEmptyAccounts: boolean;
  showAccountCodes: boolean;
  showActualsAsAmount: boolean;
  numberFormat: 'actual' | 'thousands' | 'millions';
}

const VIEW_SETTINGS_KEY = 'forecastViewSettings';

export const getViewSettings = (): ViewSettings => {
  try {
    const stored = localStorage.getItem(VIEW_SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading view settings:', error);
  }

  return {
    hideEmptyAccounts: false,
    showAccountCodes: false,
    showActualsAsAmount: true,
    numberFormat: 'actual',
  };
};

export const saveViewSettings = (settings: ViewSettings): void => {
  try {
    localStorage.setItem(VIEW_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving view settings:', error);
  }
};

export const formatNumber = (
  value: number,
  format: 'actual' | 'thousands' | 'millions'
): string => {
  switch (format) {
    case 'thousands':
      return `${(value / 1000).toFixed(1)}K`;
    case 'millions':
      return `${(value / 1000000).toFixed(1)}M`;
    default:
      return value.toLocaleString();
  }
};
