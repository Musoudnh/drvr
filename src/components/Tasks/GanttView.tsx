import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Calendar, ChevronDown, Check, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  tags: string[];
  createdAt: Date;
}

interface GanttViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskUpdate?: (taskId: string, updates: { dueDate?: Date; createdAt?: Date }) => void;
}

type TimeScale = 'days' | 'weeks' | 'months';

const GanttView: React.FC<GanttViewProps> = ({ tasks, onTaskClick, onTaskUpdate }) => {
  const [timeScale, setTimeScale] = useState<TimeScale>('days');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['high', 'medium', 'low']);
  const [showPriorityFilter, setShowPriorityFilter] = useState(false);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);
  const [dragType, setDragType] = useState<'start' | 'end' | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [tempTaskDates, setTempTaskDates] = useState<{ [key: string]: { createdAt: Date; dueDate: Date } }>({});

  const filterRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => selectedPriorities.includes(task.priority));
  }, [tasks, selectedPriorities]);

  const { startDate, endDate, dateRange, cellWidth } = useMemo(() => {
    const tasksToUse = filteredTasks.length > 0 ? filteredTasks : [];

    if (tasksToUse.length === 0) {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      const end = new Date(today);
      end.setDate(end.getDate() + 30);
      return {
        startDate: start,
        endDate: end,
        dateRange: generateDateRange(start, end, timeScale),
        cellWidth: getCellWidth(timeScale)
      };
    }

    const dates = tasksToUse.flatMap(t => [t.dueDate.getTime(), t.createdAt.getTime()]);
    const minDate = new Date(Math.min(...dates, today.getTime()));
    const maxDate = new Date(Math.max(...dates, today.getTime()));

    const start = new Date(minDate);
    const end = new Date(maxDate);

    if (timeScale === 'days') {
      start.setDate(start.getDate() - 7);
      end.setDate(end.getDate() + 7);
    } else if (timeScale === 'weeks') {
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() + 14);
    } else {
      start.setMonth(start.getMonth() - 1);
      end.setMonth(end.getMonth() + 1);
    }

    return {
      startDate: start,
      endDate: end,
      dateRange: generateDateRange(start, end, timeScale),
      cellWidth: getCellWidth(timeScale)
    };
  }, [filteredTasks, timeScale]);

  function getCellWidth(scale: TimeScale): number {
    switch (scale) {
      case 'days': return 40;
      case 'weeks': return 80;
      case 'months': return 120;
      default: return 40;
    }
  }

  function generateDateRange(start: Date, end: Date, scale: TimeScale): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    if (scale === 'days') {
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    } else if (scale === 'weeks') {
      current.setDate(current.getDate() - current.getDay());
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 7);
      }
    } else {
      current.setDate(1);
      while (current <= end) {
        dates.push(new Date(current));
        current.setMonth(current.getMonth() + 1);
      }
    }

    return dates;
  }

  const totalCells = dateRange.length;

  const getTaskPosition = (task: Task) => {
    const taskDueDate = tempTaskDates[task.id]?.dueDate || new Date(task.dueDate);
    const taskStartDate = tempTaskDates[task.id]?.createdAt || new Date(task.createdAt);

    taskDueDate.setHours(0, 0, 0, 0);
    taskStartDate.setHours(0, 0, 0, 0);

    let startDiff = 0;
    let endDiff = 0;

    if (timeScale === 'days') {
      startDiff = Math.floor((taskStartDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      endDiff = Math.floor((taskDueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    } else if (timeScale === 'weeks') {
      startDiff = Math.floor((taskStartDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
      endDiff = Math.floor((taskDueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7));
    } else {
      const startMonths = (taskStartDate.getFullYear() - startDate.getFullYear()) * 12 +
                          (taskStartDate.getMonth() - startDate.getMonth());
      const endMonths = (taskDueDate.getFullYear() - startDate.getFullYear()) * 12 +
                        (taskDueDate.getMonth() - startDate.getMonth());
      startDiff = startMonths;
      endDiff = endMonths;
    }

    const left = Math.max(0, startDiff * cellWidth);
    const width = Math.max(cellWidth, (endDiff - startDiff + 1) * cellWidth);
    const dueDatePosition = endDiff * cellWidth;

    return { left, width, dueDatePosition };
  };

  const handleDragStart = useCallback((e: React.MouseEvent, taskId: string, type: 'start' | 'end') => {
    e.stopPropagation();
    setDraggingTask(taskId);
    setDragType(type);
    setDragStartX(e.clientX);

    const task = filteredTasks.find(t => t.id === taskId);
    if (task) {
      setTempTaskDates(prev => ({
        ...prev,
        [taskId]: {
          createdAt: new Date(task.createdAt),
          dueDate: new Date(task.dueDate)
        }
      }));
    }
  }, [filteredTasks]);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!draggingTask || !dragType) return;

    const deltaX = e.clientX - dragStartX;
    const cellsMoved = Math.round(deltaX / cellWidth);

    if (cellsMoved === 0) return;

    const task = filteredTasks.find(t => t.id === draggingTask);
    if (!task) return;

    const currentDates = tempTaskDates[draggingTask] || {
      createdAt: new Date(task.createdAt),
      dueDate: new Date(task.dueDate)
    };

    let newDates = { ...currentDates };

    if (dragType === 'start') {
      const newStartDate = new Date(currentDates.createdAt);
      if (timeScale === 'days') {
        newStartDate.setDate(newStartDate.getDate() + cellsMoved);
      } else if (timeScale === 'weeks') {
        newStartDate.setDate(newStartDate.getDate() + cellsMoved * 7);
      } else {
        newStartDate.setMonth(newStartDate.getMonth() + cellsMoved);
      }

      if (newStartDate < currentDates.dueDate) {
        newDates.createdAt = newStartDate;
      }
    } else {
      const newEndDate = new Date(currentDates.dueDate);
      if (timeScale === 'days') {
        newEndDate.setDate(newEndDate.getDate() + cellsMoved);
      } else if (timeScale === 'weeks') {
        newEndDate.setDate(newEndDate.getDate() + cellsMoved * 7);
      } else {
        newEndDate.setMonth(newEndDate.getMonth() + cellsMoved);
      }

      if (newEndDate > currentDates.createdAt) {
        newDates.dueDate = newEndDate;
      }
    }

    setTempTaskDates(prev => ({
      ...prev,
      [draggingTask]: newDates
    }));
    setDragStartX(e.clientX);
  }, [draggingTask, dragType, dragStartX, cellWidth, filteredTasks, tempTaskDates, timeScale]);

  const handleDragEnd = useCallback(() => {
    if (draggingTask && tempTaskDates[draggingTask] && onTaskUpdate) {
      onTaskUpdate(draggingTask, tempTaskDates[draggingTask]);
    }
    setDraggingTask(null);
    setDragType(null);
    setTempTaskDates({});
  }, [draggingTask, tempTaskDates, onTaskUpdate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#F87171]';
      case 'medium': return 'bg-[#FBBF24]';
      case 'low': return 'bg-[#34D399]';
      default: return 'bg-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-[#4ADE80]';
      case 'in_progress': return 'bg-[#3AB7BF]';
      case 'todo': return 'bg-[#94A3B8]';
      default: return 'bg-gray-400';
    }
  };

  const formatHeaderDate = (date: Date) => {
    if (timeScale === 'days') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (timeScale === 'weeks') {
      const weekEnd = new Date(date);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
  };

  const formatCellHeader = (date: Date) => {
    if (timeScale === 'days') {
      return {
        top: date.toLocaleDateString('en-US', { weekday: 'short' }),
        bottom: date.getDate().toString()
      };
    } else if (timeScale === 'weeks') {
      return {
        top: `Week ${getWeekNumber(date)}`,
        bottom: formatHeaderDate(date)
      };
    } else {
      return {
        top: date.toLocaleDateString('en-US', { month: 'short' }),
        bottom: date.getFullYear().toString()
      };
    }
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const isToday = (date: Date) => {
    if (timeScale !== 'days') return false;
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  };

  const isWeekend = (date: Date) => {
    if (timeScale !== 'days') return false;
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const togglePriority = (priority: string) => {
    setSelectedPriorities(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority);
      } else {
        return [...prev, priority];
      }
    });
  };

  const sortedTasks = [...filteredTasks].sort((a, b) =>
    a.dueDate.getTime() - b.dueDate.getTime()
  );

  if (filteredTasks.length === 0 && tasks.length > 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No Tasks Match Selected Filters</h3>
          <p className="text-gray-400">Adjust your priority filters to see tasks</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No Tasks to Display</h3>
          <p className="text-gray-400">Add tasks to see them in the Gantt chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowPriorityFilter(!showPriorityFilter)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Priority Filter</span>
              {selectedPriorities.length < 3 && (
                <span className="px-1.5 py-0.5 bg-[#3AB7BF] text-white rounded-full text-xs">
                  {selectedPriorities.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>

            {showPriorityFilter && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowPriorityFilter(false)}
                />
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px]">
                  <div className="p-2 space-y-1">
                    {['high', 'medium', 'low'].map(priority => (
                      <button
                        key={priority}
                        onClick={() => togglePriority(priority)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded ${getPriorityColor(priority)}`} />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {priority}
                          </span>
                        </div>
                        {selectedPriorities.includes(priority) && (
                          <Check className="w-4 h-4 text-[#3AB7BF]" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 p-2">
                    <button
                      onClick={() => setSelectedPriorities(['high', 'medium', 'low'])}
                      className="w-full px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    >
                      Select All
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setTimeScale('days')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              timeScale === 'days'
                ? 'bg-white text-[#3AB7BF] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setTimeScale('weeks')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              timeScale === 'weeks'
                ? 'bg-white text-[#3AB7BF] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Weeks
          </button>
          <button
            onClick={() => setTimeScale('months')}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              timeScale === 'months'
                ? 'bg-white text-[#3AB7BF] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Months
          </button>
        </div>
      </div>

      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className="flex border-b border-gray-200">
              <div className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-4">
                <h3 className="font-semibold text-[#101010]">Tasks</h3>
              </div>

              <div className="flex-1 overflow-x-auto">
                <div className="flex" style={{ width: totalCells * cellWidth }}>
                  {dateRange.map((date, index) => {
                    const { top, bottom } = formatCellHeader(date);
                    return (
                      <div
                        key={index}
                        className={`flex-shrink-0 p-2 text-center border-r border-gray-200 ${
                          isWeekend(date) ? 'bg-gray-50' : 'bg-white'
                        } ${isToday(date) ? 'bg-[#3AB7BF]/10' : ''}`}
                        style={{ width: cellWidth }}
                      >
                        <div className={`text-xs font-medium ${
                          isToday(date) ? 'text-[#3AB7BF]' : 'text-gray-600'
                        }`}>
                          {top}
                        </div>
                        <div className={`text-xs ${
                          isToday(date) ? 'text-[#3AB7BF] font-bold' : 'text-gray-500'
                        }`}>
                          {bottom}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="relative">
              {sortedTasks.map((task) => {
                const { left, width, dueDatePosition } = getTaskPosition(task);
                const taskDueDateStr = (tempTaskDates[task.id]?.dueDate || task.dueDate)
                  .toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const isDragging = draggingTask === task.id;

                return (
                  <div
                    key={task.id}
                    className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-64 flex-shrink-0 p-4 border-r border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#101010] truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-600 truncate">{task.assignee}</p>
                            <span className="text-xs text-gray-500">Due: {taskDueDateStr}</span>
                          </div>
                        </div>
                        <span className={`ml-2 w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                      </div>
                    </div>

                    <div className="flex-1 relative" style={{ height: '60px', width: totalCells * cellWidth }}>
                      {dateRange.map((date, dateIndex) => (
                        <div
                          key={dateIndex}
                          className={`absolute top-0 h-full border-r border-gray-100 ${
                            isWeekend(date) ? 'bg-gray-50/50' : ''
                          } ${isToday(date) ? 'bg-[#3AB7BF]/5 border-[#3AB7BF] border-l-2' : ''}`}
                          style={{
                            left: dateIndex * cellWidth,
                            width: cellWidth
                          }}
                        />
                      ))}

                      <div
                        className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-lg cursor-pointer transition-all group ${
                          isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
                        } ${getStatusColor(task.status)}`}
                        style={{
                          left: `${left}px`,
                          width: `${width}px`,
                          minWidth: '80px'
                        }}
                        onClick={() => !isDragging && onTaskClick?.(task)}
                        title={`${task.title} - Due: ${taskDueDateStr} - ${task.status.replace('_', ' ')}`}
                      >
                        <div
                          className="absolute left-0 top-0 h-full w-2 cursor-ew-resize hover:bg-white/30 rounded-l-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => handleDragStart(e, task.id, 'start')}
                          title="Drag to adjust start date"
                        >
                          <div className="w-1 h-4 bg-white/80 rounded" />
                        </div>

                        <div className="h-full flex items-center justify-between px-3">
                          <span className="text-xs font-medium text-white truncate">
                            {task.title}
                          </span>
                        </div>

                        <div
                          className="absolute right-0 top-0 h-full w-2 cursor-ew-resize hover:bg-white/30 rounded-r-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onMouseDown={(e) => handleDragStart(e, task.id, 'end')}
                          title="Drag to adjust due date"
                        >
                          <div className="w-1 h-4 bg-white/80 rounded" />
                        </div>
                      </div>

                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-[#1E2A38]"
                        style={{
                          left: `${dueDatePosition}px`,
                        }}
                        title={`Due Date: ${taskDueDateStr}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[#94A3B8]" />
                <span>To Do</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[#3AB7BF]" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-[#4ADE80]" />
                <span>Done</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {formatHeaderDate(startDate)} - {formatHeaderDate(endDate)} · {sortedTasks.length} tasks
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttView;
