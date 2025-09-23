import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import { addDays, format, differenceInDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { 
  Calendar, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Pause,
  Square,
  Target,
  Settings,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import "react-resizable/css/styles.css";

const ItemTypes = { TASK: "task" };
const DAY_WIDTH = 80;

interface TaskData {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // Gantt-specific fields
  startDate: Date;
  duration: number; // in days
  progress: number; // 0-100%
  dependencies: string[]; // task IDs this task depends on
  isMilestone: boolean;
  isOnCriticalPath: boolean;
}

interface GanttProps {
  tasks: TaskData[];
  onTaskUpdate: (taskId: string, updates: Partial<TaskData>) => void;
  onTaskMove: (fromIndex: number, toIndex: number) => void;
}

// Convert board tasks to Gantt format
const convertBoardTasksToGantt = (boardTasks: any[]): TaskData[] => {
  return boardTasks.map((task, index) => ({
    ...task,
    startDate: task.createdAt || new Date(),
    duration: Math.max(1, Math.ceil((task.dueDate.getTime() - (task.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))),
    progress: task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : 0,
    dependencies: [], // Could be enhanced to detect dependencies
    isMilestone: task.priority === 'high',
    isOnCriticalPath: task.priority === 'high' && task.status !== 'done'
  }));
};

// Timeline Grid Component
const TimelineGrid: React.FC<{ 
  startDate: Date; 
  totalDays: number; 
  viewMode: 'days' | 'weeks' | 'months';
  showWeekends: boolean;
}> = React.memo(({ startDate, totalDays, viewMode, showWeekends }) => {
  const timeUnits = useMemo(() => {
    const units = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = addDays(startDate, i);
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      
      if (!showWeekends && isWeekend) continue;
      
      let label = '';
      switch (viewMode) {
        case 'days':
          label = format(currentDate, "MMM dd");
          break;
        case 'weeks':
          label = format(startOfWeek(currentDate), "MMM dd");
          break;
        case 'months':
          label = format(currentDate, "MMM yyyy");
          break;
      }
      
      units.push(
        <div
          key={i}
          className={`w-20 border-l border-gray-300 flex-shrink-0 text-center text-xs py-2 transition-colors ${
            isWeekend ? 'bg-gray-100 text-gray-400' : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          {label}
        </div>
      );
    }
    return units;
  }, [startDate, totalDays, viewMode, showWeekends]);

  return <div className="flex border-b border-gray-300">{timeUnits}</div>;
});

// Task Component with dedicated drag handle
const GanttTask: React.FC<{
  task: TaskData;
  startDate: Date;
  onUpdate: (updates: Partial<TaskData>) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  index: number;
  showWeekends: boolean;
}> = React.memo(({ task, startDate, onUpdate, onMove, index, showWeekends }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Drop for vertical reordering
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drag for horizontal timeline and vertical reorder
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index, startDate: task.startDate },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      // Horizontal movement in days - snap to grid
      const daysMoved = Math.round(delta.x / DAY_WIDTH);
      if (daysMoved !== 0) {
        const newStartDate = addDays(task.startDate, daysMoved);
        onUpdate({ startDate: newStartDate });
      }
    },
  });

  const dragDropRef = useCallback(
    (node: HTMLDivElement) => {
      ref.current = node;
      drag(drop(node));
    },
    [drag, drop]
  );

  const handleResize = useCallback(
    (e: any, { size }: any) => {
      const newDuration = Math.max(1, Math.round(size.width / DAY_WIDTH));
      onUpdate({ duration: newDuration });
    },
    [onUpdate]
  );

  const getStatusColor = () => {
    switch (task.status) {
      case 'done': return '#4ADE80';
      case 'in_progress': return '#3AB7BF';
      default: return '#94A3B8';
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high': return '#F87171';
      case 'medium': return '#F59E0B';
      default: return '#4ADE80';
    }
  };

  const taskLeft = differenceInDays(task.startDate, startDate) * DAY_WIDTH;
  const taskTop = index * 70 + 15;

  return (
    <div
      style={{
        position: "absolute",
        left: taskLeft,
        top: taskTop,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      {/* Dedicated drag handle */}
      <div
        ref={dragDropRef}
        className={`h-10 text-white rounded-t shadow cursor-move flex items-center justify-between px-2 transition-all ${
          isDragging ? "opacity-70 scale-105 shadow-lg" : "hover:shadow-md"
        }`}
        style={{ 
          width: task.duration * DAY_WIDTH,
          backgroundColor: task.isOnCriticalPath ? '#F87171' : getStatusColor()
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-sm font-medium truncate">{task.title}</span>
          {task.isMilestone && <Target className="w-3 h-3 ml-2 flex-shrink-0" />}
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium">
              {task.assignee.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <span className="text-xs">{task.progress}%</span>
        </div>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-1 py-0.5 rounded text-xs whitespace-nowrap">
            {format(task.startDate, "MMM dd")} - {format(addDays(task.startDate, task.duration), "MMM dd")}
          </div>
        )}
      </div>

      {/* Resizable task body */}
      <ResizableBox
        width={task.duration * DAY_WIDTH}
        height={15}
        minConstraints={[DAY_WIDTH, 15]}
        axis="x"
        onResizeStop={handleResize}
        handle={<span className="react-resizable-handle react-resizable-handle-se" />}
      >
        <div 
          className="w-full h-full rounded-b relative overflow-hidden"
          style={{ backgroundColor: `${getStatusColor()}80` }}
        >
          {/* Progress bar */}
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${task.progress}%`,
              backgroundColor: getStatusColor()
            }}
          />
          
          {/* Priority indicator */}
          <div 
            className="absolute top-0 right-0 w-1 h-full"
            style={{ backgroundColor: getPriorityColor() }}
          />
        </div>
      </ResizableBox>
    </div>
  );
});

// Dependency Line Component
const DependencyLine: React.FC<{
  fromTask: TaskData;
  toTask: TaskData;
  startDate: Date;
  tasks: TaskData[];
}> = React.memo(({ fromTask, toTask, startDate, tasks }) => {
  const fromIndex = tasks.findIndex(t => t.id === fromTask.id);
  const toIndex = tasks.findIndex(t => t.id === toTask.id);
  
  const x1 = differenceInDays(fromTask.startDate, startDate) * DAY_WIDTH + fromTask.duration * DAY_WIDTH;
  const y1 = fromIndex * 70 + 35;
  const x2 = differenceInDays(toTask.startDate, startDate) * DAY_WIDTH;
  const y2 = toIndex * 70 + 35;
  
  return (
    <g className="dependency-line group">
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={fromTask.isOnCriticalPath ? "#F87171" : "#6B7280"}
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        className="group-hover:stroke-blue-500 transition-colors"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon 
            points="0 0, 10 3.5, 0 7" 
            fill={fromTask.isOnCriticalPath ? "#F87171" : "#6B7280"}
            className="group-hover:fill-blue-500 transition-colors" 
          />
        </marker>
      </defs>
    </g>
  );
});

// Main Gantt Chart Component
const AdvancedGantt: React.FC<GanttProps> = ({ tasks: boardTasks, onTaskUpdate, onTaskMove }) => {
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('days');
  const [showWeekends, setShowWeekends] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const [filterAssignee, setFilterAssignee] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState(1);

  // Convert board tasks to Gantt format
  const ganttTasks = useMemo(() => convertBoardTasksToGantt(boardTasks), [boardTasks]);
  
  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return ganttTasks.filter(task => {
      const matchesAssignee = !filterAssignee || task.assignee.includes(filterAssignee);
      const matchesStatus = !filterStatus || task.status === filterStatus;
      return matchesAssignee && matchesStatus;
    });
  }, [ganttTasks, filterAssignee, filterStatus]);

  // Calculate timeline bounds
  const { startDate, totalDays } = useMemo(() => {
    if (filteredTasks.length === 0) {
      return { startDate: new Date(), totalDays: 30 };
    }
    
    const allDates = filteredTasks.flatMap(task => [
      task.startDate,
      addDays(task.startDate, task.duration)
    ]);
    
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Add padding
    const paddedStart = addDays(minDate, -7);
    const paddedEnd = addDays(maxDate, 14);
    
    return {
      startDate: paddedStart,
      totalDays: differenceInDays(paddedEnd, paddedStart)
    };
  }, [filteredTasks]);

  // Get unique assignees for filter
  const assignees = useMemo(() => {
    return [...new Set(ganttTasks.map(task => task.assignee))];
  }, [ganttTasks]);

  // Auto-detect dependencies (simple heuristic)
  useEffect(() => {
    const tasksWithDeps = filteredTasks.map(task => {
      const dependencies = filteredTasks
        .filter(otherTask => 
          otherTask.id !== task.id && 
          otherTask.dueDate <= task.startDate &&
          otherTask.assignee === task.assignee
        )
        .map(dep => dep.id);
      
      return { ...task, dependencies };
    });
    
    // Update critical path calculation
    const criticalTasks = tasksWithDeps.filter(task => 
      task.priority === 'high' || task.dependencies.length > 0
    );
    
    criticalTasks.forEach(task => {
      task.isOnCriticalPath = true;
    });
  }, [filteredTasks]);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<TaskData>) => {
    onTaskUpdate(taskId, updates);
  }, [onTaskUpdate]);

  const handleTaskMove = useCallback((fromIndex: number, toIndex: number) => {
    onTaskMove(fromIndex, toIndex);
  }, [onTaskMove]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
        {/* Gantt Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">View:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Assignee:</label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="">All Assignees</option>
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWeekends(!showWeekends)}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                showWeekends ? 'bg-[#3AB7BF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showWeekends ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              Weekends
            </button>
            
            <button
              onClick={() => setShowCriticalPath(!showCriticalPath)}
              className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                showCriticalPath ? 'bg-[#F87171] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Critical Path
            </button>
            
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-gray-100 rounded"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 px-1">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-gray-100 rounded"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Task List Sidebar */}
        <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="w-72 border-r border-gray-200 bg-gray-50">
            <div className="p-3 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-[#1E2A38]">Tasks ({filteredTasks.length})</h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="p-2 border-b border-gray-200 hover:bg-white transition-colors"
                  style={{ height: '70px' }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-[#1E2A38] text-sm leading-tight">{task.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-[#F87171]/20 text-[#F87171]' :
                      task.priority === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#4ADE80]/20 text-[#4ADE80]'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{task.duration}d</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.status === 'done' ? 'bg-[#4ADE80]/20 text-[#4ADE80]' :
                      task.status === 'in_progress' ? 'bg-[#3AB7BF]/20 text-[#3AB7BF]' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    
                    {task.isOnCriticalPath && (
                      <span className="px-2 py-1 bg-[#F87171]/20 text-[#F87171] rounded-full text-xs font-medium">
                        Critical
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Chart Area */}
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-full">
              {/* Timeline Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                <TimelineGrid 
                  startDate={startDate} 
                  totalDays={totalDays} 
                  viewMode={viewMode}
                  showWeekends={showWeekends}
                />
              </div>

              {/* Chart Area */}
              <div 
                className="relative bg-gray-50"
                style={{ 
                  height: Math.max(filteredTasks.length * 70 + 30, 350),
                  minWidth: totalDays * DAY_WIDTH,
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top left'
                }}
              >
                {/* Grid lines */}
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(90deg, transparent, transparent ${DAY_WIDTH - 1}px, #e5e7eb ${DAY_WIDTH - 1}px, #e5e7eb ${DAY_WIDTH}px),
                      repeating-linear-gradient(0deg, transparent, transparent 69px, #e5e7eb 69px, #e5e7eb 70px)
                    `
                  }}
                />

                {/* Today indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                  style={{ left: differenceInDays(new Date(), startDate) * DAY_WIDTH }}
                >
                  <div className="absolute -top-1 -left-6 bg-red-500 text-white px-1 py-0.5 rounded text-xs">
                    Today
                  </div>
                </div>

                {/* Tasks */}
                {filteredTasks.map((task, index) => (
                  <GanttTask
                    key={task.id}
                    task={task}
                    startDate={startDate}
                    onUpdate={(updates) => handleTaskUpdate(task.id, updates)}
                    onMove={handleTaskMove}
                    index={index}
                    showWeekends={showWeekends}
                  />
                ))}

                {/* Dependencies */}
                <svg 
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 10 }}
                >
                  {filteredTasks.flatMap(task =>
                    task.dependencies.map(depId => {
                      const depTask = filteredTasks.find(t => t.id === depId);
                      if (!depTask) return null;
                      return (
                        <DependencyLine
                          key={`${depId}-${task.id}`}
                          fromTask={depTask}
                          toTask={task}
                          startDate={startDate}
                          tasks={filteredTasks}
                        />
                      );
                    }).filter(Boolean)
                  )}
                </svg>

                {/* Milestones */}
                {showMilestones && filteredTasks.filter(task => task.isMilestone).map((milestone, index) => (
                  <div
                    key={`milestone-${milestone.id}`}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: differenceInDays(milestone.startDate, startDate) * DAY_WIDTH - 10,
                      top: filteredTasks.findIndex(t => t.id === milestone.id) * 70 + 10,
                      zIndex: 15
                    }}
                  >
                    <div className="w-6 h-6 bg-[#F59E0B] transform rotate-45 border-2 border-white shadow-lg" />
                    <Target className="absolute w-3 h-3 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#94A3B8] rounded mr-2"></div>
            <span>Not Started</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#3AB7BF] rounded mr-2"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#4ADE80] rounded mr-2"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#F87171] rounded mr-2"></div>
            <span>Critical Path</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#F59E0B] transform rotate-45 mr-2"></div>
            <span>Milestone</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-gray-600 mr-2"></div>
            <span>Dependencies</span>
          </div>
          <div className="flex items-center">
            <div className="w-0.5 h-4 bg-red-500 mr-2"></div>
            <span>Today</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#3AB7BF]">{filteredTasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#4ADE80]">{filteredTasks.filter(t => t.status === 'done').length}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#F87171]">{filteredTasks.filter(t => t.isOnCriticalPath).length}</div>
            <div className="text-sm text-gray-600">Critical Path</div>
          </div>
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-2xl font-bold text-[#F59E0B]">{filteredTasks.filter(t => t.isMilestone).length}</div>
            <div className="text-sm text-gray-600">Milestones</div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdvancedGantt;