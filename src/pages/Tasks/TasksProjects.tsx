import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Search, Filter, Grid3x3 as Grid3X3, List, Maximize2, Calendar, User, MessageSquare, X, ChevronRight, Clock, AlertTriangle, CheckCircle, MoreHorizontal, CreditCard as Edit3, Trash2, Eye, Link as LinkIcon, Settings, Zap, GripVertical, MoreVertical, Activity, Send, ChevronDown, Check } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import ListView from '../../components/Tasks/ListView';

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
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

interface ActivityLogEntry {
  id: string;
  user: string;
  action: 'created' | 'updated' | 'commented' | 'status_changed';
  taskTitle: string;
  taskId: string;
  details: string;
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  members: string[];
  status: 'active' | 'completed' | 'on_hold';
  dueDate: Date;
}

const TasksProjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'clickup' | 'monday' | 'native'>('native');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editTaskForm, setEditTaskForm] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [clickupConnected, setClickupConnected] = useState(false);
  const [mondayConnected, setMondayConnected] = useState(false);
  const [isDraggingTask, setIsDraggingTask] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectForm, setConnectForm] = useState({
    tabName: '',
    platform: 'clickup' as 'clickup' | 'monday'
  });
  const [connectedBoards, setConnectedBoards] = useState<Array<{
    id: string;
    name: string;
    platform: 'clickup' | 'monday';
    connected: boolean;
  }>>([]);
  const [taskMenuOpen, setTaskMenuOpen] = useState<string | null>(null);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState<string | null>(null);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activityLogFilter, setActivityLogFilter] = useState<string>('all');
  const [newComment, setNewComment] = useState('');
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false);
  const [priorityModalDropdownOpen, setPriorityModalDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [editAssigneeDropdownOpen, setEditAssigneeDropdownOpen] = useState(false);
  const [editPriorityDropdownOpen, setEditPriorityDropdownOpen] = useState(false);
  const [editStatusDropdownOpen, setEditStatusDropdownOpen] = useState(false);
  const [dueDateDropdownOpen, setDueDateDropdownOpen] = useState(false);
  const [editDueDateDropdownOpen, setEditDueDateDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [dayDropdownOpen, setDayDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [editMonthDropdownOpen, setEditMonthDropdownOpen] = useState(false);
  const [editDayDropdownOpen, setEditDayDropdownOpen] = useState(false);
  const [editYearDropdownOpen, setEditYearDropdownOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [editSelectedMonth, setEditSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [editSelectedDay, setEditSelectedDay] = useState<number>(new Date().getDate());
  const [editSelectedYear, setEditSelectedYear] = useState<number>(new Date().getFullYear());
  const assigneeDropdownRef = useRef<HTMLDivElement>(null);
  const priorityModalDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const editAssigneeDropdownRef = useRef<HTMLDivElement>(null);
  const editPriorityDropdownRef = useRef<HTMLDivElement>(null);
  const editStatusDropdownRef = useRef<HTMLDivElement>(null);
  const dueDateDropdownRef = useRef<HTMLDivElement>(null);
  const editDueDateDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const dayDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const editMonthDropdownRef = useRef<HTMLDivElement>(null);
  const editDayDropdownRef = useRef<HTMLDivElement>(null);
  const editYearDropdownRef = useRef<HTMLDivElement>(null);

  const [tabs, setTabs] = useState<Array<{
    id: string;
    name: string;
    type: 'native' | 'board';
    platform?: 'clickup' | 'monday';
  }>>([
    { id: 'native', name: 'Task Board', type: 'native' }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Q1 Budget Review',
      description: 'Review and finalize Q1 budget allocations across all departments',
      assignee: 'Sarah Johnson',
      assigneeAvatar: undefined,
      dueDate: new Date('2025-01-25'),
      priority: 'high',
      status: 'in_progress',
      tags: ['budget', 'finance'],
      comments: [
        {
          id: 'c1',
          author: 'Michael Chen',
          content: 'Marketing budget needs adjustment based on Q4 performance',
          createdAt: new Date('2025-01-15')
        }
      ],
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-15')
    },
    {
      id: '2',
      title: 'Financial Report Generation',
      description: 'Generate monthly financial reports for stakeholders',
      assignee: 'Emily Rodriguez',
      assigneeAvatar: undefined,
      dueDate: new Date('2025-01-30'),
      priority: 'medium',
      status: 'todo',
      tags: ['reporting', 'monthly'],
      comments: [],
      createdAt: new Date('2025-01-12'),
      updatedAt: new Date('2025-01-12')
    },
    {
      id: '3',
      title: 'Expense Categorization',
      description: 'Categorize and review Q4 expense entries',
      assignee: 'David Kim',
      assigneeAvatar: undefined,
      dueDate: new Date('2025-01-20'),
      priority: 'low',
      status: 'done',
      tags: ['expenses', 'categorization'],
      comments: [],
      createdAt: new Date('2025-01-08'),
      updatedAt: new Date('2025-01-18')
    },
    {
      id: '4',
      title: 'Cash Flow Forecast',
      description: 'Update 13-week rolling cash flow forecast',
      assignee: 'Sarah Johnson',
      assigneeAvatar: undefined,
      dueDate: new Date('2025-01-28'),
      priority: 'high',
      status: 'todo',
      tags: ['forecast', 'cash-flow'],
      comments: [],
      createdAt: new Date('2025-01-14'),
      updatedAt: new Date('2025-01-14')
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    priority: 'medium' as const
  });

  const teamMembers = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Lisa Thompson'
  ];

  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([
    {
      id: 'a1',
      user: 'Sarah Johnson',
      action: 'created',
      taskTitle: 'Q1 Budget Review',
      taskId: '1',
      details: 'Created task',
      timestamp: new Date('2025-01-10T09:30:00')
    },
    {
      id: 'a2',
      user: 'Michael Chen',
      action: 'commented',
      taskTitle: 'Q1 Budget Review',
      taskId: '1',
      details: 'Added comment about marketing budget',
      timestamp: new Date('2025-01-15T14:20:00')
    },
    {
      id: 'a3',
      user: 'Sarah Johnson',
      action: 'status_changed',
      taskTitle: 'Q1 Budget Review',
      taskId: '1',
      details: 'Changed status from To Do to In Progress',
      timestamp: new Date('2025-01-15T16:45:00')
    },
    {
      id: 'a4',
      user: 'Emily Rodriguez',
      action: 'created',
      taskTitle: 'Financial Report Generation',
      taskId: '2',
      details: 'Created task',
      timestamp: new Date('2025-01-12T10:15:00')
    },
    {
      id: 'a5',
      user: 'David Kim',
      action: 'updated',
      taskTitle: 'Expense Categorization',
      taskId: '3',
      details: 'Updated task description',
      timestamp: new Date('2025-01-16T11:30:00')
    },
    {
      id: 'a6',
      user: 'David Kim',
      action: 'status_changed',
      taskTitle: 'Expense Categorization',
      taskId: '3',
      details: 'Changed status from In Progress to Done',
      timestamp: new Date('2025-01-18T15:00:00')
    }
  ]);

  const filteredTasks = tasks.filter(task =>
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tasksByStatus = {
    todo: filteredTasks.filter(task => task.status === 'todo'),
    in_progress: filteredTasks.filter(task => task.status === 'in_progress'),
    done: filteredTasks.filter(task => task.status === 'done')
  };

  const handleDragStart = () => {
    setIsDraggingTask(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setIsDraggingTask(false);

    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === 'TAB') {
      const newTabs = Array.from(tabs);
      const [removed] = newTabs.splice(source.index, 1);
      newTabs.splice(destination.index, 0, removed);
      setTabs(newTabs);
      return;
    }

    setTasks(prev => prev.map(task =>
      task.id === draggableId
        ? { ...task, status: destination.droppableId as Task['status'] }
        : task
    ));
  };

  const handleAddTask = () => {
    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      dueDate: new Date(newTask.dueDate),
      priority: newTask.priority,
      status: 'todo',
      tags: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;

    setTasks(prev => [...prev, task]);
    setNewTask({ title: '', description: '', assignee: '', dueDate: '', priority: 'medium' });
    setShowAddTaskModal(false);
  };

  const handleTaskUpdate = (taskId: string, updates: { dueDate?: Date; createdAt?: Date; priority?: 'high' | 'medium' | 'low' }) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            ...(updates.dueDate && { dueDate: updates.dueDate }),
            ...(updates.createdAt && { createdAt: updates.createdAt }),
            ...(updates.priority && { priority: updates.priority }),
            updatedAt: new Date()
          }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    return 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const getStatusColor = (status: string) => {
    return 'bg-gray-100 text-gray-700 border border-gray-200';
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

  useEffect(() => {
    setIsDraggingTask(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (taskMenuOpen) {
        setTaskMenuOpen(null);
      }
      if (assigneeDropdownRef.current && !assigneeDropdownRef.current.contains(e.target as Node)) {
        setAssigneeDropdownOpen(false);
      }
      if (priorityModalDropdownRef.current && !priorityModalDropdownRef.current.contains(e.target as Node)) {
        setPriorityModalDropdownOpen(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
      if (editAssigneeDropdownRef.current && !editAssigneeDropdownRef.current.contains(e.target as Node)) {
        setEditAssigneeDropdownOpen(false);
      }
      if (editPriorityDropdownRef.current && !editPriorityDropdownRef.current.contains(e.target as Node)) {
        setEditPriorityDropdownOpen(false);
      }
      if (editStatusDropdownRef.current && !editStatusDropdownRef.current.contains(e.target as Node)) {
        setEditStatusDropdownOpen(false);
      }
      if (dueDateDropdownRef.current && !dueDateDropdownRef.current.contains(e.target as Node)) {
        setDueDateDropdownOpen(false);
      }
      if (editDueDateDropdownRef.current && !editDueDateDropdownRef.current.contains(e.target as Node)) {
        setEditDueDateDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target as Node)) {
        setMonthDropdownOpen(false);
      }
      if (dayDropdownRef.current && !dayDropdownRef.current.contains(e.target as Node)) {
        setDayDropdownOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target as Node)) {
        setYearDropdownOpen(false);
      }
      if (editMonthDropdownRef.current && !editMonthDropdownRef.current.contains(e.target as Node)) {
        setEditMonthDropdownOpen(false);
      }
      if (editDayDropdownRef.current && !editDayDropdownRef.current.contains(e.target as Node)) {
        setEditDayDropdownOpen(false);
      }
      if (editYearDropdownRef.current && !editYearDropdownRef.current.contains(e.target as Node)) {
        setEditYearDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [taskMenuOpen]);

  const renderTaskCard = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-3 mb-2 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab group relative ${
            snapshot.isDragging ? 'rotate-2 shadow-lg cursor-grabbing' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
          onDoubleClick={() => {
            setSelectedTask(task);
            setShowTaskDetail(true);
            setIsEditingTask(false);
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-[#101010] text-xs leading-tight flex-1 pr-2">{task.title}</h3>
            <div className="flex items-center gap-1 flex-shrink-0">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPriorityDropdownOpen(priorityDropdownOpen === task.id ? null : task.id);
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
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                    {(['high', 'medium', 'low'] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskUpdate(task.id, { priority });
                          setPriorityDropdownOpen(null);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between capitalize"
                      >
                        <span>{priority}</span>
                        {task.priority === priority && <Check className="w-4 h-4 text-[#3AB7BF]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTaskMenuOpen(taskMenuOpen === task.id ? null : task.id);
                  setPriorityDropdownOpen(null);
                }}
                className="p-1 hover:bg-gray-100 rounded relative"
                title="More options"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xs text-gray-600">{task.assignee}</span>
            </div>

            <div className="flex items-center">
              <Calendar className="w-3 h-3 text-gray-400 mr-1" />
              <span className={`text-xs ${
                isOverdue(task.dueDate) ? 'text-[#F87171] font-medium' : 'text-gray-600'
              }`}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>


          {/* Dropdown Menu - positioned relative to button in header */}
          {taskMenuOpen === task.id && (
            <div className="absolute top-8 right-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTask(task);
                  setEditTaskForm(task);
                  setIsEditingTask(true);
                  setShowTaskDetail(true);
                  setTaskMenuOpen(null);
                }}
                className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete task "${task.title}"?`)) {
                    setTasks(prev => prev.filter(t => t.id !== task.id));
                  }
                  setTaskMenuOpen(null);
                }}
                className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

  const renderKanbanBoard = () => (
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full"
        onClick={() => {
          setPriorityDropdownOpen(null);
          setTaskMenuOpen(null);
        }}
      >
        {(['todo', 'in_progress', 'done'] as const).map(status => {
          const statusTasks = tasksByStatus[status];
          const statusLabels = {
            todo: 'To Do',
            in_progress: 'In Progress', 
            done: 'Done'
          };
          
          return (
            <div key={status} className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#101010] flex items-center">
                  {statusLabels[status]}
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {statusTasks.length}
                  </span>
                </h3>
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[400px] p-2 rounded-lg transition-all duration-200 ${
                      snapshot.isDraggingOver 
                        ? 'bg-[#3AB7BF]/10 border-2 border-[#3AB7BF] border-dashed' 
                        : 'bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    {statusTasks.map((task, index) => renderTaskCard(task, index))}
                    {provided.placeholder}
                    {/* Drop zone indicator when dragging over */}
                    {snapshot.isDraggingOver && (
                      <div className="text-center py-4 border-2 border-dashed border-[#3AB7BF] rounded-lg bg-[#3AB7BF]/5 mt-2">
                        <p className="text-xs font-medium text-[#3AB7BF]">Drop here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
  );

  const handleTaskUpdateWrapper = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));

    if (updates.status) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setActivityLog(prev => [{
          id: `a${Date.now()}`,
          user: 'Current User',
          action: 'status_changed',
          taskTitle: task.title,
          taskId: task.id,
          details: `Changed status to ${updates.status}`,
          timestamp: new Date()
        }, ...prev]);
      }
    }
  };

  const handleTaskDeleteWrapper = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const renderIntegrationTab = (type: 'clickup' | 'monday') => {
    const isConnected = type === 'clickup' ? clickupConnected : mondayConnected;
    const setConnected = type === 'clickup' ? setClickupConnected : setMondayConnected;
    const serviceName = type === 'clickup' ? 'ClickUp' : 'Monday.com';
    const serviceColor = type === 'clickup' ? '#7B68EE' : '#FF6B6B';

    if (!isConnected) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${serviceColor}20` }}
            >
              <LinkIcon className="w-8 h-8" style={{ color: serviceColor }} />
            </div>
            <h3 className="text-xl font-semibold text-[#101010] mb-2">Connect to {serviceName}</h3>
            <p className="text-gray-600 mb-6">
              Connect your {serviceName} workspace to view and manage your tasks directly within FinanceFlow.
            </p>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                onClick={() => setConnected(true)}
                className="w-full"
                style={{ backgroundColor: serviceColor }}
              >
                <Zap className="w-4 h-4 mr-2" />
                Connect {serviceName}
              </Button>
              <p className="text-xs text-gray-500">
                Secure OAuth integration • Read-only access • Revoke anytime
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center mr-2"
              style={{ backgroundColor: serviceColor }}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-medium text-[#101010]">Connected to {serviceName}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 h-[600px]">
          <iframe
            src={type === 'clickup' 
              ? 'https://app.clickup.com/embed' 
              : 'https://view.monday.com/embed'
            }
            className="w-full h-full rounded-lg"
            title={`${serviceName} Board`}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    );
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="p-4 space-y-4">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <Droppable droppableId="tabs" direction="horizontal" type="TAB">
              {(provided, snapshot) => (
                <nav
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex space-x-2 px-4 transition-all duration-200 ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
                  aria-label="Task Navigation"
                >
                  {tabs.map((tab, index) => (
                    <Draggable key={tab.id} draggableId={tab.id} index={index}>
                      {(provided, snapshot) => (
                        <button
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => setActiveTab(tab.id)}
                          disabled={isDraggingTask}
                          className={`flex items-center py-3 px-3 border-b-2 font-medium text-xs transition-all duration-200 group cursor-grab active:cursor-grabbing ${
                            activeTab === tab.id
                              ? tab.platform === 'clickup'
                                ? 'border-[#7B68EE] text-[#7B68EE]'
                                : tab.platform === 'monday'
                                ? 'border-[#FF6B6B] text-[#FF6B6B]'
                                : 'border-[#4F46E5] text-[#4F46E5]'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } ${isDraggingTask ? 'opacity-50 cursor-not-allowed' : ''} ${
                            snapshot.isDragging ? 'bg-white shadow-xl ring-2 ring-blue-400 z-50 scale-105' : ''
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <GripVertical className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-40 transition-opacity" />
                          {tab.type === 'native' ? (
                            <Grid3X3 className="w-4 h-4 mr-2" />
                          ) : (
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: tab.platform === 'clickup' ? '#7B68EE' : '#FF6B6B' }}
                            />
                          )}
                          {tab.name}
                        </button>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    onClick={() => setShowConnectModal(true)}
                    disabled={isDraggingTask}
                    className={`flex items-center py-3 px-3 border-b-2 font-medium text-xs transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 ${isDraggingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Connect Board
                  </button>
                </nav>
              )}
            </Droppable>
          </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'native' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="flex items-center px-4 py-2 rounded-lg text-xs font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode('board')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        viewMode === 'board'
                          ? 'bg-white text-[#4F46E5] shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 mr-1 inline" />
                      Board
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-[#4F46E5] shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <List className="w-4 h-4 mr-1 inline" />
                      List
                    </button>
                  </div>

                  <button
                    onClick={() => setShowActivityLog(true)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium flex items-center"
                  >
                    <Activity className="w-4 h-4 mr-1.5" />
                    Activity Log
                  </button>
                </div>
              </div>

              {/* Task View */}
              {viewMode === 'board' && renderKanbanBoard()}
              {viewMode === 'list' && (
                <ListView
                  tasks={filteredTasks}
                  onTaskClick={(task) => {
                    setSelectedTask(task);
                    setShowTaskDetail(true);
                  }}
                  onTaskUpdate={handleTaskUpdateWrapper}
                  onTaskDelete={handleTaskDeleteWrapper}
                />
              )}
            </div>
          )}

          {tabs.filter(tab => tab.type === 'board').map(tab => {
            const board = connectedBoards.find(b => b.id === tab.id);
            return activeTab === tab.id && board ? (
              <div key={tab.id}>
                {renderIntegrationTab(board.platform)}
              </div>
            ) : null;
          })}
        </div>
      </div>
        
      {/* Floating Add Task Button */}
      {activeTab === 'native' && (
        <button
          onClick={() => setShowAddTaskModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#3AB7BF] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
          title="Add new task"
        >
          <Plus className="w-6 h-6 text-white" />
          <div className="absolute inset-0 rounded-full bg-[#3AB7BF] animate-ping opacity-20" />
        </button>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Add New Task</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  rows={3}
                  placeholder="Describe the task"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Assignee *</label>
                  <div className="relative" ref={assigneeDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setAssigneeDropdownOpen(!assigneeDropdownOpen)}
                      className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{newTask.assignee || 'Select assignee'}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {assigneeDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                        <div className="flex flex-col gap-1">
                          {teamMembers.map((member) => (
                            <button
                              key={member}
                              type="button"
                              onClick={() => {
                                setNewTask({...newTask, assignee: member});
                                setAssigneeDropdownOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                newTask.assignee === member
                                  ? 'bg-[#3AB7BF] text-white'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {member}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                  <div className="relative" ref={priorityModalDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setPriorityModalDropdownOpen(!priorityModalDropdownOpen)}
                      className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between capitalize"
                    >
                      <span>{newTask.priority}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {priorityModalDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full">
                        <div className="flex flex-col gap-1">
                          {(['low', 'medium', 'high'] as const).map((priority) => (
                            <button
                              key={priority}
                              type="button"
                              onClick={() => {
                                setNewTask({...newTask, priority});
                                setPriorityModalDropdownOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left capitalize ${
                                newTask.priority === priority
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {priority}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Due Date *</label>
                <div className="relative" ref={dueDateDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDueDateDropdownOpen(!dueDateDropdownOpen)}
                    className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{newTask.dueDate || 'Select due date'}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  {dueDateDropdownOpen && (
                    <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-full">
                      <div className="flex gap-2">
                        <div className="flex-1 relative" ref={monthDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                            className="w-full px-2 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][selectedMonth - 1]}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>
                          {monthDropdownOpen && (
                            <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                                <button
                                  key={month}
                                  type="button"
                                  onClick={() => {
                                    setSelectedMonth(idx + 1);
                                    setMonthDropdownOpen(false);
                                    const dateStr = `${selectedYear}-${String(idx + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                                    setNewTask({...newTask, dueDate: dateStr});
                                  }}
                                  className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                    selectedMonth === idx + 1 ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {month}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 relative" ref={dayDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setDayDropdownOpen(!dayDropdownOpen)}
                            className="w-full px-2 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{selectedDay}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>
                          {dayDropdownOpen && (
                            <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDay(day);
                                    setDayDropdownOpen(false);
                                    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    setNewTask({...newTask, dueDate: dateStr});
                                  }}
                                  className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                    selectedDay === day ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 relative" ref={yearDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                            className="w-full px-2 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{selectedYear}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </button>
                          {yearDropdownOpen && (
                            <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                <button
                                  key={year}
                                  type="button"
                                  onClick={() => {
                                    setSelectedYear(year);
                                    setYearDropdownOpen(false);
                                    const dateStr = `${year}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                                    setNewTask({...newTask, dueDate: dateStr});
                                  }}
                                  className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                    selectedYear === year ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                disabled={!newTask.title.trim() || !newTask.assignee || !newTask.dueDate}
                className="px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#212B36',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }
                }}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-[#101010]">
                {isEditingTask ? 'Edit Task' : selectedTask.title}
              </h3>
              <button
                onClick={() => {
                  setShowTaskDetail(false);
                  setIsEditingTask(false);
                  setEditTaskForm(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            {isEditingTask && editTaskForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={editTaskForm.title}
                    onChange={(e) => setEditTaskForm({...editTaskForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editTaskForm.description}
                    onChange={(e) => setEditTaskForm({...editTaskForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Assignee</label>
                    <div className="relative" ref={editAssigneeDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setEditAssigneeDropdownOpen(!editAssigneeDropdownOpen)}
                        className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{editTaskForm.assignee}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {editAssigneeDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                          <div className="flex flex-col gap-1">
                            {teamMembers.map((member) => (
                              <button
                                key={member}
                                type="button"
                                onClick={() => {
                                  setEditTaskForm({...editTaskForm, assignee: member});
                                  setEditAssigneeDropdownOpen(false);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                  editTaskForm.assignee === member
                                    ? 'bg-[#3AB7BF] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {member}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Due Date</label>
                    <div className="relative" ref={editDueDateDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setEditDueDateDropdownOpen(!editDueDateDropdownOpen)}
                        className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{editTaskForm.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {editDueDateDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 w-full">
                          <div className="flex gap-2">
                            <div className="flex-1 relative" ref={editMonthDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setEditMonthDropdownOpen(!editMonthDropdownOpen)}
                                className="w-full px-2 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                              >
                                <span>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][editSelectedMonth - 1]}</span>
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </button>
                              {editMonthDropdownOpen && (
                                <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                                    <button
                                      key={month}
                                      type="button"
                                      onClick={() => {
                                        setEditSelectedMonth(idx + 1);
                                        setEditMonthDropdownOpen(false);
                                        const newDate = new Date(editSelectedYear, idx, editSelectedDay);
                                        setEditTaskForm({...editTaskForm, dueDate: newDate});
                                      }}
                                      className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                        editSelectedMonth === idx + 1 ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {month}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 relative" ref={editDayDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setEditDayDropdownOpen(!editDayDropdownOpen)}
                                className="w-full px-2 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                              >
                                <span>{editSelectedDay}</span>
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </button>
                              {editDayDropdownOpen && (
                                <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <button
                                      key={day}
                                      type="button"
                                      onClick={() => {
                                        setEditSelectedDay(day);
                                        setEditDayDropdownOpen(false);
                                        const newDate = new Date(editSelectedYear, editSelectedMonth - 1, day);
                                        setEditTaskForm({...editTaskForm, dueDate: newDate});
                                      }}
                                      className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                        editSelectedDay === day ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {day}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 relative" ref={editYearDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setEditYearDropdownOpen(!editYearDropdownOpen)}
                                className="w-full px-2 py-1.5 bg-white text-gray-700 border border-gray-300 rounded text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                              >
                                <span>{editSelectedYear}</span>
                                <ChevronDown className="w-3 h-3 ml-1" />
                              </button>
                              {editYearDropdownOpen && (
                                <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full max-h-48 overflow-y-auto">
                                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                    <button
                                      key={year}
                                      type="button"
                                      onClick={() => {
                                        setEditSelectedYear(year);
                                        setEditYearDropdownOpen(false);
                                        const newDate = new Date(year, editSelectedMonth - 1, editSelectedDay);
                                        setEditTaskForm({...editTaskForm, dueDate: newDate});
                                      }}
                                      className={`w-full px-2 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                        editSelectedYear === year ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {year}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                    <div className="relative" ref={editPriorityDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setEditPriorityDropdownOpen(!editPriorityDropdownOpen)}
                        className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between capitalize"
                      >
                        <span>{editTaskForm.priority}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {editPriorityDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full">
                          <div className="flex flex-col gap-1">
                            {(['low', 'medium', 'high'] as const).map((priority) => (
                              <button
                                key={priority}
                                type="button"
                                onClick={() => {
                                  setEditTaskForm({...editTaskForm, priority});
                                  setEditPriorityDropdownOpen(false);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left capitalize ${
                                  editTaskForm.priority === priority
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {priority}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                    <div className="relative" ref={editStatusDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setEditStatusDropdownOpen(!editStatusDropdownOpen)}
                        className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{editTaskForm.status === 'todo' ? 'To Do' : editTaskForm.status === 'in_progress' ? 'In Progress' : editTaskForm.status === 'done' ? 'Done' : 'Review'}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {editStatusDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 w-full">
                          <div className="flex flex-col gap-1">
                            {[{value: 'todo', label: 'To Do'}, {value: 'in_progress', label: 'In Progress'}, {value: 'done', label: 'Done'}].map((status) => (
                              <button
                                key={status.value}
                                type="button"
                                onClick={() => {
                                  setEditTaskForm({...editTaskForm, status: status.value as Task['status']});
                                  setEditStatusDropdownOpen(false);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                  editTaskForm.status === status.value
                                    ? 'bg-[#3AB7BF] text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {status.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[#101010] mb-2">Description</h4>
                  <p className="text-gray-700">{selectedTask.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-[#101010] mb-2">Assignee</h4>
                    <p className="text-gray-700">{selectedTask.assignee}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#101010] mb-2">Due Date</h4>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className={`${
                        isOverdue(selectedTask.dueDate) ? 'text-[#F87171] font-medium' : 'text-gray-700'
                      }`}>
                        {formatDate(selectedTask.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-[#101010] mb-2">Priority</h4>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#101010] mb-2">Status</h4>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTask.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>


                <div>
                  <h4 className="font-semibold text-[#101010] mb-2">Comments</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto mb-3">
                    {selectedTask.comments.map(comment => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-[#101010] text-xs">{comment.author}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                    {selectedTask.comments.length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-4">No comments yet</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          const updatedTask = {
                            ...selectedTask,
                            comments: [
                              ...selectedTask.comments,
                              {
                                id: `c${Date.now()}`,
                                author: 'Current User',
                                content: newComment,
                                createdAt: new Date()
                              }
                            ]
                          };
                          setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                          setSelectedTask(updatedTask);
                          setNewComment('');

                          setActivityLog(prev => [{
                            id: `a${Date.now()}`,
                            user: 'Current User',
                            action: 'commented',
                            taskTitle: selectedTask.title,
                            taskId: selectedTask.id,
                            details: `Added comment: "${newComment}"`,
                            timestamp: new Date()
                          }, ...prev]);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newComment.trim()) {
                          const updatedTask = {
                            ...selectedTask,
                            comments: [
                              ...selectedTask.comments,
                              {
                                id: `c${Date.now()}`,
                                author: 'Current User',
                                content: newComment,
                                createdAt: new Date()
                              }
                            ]
                          };
                          setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
                          setSelectedTask(updatedTask);
                          setNewComment('');

                          setActivityLog(prev => [{
                            id: `a${Date.now()}`,
                            user: 'Current User',
                            action: 'commented',
                            taskTitle: selectedTask.title,
                            taskId: selectedTask.id,
                            details: `Added comment: "${newComment}"`,
                            timestamp: new Date()
                          }, ...prev]);
                        }
                      }}
                      disabled={!newComment.trim()}
                      className="px-3 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center gap-3 mt-6">
              <button
                onClick={() => {
                  console.log('Schedule task:', selectedTask.title);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button>

              <div className="flex gap-3">
                {isEditingTask ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingTask(false);
                        setEditTaskForm(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editTaskForm) {
                          setTasks(prev => prev.map(t => t.id === editTaskForm.id ? editTaskForm : t));
                          setSelectedTask(editTaskForm);
                          setIsEditingTask(false);
                        }
                      }}
                      className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditTaskForm(selectedTask);
                        setIsEditingTask(true);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Edit Task
                    </button>
                    <button
                      onClick={() => {
                        setShowTaskDetail(false);
                        setIsEditingTask(false);
                        setEditTaskForm(null);
                      }}
                      className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Board Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Connect Board</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Tab Name</label>
                <input
                  type="text"
                  value={connectForm.tabName}
                  onChange={(e) => setConnectForm({...connectForm, tabName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Marketing Board"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Platform</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConnectForm({...connectForm, platform: 'clickup'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      connectForm.platform === 'clickup'
                        ? 'border-[#7B68EE] bg-[#7B68EE]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#7B68EE] rounded mx-auto mb-2" />
                    <p className="font-medium text-[#101010]">ClickUp</p>
                  </button>
                  <button
                    onClick={() => setConnectForm({...connectForm, platform: 'monday'})}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      connectForm.platform === 'monday'
                        ? 'border-[#FF6B6B] bg-[#FF6B6B]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#FF6B6B] rounded mx-auto mb-2" />
                    <p className="font-medium text-[#101010]">Monday.com</p>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">View Type</label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="viewType"
                      value="embedded"
                      defaultChecked
                      className="w-4 h-4 text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] mr-3"
                    />
                    <div>
                      <p className="font-medium text-[#101010]">Connected as Embedded</p>
                      <p className="text-xs text-gray-600">Display the board directly within FinanceFlow</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="viewType"
                      value="link"
                      className="w-4 h-4 text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] mr-3"
                    />
                    <div>
                      <p className="font-medium text-[#101010]">Connected as Link</p>
                      <p className="text-xs text-gray-600">Open the board in a new tab/window</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Embed Code</label>
                <textarea
                  placeholder="Paste your embed code here (for embedded view type)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-xs"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  For embedded view: Paste the iframe embed code from your platform
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (connectForm.tabName.trim()) {
                    const newBoard = {
                      id: `board_${Date.now()}`,
                      name: connectForm.tabName,
                      platform: connectForm.platform,
                      connected: true
                    };
                    setConnectedBoards(prev => [...prev, newBoard]);
                    setTabs(prev => [...prev, {
                      id: newBoard.id,
                      name: newBoard.name,
                      type: 'board',
                      platform: newBoard.platform
                    }]);
                    setActiveTab(newBoard.id);
                    setConnectForm({ tabName: '', platform: 'clickup' });
                    setShowConnectModal(false);
                  }
                }}
                disabled={!connectForm.tabName.trim()}
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#212B36',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#1a2028';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#212B36';
                  }
                }}
              >
                Connect Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Sidebar */}
      {showActivityLog && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowActivityLog(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[400px] bg-white/95 backdrop-blur-md shadow-2xl z-50 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-[#101010]">
                  Activity Log
                </h3>
                <button
                  onClick={() => setShowActivityLog(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Filter by User</label>
                <select
                  value={activityLogFilter}
                  onChange={(e) => setActivityLogFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent text-xs"
                >
                  <option value="all">All Users</option>
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {activityLog
                  .filter(entry => activityLogFilter === 'all' || entry.user === activityLogFilter)
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((entry) => {
                    return (
                      <div
                        key={entry.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          const task = tasks.find(t => t.id === entry.taskId);
                          if (task) {
                            setSelectedTask(task);
                            setShowTaskDetail(true);
                          }
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#101010] text-xs">{entry.user}</span>
                          <span className="text-xs text-gray-500">
                            {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-medium text-[#101010]">{entry.taskTitle}</span>
                        </p>
                        <p className="text-xs text-gray-700">{entry.details}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {entry.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </DragDropContext>
  );
};

export default TasksProjects;