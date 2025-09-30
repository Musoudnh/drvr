import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Search, Filter, Grid3x3 as Grid3X3, List, Maximize2, Calendar, User, MessageSquare, X, ChevronRight, Clock, AlertTriangle, CheckCircle, MoreHorizontal, CreditCard as Edit3, Trash2, Eye, Link as LinkIcon, Settings, Zap } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import GanttView from '../../components/Tasks/GanttView';

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
    
    const { source, destination, draggableId } = result;

    if (!destination) return;
    
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
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

  const handleTaskUpdate = (taskId: string, updates: { dueDate?: Date; createdAt?: Date }) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            ...(updates.dueDate && { dueDate: updates.dueDate }),
            ...(updates.createdAt && { createdAt: updates.createdAt }),
            updatedAt: new Date()
          }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#F87171]/20 text-[#F87171]';
      case 'medium': return 'bg-[#FBBF24]/20 text-[#FBBF24]';
      case 'low': return 'bg-[#34D399]/20 text-[#34D399]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-[#94A3B8]/20 text-[#94A3B8]';
      case 'in_progress': return 'bg-[#3AB7BF]/20 text-[#3AB7BF]';
      case 'done': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      default: return 'bg-gray-200 text-gray-700';
    }
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

  const renderTaskCard = (task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-4 mb-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab group relative ${
            snapshot.isDragging ? 'rotate-2 shadow-lg cursor-grabbing' : ''
          }`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-[#1E2A38] text-sm leading-tight">{task.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs font-medium">
                  {task.assignee.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
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
          
          
          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTask(task);
              setShowTaskDetail(true);
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            title="View details"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}
    </Draggable>
  );

  const renderKanbanBoard = () => (
    <DragDropContext onDragStart={() => setIsDraggingTask(true)} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
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
                <h3 className="font-semibold text-[#1E2A38] flex items-center">
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
                        <p className="text-sm font-medium text-[#3AB7BF]">Drop here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );

  const renderListView = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Task</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Assignee</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Due Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-[#1E2A38]">{task.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-medium">
                        {task.assignee.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{task.assignee}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-sm ${
                    isOverdue(task.dueDate) ? 'text-[#F87171] font-medium' : 'text-gray-700'
                  }`}>
                    {formatDate(task.dueDate)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowTaskDetail(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
            <h3 className="text-xl font-semibold text-[#1E2A38] mb-2">Connect to {serviceName}</h3>
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
            <span className="text-sm font-medium text-[#1E2A38]">Connected to {serviceName}</span>
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
    <div className="p-4 space-y-4">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-4" aria-label="Task Navigation">
            <button
              onClick={() => setActiveTab('native')}
              disabled={isDraggingTask}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'native'
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } ${isDraggingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Native Task Board
            </button>
            {connectedBoards.map(board => (
              <button
                key={board.id}
                onClick={() => setActiveTab(board.id)}
                disabled={isDraggingTask}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === board.id
                    ? `border-[${board.platform === 'clickup' ? '#7B68EE' : '#FF6B6B'}] text-[${board.platform === 'clickup' ? '#7B68EE' : '#FF6B6B'}]`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } ${isDraggingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-4 h-4 rounded mr-2`} style={{ backgroundColor: board.platform === 'clickup' ? '#7B68EE' : '#FF6B6B' }} />
                {board.name}
              </button>
            ))}
            <button
              onClick={() => setShowConnectModal(true)}
              disabled={isDraggingTask}
              className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 ${isDraggingTask ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Board
            </button>
          </nav>
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
                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors bg-[#8B5CF6] text-white hover:bg-white hover:text-[#8B5CF6] shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode('board')}
                      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                        viewMode === 'board'
                          ? 'bg-white text-[#3AB7BF] shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 mr-1 inline" />
                      Board
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-[#3AB7BF] shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <List className="w-4 h-4 mr-1 inline" />
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('gantt')}
                      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                        viewMode === 'gantt'
                          ? 'bg-white text-[#3AB7BF] shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Calendar className="w-4 h-4 mr-1 inline" />
                      Gantt
                    </button>
                  </div>
                </div>
              </div>

              {/* Task View */}
              {viewMode === 'board' && renderKanbanBoard()}
              {viewMode === 'list' && renderListView()}
              {viewMode === 'gantt' && (
                <GanttView
                  tasks={filteredTasks}
                  onTaskClick={(task) => {
                    setSelectedTask(task);
                    setShowTaskDetail(true);
                  }}
                  onTaskUpdate={handleTaskUpdate}
                />
              )}
            </div>
          )}

          {connectedBoards.map(board => (
            activeTab === board.id && (
              <div key={board.id}>
                {renderIntegrationTab(board.platform)}
              </div>
            )
          ))}
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
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add New Task</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="Enter task title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee *</label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="">Select assignee</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">{selectedTask.title}</h3>
              <button
                onClick={() => setShowTaskDetail(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-2">Description</h4>
                <p className="text-gray-700">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Assignee</h4>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-medium">
                        {selectedTask.assignee.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-gray-700">{selectedTask.assignee}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Due Date</h4>
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
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Priority</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                    {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                  </span>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Status</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ').charAt(0).toUpperCase() + selectedTask.status.replace('_', ' ').slice(1)}
                  </span>
                </div>
              </div>
              
              {selectedTask.tags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-[#3AB7BF]/10 text-[#3AB7BF] rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-[#1E2A38] mb-2">Comments</h4>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {selectedTask.comments.map(comment => (
                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#1E2A38] text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                  {selectedTask.comments.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Task
              </Button>
              <button
                onClick={() => setShowTaskDetail(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Board Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Connect Board</h3>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tab Name</label>
                <input
                  type="text"
                  value={connectForm.tabName}
                  onChange={(e) => setConnectForm({...connectForm, tabName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Marketing Board"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
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
                    <p className="font-medium text-[#1E2A38]">ClickUp</p>
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
                    <p className="font-medium text-[#1E2A38]">Monday.com</p>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">View Type</label>
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
                      <p className="font-medium text-[#1E2A38]">Connected as Embedded</p>
                      <p className="text-sm text-gray-600">Display the board directly within FinanceFlow</p>
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
                      <p className="font-medium text-[#1E2A38]">Connected as Link</p>
                      <p className="text-sm text-gray-600">Open the board in a new tab/window</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
                <textarea
                  placeholder="Paste your embed code here (for embedded view type)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-sm"
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
    </div>
  );
};

export default TasksProjects;