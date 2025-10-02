import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, Calendar, User, MoreVertical, CreditCard as Edit3, Trash2, AlertTriangle, ChevronDown, Check } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeAvatar?: string;
  dueDate: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  tags: string[];
  comments: { id: string; author: string; content: string; createdAt: Date; }[];
  createdAt: Date;
  updatedAt: Date;
}

interface ListViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ tasks, onTaskClick, onTaskUpdate, onTaskDelete }) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState<string | null>(null);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState<string | null>(null);
  const [taskMenuOpen, setTaskMenuOpen] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<string | null>(null);

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const newStatus = destination.droppableId as Task['status'];
    onTaskUpdate(draggableId, { status: newStatus });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const isOverdue = (date: Date) => {
    return date < new Date() && date.toDateString() !== new Date().toDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in_progress': return 'In Progress';
      case 'done': return 'Done';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in_progress': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'done': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderTaskRow = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors ${
            snapshot.isDragging ? 'shadow-lg bg-white border border-gray-300 rounded-lg' : ''
          }`}
          onMouseEnter={() => setHoveredTask(task.id)}
          onMouseLeave={() => setHoveredTask(null)}
        >
          <div className="flex items-center px-4 py-3">
            <div
              {...provided.dragHandleProps}
              className={`mr-3 cursor-grab active:cursor-grabbing transition-opacity ${
                hoveredTask === task.id ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </div>

            <div className="flex-1 min-w-0 mr-4">
              <button
                onClick={() => onTaskClick(task)}
                className="text-left hover:text-[#3AB7BF] transition-colors"
              >
                <h3 className="font-medium text-[#101010] text-sm truncate">{task.title}</h3>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStatusDropdownOpen(statusDropdownOpen === task.id ? null : task.id);
                    setPriorityDropdownOpen(null);
                    setTaskMenuOpen(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all hover:shadow-sm ${getStatusColor(task.status)}`}
                >
                  <span className="flex items-center">
                    {getStatusLabel(task.status)}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </span>
                </button>

                {statusDropdownOpen === task.id && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                    {(['todo', 'in_progress', 'done'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskUpdate(task.id, { status });
                          setStatusDropdownOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{getStatusLabel(status)}</span>
                        {task.status === status && <Check className="w-4 h-4 text-[#3AB7BF]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriorityDropdownOpen(priorityDropdownOpen === task.id ? null : task.id);
                    setStatusDropdownOpen(null);
                    setTaskMenuOpen(null);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all hover:shadow-sm ${getPriorityColor(task.priority)}`}
                >
                  <span className="flex items-center capitalize">
                    {task.priority}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </span>
                </button>

                {priorityDropdownOpen === task.id && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                    {(['high', 'medium', 'low'] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskUpdate(task.id, { priority });
                          setPriorityDropdownOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between capitalize"
                      >
                        <span>{priority}</span>
                        {task.priority === priority && <Check className="w-4 h-4 text-[#3AB7BF]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-32 flex items-center text-sm text-gray-600">
                <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <span className="truncate">{task.assignee}</span>
              </div>

              <div className="w-28 flex items-center text-sm">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium flex items-center' : 'text-gray-600'}>
                  {isOverdue(task.dueDate) && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {formatDate(task.dueDate)}
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTaskMenuOpen(taskMenuOpen === task.id ? null : task.id);
                    setStatusDropdownOpen(null);
                    setPriorityDropdownOpen(null);
                  }}
                  className={`p-1.5 hover:bg-gray-200 rounded transition-opacity ${
                    hoveredTask === task.id || taskMenuOpen === task.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>

                {taskMenuOpen === task.id && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                        setTaskMenuOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete task "${task.title}"?`)) {
                          onTaskDelete(task.id);
                        }
                        setTaskMenuOpen(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  const renderColumn = (status: 'todo' | 'in_progress' | 'done', columnTasks: Task[], title: string, borderColor: string) => (
    <div key={status} className="flex-1 min-w-0">
      <div className={`border-t-4 ${borderColor} bg-white rounded-t-lg`}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-[#101010] text-sm flex items-center">
            {title}
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              {columnTasks.length}
            </span>
          </h3>
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[200px] transition-colors ${
                snapshot.isDraggingOver ? 'bg-teal-50' : 'bg-white'
              }`}
            >
              {columnTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  No tasks
                </div>
              ) : (
                columnTasks.map((task, index) => renderTaskRow(task, index))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        className="space-y-4"
        onClick={() => {
          setStatusDropdownOpen(null);
          setPriorityDropdownOpen(null);
          setTaskMenuOpen(null);
        }}
      >
        {renderColumn('todo', todoTasks, 'To Do', 'border-gray-400')}
        {renderColumn('in_progress', inProgressTasks, 'In Progress', 'border-teal-500')}
        {renderColumn('done', doneTasks, 'Done', 'border-green-500')}
      </div>
    </DragDropContext>
  );
};

export default ListView;
