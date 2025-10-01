import React, { useState } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle, MessageSquare, FileText, Eye, Edit3, X, Send, Plus, ArrowRight } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface WorkflowStep {
  id: string;
  name: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  dueDate: Date;
  comments: Comment[];
  approvalRequired: boolean;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  type: 'budget_approval' | 'forecast_review' | 'expense_approval' | 'custom';
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  version: number;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  type: 'comment' | 'approval' | 'rejection';
}

const WorkflowManagement: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Q1 Budget Approval',
      description: 'Review and approve Q1 2025 budget allocations',
      type: 'budget_approval',
      steps: [
        {
          id: 's1',
          name: 'Department Review',
          assignee: 'Michael Chen',
          status: 'completed',
          dueDate: new Date('2025-01-20'),
          comments: [
            {
              id: 'c1',
              author: 'Michael Chen',
              content: 'Budget looks good, minor adjustments to marketing allocation',
              createdAt: new Date('2025-01-18'),
              type: 'approval'
            }
          ],
          approvalRequired: true
        },
        {
          id: 's2',
          name: 'Finance Review',
          assignee: 'Sarah Johnson',
          status: 'in_progress',
          dueDate: new Date('2025-01-25'),
          comments: [],
          approvalRequired: true
        },
        {
          id: 's3',
          name: 'Executive Approval',
          assignee: 'John Doe',
          status: 'pending',
          dueDate: new Date('2025-01-30'),
          comments: [],
          approvalRequired: true
        }
      ],
      createdBy: 'Sarah Johnson',
      createdAt: new Date('2025-01-15'),
      status: 'active',
      version: 1
    },
    {
      id: '2',
      name: 'Monthly Forecast Review',
      description: 'Review and validate monthly revenue forecasts',
      type: 'forecast_review',
      steps: [
        {
          id: 's4',
          name: 'Data Validation',
          assignee: 'Emily Rodriguez',
          status: 'completed',
          dueDate: new Date('2025-01-22'),
          comments: [],
          approvalRequired: false
        },
        {
          id: 's5',
          name: 'Analyst Review',
          assignee: 'David Kim',
          status: 'pending',
          dueDate: new Date('2025-01-24'),
          comments: [],
          approvalRequired: true
        }
      ],
      createdBy: 'Emily Rodriguez',
      createdAt: new Date('2025-01-20'),
      status: 'active',
      version: 2
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowDetail, setShowWorkflowDetail] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-[#4ADE80]/20 text-[#4ADE80]';
      case 'in_progress': return 'bg-[#3AB7BF]/20 text-[#3AB7BF]';
      case 'pending': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      case 'rejected': return 'bg-[#F87171]/20 text-[#F87171]';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'pending': return AlertTriangle;
      case 'rejected': return X;
      default: return Clock;
    }
  };

  const handleApproveStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === workflowId
        ? {
            ...workflow,
            steps: workflow.steps.map(step =>
              step.id === stepId
                ? { ...step, status: 'completed' as const }
                : step
            )
          }
        : workflow
    ));
  };

  const handleRejectStep = (workflowId: string, stepId: string) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === workflowId
        ? {
            ...workflow,
            steps: workflow.steps.map(step =>
              step.id === stepId
                ? { ...step, status: 'rejected' as const }
                : step
            )
          }
        : workflow
    ));
  };

  const addComment = (workflowId: string, stepId: string, content: string, type: 'comment' | 'approval' | 'rejection') => {
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content,
      createdAt: new Date(),
      type
    };

    setWorkflows(prev => prev.map(workflow =>
      workflow.id === workflowId
        ? {
            ...workflow,
            steps: workflow.steps.map(step =>
              step.id === stepId
                ? { ...step, comments: [...step.comments, comment] }
                : step
            )
          }
        : workflow
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#101010]">Workflow Management</h2>
          <p className="text-gray-600 mt-1">Manage approval workflows and collaboration</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Workflow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{workflows.filter(w => w.status === 'active').length}</p>
              <p className="text-sm text-gray-600 mt-1">In progress</p>
            </div>
            <Clock className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">
                {workflows.reduce((count, w) => count + w.steps.filter(s => s.status === 'pending' && s.approvalRequired).length, 0)}
              </p>
              <p className="text-sm text-gray-600 mt-1">Need attention</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">{workflows.filter(w => w.status === 'completed').length}</p>
              <p className="text-sm text-gray-600 mt-1">This month</p>
            </div>
            <CheckCircle className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">12</p>
              <p className="text-sm text-gray-600 mt-1">Participating</p>
            </div>
            <Users className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Active Workflows */}
      <Card title="Active Workflows">
        <div className="space-y-4">
          {workflows.filter(w => w.status === 'active').map(workflow => (
            <div key={workflow.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#8B5CF6] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#101010]">{workflow.name}</h3>
                  <p className="text-sm text-gray-600">{workflow.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">v{workflow.version}</span>
                  <button
                    onClick={() => {
                      setSelectedWorkflow(workflow);
                      setShowWorkflowDetail(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              {/* Workflow Progress */}
              <div className="flex items-center space-x-2 mb-4">
                {workflow.steps.map((step, index) => {
                  const StatusIcon = getStatusIcon(step.status);
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.status === 'completed' ? 'bg-[#4ADE80]' :
                            step.status === 'in_progress' ? 'bg-[#3AB7BF]' :
                            step.status === 'rejected' ? 'bg-[#F87171]' : 'bg-gray-300'
                          }`}
                        >
                          <StatusIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-600 mt-1 text-center max-w-[80px] truncate">
                          {step.name}
                        </span>
                      </div>
                      {index < workflow.steps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Created by {workflow.createdBy}</span>
                <span>{workflow.steps.filter(s => s.status === 'completed').length} of {workflow.steps.length} steps completed</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Workflow Detail Modal */}
      {showWorkflowDetail && selectedWorkflow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[800px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">{selectedWorkflow.name}</h3>
              <button
                onClick={() => setShowWorkflowDetail(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {selectedWorkflow.steps.map((step, index) => {
                const StatusIcon = getStatusIcon(step.status);
                return (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <StatusIcon 
                          className={`w-5 h-5 mr-3 ${
                            step.status === 'completed' ? 'text-[#4ADE80]' :
                            step.status === 'in_progress' ? 'text-[#3AB7BF]' :
                            step.status === 'rejected' ? 'text-[#F87171]' : 'text-gray-400'
                          }`}
                        />
                        <div>
                          <h4 className="font-semibold text-[#101010]">{step.name}</h4>
                          <p className="text-sm text-gray-600">Assigned to: {step.assignee}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                          {step.status.replace('_', ' ')}
                        </span>
                        {step.status === 'pending' && step.approvalRequired && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleApproveStep(selectedWorkflow.id, step.id)}
                              className="px-3 py-1 bg-[#4ADE80] text-white rounded text-xs hover:bg-[#3BC66F] transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectStep(selectedWorkflow.id, step.id)}
                              className="px-3 py-1 bg-[#F87171] text-white rounded text-xs hover:bg-[#F56565] transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Comments */}
                    {step.comments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {step.comments.map(comment => (
                          <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-[#101010] text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.createdAt.toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Comment */}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent text-sm"
                      />
                      <button
                        onClick={() => {
                          if (newComment.trim()) {
                            addComment(selectedWorkflow.id, step.id, newComment, 'comment');
                            setNewComment('');
                          }
                        }}
                        className="px-3 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Workflow Templates */}
      <Card title="Workflow Templates">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Budget Approval',
              description: 'Standard budget review and approval process',
              steps: ['Department Review', 'Finance Review', 'Executive Approval'],
              icon: FileText
            },
            {
              name: 'Expense Approval',
              description: 'Multi-level expense approval workflow',
              steps: ['Manager Review', 'Finance Approval', 'Final Sign-off'],
              icon: DollarSign
            },
            {
              name: 'Forecast Review',
              description: 'Monthly forecast validation process',
              steps: ['Data Validation', 'Analyst Review', 'Management Approval'],
              icon: BarChart3
            }
          ].map((template, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/5 transition-all cursor-pointer">
              <div className="flex items-center mb-3">
                <template.icon className="w-5 h-5 text-[#8B5CF6] mr-3" />
                <h3 className="font-semibold text-[#101010]">{template.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="space-y-1">
                {template.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="text-xs text-gray-500 flex items-center">
                    <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                    {step}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Use Template
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WorkflowManagement;