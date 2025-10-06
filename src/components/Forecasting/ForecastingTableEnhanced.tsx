import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, TrendingUp, MessageSquare, Eye, CreditCard as Edit3, Copy, Trash2, BarChart3, Table as TableIcon } from 'lucide-react';

interface ContextMenuPosition {
  x: number;
  y: number;
  rowData?: any;
}

interface ForecastingTableEnhancedProps {
  children: React.ReactNode;
  onAddForecast?: () => void;
  onDrillDown?: (rowData: any) => void;
  onAddNote?: (rowData: any) => void;
  onViewDetails?: (rowData: any) => void;
  onEdit?: (rowData: any) => void;
  onDuplicate?: (rowData: any) => void;
  onDelete?: (rowData: any) => void;
}

const ForecastingTableEnhanced: React.FC<ForecastingTableEnhancedProps> = ({
  children,
  onAddForecast,
  onDrillDown,
  onAddNote,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>(() => {
    return (localStorage.getItem('forecastViewMode') as 'table' | 'chart') || 'table';
  });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    const handleScroll = () => {
      setContextMenu(null);
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [contextMenu]);

  const handleContextMenu = (event: React.MouseEvent, rowData?: any) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      rowData,
    });
  };

  const handleMenuAction = (action: () => void) => {
    action();
    setContextMenu(null);
  };

  const handleViewModeChange = (mode: 'table' | 'chart') => {
    setViewMode(mode);
    localStorage.setItem('forecastViewMode', mode);
  };

  return (
    <div className="relative">
      {/* View Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => handleViewModeChange('table')}
          className={`px-3 py-2 rounded-l-lg flex items-center gap-2 transition-colors ${
            viewMode === 'table'
              ? 'bg-[#3AB7BF] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Table</span>
        </button>
        <button
          onClick={() => handleViewModeChange('chart')}
          className={`px-3 py-2 rounded-r-lg flex items-center gap-2 transition-colors ${
            viewMode === 'chart'
              ? 'bg-[#3AB7BF] text-white'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium hidden sm:inline">Chart</span>
        </button>
      </div>

      {/* Enhanced Table with Sticky Headers */}
      <div
        className="forecast-table-wrapper"
        onContextMenu={(e) => handleContextMenu(e)}
      >
        {children}
      </div>

      {/* Floating Add Button */}
      {onAddForecast && (
        <button
          onClick={onAddForecast}
          className="fixed bottom-8 right-8 z-30 w-14 h-14 bg-gradient-to-r from-[#3AB7BF] to-[#4ADE80] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
          title="Add Forecast"
        >
          <Plus className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Add Forecast
          </span>
        </button>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          {onDrillDown && (
            <button
              onClick={() => handleMenuAction(() => onDrillDown(contextMenu.rowData))}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-[#3AB7BF]" />
              Drill Down
            </button>
          )}
          {onAddNote && (
            <button
              onClick={() => handleMenuAction(() => onAddNote(contextMenu.rowData))}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
              Add Note
            </button>
          )}
          {onViewDetails && (
            <button
              onClick={() => handleMenuAction(() => onViewDetails(contextMenu.rowData))}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Eye className="w-4 h-4 text-[#3AB7BF]" />
              View Details
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => handleMenuAction(() => onEdit(contextMenu.rowData))}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[#3AB7BF]" />
              Edit
            </button>
          )}
          {onDuplicate && (
            <button
              onClick={() => handleMenuAction(() => onDuplicate(contextMenu.rowData))}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
            >
              <Copy className="w-4 h-4 text-[#3AB7BF]" />
              Duplicate
            </button>
          )}
          {onDelete && (
            <>
              <div className="border-t border-gray-200 my-2"></div>
              <button
                onClick={() => handleMenuAction(() => onDelete(contextMenu.rowData))}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}

      <style>{`
        .forecast-table-wrapper {
          position: relative;
          overflow-x: auto;
          overflow-y: auto;
          max-height: calc(100vh - 300px);
        }

        .forecast-table-wrapper table {
          border-collapse: separate;
          border-spacing: 0;
        }

        .forecast-table-wrapper thead {
          position: sticky;
          top: 0;
          z-index: 10;
          background: white;
        }

        .forecast-table-wrapper thead th {
          position: sticky;
          top: 0;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .forecast-table-wrapper tbody tr td:first-child,
        .forecast-table-wrapper thead tr th:first-child {
          position: sticky;
          left: 0;
          z-index: 9;
          background: white;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
        }

        .forecast-table-wrapper thead tr th:first-child {
          z-index: 11;
        }

        @media (max-width: 768px) {
          .forecast-table-wrapper {
            max-height: calc(100vh - 250px);
          }

          .forecast-table-wrapper table {
            font-size: 0.875rem;
          }

          .forecast-table-wrapper th,
          .forecast-table-wrapper td {
            padding: 0.5rem;
            min-width: 80px;
          }
        }

        @media (max-width: 640px) {
          .forecast-table-wrapper {
            max-height: calc(100vh - 200px);
          }

          .forecast-table-wrapper table {
            font-size: 0.75rem;
          }

          .forecast-table-wrapper th,
          .forecast-table-wrapper td {
            padding: 0.375rem;
            min-width: 60px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForecastingTableEnhanced;
