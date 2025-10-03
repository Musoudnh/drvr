import React, { useState, useEffect } from 'react';
import { X, Check, Eye, EyeOff } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  category: string;
  alwaysVisible?: boolean;
}

interface NavigationCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  hiddenItems: string[];
  onSave: (hiddenItems: string[]) => Promise<boolean>;
  onReset: () => Promise<boolean>;
  saving?: boolean;
}

const NavigationCustomizationModal: React.FC<NavigationCustomizationModalProps> = ({
  isOpen,
  onClose,
  navItems,
  hiddenItems: initialHiddenItems,
  onSave,
  onReset,
  saving = false
}) => {
  const [localHiddenItems, setLocalHiddenItems] = useState<string[]>(initialHiddenItems);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setLocalHiddenItems(initialHiddenItems);
  }, [initialHiddenItems, isOpen]);

  if (!isOpen) return null;

  const toggleItemVisibility = (path: string) => {
    setLocalHiddenItems(prev => {
      if (prev.includes(path)) {
        return prev.filter(item => item !== path);
      } else {
        return [...prev, path];
      }
    });
  };

  const handleSelectAll = () => {
    setLocalHiddenItems([]);
  };

  const handleDeselectAll = () => {
    const allPaths = navItems
      .filter(item => !item.alwaysVisible)
      .map(item => item.path);
    setLocalHiddenItems(allPaths);
  };

  const handleSave = async () => {
    const success = await onSave(localHiddenItems);
    if (success) {
      onClose();
    }
  };

  const handleReset = async () => {
    const success = await onReset();
    if (success) {
      setLocalHiddenItems([]);
      setShowResetConfirm(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setLocalHiddenItems(initialHiddenItems);
    setShowResetConfirm(false);
    onClose();
  };

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const visibleCount = navItems.filter(item => !localHiddenItems.includes(item.path)).length;
  const totalCount = navItems.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#101010]">Customize Navigation</h3>
            <p className="text-xs text-gray-500 mt-1">
              {visibleCount} of {totalCount} items visible
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={handleSelectAll}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-3 h-3 inline mr-1" />
            Show All
          </button>
          <button
            onClick={handleDeselectAll}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <EyeOff className="w-3 h-3 inline mr-1" />
            Hide All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="border-b border-gray-100 last:border-b-0">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {category}
                </h4>
              </div>
              <div className="p-2">
                {items.map((item) => {
                  const isVisible = !localHiddenItems.includes(item.path);
                  const IconComponent = item.icon;

                  return (
                    <div
                      key={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                        item.alwaysVisible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => !item.alwaysVisible && toggleItemVisibility(item.path)}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                        {item.alwaysVisible && (
                          <span className="text-xs text-gray-400">(Always visible)</span>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isVisible
                            ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {isVisible && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            disabled={saving}
          >
            Reset to Default
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#212B36',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#1a2028';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#212B36';
                }
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90vw]">
            <h4 className="text-lg font-semibold text-[#101010] mb-2">Reset to Default?</h4>
            <p className="text-sm text-gray-600 mb-4">
              This will restore all navigation items to their default visibility. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                disabled={saving}
                className="px-4 py-2 bg-[#F87171] text-white rounded-lg hover:bg-[#EF4444] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationCustomizationModal;
