import React, { useState, useRef, useCallback, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import { addDays, format, differenceInDays } from "date-fns";
import "react-resizable/css/styles.css";

const ItemTypes = { TASK: "task" };
const DAY_WIDTH = 80; // pixels per day

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
  index: number;
}

// Task component with proper react-dnd only (no native drag)
const Task: React.FC<{
  task: TaskData;
  tasks: TaskData[];
  startDate: Date;
  moveTask: (fromIndex: number, toIndex: number) => void;
  updateTask: (id: number, updatedTask: TaskData) => void;
}> = React.memo(({ task, tasks, startDate, moveTask, updateTask }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Drop for reordering tasks vertically
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = task.index;
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

  // Drag for moving tasks both vertically (reorder) and horizontally (timeline)
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { id: task.id, index: task.index },
    collect: (monitor) => ({ 
      isDragging: monitor.isDragging() 
    }),
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;
      
      // Snap to day grid (80px per day)
      const daysMoved = Math.round(delta.x / DAY_WIDTH);
      if (daysMoved !== 0) {
        const newStart = addDays(task.start, daysMoved);
        updateTask(task.id, { ...task, start: newStart });
      }
    },
  });

  drag(drop(ref));

  // Handle resize
  const handleResize = useCallback((e: any, { size }: any) => {
    const newDuration = Math.max(1, Math.round(size.width / DAY_WIDTH));
    updateTask(task.id, { ...task, duration: newDuration });
  }, [task, updateTask]);

  return (
    <ResizableBox
      width={task.duration * DAY_WIDTH}
      height={40}
      minConstraints={[DAY_WIDTH, 40]}
      axis="x"
      onResizeStop={handleResize}
      handle={<span className="react-resizable-handle react-resizable-handle-se" />}
      style={{
        position: 'absolute',
        left: differenceInDays(task.start, startDate) * DAY_WIDTH,
        top: task.index * 60,
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <div
        ref={ref}
        className={`bg-blue-500 text-white rounded shadow flex items-center justify-center cursor-move transition-all duration-200 hover:bg-blue-600 ${
          isDragging ? 'opacity-70 scale-105 shadow-lg' : ''
        }`}
        style={{
          width: '100%',
          height: '100%',
        }}
        title={`${task.title} - ${formatDate(task.start)} (${task.duration} days)`}
      >
        <span className="text-sm font-medium truncate px-2">{task.title}</span>
        
        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {formatDate(task.start)}
          </div>
        )}
      </div>
    </ResizableBox>
  );
});

// Dependency Line with hover effects
const DependencyLine: React.FC<{
  fromTask: TaskData;
  toTask: TaskData;
  startDate: Date;
}> = React.memo(({ fromTask, toTask, startDate }) => {
  const x1 = differenceInDays(fromTask.start, startDate) * DAY_WIDTH + fromTask.duration * DAY_WIDTH;
  const y1 = fromTask.index * 60 + 20;
  const x2 = differenceInDays(toTask.start, startDate) * DAY_WIDTH;
  const y2 = toTask.index * 60 + 20;
  
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

  const [tasks, setTasks] = useState<TaskData[]>([
    { id: 1, title: "Forecast Review", start: today, duration: 3, index: 0 },
    { id: 2, title: "Variance Analysis", start: addDays(today, 3), duration: 5, index: 1 },
    { id: 3, title: "Scenario Planning", start: addDays(today, 8), duration: 2, index: 2 },
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
      // Update indices after reordering
      return updated.map((task, i) => ({ ...task, index: i }));
    });
  }, []);

  const updateTask = useCallback((id: number, updatedTask: TaskData) => {
    setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
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
          <div className="relative" style={{ height: tasks.length * 60 + 40, minWidth: totalDays * DAY_WIDTH }}>
            {/* Task rows background */}
            {tasks.map((_, index) => (
              <div
                key={`row-${index}`}
                className="absolute w-full h-12 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                style={{ top: index * 60 }}
              />
            ))}

            {/* Tasks */}
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                tasks={tasks}
                startDate={today}
                moveTask={moveTask}
                updateTask={updateTask}
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
                  />
                );
              })}
            </svg>
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
            <span>Drag to reorder or reschedule</span>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdvancedGantt;