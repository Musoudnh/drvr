import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface BudgetAllocation {
  month: string;
  monthIndex: number;
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
  projectId: string;
  projectName: string;
  fiscalYear: number;
  onClose: () => void;
  onSave: (allocations: BudgetAllocation[], ganttRows: GanttRow[]) => void;
}

const BudgetScheduler: React.FC<BudgetSchedulerProps> = ({
  projectName,
  fiscalYear,
  onClose,
  onSave,
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [allocations, setAllocations] = useState<BudgetAllocation[]>(
    months.map((month, index) => ({
      month,
      monthIndex: index,
      budget: 0,
      actual: 0,
    }))
  );

  const [ganttRows, setGanttRows] = useState<GanttRow[]>([]);
  const [selectingRow, setSelectingRow] = useState<string | null>(null);

  const handleBudgetChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updated = [...allocations];
    updated[index].budget = numValue;
    setAllocations(updated);
  };

  const handleAddGanttRow = () => {
    const newRow: GanttRow = {
      id: `gantt-${Date.now()}`,
      label: `Timeline ${ganttRows.length + 1}`,
      startMonth: 0,
      endMonth: 11,
    };
    setGanttRows([...ganttRows, newRow]);
  };

  const handleDeleteGanttRow = (id: string) => {
    setGanttRows(ganttRows.filter((row) => row.id !== id));
  };

  const handleMonthClick = (rowId: string, monthIndex: number) => {
    const rowIndex = ganttRows.findIndex((r) => r.id === rowId);
    if (rowIndex === -1) return;

    const row = ganttRows[rowIndex];
    const updated = [...ganttRows];

    if (selectingRow === rowId) {
      if (monthIndex < row.startMonth) {
        updated[rowIndex] = { ...row, startMonth: monthIndex };
      } else if (monthIndex > row.endMonth) {
        updated[rowIndex] = { ...row, endMonth: monthIndex };
      } else {
        updated[rowIndex] = { ...row, startMonth: monthIndex, endMonth: monthIndex };
      }
    } else {
      updated[rowIndex] = { ...row, startMonth: monthIndex, endMonth: monthIndex };
      setSelectingRow(rowId);
    }

    setGanttRows(updated);
  };

  const handleLabelChange = (id: string, label: string) => {
    const updated = ganttRows.map((row) =>
      row.id === id ? { ...row, label } : row
    );
    setGanttRows(updated);
  };

  const handleSave = () => {
    onSave(allocations, ganttRows);
  };

  const totalBudget = allocations.reduce((sum, alloc) => sum + alloc.budget, 0);
  const totalActual = allocations.reduce((sum, alloc) => sum + alloc.actual, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-[#101010]">Budget Scheduler</h2>
            <p className="text-xs text-gray-600 mt-1">
              {projectName} - FY{fiscalYear}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <div className="flex mb-4">
              <div className="w-48 text-xs font-semibold text-gray-700">Month</div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {months.map((month, index) => (
                  <div key={index} className="text-center text-xs font-semibold text-gray-700">
                    {month}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex mb-3">
              <div className="w-48 text-xs font-medium text-gray-700 flex items-center">
                Budget
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {allocations.map((alloc, index) => (
                  <div key={index} className="h-8 mx-1">
                    <input
                      type="number"
                      value={alloc.budget || ''}
                      onChange={(e) => handleBudgetChange(index, e.target.value)}
                      className="w-full h-full px-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent text-center"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex mb-3">
              <div className="w-48 text-xs font-medium text-gray-700 flex items-center">
                Actuals
              </div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                {allocations.map((alloc, index) => (
                  <div
                    key={index}
                    className="h-8 rounded-lg mx-1 bg-blue-300 flex items-center justify-center text-xs font-medium text-blue-900"
                  >
                    ${alloc.actual}k
                  </div>
                ))}
              </div>
            </div>

            <div className="flex mb-4 pt-2 border-t border-gray-200">
              <div className="w-48 text-xs font-semibold text-gray-700">Total</div>
              <div className="flex-1 grid grid-cols-12 gap-1">
                <div className="col-span-12 text-xs font-semibold text-gray-700">
                  Budget: ${totalBudget.toLocaleString()}k | Actual: ${totalActual.toLocaleString()}k
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-700">Timeline Gantt</h3>
              <button
                onClick={handleAddGanttRow}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#329ba3] transition-colors text-xs"
              >
                <Plus className="w-4 h-4" />
                Add Gantt Row
              </button>
            </div>

            {ganttRows.map((row) => (
              <div key={row.id} className="flex mb-3">
                <div className="w-48 flex items-center gap-2">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => handleLabelChange(row.id, e.target.value)}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                  <button
                    onClick={() => handleDeleteGanttRow(row.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-1">
                  {months.map((_, index) => {
                    const isActive = index >= row.startMonth && index <= row.endMonth;
                    return (
                      <div
                        key={index}
                        onClick={() => handleMonthClick(row.id, index)}
                        className="h-8 rounded-lg mx-1 cursor-pointer border border-gray-200 hover:border-gray-400 transition-colors"
                        style={{
                          backgroundColor: isActive ? '#4ADE80' : 'transparent',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {ganttRows.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-500">
                No timeline rows yet. Click "Add Gantt Row" to create one.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-medium bg-[#3AB7BF] text-white rounded-lg hover:bg-[#329ba3] transition-colors"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetScheduler;
