import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, DollarSign, Users, Search, ChevronDown } from 'lucide-react';
import type { RoadmapProject, RoadmapMilestone, ProjectStatus, ProjectScenario } from '../../types/roadmap';
import { roadmapService } from '../../services/roadmapService';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface ProjectModalProps {
  project: RoadmapProject | null;
  onClose: () => void;
  onSave: () => void;
}

interface GLAccount {
  code: string;
  name: string;
  category: string;
}

interface TeamMember {
  id: string;
  email: string;
  full_name?: string;
}

interface BudgetLine {
  id: string;
  gl_code: string;
  gl_name: string;
  amount: number;
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
    budget_total: 0
  });

  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({
    name: '',
    target_date: '',
    owner: ''
  });
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [availableGLAccounts, setAvailableGLAccounts] = useState<GLAccount[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showGLPicker, setShowGLPicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [glSearchTerm, setGlSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
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
        budget_total: project.budget_total
      });
      loadMilestones(project.id);
    }
    loadGLAccounts();
    loadTeamMembers();
  }, [project]);

  useEffect(() => {
    const total = budgetLines.reduce((sum, line) => sum + line.amount, 0);
    setFormData(prev => ({ ...prev, budget_total: total }));
  }, [budgetLines]);

  const loadGLAccounts = async () => {
    const mockGLAccounts: GLAccount[] = [
      { code: '4000', name: 'Product Revenue', category: 'Revenue' },
      { code: '4100', name: 'Service Revenue', category: 'Revenue' },
      { code: '4200', name: 'Subscription Revenue', category: 'Revenue' },
      { code: '5000', name: 'Cost of Goods Sold', category: 'COGS' },
      { code: '5100', name: 'Direct Labor', category: 'COGS' },
      { code: '6000', name: 'Salaries & Wages', category: 'OPEX' },
      { code: '6100', name: 'Employee Benefits', category: 'OPEX' },
      { code: '6200', name: 'Rent & Facilities', category: 'OPEX' },
      { code: '6300', name: 'Marketing & Advertising', category: 'OPEX' },
      { code: '6400', name: 'Professional Services', category: 'OPEX' },
      { code: '6500', name: 'Software & Technology', category: 'OPEX' },
      { code: '6600', name: 'Travel & Entertainment', category: 'OPEX' },
      { code: '6700', name: 'Office Supplies', category: 'OPEX' },
      { code: '6800', name: 'Insurance', category: 'OPEX' },
      { code: '6900', name: 'Utilities', category: 'OPEX' },
      { code: '7000', name: 'Depreciation', category: 'Other' },
      { code: '7100', name: 'Interest Expense', category: 'Other' }
    ];
    setAvailableGLAccounts(mockGLAccounts);
  };

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email');

      if (error) {
        console.error('Error loading team members:', error);
        setTeamMembers([{ id: user?.id || '', email: user?.email || '', full_name: 'Current User' }]);
      } else {
        setTeamMembers(data || []);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([{ id: user?.id || '', email: user?.email || '', full_name: 'Current User' }]);
    }
  };

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
      const gl_accounts = budgetLines.map(line => line.gl_code);

      if (project) {
        await roadmapService.updateProject(project.id, {
          ...formData,
          gl_accounts
        });
      } else {
        await roadmapService.createProject({
          ...formData,
          gl_accounts,
          user_id: user.id,
          actual_total: 0,
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

  const handleAddGLAccount = (glAccount: GLAccount) => {
    if (budgetLines.some(line => line.gl_code === glAccount.code)) {
      return;
    }

    const newLine: BudgetLine = {
      id: Math.random().toString(36).substr(2, 9),
      gl_code: glAccount.code,
      gl_name: glAccount.name,
      amount: 0
    };

    setBudgetLines([...budgetLines, newLine]);
    setShowGLPicker(false);
    setGlSearchTerm('');
  };

  const handleRemoveBudgetLine = (id: string) => {
    setBudgetLines(budgetLines.filter(line => line.id !== id));
  };

  const handleUpdateBudgetAmount = (id: string, amount: number) => {
    setBudgetLines(budgetLines.map(line =>
      line.id === id ? { ...line, amount } : line
    ));
  };

  const handleAddUser = (member: TeamMember) => {
    if (formData.assigned_users.includes(member.id)) {
      return;
    }

    setFormData({
      ...formData,
      assigned_users: [...formData.assigned_users, member.id]
    });
    setShowUserPicker(false);
    setUserSearchTerm('');
  };

  const handleRemoveUser = (userId: string) => {
    setFormData({
      ...formData,
      assigned_users: formData.assigned_users.filter(u => u !== userId)
    });
  };

  const filteredGLAccounts = availableGLAccounts.filter(gl =>
    gl.code.toLowerCase().includes(glSearchTerm.toLowerCase()) ||
    gl.name.toLowerCase().includes(glSearchTerm.toLowerCase()) ||
    gl.category.toLowerCase().includes(glSearchTerm.toLowerCase())
  );

  const filteredTeamMembers = teamMembers.filter(member =>
    member.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (member.full_name?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const getTeamMemberDisplay = (userId: string) => {
    const member = teamMembers.find(m => m.id === userId);
    return member?.full_name || member?.email || userId.slice(0, 8);
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget by GL Account
            </label>

            {budgetLines.length > 0 && (
              <div className="mb-3 space-y-2">
                {budgetLines.map((line) => (
                  <div key={line.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[#101010]">
                        {line.gl_code} - {line.gl_name}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">$</span>
                      <input
                        type="number"
                        value={line.amount}
                        onChange={(e) => handleUpdateBudgetAmount(line.id, parseFloat(e.target.value) || 0)}
                        className="w-32 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                        placeholder="0.00"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBudgetLine(line.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gray-300">
                  <span className="font-semibold text-[#101010]">Total Budget</span>
                  <span className="font-bold text-lg text-[#101010]">
                    ${formData.budget_total.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowGLPicker(!showGLPicker)}
                className="w-full px-4 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6B58DE] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add GL Account
              </button>

              {showGLPicker && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={glSearchTerm}
                        onChange={(e) => setGlSearchTerm(e.target.value)}
                        placeholder="Search GL accounts..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredGLAccounts.map((gl) => (
                      <button
                        key={gl.code}
                        type="button"
                        onClick={() => handleAddGLAccount(gl)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-sm text-[#101010]">
                            {gl.code} - {gl.name}
                          </div>
                          <div className="text-xs text-gray-600">{gl.category}</div>
                        </div>
                        <Plus className="w-4 h-4 text-[#7B68EE]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Users
            </label>

            {formData.assigned_users.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {formData.assigned_users.map((userId) => (
                  <span
                    key={userId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {getTeamMemberDisplay(userId)}
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
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserPicker(!showUserPicker)}
                className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Add Team Member
              </button>

              {showUserPicker && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-80 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        placeholder="Search team members..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredTeamMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleAddUser(member)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium text-sm text-[#101010]">
                            {member.full_name || member.email}
                          </div>
                          {member.full_name && (
                            <div className="text-xs text-gray-600">{member.email}</div>
                          )}
                        </div>
                        <Plus className="w-4 h-4 text-[#7B68EE]" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
