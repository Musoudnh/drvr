import React, { useState, useRef, useEffect } from 'react';
import { Lock, Check, CreditCard as Edit2 } from 'lucide-react';

interface MonthData {
  month: string;
  value: number;
  actualValue?: number;
  percentage: number;
  isActual: boolean;
  isSelected: boolean;
}

interface MonthsViewProps {
  months: MonthData[];
  onMonthsUpdate: (updatedMonths: MonthData[]) => void;
  onSelectionChange?: (selectedMonths: string[]) => void;
  rowLabel: string;
  format?: 'currency' | 'number';
}

const MonthsView: React.FC<MonthsViewProps> = ({
  months,
  onMonthsUpdate,
  onSelectionChange,
  rowLabel,
  format = 'currency'
}) => {
  const [localMonths, setLocalMonths] = useState<MonthData[]>(months);
  const [editingCell, setEditingCell] = useState<{ month: string; field: 'value' | 'percentage' } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalMonths(months);
  }, [months]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  const formatValue = (value: number): string => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toLocaleString();
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const calculateVariance = (actual: number, budget: number): number => {
    if (budget === 0) return 0;
    return ((actual - budget) / budget) * 100;
  };

  const handleCellClick = (month: string, field: 'value' | 'percentage', monthData: MonthData) => {
    if (monthData.isActual) return;

    setEditingCell({ month, field });
    const currentValue = field === 'value' ? monthData.value : monthData.percentage;
    setEditValue(currentValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.-]/g, '');
    setEditValue(value);
  };

  const handleInputBlur = () => {
    if (!editingCell) return;

    const numValue = parseFloat(editValue);
    if (isNaN(numValue)) {
      setEditingCell(null);
      return;
    }

    const updatedMonths = localMonths.map(m => {
      if (m.month === editingCell.month) {
        return {
          ...m,
          [editingCell.field]: numValue
        };
      }
      return m;
    });

    setLocalMonths(updatedMonths);
    onMonthsUpdate(updatedMonths);
    setEditingCell(null);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleCheckboxChange = (month: string) => {
    const monthData = localMonths.find(m => m.month === month);
    if (!monthData || monthData.isActual) return;

    const updatedMonths = localMonths.map(m => {
      if (m.month === month) {
        return { ...m, isSelected: !m.isSelected };
      }
      return m;
    });

    setLocalMonths(updatedMonths);
    onMonthsUpdate(updatedMonths);

    if (onSelectionChange) {
      const selected = updatedMonths.filter(m => m.isSelected).map(m => m.month);
      onSelectionChange(selected);
    }
  };

  const hasAnySelection = localMonths.some(m => m.isSelected);

  return (
    <div className="w-full">
      <div className="flex items-center mb-2">
        <span className="text-sm font-semibold text-gray-700 min-w-[200px]">{rowLabel}</span>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-2 min-w-full">
          {localMonths.map((monthData) => {
            const isEditing = editingCell?.month === monthData.month;
            const isEditingValue = isEditing && editingCell.field === 'value';
            const isEditingPercentage = isEditing && editingCell.field === 'percentage';

            return (
              <div
                key={monthData.month}
                className={`flex-shrink-0 border rounded-lg transition-all ${
                  monthData.isActual
                    ? 'bg-gray-50 border-gray-300'
                    : monthData.isSelected
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                style={{ width: '120px' }}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-600">
                      {monthData.month}
                    </span>
                    {monthData.isActual ? (
                      <Lock className="w-3 h-3 text-gray-400" title="Actual - Not Editable" />
                    ) : (
                      <div
                        onClick={() => handleCheckboxChange(monthData.month)}
                        className={`w-4 h-4 rounded border-2 cursor-pointer transition-all flex items-center justify-center ${
                          monthData.isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {monthData.isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium mb-1">Budget</div>
                    <div
                      className={`relative mb-2 ${
                        !monthData.isActual ? 'cursor-pointer group' : 'cursor-not-allowed'
                      }`}
                      onClick={() => !monthData.isActual && handleCellClick(monthData.month, 'value', monthData)}
                    >
                      {isEditingValue ? (
                        <input
                          ref={inputRef}
                          type="text"
                          value={editValue}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          onKeyDown={handleInputKeyDown}
                          className="w-full px-2 py-1 text-sm font-semibold text-gray-900 border-2 border-blue-500 rounded focus:outline-none"
                        />
                      ) : (
                        <div
                          className={`px-2 py-1 rounded text-sm font-semibold ${
                            monthData.isActual
                              ? 'text-gray-700 bg-gray-100'
                              : 'text-gray-900 group-hover:bg-blue-50 group-hover:ring-2 group-hover:ring-blue-200'
                          }`}
                        >
                          {formatValue(monthData.value)}
                          {!monthData.isActual && (
                            <Edit2 className="w-3 h-3 text-gray-400 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                      )}
                    </div>

                    {monthData.actualValue !== undefined && (
                      <>
                        <div className="text-[10px] text-gray-500 font-medium mb-1">Actuals</div>
                        <div className="px-2 py-1 rounded text-sm font-semibold bg-blue-50 text-blue-900 mb-2">
                          {formatValue(monthData.actualValue)}
                        </div>

                        <div className="text-[10px] text-gray-500 font-medium mb-1">% vs Budget</div>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            calculateVariance(monthData.actualValue, monthData.value) >= 0
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {formatPercentage(calculateVariance(monthData.actualValue, monthData.value))}
                        </div>
                      </>
                    )}
                  </div>

                  {monthData.isActual && (
                    <div className="mt-2 text-center">
                      <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-[10px] font-medium">
                        ACTUAL
                      </span>
                    </div>
                  )}

                  {!monthData.isActual && monthData.isSelected && (
                    <div className="mt-2 text-center">
                      <span className="inline-block px-2 py-0.5 bg-blue-200 text-blue-700 rounded-full text-[10px] font-medium">
                        SELECTED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {hasAnySelection && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700 font-medium">
            {localMonths.filter(m => m.isSelected).length} month(s) selected for bulk editing
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthsView;
