import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, Calendar, User, MoreVertical, CreditCard as Edit3, Trash2, AlertTriangle, ChevronDown, Check, Settings } from 'lucide-react';

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
  const [columnMenuOpen, setColumnMenuOpen] = useState<string | null>(null);
  const [showColumnSettingsModal, setShowColumnSettingsModal] = useState<string | null>(null);
  const [columnSettings, setColumnSettings] = useState({
    todo: { label: 'To Do', color: 'bg-gray-100', textColor: 'text-gray-700' },
    in_progress: { label: 'In Progress', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    done: { label: 'Done', color: 'bg-green-100', textColor: 'text-green-700' }
  });
  const [tempColumnLabel, setTempColumnLabel] = useState('');
  const [tempColumnColor, setTempColumnColor] = useState('');

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
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'todo') return columnSettings.todo.label;
    if (status === 'in_progress') return columnSettings.in_progress.label;
    if (status === 'done') return columnSettings.done.label;
    return status;
  };

  const getStatusColor = (status: string) => {
    if (status === 'todo') return `${columnSettings.todo.color} ${columnSettings.todo.textColor} border-gray-200`;
    if (status === 'in_progress') return `${columnSettings.in_progress.color} ${columnSettings.in_progress.textColor} border-yellow-200`;
    if (status === 'done') return `${columnSettings.done.color} ${columnSettings.done.textColor} border-green-200`;
    return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const renderColumn = (status: 'todo' | 'in_progress' | 'done', columnTasks: Task[], title: string, borderColor: string) => {
    const settings = columnSettings[status];

    return (
      <div key={status} className="flex-1 min-w-0">
        <div className="bg-white rounded-t-lg">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-[#101010] text-sm flex items-center">
              <span className={`px-3 py-1.5 rounded-md text-xs font-medium ${settings.color} ${settings.textColor} border border-gray-200`}>
                {settings.label}
              </span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                {columnTasks.length}
              </span>
            </h3>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setColumnMenuOpen(columnMenuOpen === status ? null : status);
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
              {columnMenuOpen === status && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[160px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColumnSettingsModal(status);
                      setTempColumnLabel(settings.label);
                      setTempColumnColor(settings.color);
                      setColumnMenuOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize Column
                  </button>
                </div>
              )}
            </div>
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
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div
          className="space-y-4"
          onClick={() => {
            setStatusDropdownOpen(null);
            setPriorityDropdownOpen(null);
            setTaskMenuOpen(null);
            setColumnMenuOpen(null);
          }}
        >
          {renderColumn('todo', todoTasks, 'To Do', '')}
          {renderColumn('in_progress', inProgressTasks, 'In Progress', '')}
          {renderColumn('done', doneTasks, 'Done', '')}
        </div>
      </DragDropContext>

      {showColumnSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Customize Column</h3>
              <button
                onClick={() => setShowColumnSettingsModal(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <span className="text-gray-400 text-xl leading-none">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Column Name</label>
                <input
                  type="text"
                  value={tempColumnLabel}
                  onChange={(e) => setTempColumnLabel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="Enter column name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Grey' },
                    { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Yellow' },
                    { bg: 'bg-green-100', text: 'text-green-700', label: 'Green' },
                    { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Blue' },
                    { bg: 'bg-red-100', text: 'text-red-700', label: 'Red' },
                    { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Purple' },
                    { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Pink' },
                    { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Orange' }
                  ].map((color) => (
                    <button
                      key={color.bg}
                      onClick={() => {
                        setTempColumnColor(color.bg);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        tempColumnColor === color.bg
                          ? 'border-[#3AB7BF] ring-2 ring-[#3AB7BF] ring-opacity-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-full h-6 rounded ${color.bg}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowColumnSettingsModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showColumnSettingsModal) {
                    const colorMap: Record<string, string> = {
                      'bg-gray-100': 'text-gray-700',
                      'bg-yellow-100': 'text-yellow-700',
                      'bg-green-100': 'text-green-700',
                      'bg-blue-100': 'text-blue-700',
                      'bg-red-100': 'text-red-700',
                      'bg-purple-100': 'text-purple-700',
                      'bg-pink-100': 'text-pink-700',
                      'bg-orange-100': 'text-orange-700'
                    };

                    setColumnSettings({
                      ...columnSettings,
                      [showColumnSettingsModal]: {
                        label: tempColumnLabel || columnSettings[showColumnSettingsModal].label,
                        color: tempColumnColor || columnSettings[showColumnSettingsModal].color,
                        textColor: colorMap[tempColumnColor] || columnSettings[showColumnSettingsModal].textColor
                      }
                    });
                    setShowColumnSettingsModal(null);
                  }
                }}
                className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListView;
