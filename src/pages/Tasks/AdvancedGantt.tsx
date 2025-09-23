import React, { useState, useRef, useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import { addDays, format, differenceInDays } from "date-fns";
import "react-resizable/css/styles.css";

const ItemTypes = { TASK: "task" };

// Helper function to format dates
const formatDate = (date: Date) => format(date, "MMM dd");

// Timeline grid component
const TimelineGrid: React.FC<{ startDate: Date; totalDays: number }> = React.memo(({ startDate, totalDays }) => {
  const days = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => {
      const currentDate = addDays(startDate, i);
      return (
        <div
          key={i}
          className="w-20 border-l border-gray-300 flex-shrink-0 text-center text-xs text-gray-500 py-2 hover:bg-gray-50 transition-colors"
        >
          {formatDate(currentDate)}
        </div>
      );
    });
  }, [startDate, totalDays]);

  return <div className="flex border-b border-gray-300">{days}</div>;
});

interface TaskData {
  id: number;
  title: string;
  start: Date;
  duration: number;
}

// Task component with proper drag/drop and resize
const Task: React.FC<{
  task: TaskData;
  index: number;
  moveTask: (fromIndex: number, toIndex: number) => void;
  updateTask: (id: number, updatedTask: Partial<TaskData>) => void;
  startDate: Date;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}> = React.memo(({ task, index, moveTask, updateTask, startDate, onDragStart, onDragEnd }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);

  // Drop for reordering tasks vertically
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drag for moving tasks horizontally along timeline
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index },
    collect: (monitor) => ({ 
      isDragging: monitor.isDragging() 
    }),
    begin: () => {
      setIsDraggingTimeline(true);
      onDragStart?.();
    },
    end: (item, monitor) => {
      setIsDraggingTimeline(false);
      onDragEnd?.();
      
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;
      
      // Snap to day grid (80px per day)
      const daysMoved = Math.round(delta.x / 80);
      if (daysMoved !== 0) {
        const newStart = addDays(task.start, daysMoved);
        updateTask(task.id, { start: newStart });
      }
    },
  });

  drag(drop(ref));

  // Handle resize
  const handleResize = useCallback((e: any, { size }: any) => {
    const newDuration = Math.max(1, Math.round(size.width / 80));
    updateTask(task.id, { duration: newDuration });
  }, [task.id, updateTask]);

  const leftPosition = differenceInDays(task.start, startDate) * 80;
  const topPosition = index * 60;

  return (
    <div
      style={{
        position: 'absolute',
        left: leftPosition,
        top: topPosition,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <ResizableBox
        width={task.duration * 80}
        height={40}
        minConstraints={[80, 40]}
        axis="x"
        onResizeStop={handleResize}
        handle={<span className="react-resizable-handle react-resizable-handle-se" />}
      >
        <div
          ref={ref}
          className={`bg-blue-500 text-white rounded shadow flex items-center justify-center cursor-move transition-all duration-200 hover:bg-blue-600 ${
            isDragging ? 'opacity-70 scale-105 shadow-lg' : ''
          }`}
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
          title={`${task.title} - ${formatDate(task.start)} (${task.duration} days)`}
        >
          <span className="text-sm font-medium truncate px-2">{task.title}</span>
          
          {/* Drag indicator */}
          {isDraggingTimeline && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {formatDate(task.start)}
            </div>
          )}
        </div>
      </ResizableBox>
    </div>
  );
});

// Dependency Line with hover effects
const DependencyLine: React.FC<{
  fromTask: TaskData;
  toTask: TaskData;
  startDate: Date;
  tasks: TaskData[];
}> = React.memo(({ fromTask, toTask, startDate, tasks }) => {
  const fromIndex = tasks.findIndex(t => t.id === fromTask.id);
  const toIndex = tasks.findIndex(t => t.id === toTask.id);
  
  const x1 = differenceInDays(fromTask.start, startDate) * 80 + fromTask.duration * 80;
  const y1 = fromIndex * 60 + 20;
  const x2 = differenceInDays(toTask.start, startDate) * 80;
  const y2 = toIndex * 60 + 20;
  
  return (
    <g className="dependency-line group">
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke="#6B7280" 
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
        className="group-hover:stroke-blue-500 transition-colors"
      />
      {/* Arrow marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" className="group-hover:fill-blue-500 transition-colors" />
        </marker>
      </defs>
    </g>
  );
});

const AdvancedGantt: React.FC = () => {
  const today = new Date("2025-01-22");
  const totalDays = 20;
  const [isDraggingAny, setIsDraggingAny] = useState(false);

  const [tasks, setTasks] = useState<TaskData[]>([
    { id: 1, title: "Forecast Review", start: today, duration: 3 },
    { id: 2, title: "Variance Analysis", start: addDays(today, 3), duration: 5 },
    { id: 3, title: "Scenario Planning", start: addDays(today, 8), duration: 2 },
  ]);

  const dependencies = useMemo(() => [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ], []);

  const moveTask = useCallback((fromIndex: number, toIndex: number) => {
    setTasks(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const updateTask = useCallback((id: number, updatedFields: Partial<TaskData>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDraggingAny(true);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDraggingAny(false);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1E2A38]">Advanced Gantt Chart</h2>
          <div className="text-sm text-gray-600">
            Drag tasks vertically to reorder • Drag horizontally to reschedule • Resize to adjust duration
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
          {/* Timeline Header */}
          <div className="mb-4">
            <TimelineGrid startDate={today} totalDays={totalDays} />
          </div>

          {/* Gantt Chart Area */}
          <div className="relative" style={{ height: tasks.length * 60 + 40, minWidth: totalDays * 80 }}>
            {/* Task rows background */}
            {tasks.map((_, index) => (
              <div
                key={`row-${index}`}
                className="absolute w-full h-12 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                style={{ top: index * 60 }}
              />
            ))}

            {/* Tasks */}
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                moveTask={moveTask}
                updateTask={updateTask}
                startDate={today}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))}

            {/* Dependencies */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {dependencies.map((dep, i) => {
                const fromTask = tasks.find(t => t.id === dep.from);
                const toTask = tasks.find(t => t.id === dep.to);
                if (!fromTask || !toTask) return null;
                return (
                  <DependencyLine
                    key={i}
                    fromTask={fromTask}
                    toTask={toTask}
                    startDate={today}
                    tasks={tasks}
                  />
                );
              })}
            </svg>

            {/* Grid overlay when dragging */}
            {isDraggingAny && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: totalDays }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-blue-200 opacity-50"
                    style={{ left: i * 80 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>Tasks</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-0.5 bg-gray-600 mr-2"></div>
            <span>Dependencies</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-dashed border-blue-200 mr-2"></div>
            <span>Day Grid (when dragging)</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdvancedGantt;