import React, { useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

const GanttView: React.FC<GanttViewProps> = ({ tasks, onTaskClick }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { startDate, endDate, dateRange } = useMemo(() => {
    if (tasks.length === 0) {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      const end = new Date(today);
      end.setDate(end.getDate() + 30);
      return {
        startDate: start,
        endDate: end,
        dateRange: generateDateRange(start, end)
      };
    }

    const dates = tasks.map(t => t.dueDate.getTime());
    const minDate = new Date(Math.min(...dates, today.getTime()));
    const maxDate = new Date(Math.max(...dates, today.getTime()));

    const start = new Date(minDate);
    start.setDate(start.getDate() - 7);

    const end = new Date(maxDate);
    end.setDate(end.getDate() + 7);

    return {
      startDate: start,
      endDate: end,
      dateRange: generateDateRange(start, end)
    };
  }, [tasks]);

  function generateDateRange(start: Date, end: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(start);

    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  const totalDays = dateRange.length;
  const dayWidth = 40;

  const getTaskPosition = (task: Task) => {
    const taskDueDate = new Date(task.dueDate);
    taskDueDate.setHours(0, 0, 0, 0);

    const taskStartDate = new Date(task.createdAt);
    taskStartDate.setHours(0, 0, 0, 0);

    const daysBetween = Math.floor((taskDueDate.getTime() - taskStartDate.getTime()) / (1000 * 60 * 60 * 24));

    const effectiveStartDate = taskStartDate;
    const minDuration = 3;
    const effectiveDuration = Math.max(minDuration, daysBetween);

    const startDiff = Math.floor((effectiveStartDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const endDiff = startDiff + effectiveDuration;

    const left = Math.max(0, startDiff * dayWidth);
    const width = Math.max(dayWidth * minDuration, effectiveDuration * dayWidth);

    const dueDatePosition = Math.floor((taskDueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) * dayWidth;

    return { left, width, dueDatePosition };
  };

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isToday = (date: Date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const sortedTasks = [...tasks].sort((a, b) =>
    a.dueDate.getTime() - b.dueDate.getTime()
  );

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex border-b border-gray-200">
            <div className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-4">
              <h3 className="font-semibold text-[#1E2A38]">Tasks</h3>
            </div>

            <div className="flex-1 overflow-x-auto">
              <div className="flex" style={{ width: totalDays * dayWidth }}>
                {dateRange.map((date, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 p-2 text-center border-r border-gray-200 ${
                      isWeekend(date) ? 'bg-gray-50' : 'bg-white'
                    } ${isToday(date) ? 'bg-[#3AB7BF]/10' : ''}`}
                    style={{ width: dayWidth }}
                  >
                    <div className={`text-xs font-medium ${
                      isToday(date) ? 'text-[#3AB7BF]' : 'text-gray-600'
                    }`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-xs ${
                      isToday(date) ? 'text-[#3AB7BF] font-bold' : 'text-gray-500'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            {sortedTasks.map((task, index) => {
              const { left, width, dueDatePosition } = getTaskPosition(task);
              const taskDueDateStr = task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <div
                  key={task.id}
                  className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-64 flex-shrink-0 p-4 border-r border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#1E2A38] truncate">
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

                  <div className="flex-1 relative" style={{ height: '60px', width: totalDays * dayWidth }}>
                    {dateRange.map((date, dateIndex) => (
                      <div
                        key={dateIndex}
                        className={`absolute top-0 h-full border-r border-gray-100 ${
                          isWeekend(date) ? 'bg-gray-50/50' : ''
                        } ${isToday(date) ? 'bg-[#3AB7BF]/5 border-[#3AB7BF] border-l-2' : ''}`}
                        style={{
                          left: dateIndex * dayWidth,
                          width: dayWidth
                        }}
                      />
                    ))}

                    <div
                      className={`absolute top-1/2 -translate-y-1/2 h-8 rounded-lg cursor-pointer transition-all hover:shadow-md ${getStatusColor(task.status)}`}
                      style={{
                        left: `${left}px`,
                        width: `${width}px`,
                        minWidth: '80px'
                      }}
                      onClick={() => onTaskClick?.(task)}
                      title={`${task.title} - Due: ${taskDueDateStr} - ${task.status.replace('_', ' ')}`}
                    >
                      <div className="h-full flex items-center justify-between px-2">
                        <span className="text-xs font-medium text-white truncate">
                          {task.title}
                        </span>
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
            <span className="font-medium">Legend:</span>
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
          {formatHeaderDate(startDate)} - {formatHeaderDate(endDate)}
        </div>
      </div>
    </div>
  );
};

export default GanttView;
