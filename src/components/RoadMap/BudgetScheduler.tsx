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

  const cellWidth = 80;
  const cellHeight = 48;
  const labelWidth = 120;

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

  const getGanttBarStyle = (startMonth: number, endMonth: number) => {
    const left = startMonth * cellWidth;
    const width = (endMonth - startMonth + 1) * cellWidth;

    return {
      left: `${left}px`,
      width: `${width}px`,
      height: `${cellHeight - 16}px`,
      top: '50%',
      transform: 'translateY(-50%)'
    };
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
              <div style={{ minWidth: labelWidth + (months.length * cellWidth) }}>
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <div
                    className="flex-shrink-0 flex items-center justify-center font-semibold text-sm text-gray-700 border-r border-gray-200"
                    style={{ width: labelWidth, height: cellHeight }}
                  >
                    Month
                  </div>
                  {months.map((month, index) => (
                    <div
                      key={month}
                      className="flex-shrink-0 flex items-center justify-center font-semibold text-sm text-gray-700 border-r border-gray-200"
                      style={{ width: cellWidth, height: cellHeight }}
                    >
                      {month}
                    </div>
                  ))}
                </div>

                <div className="flex border-b border-gray-200 bg-white">
                  <div
                    className="flex-shrink-0 flex items-center px-3 font-medium text-sm text-gray-700 border-r border-gray-200"
                    style={{ width: labelWidth, height: cellHeight }}
                  >
                    Budget
                  </div>
                  {allocations.map((alloc, index) => (
                    <div
                      key={`budget-${index}`}
                      className="flex-shrink-0 flex items-center justify-center border-r border-gray-200"
                      style={{ width: cellWidth, height: cellHeight }}
                    >
                      <input
                        type="number"
                        value={alloc.budget}
                        onChange={(e) => handleBudgetChange(index, parseFloat(e.target.value) || 0)}
                        className="w-full h-full text-center text-sm border-0 focus:ring-2 focus:ring-[#7B68EE] focus:outline-none"
                        style={{ padding: '4px' }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex border-b border-gray-200 bg-white">
                  <div
                    className="flex-shrink-0 flex items-center px-3 font-medium text-sm text-gray-700 border-r border-gray-200"
                    style={{ width: labelWidth, height: cellHeight }}
                  >
                    Actuals
                  </div>
                  {allocations.map((alloc, index) => (
                    <div
                      key={`actual-${index}`}
                      className="flex-shrink-0 flex items-center justify-center p-2 border-r border-gray-200"
                      style={{ width: cellWidth, height: cellHeight }}
                    >
                      <div className="w-full h-full bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs font-semibold text-blue-700">
                        ${(alloc.actual / 1000).toFixed(0)}k
                      </div>
                    </div>
                  ))}
                </div>

                {ganttRows.map((row) => (
                  <div key={row.id} className="flex border-b border-gray-100 bg-white">
                    <div
                      className="flex-shrink-0 flex items-center px-3 border-r border-gray-200 group"
                      style={{ width: labelWidth, height: cellHeight }}
                    >
                      <span className="text-sm text-gray-700 flex-1 truncate">{row.label}</span>
                      <button
                        onClick={() => handleRemoveGanttRow(row.id)}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-red-100 rounded transition-opacity"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <div
                      className="flex-shrink-0 relative"
                      style={{ width: months.length * cellWidth, height: cellHeight }}
                    >
                      {months.map((_, index) => (
                        <div
                          key={`cell-${row.id}-${index}`}
                          className="absolute top-0 border-r border-gray-100"
                          style={{
                            left: index * cellWidth,
                            width: cellWidth,
                            height: cellHeight
                          }}
                        />
                      ))}
                      <div
                        className="absolute bg-green-500 rounded shadow-sm flex items-center justify-center"
                        style={getGanttBarStyle(row.startMonth, row.endMonth)}
                      >
                        <span className="text-xs font-semibold text-white truncate px-2">
                          {row.label}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isAddingGantt && (
                  <div className="flex border-b border-gray-200 bg-green-50">
                    <div
                      className="flex-shrink-0 flex items-center px-3 border-r border-gray-200"
                      style={{ width: labelWidth, height: cellHeight }}
                    >
                      <input
                        type="text"
                        value={newGanttLabel}
                        onChange={(e) => setNewGanttLabel(e.target.value)}
                        placeholder="Enter label..."
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div
                      className="flex-shrink-0 relative"
                      style={{ width: months.length * cellWidth, height: cellHeight }}
                    >
                      {months.map((_, index) => {
                        const isInRange = selectedStartMonth !== null && selectedEndMonth !== null &&
                                         index >= Math.min(selectedStartMonth, selectedEndMonth) &&
                                         index <= Math.max(selectedStartMonth, selectedEndMonth);

                        return (
                          <div
                            key={`new-cell-${index}`}
                            onClick={() => handleMonthClick(index)}
                            className={`absolute top-0 border-r border-gray-200 cursor-pointer transition-colors ${
                              isInRange ? 'bg-green-200' : 'hover:bg-green-100'
                            }`}
                            style={{
                              left: index * cellWidth,
                              width: cellWidth,
                              height: cellHeight
                            }}
                          />
                        );
                      })}
                      {selectedStartMonth !== null && selectedEndMonth !== null && (
                        <div
                          className="absolute bg-green-500 rounded shadow-sm flex items-center justify-center pointer-events-none"
                          style={getGanttBarStyle(
                            Math.min(selectedStartMonth, selectedEndMonth),
                            Math.max(selectedStartMonth, selectedEndMonth)
                          )}
                        >
                          <span className="text-xs font-semibold text-white truncate px-2">
                            {newGanttLabel || 'New Phase'}
                          </span>
                        </div>
                      )}
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
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Instructions:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Adjust budget values for each month by clicking on the Budget row cells</li>
              <li>• The Actuals row shows current spending aligned under each month</li>
              <li>• Click "Add Gantt Row" to create a new timeline</li>
              <li>• Click on month cells to select start and end months for your Gantt bar</li>
              <li>• The green box will span exactly from start to end month, perfectly aligned</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetScheduler;
