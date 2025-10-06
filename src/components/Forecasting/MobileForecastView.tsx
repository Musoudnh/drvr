import React, { useState, useRef, TouchEvent } from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface MobileForecastViewProps {
  data: any[];
  months: string[];
  onMonthChange?: (month: string) => void;
}

const MobileForecastView: React.FC<MobileForecastViewProps> = ({
  data,
  months,
  onMonthChange,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentMonthIndex < months.length - 1) {
      navigateMonth(1);
    }
    if (isRightSwipe && currentMonthIndex > 0) {
      navigateMonth(-1);
    }
  };

  const navigateMonth = (direction: number) => {
    const newIndex = currentMonthIndex + direction;
    if (newIndex >= 0 && newIndex < months.length) {
      setCurrentMonthIndex(newIndex);
      onMonthChange?.(months[newIndex]);
    }
  };

  const toggleRow = (rowId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const currentMonth = months[currentMonthIndex];
  const monthData = data.filter(item => item.month === currentMonth);

  const formatCurrency = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="md:hidden">
      {/* Month Navigation Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigateMonth(-1)}
            disabled={currentMonthIndex === 0}
            className={`p-2 rounded-lg transition-colors ${
              currentMonthIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-[#3AB7BF] hover:bg-[#3AB7BF]/10'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#3AB7BF]" />
            <h2 className="text-lg font-semibold text-gray-900">{currentMonth}</h2>
          </div>

          <button
            onClick={() => navigateMonth(1)}
            disabled={currentMonthIndex === months.length - 1}
            className={`p-2 rounded-lg transition-colors ${
              currentMonthIndex === months.length - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-[#3AB7BF] hover:bg-[#3AB7BF]/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe Indicator */}
        <div className="flex items-center justify-center gap-1 pb-2">
          {months.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all ${
                index === currentMonthIndex
                  ? 'w-6 bg-[#3AB7BF]'
                  : 'w-1 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Swipeable Content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="p-4 space-y-3"
      >
        {monthData.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No data for this month</p>
          </div>
        ) : (
          monthData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleRow(item.glCode)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900 mb-1">
                    {item.name}
                  </div>
                  {item.code && (
                    <div className="text-xs text-gray-500">{item.code}</div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(item.forecastedAmount)}
                  </div>
                  {item.variance !== undefined && (
                    <div
                      className={`text-xs flex items-center justify-end gap-1 ${
                        item.variance >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                      }`}
                    >
                      {item.variance >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(item.variance).toFixed(1)}%
                    </div>
                  )}
                </div>
              </button>

              {expandedRows.has(item.glCode) && (
                <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {item.actualAmount !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Actual</div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(item.actualAmount)}
                        </div>
                      </div>
                    )}
                    {item.budgetAmount !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Budget</div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(item.budgetAmount)}
                        </div>
                      </div>
                    )}
                    {item.cumulativeYTD !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">YTD</div>
                        <div className="font-medium text-gray-900">
                          {formatCurrency(item.cumulativeYTD)}
                        </div>
                      </div>
                    )}
                    {item.changeVsPrior !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">vs Prior</div>
                        <div
                          className={`font-medium ${
                            item.changeVsPrior >= 0
                              ? 'text-[#4ADE80]'
                              : 'text-[#F87171]'
                          }`}
                        >
                          {item.changeVsPrior >= 0 ? '+' : ''}
                          {item.changeVsPrior.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation Helper */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs shadow-lg">
        Swipe to navigate months
      </div>
    </div>
  );
};

export default MobileForecastView;
