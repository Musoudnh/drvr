import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ResizableBox } from "react-resizable";
import { addDays, format, differenceInDays } from "date-fns";
import "react-resizable/css/styles.css";

const ItemTypes = { TASK: "task" };

// Helper function to format dates
const formatDate = (date: Date) => format(date, "MMM dd");

// Timeline grid component
const TimelineGrid: React.FC<{ startDate: Date; totalDays: number }> = ({ startDate, totalDays }) => {
  const days = [];
  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(startDate, i);
    days.push(
      <div
        key={i}
        className="w-20 border-l border-gray-300 flex-shrink-0 text-center text-xs text-gray-500"
      >
        {formatDate(currentDate)}
      </div>
    );
  }
  return <div className="flex">{days}</div>;
};

interface TaskData {
  id: number;
  title: string;
  start: Date;
  duration: number;
  index: number;
}

// Task component
const Task: React.FC<{
  task: TaskData;
  index: number;
  moveTask: (fromIndex: number, toIndex: number) => void;
  updateTask: (id: number, updatedTask: TaskData) => void;
  startDate: Date;
}> = ({ task, index, moveTask, updateTask, startDate }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Drag
  const [, drag] = useDrag({
    type: ItemTypes.TASK,
    item: { index, id: task.id },
  });

  // Drop for reordering
  const [, drop] = useDrop({
    accept: ItemTypes.TASK,
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Resize handler
  const handleResize = (event: any, { size }: any) => {
    const newDuration = Math.max(1, Math.round(size.width / 80)); // 80px per day
    updateTask(task.id, { ...task, duration: newDuration });
  };

  // Drag along timeline to move start date
  const handleDragEnd = (e: React.DragEvent) => {
    if (!ref.current?.parentNode) return;
    const parentRect = (ref.current.parentNode as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - parentRect.left;
    const newStartIndex = Math.round(offsetX / 80);
    const newStartDate = addDays(startDate, newStartIndex);
    updateTask(task.id, { ...task, start: newStartDate });
  };

  return (
    <ResizableBox
      width={task.duration * 80}
      height={40}
      minConstraints={[80, 40]}
      axis="x"
      onResizeStop={handleResize}
    >
      <div
        ref={ref}
        draggable
        onDragEnd={handleDragEnd}
        className="bg-blue-500 text-white rounded shadow cursor-move flex items-center justify-center absolute"
        style={{
          left: differenceInDays(task.start, startDate) * 80,
          width: task.duration * 80,
          height: 40,
        }}
      >
        {task.title}
      </div>
    </ResizableBox>
  );
};

// Dependency Line (SVG)
const DependencyLine: React.FC<{
  fromTask: TaskData;
  toTask: TaskData;
  startDate: Date;
}> = ({ fromTask, toTask, startDate }) => {
  const x1 = differenceInDays(fromTask.start, startDate) * 80 + fromTask.duration * 80;
  const y1 = fromTask.index * 60 + 20;
  const x2 = differenceInDays(toTask.start, startDate) * 80;
  const y2 = toTask.index * 60 + 20;
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />;
};

const AdvancedGantt: React.FC = () => {
  const today = new Date("2025-01-22");
  const totalDays = 20;

  const [tasks, setTasks] = useState<TaskData[]>([
    { id: 1, title: "Forecast Review", start: today, duration: 3, index: 0 },
    { id: 2, title: "Variance Analysis", start: addDays(today, 3), duration: 5, index: 1 },
    { id: 3, title: "Scenario Planning", start: addDays(today, 8), duration: 2, index: 2 },
  ]);

  // Example dependencies: task 1 → task 2 → task 3
  const dependencies = [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ];

  const moveTask = (fromIndex: number, toIndex: number) => {
    const updated = [...tasks];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    // update index
    const newTasks = updated.map((t, i) => ({ ...t, index: i }));
    setTasks(newTasks);
  };

  const updateTask = (id: number, updatedTask: TaskData) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? updatedTask : t)));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 overflow-x-auto relative">
        <h2 className="text-xl font-bold mb-4">Fixed Advanced Gantt Chart</h2>

        {/* Timeline Grid */}
        <TimelineGrid startDate={today} totalDays={totalDays} />

        {/* Gantt Task Area */}
        <div className="relative h-[200px] mt-4">
          {tasks.map((task, index) => (
            <Task
              key={task.id}
              task={task}
              index={index}
              moveTask={moveTask}
              updateTask={updateTask}
              startDate={today}
            />
          ))}

          {/* Dependencies */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {dependencies.map((dep, i) => {
              const fromTask = tasks.find((t) => t.id === dep.from);
              const toTask = tasks.find((t) => t.id === dep.to);
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
    </DndProvider>
  );
};

export default AdvancedGantt;