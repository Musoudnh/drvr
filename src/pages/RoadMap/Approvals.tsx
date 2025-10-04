import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Card from '../../components/UI/Card';
import { roadmapService } from '../../services/roadmapService';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../context/AuthContext';
import type { RoadmapProject } from '../../types/roadmap';
import type { ProjectApprovalWorkflow } from '../../types/department';

interface ProjectWithWorkflow {
  project: RoadmapProject;
  workflow: ProjectApprovalWorkflow;
}

const Approvals: React.FC = () => {
  const { user, primaryRole } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<ProjectWithWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithWorkflow | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'revise'>('approve');
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    loadPendingApprovals();
  }, []);

  const loadPendingApprovals = async () => {
    if (!user || !primaryRole) return;

    try {
      setLoading(true);
      const workflows = await departmentService.getUserPendingApprovals(user.id, primaryRole);

      const projectsWithWorkflows = await Promise.all(
        workflows.map(async (workflow) => {
          const project = await roadmapService.getProjectById(workflow.project_id);
          return project ? { project, workflow } : null;
        })
      );

      setPendingApprovals(projectsWithWorkflows.filter(Boolean) as ProjectWithWorkflow[]);
    } catch (error) {
      console.error('Error loading pending approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedProject || !user || !primaryRole) return;

    try {
      setLoading(true);

      if (actionType === 'approve') {
        await roadmapService.approveProject(
          selectedProject.project.id,
          user.id,
          primaryRole,
          actionNotes
        );
      } else if (actionType === 'reject') {
        await roadmapService.rejectProject(
          selectedProject.project.id,
          user.id,
          actionNotes
        );
      } else if (actionType === 'revise') {
        await roadmapService.requestRevision(
          selectedProject.project.id,
          user.id,
          actionNotes
        );
      }

      setShowActionModal(false);
      setSelectedProject(null);
      setActionNotes('');
      await loadPendingApprovals();
    } catch (error: any) {
      console.error('Error performing action:', error);
      alert(`Action failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (project: ProjectWithWorkflow, type: 'approve' | 'reject' | 'revise') => {
    setSelectedProject(project);
    setActionType(type);
    setShowActionModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#101010]">Project Approvals</h1>
        <p className="text-gray-600 mt-1">Review and approve project budget requests</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#212B36] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">Loading approvals...</p>
        </div>
      ) : pendingApprovals.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">No pending approvals</p>
            <p className="text-sm text-gray-500 mt-1">All projects have been reviewed</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApprovals.map(({ project, workflow }) => (
            <Card key={project.id}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-[#101010]">{project.header}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(workflow.workflow_status)}`}>
                        {workflow.workflow_status.replace('_', ' ')}
                      </span>
                      {isOverdue(workflow.sla_deadline) && (
                        <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Overdue
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="text-sm font-medium text-[#101010]">{project.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Budget (Base Case)</p>
                    <p className="text-sm font-medium text-[#101010]">
                      ${project.budget_base_case?.toLocaleString() || project.budget_total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fiscal Year</p>
                    <p className="text-sm font-medium text-[#101010]">{project.fiscal_year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="text-sm font-medium text-[#101010]">
                      {project.submitted_at ? formatDate(project.submitted_at) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-gray-500">Approval Progress</p>
                    <p className="text-xs text-gray-600">
                      Step {workflow.current_step} of {workflow.total_steps}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(workflow.current_step / workflow.total_steps) * 100}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {workflow.completed_approvers.map((role, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {role}
                      </span>
                    ))}
                    {workflow.pending_approvers.map((role, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openActionModal({ project, workflow }, 'approve')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => openActionModal({ project, workflow }, 'revise')}
                    className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Request Revision
                  </button>
                  <button
                    onClick={() => openActionModal({ project, workflow }, 'reject')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showActionModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#101010]">
                {actionType === 'approve' ? 'Approve Project' : actionType === 'reject' ? 'Reject Project' : 'Request Revision'}
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Project: <span className="font-medium text-[#101010]">{selectedProject.project.header}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {actionType === 'approve' ? 'Notes (Optional)' : 'Notes (Required)'}
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#212B36] focus:border-transparent"
                placeholder={actionType === 'approve' ? 'Add any notes...' : 'Explain why...'}
                required={actionType !== 'approve'}
              />
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setActionNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                disabled={actionType !== 'approve' && !actionNotes.trim()}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : actionType === 'reject'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
