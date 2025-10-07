import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Hash, DollarSign, Percent } from 'lucide-react';

interface ViewSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  hideEmptyAccounts: boolean;
  onHideEmptyAccountsChange: (value: boolean) => void;
  showAccountCodes: boolean;
  onShowAccountCodesChange: (value: boolean) => void;
  showActualsAsAmount: boolean;
  onShowActualsAsAmountChange: (value: boolean) => void;
  numberFormat: 'actual' | 'thousands' | 'millions';
  onNumberFormatChange: (value: 'actual' | 'thousands' | 'millions') => void;
  onSave?: () => void;
}

const ViewSettingsPanel: React.FC<ViewSettingsPanelProps> = ({
  isOpen,
  onClose,
  hideEmptyAccounts,
  onHideEmptyAccountsChange,
  showAccountCodes,
  onShowAccountCodesChange,
  showActualsAsAmount,
  onShowActualsAsAmountChange,
  numberFormat,
  onNumberFormatChange,
  onSave,
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    hideEmptyAccounts,
    showAccountCodes,
    showActualsAsAmount,
    numberFormat,
  });

  useEffect(() => {
    if (isOpen) {
      setInitialSettings({
        hideEmptyAccounts,
        showAccountCodes,
        showActualsAsAmount,
        numberFormat,
      });
      setHasChanges(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const changed =
      hideEmptyAccounts !== initialSettings.hideEmptyAccounts ||
      showAccountCodes !== initialSettings.showAccountCodes ||
      showActualsAsAmount !== initialSettings.showActualsAsAmount ||
      numberFormat !== initialSettings.numberFormat;
    setHasChanges(changed);
  }, [hideEmptyAccounts, showAccountCodes, showActualsAsAmount, numberFormat, initialSettings]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">View Settings</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close settings panel"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Display Options
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {hideEmptyAccounts ? (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <div className="text-xs font-medium text-gray-900">
                        {hideEmptyAccounts ? 'Empty Accounts Hidden' : 'Show All Accounts'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {hideEmptyAccounts
                          ? 'Only showing accounts with data'
                          : 'Displaying all accounts including empty ones'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onHideEmptyAccountsChange(!hideEmptyAccounts)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      hideEmptyAccounts ? 'bg-[#7B68EE]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        hideEmptyAccounts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-xs font-medium text-gray-900">Account Codes</div>
                      <div className="text-xs text-gray-500">
                        {showAccountCodes ? 'Showing GL codes' : 'Codes hidden'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowAccountCodesChange(!showAccountCodes)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showAccountCodes ? 'bg-[#7B68EE]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showAccountCodes ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    {showActualsAsAmount ? (
                      <DollarSign className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Percent className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <div className="text-xs font-medium text-gray-900">Actuals Display</div>
                      <div className="text-xs text-gray-500">
                        {showActualsAsAmount
                          ? 'Showing as dollar amounts'
                          : 'Showing as percentages'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowActualsAsAmountChange(!showActualsAsAmount)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showActualsAsAmount ? 'bg-[#7B68EE]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showActualsAsAmount ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Number Format
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => onNumberFormatChange('actual')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    numberFormat === 'actual'
                      ? 'bg-purple-50 border-2 border-[#7B68EE] text-[#7B68EE]'
                      : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-xs font-medium">Full Amount</div>
                    <div className="text-xs opacity-75">1,000,000</div>
                  </div>
                  {numberFormat === 'actual' && (
                    <div className="w-2 h-2 rounded-full bg-[#7B68EE]" />
                  )}
                </button>

                <button
                  onClick={() => onNumberFormatChange('thousands')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    numberFormat === 'thousands'
                      ? 'bg-purple-50 border-2 border-[#7B68EE] text-[#7B68EE]'
                      : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-xs font-medium">Thousands</div>
                    <div className="text-xs opacity-75">1,000.0K</div>
                  </div>
                  {numberFormat === 'thousands' && (
                    <div className="w-2 h-2 rounded-full bg-[#7B68EE]" />
                  )}
                </button>

                <button
                  onClick={() => onNumberFormatChange('millions')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    numberFormat === 'millions'
                      ? 'bg-purple-50 border-2 border-[#7B68EE] text-[#7B68EE]'
                      : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-xs font-medium">Millions</div>
                    <div className="text-xs opacity-75">1.0M</div>
                  </div>
                  {numberFormat === 'millions' && (
                    <div className="w-2 h-2 rounded-full bg-[#7B68EE]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            {onSave && (
              <button
                onClick={() => {
                  onSave();
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors font-medium ${
                  hasChanges
                    ? 'bg-[#101010] text-white hover:bg-gray-800'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasChanges}
              >
                Save Settings
              </button>
            )}
            <p className="text-xs text-gray-600 text-center">
              These settings apply to the current view only
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSettingsPanel;
