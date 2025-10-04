import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, DollarSign, Users, Paperclip } from 'lucide-react';
import type { RoadmapProject, RoadmapMilestone, ProjectStatus, ProjectScenario } from '../../types/roadmap';
import { roadmapService } from '../../services/roadmapService';
import { useAuth } from '../../context/AuthContext';

interface ProjectModalProps {
  project: RoadmapProject | null;
  onClose: () => void;
  onSave: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    header: '',
    description: '',
    completion_date: '',
    department: '',
    status: 'Draft' as ProjectStatus,
    scenario: 'Base Case' as ProjectScenario,
    gl_accounts: [] as string[],
    assigned_users: [] as string[],
    budget_total: 0,
    actual_total: 0
  });

  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    target_date: '',
    owner: ''
  });
  const [glAccountInput, setGlAccountInput] = useState('');
  const [assignedUserInput, setAssignedUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        header: project.header,
        description: project.description,
        completion_date: project.completion_date || '',
        department: project.department,
        status: project.status,
        scenario: project.scenario,
        gl_accounts: project.gl_accounts,
        assigned_users: project.assigned_users,
        budget_total: project.budget_total,
        actual_total: project.actual_total
      });
      loadMilestones(project.id);
    }
  }, [project]);

  const loadMilestones = async (projectId: string) => {
    try {
      const data = await roadmapService.getMilestones(projectId);
      setMilestones(data);
    } catch (error) {
      console.error('Error loading milestones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (project) {
        await roadmapService.updateProject(project.id, formData);
      } else {
        await roadmapService.createProject({
          ...formData,
          user_id: user.id,
          attachments: [],
          version: 1
        });
      }
      onSave();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newMilestone.name || !project) return;

    try {
      await roadmapService.createMilestone({
        project_id: project.id,
        name: newMilestone.name,
        target_date: newMilestone.target_date || null,
        owner: newMilestone.owner,
        completion_percentage: 0,
        status: 'Not Started'
      });
      setNewMilestone({ name: '', target_date: '', owner: '' });
      loadMilestones(project.id);
    } catch (error) {
      console.error('Error adding milestone:', error);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      await roadmapService.deleteMilestone(id);
      if (project) loadMilestones(project.id);
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const handleAddGlAccount = () => {
    if (glAccountInput && !formData.gl_accounts.includes(glAccountInput)) {
      setFormData({
        ...formData,
        gl_accounts: [...formData.gl_accounts, glAccountInput]
      });
      setGlAccountInput('');
    }
  };

  const handleRemoveGlAccount = (account: string) => {
    setFormData({
      ...formData,
      gl_accounts: formData.gl_accounts.filter(a => a !== account)
    });
  };

  const handleAddUser = () => {
    if (assignedUserInput && !formData.assigned_users.includes(assignedUserInput)) {
      setFormData({
        ...formData,
        assigned_users: [...formData.assigned_users, assignedUserInput]
      });
      setAssignedUserInput('');
    }
  };

  const handleRemoveUser = (userId: string) => {
    setFormData({
      ...formData,
      assigned_users: formData.assigned_users.filter(u => u !== userId)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#101010]">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.header}
              onChange={(e) => setFormData({ ...formData, header: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completion Date
              </label>
              <input
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              >
                <option value="">Select Department</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="R&D">R&D</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              >
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scenario
              </label>
              <select
                value={formData.scenario}
                onChange={(e) => setFormData({ ...formData, scenario: e.target.value as ProjectScenario })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              >
                <option value="Base Case">Base Case</option>
                <option value="Best Case">Best Case</option>
                <option value="Downside Case">Downside Case</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Total
              </label>
              <input
                type="number"
                value={formData.budget_total}
                onChange={(e) => setFormData({ ...formData, budget_total: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Total
              </label>
              <input
                type="number"
                value={formData.actual_total}
                onChange={(e) => setFormData({ ...formData, actual_total: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GL Accounts
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={glAccountInput}
                onChange={(e) => setGlAccountInput(e.target.value)}
                placeholder="Enter GL account code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGlAccount())}
              />
              <button
                type="button"
                onClick={handleAddGlAccount}
                className="px-4 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6B58DE] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.gl_accounts.map((account) => (
                <span
                  key={account}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {account}
                  <button
                    type="button"
                    onClick={() => handleRemoveGlAccount(account)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Users
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={assignedUserInput}
                onChange={(e) => setAssignedUserInput(e.target.value)}
                placeholder="Enter user email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddUser())}
              />
              <button
                type="button"
                onClick={handleAddUser}
                className="px-4 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6B58DE] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.assigned_users.map((userId) => (
                <span
                  key={userId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {userId}
                  <button
                    type="button"
                    onClick={() => handleRemoveUser(userId)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {project && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestones
              </label>
              <div className="space-y-2 mb-3">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">{milestone.name}</div>
                      <div className="text-xs text-gray-600">
                        {milestone.target_date && `Due: ${new Date(milestone.target_date).toLocaleDateString()}`}
                        {milestone.owner && ` • Owner: ${milestone.owner}`}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newMilestone.name}
                  onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                  placeholder="Milestone name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-sm"
                />
                <input
                  type="date"
                  value={newMilestone.target_date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, target_date: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMilestone.owner}
                    onChange={(e) => setNewMilestone({ ...newMilestone, owner: e.target.value })}
                    placeholder="Owner"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddMilestone}
                    className="px-3 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6B58DE] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#212B36] text-white rounded-lg hover:bg-[#101010] transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
