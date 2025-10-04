import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MonthAllocation {
  month: number;
  budget: number;
  actual: number;
}

interface GanttRow {
  id: string;
  label: string;
  startMonth: number;
  endMonth: number;
}

interface BudgetSchedulerProps {
  projectId?: string;
  fiscalYear: number;
  totalBudget: number;
  onClose: () => void;
  onSave: (allocations: MonthAllocation[], ganttRows: GanttRow[]) => void;
}

const BudgetScheduler: React.FC<BudgetSchedulerProps> = ({
  projectId,
  fiscalYear,
  totalBudget,
  onClose,
  onSave
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [allocations, setAllocations] = useState<MonthAllocation[]>(
    months.map((_, index) => ({
      month: index,
      budget: Math.round(totalBudget / 12),
      actual: Math.round((totalBudget / 12) * (Math.random() * 0.3 + 0.7))
    }))
  );

  const [ganttRows, setGanttRows] = useState<GanttRow[]>([]);
  const [isAddingGantt, setIsAddingGantt] = useState(false);
  const [selectedStartMonth, setSelectedStartMonth] = useState<number | null>(null);
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | null>(null);
  const [newGanttLabel, setNewGanttLabel] = useState('');

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

  const handleMonthClick = (monthIndex: number) => {
    if (!isAddingGantt) return;

    if (selectedStartMonth === null) {
      setSelectedStartMonth(monthIndex);
      setSelectedEndMonth(monthIndex);
    } else if (selectedEndMonth !== null) {
      if (monthIndex < selectedStartMonth) {
        setSelectedStartMonth(monthIndex);
        setSelectedEndMonth(selectedStartMonth);
      } else {
        setSelectedEndMonth(monthIndex);
      }
    }
  };

  const handleAddGanttRow = () => {
    if (selectedStartMonth === null || selectedEndMonth === null) return;

    const newRow: GanttRow = {
      id: `gantt-${Date.now()}`,
      label: newGanttLabel || `Phase ${ganttRows.length + 1}`,
      startMonth: selectedStartMonth,
      endMonth: selectedEndMonth
    };

    setGanttRows([...ganttRows, newRow]);
    setIsAddingGantt(false);
    setSelectedStartMonth(null);
    setSelectedEndMonth(null);
    setNewGanttLabel('');
  };

  const handleRemoveGanttRow = (id: string) => {
    setGanttRows(ganttRows.filter(row => row.id !== id));
  };

  const totalAllocatedBudget = allocations.reduce((sum, a) => sum + a.budget, 0);
  const totalActual = allocations.reduce((sum, a) => sum + a.actual, 0);

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
                  <div className="flex-1 grid grid-cols-12 gap-1 bg-gray-100 rounded-r-lg p-3">
                    {months.map((month, index) => (
                      <div key={index} className="text-xs font-bold text-gray-700 text-center">
                        {month}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget Row - EXACTLY like HiringRunway */}
                <div className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-48 text-sm font-medium text-[#101010] p-2">
                    Budget
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-1">
                    {allocations.map((alloc, index) => (
                      <div key={`budget-${index}`} className="h-8 flex items-center justify-center">
                        <input
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
                  <div className="flex-1 grid grid-cols-12 gap-1">
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

                {/* Gantt Rows - EXACTLY like HiringRunway */}
                {ganttRows.map((row) => (
                  <div key={row.id} className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-48 text-sm font-medium text-[#101010] p-2 truncate group">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3 bg-green-500" />
                        <span className="flex-1 truncate">{row.label}</span>
                        <button
                          onClick={() => handleRemoveGanttRow(row.id)}
                          className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-red-100 rounded transition-opacity"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {months.map((month, index) => {
                        const isActive = index >= row.startMonth && index <= row.endMonth;

                        return (
                          <div
                            key={index}
                            className="h-8 rounded-lg"
                            style={{ backgroundColor: isActive ? '#4ADE80' : 'transparent' }}
                            title={isActive ? `${row.label}` : ''}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Adding Gantt Row - EXACTLY like HiringRunway */}
                {isAddingGantt && (
                  <div className="flex mb-3 items-center bg-green-50 rounded-lg border-2 border-green-300 shadow-sm">
                    <div className="w-48 p-2">
                      <input
                        type="text"
                        value={newGanttLabel}
                        onChange={(e) => setNewGanttLabel(e.target.value)}
                        placeholder="Enter label..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {months.map((month, index) => {
                        const isInRange = selectedStartMonth !== null && selectedEndMonth !== null &&
                                         index >= Math.min(selectedStartMonth, selectedEndMonth) &&
                                         index <= Math.max(selectedStartMonth, selectedEndMonth);
                        const isActive = isInRange;

                        return (
                          <div
                            key={`new-${index}`}
                            onClick={() => handleMonthClick(index)}
                            className="h-8 rounded-lg cursor-pointer transition-colors"
                            style={{
                              backgroundColor: isActive ? '#4ADE80' : 'transparent',
                              border: isActive ? 'none' : '1px dashed #9CA3AF'
                            }}
                            title={`Click to ${selectedStartMonth === null ? 'set start' : 'set end'} month`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div>
              {!isAddingGantt ? (
                <button
                  onClick={() => {
                    setIsAddingGantt(true);
                    setSelectedStartMonth(null);
                    setSelectedEndMonth(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Add Gantt Row
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleAddGanttRow}
                    disabled={selectedStartMonth === null || selectedEndMonth === null}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingGantt(false);
                      setSelectedStartMonth(null);
                      setSelectedEndMonth(null);
                      setNewGanttLabel('');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(allocations, ganttRows)}
                className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors"
              >
                Save Schedule
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">How to Use:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Edit budget values for each month in the Budget row</li>
              <li>• The Actuals row (blue boxes) shows spending - perfectly aligned under each month</li>
              <li>• Click "Add Gantt Row" to create a new timeline phase</li>
              <li>• Click on month cells to select start and end months</li>
              <li>• The green boxes will span exactly across your selected months, aligned perfectly</li>
              <li>• Example: Selecting Nov-Dec creates a green bar that sits exactly under Nov and Dec</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetScheduler;
