import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MonthAllocation {
  month: number;
  budget: number;
  actual: number;
}

interface BudgetSchedulerProps {
  projectId?: string;
  fiscalYear: number;
  totalBudget: number;
  onClose: () => void;
  onSave: (allocations: MonthAllocation[]) => void;
  visibleMonthStart?: number;
  visibleMonthEnd?: number;
}

const BudgetScheduler: React.FC<BudgetSchedulerProps> = ({
  projectId,
  fiscalYear,
  totalBudget,
  onClose,
  onSave,
  visibleMonthStart = 0,
  visibleMonthEnd = 11
}) => {
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = allMonths.slice(visibleMonthStart, visibleMonthEnd + 1);
  const monthStartIndex = visibleMonthStart;

  const [allocations, setAllocations] = useState<MonthAllocation[]>(
    months.map((_, index) => ({
      month: monthStartIndex + index,
      budget: Math.round(totalBudget / 12),
      actual: Math.round((totalBudget / 12) * (Math.random() * 0.3 + 0.7))
    }))
  );

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; monthIndex: number } | null>(null);


  const handleBudgetChange = (monthIndex: number, value: number) => {
    setAllocations(prev => prev.map((alloc, idx) =>
      idx === monthIndex ? { ...alloc, budget: value } : alloc
    ));
  };

  const handleActualChange = (monthIndex: number, value: number) => {
    setAllocations(prev => prev.map((alloc, idx) =>
      idx === monthIndex ? { ...alloc, actual: value } : alloc
    ));
  };

  const totalAllocatedBudget = allocations.reduce((sum, a) => sum + a.budget, 0);
  const totalActual = allocations.reduce((sum, a) => sum + a.actual, 0);

  const handleContextMenu = (e: React.MouseEvent, monthIndex: number) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, monthIndex });
  };

  const handleEditFromContextMenu = () => {
    if (contextMenu) {
      const inputElement = document.getElementById(`budget-input-${contextMenu.monthIndex}`) as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
        inputElement.select();
      }
      setContextMenu(null);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-[#101010]">Budget Schedule - FY {fiscalYear}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Allocated: ${totalAllocatedBudget.toLocaleString()} | Actual: ${totalActual.toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Month Headers - EXACTLY like HiringRunway */}
                <div className="flex mb-4">
                  <div className="w-48 text-sm font-bold text-gray-800 p-3 bg-gray-100 rounded-l-lg">Month</div>
                  <div className="flex-1 gap-1 bg-gray-100 rounded-r-lg p-3" style={{ display: 'grid', gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
                    {months.map((month, index) => (
                      <div key={index} className="text-xs font-bold text-gray-700 text-center">
                        {month}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-48 text-sm font-medium text-[#101010] p-2">
                    Budget
                  </div>
                  <div className="flex-1 gap-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
                    {allocations.map((alloc, index) => (
                      <div
                        key={`budget-${index}`}
                        className="h-8 flex items-center justify-center"
                        onContextMenu={(e) => handleContextMenu(e, index)}
                      >
                        <input
                          id={`budget-input-${index}`}
                          type="number"
                          value={alloc.budget}
                          onChange={(e) => handleBudgetChange(index, parseFloat(e.target.value) || 0)}
                          className="w-full h-full text-center text-xs border border-gray-200 rounded focus:ring-2 focus:ring-[#7B68EE] focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actuals Row - EXACTLY like HiringRunway */}
                <div className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-48 text-sm font-medium text-[#101010] p-2">
                    Actuals
                  </div>
                  <div className="flex-1 gap-1" style={{ display: 'grid', gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
                    {allocations.map((alloc, index) => (
                      <div
                        key={`actual-${index}`}
                        className="h-8 rounded-lg"
                        style={{ backgroundColor: '#93C5FD' }}
                        title={`Actual: $${alloc.actual.toLocaleString()}`}
                      >
                        <div className="flex items-center justify-center h-full text-xs font-semibold text-blue-900">
                          ${(alloc.actual / 1000).toFixed(0)}k
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(allocations)}
              className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={handleEditFromContextMenu}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Edit Budget
          </button>
        </div>
      )}
    </div>
  );
};

export default BudgetScheduler;
