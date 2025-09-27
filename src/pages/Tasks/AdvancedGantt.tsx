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
  EyeOff,
  ChevronDown,
  ChevronRight,
  Plus,
  Link as LinkIcon,
  Trash2,
  Printer,
  Download,
  Minus
} from "lucide-react";
import "react-resizable/css/styles.css";

const ItemTypes = { TASK: "task" };
const DAY_WIDTH = 80;

interface TaskGroup {
  id: string;
  name: string;
  color: string;
  tasks: TaskData[];
  expanded: boolean;
}

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
  groupId: string;
}

interface GanttProps {
  tasks: TaskData[];
  onTaskUpdate: (taskId: string, updates: Partial<TaskData>) => void;
  onTaskMove: (fromIndex: number, toIndex: number) => void;
}

// Convert board tasks to Gantt format
const convertBoardTasksToGantt = (boardTasks: any[]): TaskData[] => {
  const getGroupId = (task: any) => {
    if (task.tags.includes('contract') || task.title.toLowerCase().includes('contract')) return 'contracts';
    if (task.tags.includes('design') || task.title.toLowerCase().includes('design')) return 'design';
    if (task.tags.includes('procurement') || task.title.toLowerCase().includes('procurement')) return 'procurement';
    return 'construction';
  };

  return boardTasks.map((task, index) => ({
    ...task,
    startDate: task.createdAt || new Date(),
    duration: Math.max(1, Math.ceil((task.dueDate.getTime() - (task.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))),
    progress: task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : 0,
    dependencies: [],
    isMilestone: task.priority === 'high',
    isOnCriticalPath: task.priority === 'high' && task.status !== 'done',
    groupId: getGroupId(task)
  }));
};

// Task Groups Configuration
const taskGroups: TaskGroup[] = [
  { id: 'contracts', name: 'Contracts', color: '#3B82F6', tasks: [], expanded: true },
  { id: 'design', name: 'Design', color: '#10B981', tasks: [], expanded: true },
  { id: 'procurement', name: 'Procurement', color: '#6B7280', tasks: [], expanded: true },
  { id: 'construction', name: 'Construction', color: '#F97316', tasks: [], expanded: true }
];

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

// Task Component with drag and resize
const GanttTask: React.FC<{
  task: TaskData;
  startDate: Date;
  onUpdate: (updates: Partial<TaskData>) => void;
  groupColor: string;
  taskIndex: number;
}> = React.memo(({ task, startDate, onUpdate, groupColor, taskIndex }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, startDate: task.startDate },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const daysMoved = Math.round(delta.x / DAY_WIDTH);
      if (daysMoved !== 0) {
        const newStartDate = addDays(task.startDate, daysMoved);
        onUpdate({ startDate: newStartDate });
      }
    },
  });

  const dragRef = useCallback(
    (node: HTMLDivElement) => {
      ref.current = node;
      drag(node);
    },
    [drag]
  );

  const handleResize = useCallback(
    (e: any, { size }: any) => {
      const newDuration = Math.max(1, Math.round(size.width / DAY_WIDTH));
      onUpdate({ duration: newDuration });
    },
    [onUpdate]
  );

  const taskLeft = differenceInDays(task.startDate, startDate) * DAY_WIDTH;
  const taskTop = taskIndex * 50 + 10;

  return (
    <div
      style={{
        position: "absolute",
        left: taskLeft,
        top: taskTop,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <div
        ref={dragRef}
        className={`h-8 text-white rounded shadow cursor-move flex items-center justify-between px-2 transition-all ${
          isDragging ? "opacity-70 scale-105 shadow-lg" : "hover:shadow-md"
        }`}
        style={{ 
          width: task.duration * DAY_WIDTH,
          backgroundColor: task.isOnCriticalPath ? '#F87171' : groupColor,
          background: `linear-gradient(90deg, ${groupColor} 0%, ${groupColor}dd ${task.progress}%, ${groupColor}66 ${task.progress}%, ${groupColor}33 100%)`
        }}
      >
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-xs font-medium truncate">{task.title}</span>
          {task.isMilestone && <Target className="w-3 h-3 ml-1 flex-shrink-0" />}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className="text-xs">{task.progress}%</span>
        </div>
      </div>

      <ResizableBox
        width={task.duration * DAY_WIDTH}
        height={8}
        minConstraints={[DAY_WIDTH, 8]}
        axis="x"
        onResizeStop={handleResize}
        handle={<span className="react-resizable-handle react-resizable-handle-se" />}
      >
        <div className="w-full h-full" />
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
  const y1 = fromIndex * 50 + 25;
  const x2 = differenceInDays(toTask.startDate, startDate) * DAY_WIDTH;
  const y2 = toIndex * 50 + 25;
  
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

// Hierarchical Task Sidebar Component
const HierarchicalTaskSidebar: React.FC<{
  taskGroups: TaskGroup[];
  onToggleGroup: (groupId: string) => void;
  onToggleAll: () => void;
  allExpanded: boolean;
}> = ({ taskGroups, onToggleGroup, onToggleAll, allExpanded }) => {
  const totalTasks = taskGroups.reduce((sum, group) => sum + group.tasks.length, 0);
  const completedTasks = taskGroups.reduce((sum, group) => 
    sum + group.tasks.filter(task => task.status === 'done').length, 0
  );
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[#1E2A38] text-lg">Project Tasks</h3>
          <button
            onClick={onToggleAll}
            className="flex items-center px-2 py-1 text-xs font-medium text-[#3AB7BF] hover:bg-[#3AB7BF]/10 rounded transition-colors"
          >
            {allExpanded ? (
              <>
                <Minus className="w-3 h-3 mr-1" />
                Collapse All
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-1" />
                Expand All
              </>
            )}
          </button>
        </div>
        
        {/* Overall Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="text-gray-600">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#4ADE80] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{overallProgress.toFixed(1)}% complete</div>
        </div>
      </div>

      {/* Task Groups */}
      <div className="flex-1 overflow-y-auto">
        {taskGroups.map(group => (
          <div key={group.id} className="border-b border-gray-100">
            {/* Group Header */}
            <button
              onClick={() => onToggleGroup(group.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                {group.expanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
                )}
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: group.color }}
                />
                <span className="font-semibold text-[#1E2A38]">{group.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{group.tasks.length} tasks</span>
                <div className="w-8 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${group.tasks.length > 0 ? (group.tasks.filter(t => t.status === 'done').length / group.tasks.length) * 100 : 0}%`,
                      backgroundColor: group.color
                    }}
                  />
                </div>
              </div>
            </button>
            
            {/* Group Tasks */}
            {group.expanded && (
              <div className="bg-gray-50/50">
                {group.tasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className="flex items-center p-3 pl-8 hover:bg-white transition-colors border-l-2 ml-4"
                    style={{ borderColor: group.color }}
                  >
                    {/* Task Checkbox */}
                    <div className="flex items-center mr-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={() => {
                          // Handle task completion toggle
                        }}
                        className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-0"
                        style={{ accentColor: group.color }}
                      />
                    </div>
                    
                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-[#1E2A38] text-sm truncate">{task.title}</h4>
                        <span className="text-xs font-medium text-gray-600 ml-2">{task.progress}%</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                               style={{ backgroundColor: `${group.color}20` }}>
                            <span className="text-xs font-medium" style={{ color: group.color }}>
                              {task.assignee.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-xs text-gray-600">{task.assignee}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">{task.duration}d</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${task.progress}%`,
                            backgroundColor: group.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[#3AB7BF]">{totalTasks}</div>
            <div className="text-xs text-gray-600">Total Tasks</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#4ADE80]">{completedTasks}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Gantt Chart Component
const AdvancedGantt: React.FC<GanttProps> = ({ tasks: boardTasks, onTaskUpdate, onTaskMove }) => {
  const [viewMode, setViewMode] = useState<'days' | 'weeks' | 'months'>('days');
  const [showWeekends, setShowWeekends] = useState(true);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [showMilestones, setShowMilestones] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [groupStates, setGroupStates] = useState<{ [key: string]: boolean }>({
    contracts: true,
    design: true,
    procurement: true,
    construction: true
  });

  // Convert board tasks to Gantt format
  const ganttTasks = useMemo(() => convertBoardTasksToGantt(boardTasks), [boardTasks]);
  
  // Group tasks by category
  const organizedGroups = useMemo(() => {
    return taskGroups.map(group => ({
      ...group,
      expanded: groupStates[group.id],
      tasks: ganttTasks.filter(task => task.groupId === group.id)
    }));
  }, [ganttTasks, groupStates]);
  
  // Flatten visible tasks for timeline rendering
  const visibleTasks = useMemo(() => {
    return organizedGroups.flatMap(group => 
      group.expanded ? group.tasks : []
    );
  }, [organizedGroups]);

  // Calculate timeline bounds
  const { startDate, totalDays } = useMemo(() => {
    if (visibleTasks.length === 0) {
      return { startDate: new Date(), totalDays: 30 };
    }
    
    const allDates = visibleTasks.flatMap(task => [
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
  }, [visibleTasks]);
  
  const handleToggleGroup = useCallback((groupId: string) => {
    setGroupStates(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  }, []);
  
  const handleToggleAll = useCallback(() => {
    const allExpanded = Object.values(groupStates).every(expanded => expanded);
    const newState = !allExpanded;
    setGroupStates(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: newState }), {})
    );
  }, [groupStates]);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<TaskData>) => {
    onTaskUpdate(taskId, updates);
  }, [onTaskUpdate]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  
  const allExpanded = Object.values(groupStates).every(expanded => expanded);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-3">
        {/* Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            {/* View Mode */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">View:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <button className="flex items-center px-3 py-1.5 bg-[#4ADE80] text-white rounded-lg hover:bg-[#3BC66F] transition-colors text-sm font-medium">
              <Plus className="w-4 h-4 mr-1" />
              Add Task
            </button>
            
            <button className="flex items-center px-3 py-1.5 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors text-sm font-medium">
              <LinkIcon className="w-4 h-4 mr-1" />
              Link Tasks
            </button>
            
            <button className="flex items-center px-3 py-1.5 bg-[#F87171] text-white rounded-lg hover:bg-[#F56565] transition-colors text-sm font-medium">
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </button>
            
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            {/* View Options */}
            <button
              onClick={() => setShowWeekends(!showWeekends)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showWeekends ? 'bg-[#3AB7BF] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showWeekends ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              Weekends
            </button>
            
            <button
              onClick={() => setShowCriticalPath(!showCriticalPath)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showCriticalPath ? 'bg-[#F87171] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Critical Path
            </button>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 px-2 min-w-[50px] text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-gray-300"></div>
            
            {/* Calendar Navigation */}
            <input
              type="date"
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              title="Navigate to date"
            />
          </div>
        </div>

        {/* Main Gantt Layout */}
        <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Hierarchical Task Sidebar */}
          <HierarchicalTaskSidebar
            taskGroups={organizedGroups}
            onToggleGroup={handleToggleGroup}
            onToggleAll={handleToggleAll}
            allExpanded={allExpanded}
          />

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
                className="relative bg-gradient-to-b from-gray-50 to-white"
                style={{ 
                  height: Math.max(visibleTasks.length * 50 + 30, 350),
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
                      repeating-linear-gradient(0deg, transparent, transparent 49px, #e5e7eb 49px, #e5e7eb 50px)
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
                {visibleTasks.map((task, index) => {
                  const group = organizedGroups.find(g => g.id === task.groupId);
                  return (
                    <GanttTask
                      key={task.id}
                      task={task}
                      startDate={startDate}
                      onUpdate={(updates) => handleTaskUpdate(task.id, updates)}
                      groupColor={group?.color || '#6B7280'}
                      taskIndex={index}
                    />
                  );
                })}

                {/* Dependencies */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
                  {visibleTasks.flatMap(task =>
                    task.dependencies.map(depId => {
                      const depTask = visibleTasks.find(t => t.id === depId);
                      return depTask ? (
                        <DependencyLine
                          key={`${task.id}-${depId}`}
                          fromTask={depTask}
                          toTask={task}
                          startDate={startDate}
                          tasks={visibleTasks}
                        />
                      ) : null;
                    }).filter(Boolean)
                  )}
                </svg>

                {/* Milestones */}
                {showMilestones && visibleTasks.filter(task => task.isMilestone).map((task, index) => {
                  const taskLeft = differenceInDays(task.startDate, startDate) * DAY_WIDTH;
                  const taskTop = visibleTasks.indexOf(task) * 50 + 20;
                  
                  return (
                    <div
                      key={`milestone-${task.id}`}
                      className="absolute w-4 h-4 bg-[#F59E0B] transform rotate-45 z-15"
                      style={{
                        left: taskLeft - 8,
                        top: taskTop,
                      }}
                      title={`Milestone: ${task.title}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 p-3 bg-white rounded-lg border border-gray-200">
          {/* Task Groups */}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#3B82F6] rounded mr-2"></div>
            <span>Contracts</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#10B981] rounded mr-2"></div>
            <span>Design</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#6B7280] rounded mr-2"></div>
            <span>Procurement</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[#F97316] rounded mr-2"></div>
            <span>Construction</span>
          </div>
          
          <div className="h-4 w-px bg-gray-300"></div>
          
          {/* Status Indicators */}
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
      </div>
    </DndProvider>
  );
};

export default AdvancedGantt;