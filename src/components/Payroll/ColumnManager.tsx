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
    <div className="fixed right-4 top-32 w-72 bg-white rounded-lg shadow-2xl border border-gray-200 p-3 z-[9999]">
      <div className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
        Column Visibility & Order
      </div>
      <div className="space-y-1">
        {columns.map((column, index) => (
          <div
            key={column.key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-2 cursor-move hover:bg-gray-50 p-2 rounded transition-colors ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <label className="flex items-center gap-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={visibleColumns[column.key]}
                onChange={(e) => onToggleColumn(column.key, e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm text-gray-700">{column.label}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Drag columns to reorder, uncheck to hide
      </div>
    </div>
  );
};

export default ColumnManager;
