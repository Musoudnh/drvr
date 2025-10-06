import React, { useState, useEffect } from 'react';
import { Save, X, Eye, EyeOff, Check, LayoutGrid } from 'lucide-react';
import Button from '../UI/Button';

interface ViewPreference {
  id: string;
  name: string;
  filters: {
    categories: string[];
    hideEmptyAccounts: boolean;
    showAccountCodes: boolean;
    dateViewMode: 'months' | 'quarters' | 'years';
    numberFormat: 'actual' | 'thousands' | 'millions';
  };
  layout: {
    viewMode: 'table' | 'chart';
    expandedCategories: string[];
    columnWidths?: Record<string, number>;
  };
  createdAt: Date;
  isDefault: boolean;
}

interface MyViewSettingsProps {
  onClose: () => void;
  currentFilters: any;
  onApplyView: (view: ViewPreference) => void;
}

const MyViewSettings: React.FC<MyViewSettingsProps> = ({
  onClose,
  currentFilters,
  onApplyView,
}) => {
  const [savedViews, setSavedViews] = useState<ViewPreference[]>([]);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('forecastViewPreferences');
    if (stored) {
      setSavedViews(JSON.parse(stored));
    }
  }, []);

  const saveView = () => {
    if (!newViewName.trim()) return;

    const newView: ViewPreference = {
      id: Date.now().toString(),
      name: newViewName,
      filters: {
        categories: currentFilters.selectedCategories || [],
        hideEmptyAccounts: currentFilters.hideEmptyAccounts || false,
        showAccountCodes: currentFilters.showAccountCodes || false,
        dateViewMode: currentFilters.dateViewMode || 'months',
        numberFormat: currentFilters.numberFormat || 'thousands',
      },
      layout: {
        viewMode: currentFilters.viewMode || 'table',
        expandedCategories: currentFilters.expandedCategories || [],
        columnWidths: currentFilters.columnWidths || {},
      },
      createdAt: new Date(),
      isDefault: savedViews.length === 0,
    };

    const updatedViews = [...savedViews, newView];
    setSavedViews(updatedViews);
    localStorage.setItem('forecastViewPreferences', JSON.stringify(updatedViews));
    setIsCreatingNew(false);
    setNewViewName('');
  };

  const deleteView = (id: string) => {
    const updatedViews = savedViews.filter(v => v.id !== id);
    setSavedViews(updatedViews);
    localStorage.setItem('forecastViewPreferences', JSON.stringify(updatedViews));
  };

  const setDefaultView = (id: string) => {
    const updatedViews = savedViews.map(v => ({
      ...v,
      isDefault: v.id === id,
    }));
    setSavedViews(updatedViews);
    localStorage.setItem('forecastViewPreferences', JSON.stringify(updatedViews));
  };

  const applyView = (view: ViewPreference) => {
    onApplyView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] rounded-lg flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">My Views</h2>
              <p className="text-sm text-gray-500">Save and manage personalized view settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isCreatingNew && (
            <Button
              onClick={() => setIsCreatingNew(true)}
              className="w-full mb-4"
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Current View
            </Button>
          )}

          {isCreatingNew && (
            <div className="bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-lg p-4 mb-4 border border-[#3AB7BF]/20">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="e.g., Q1 Revenue Focus"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  autoFocus
                />
                <Button onClick={saveView} disabled={!newViewName.trim()}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setIsCreatingNew(false);
                    setNewViewName('');
                  }}
                  variant="outline"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {savedViews.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No saved views yet</p>
              <p className="text-sm text-gray-400">
                Configure your filters and layout, then save as a custom view
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedViews.map((view) => (
                <div
                  key={view.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                    selectedViewId === view.id
                      ? 'border-[#3AB7BF] bg-[#3AB7BF]/5'
                      : 'border-gray-200 hover:border-[#3AB7BF]/40 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedViewId(view.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{view.name}</h3>
                      {view.isDefault && (
                        <span className="px-2 py-0.5 bg-[#4ADE80]/20 text-[#4ADE80] text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDefaultView(view.id);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Set as default"
                      >
                        {view.isDefault ? (
                          <Eye className="w-4 h-4 text-[#3AB7BF]" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteView(view.id);
                        }}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                        title="Delete view"
                      >
                        <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">View:</span>
                      <span>{view.layout.viewMode === 'table' ? 'Table' : 'Chart'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Format:</span>
                      <span className="capitalize">{view.filters.numberFormat}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Period:</span>
                      <span className="capitalize">{view.filters.dateViewMode}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Categories:</span>
                      <span>{view.filters.categories.length || 'All'}</span>
                    </div>
                  </div>

                  {selectedViewId === view.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <Button
                        onClick={() => applyView(view)}
                        className="w-full"
                        size="sm"
                      >
                        Apply This View
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyViewSettings;
