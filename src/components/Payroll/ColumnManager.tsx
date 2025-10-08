import React from 'react';
import { GripVertical } from 'lucide-react';

interface ColumnConfig {
  key: string;
  label: string;
}

interface ColumnManagerProps {
  columns: ColumnConfig[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (key: string, visible: boolean) => void;
  onReorderColumns: (newOrder: string[]) => void;
}

const ColumnManager: React.FC<ColumnManagerProps> = ({
  columns,
  visibleColumns,
  onToggleColumn,
  onReorderColumns,
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newColumns = [...columns];
      const draggedColumn = newColumns[draggedIndex];
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(index, 0, draggedColumn);
      onReorderColumns(newColumns.map((c) => c.key));
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-[9999]">
      <div className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
        Column Visibility & Order
      </div>
      <div className="space-y-2">
        {columns.map((column, index) => (
          <div
            key={column.key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between gap-3 cursor-move hover:bg-gray-50 p-2 rounded transition-colors ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-700">{column.label}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleColumn(column.key, !visibleColumns[column.key]);
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                visibleColumns[column.key] ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  visibleColumns[column.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Drag to reorder • Toggle to show/hide
      </div>
    </div>
  );
};

export default ColumnManager;
