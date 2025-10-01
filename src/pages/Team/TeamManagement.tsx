import React, { useState } from 'react';
import { UserPlus, Search, Filter, MoreVertical, Mail, Phone, Users, Building2, CreditCard as Edit, X, Save, Trash2 } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const TeamManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [editingFirm, setEditingFirm] = useState<any | null>(null);
  const [showEditFirmModal, setShowEditFirmModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddFirmModal, setShowAddFirmModal] = useState(false);
  const [addMemberForm, setAddMemberForm] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Finance',
    level: 'user'
  });
  const [addFirmForm, setAddFirmForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    level: 'user'
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    level: ''
  });
  const [firmEditForm, setFirmEditForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    level: ''
  });
  
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Finance Manager', department: 'Finance', status: 'active', level: 'admin', avatar: null },
    { id: 2, name: 'Michael Chen', email: 'michael.c@company.com', role: 'Senior Accountant', department: 'Finance', status: 'active', level: 'super_user', avatar: null },
    { id: 3, name: 'Emily Rodriguez', email: 'emily.r@company.com', role: 'Financial Analyst', department: 'Finance', status: 'pending', level: 'user', avatar: null },
    { id: 4, name: 'David Kim', email: 'david.k@company.com', role: 'Controller', department: 'Finance', status: 'active', level: 'admin', avatar: null },
    { id: 5, name: 'Lisa Thompson', email: 'lisa.t@company.com', role: 'Bookkeeper', department: 'Finance', status: 'inactive', level: 'viewer', avatar: null }
  ]);

  const [accountingFirms, setAccountingFirms] = useState([
    { id: 1, name: 'Smith & Associates CPA', contact: 'Jennifer Smith', email: 'jennifer@smithcpa.com', phone: '+1 (555) 234-5678', status: 'active', level: 'admin' },
    { id: 2, name: 'Global Tax Solutions', contact: 'Michael Johnson', email: 'mjohnson@globaltax.com', phone: '+1 (555) 345-6789', status: 'active', level: 'super_user' },
    { id: 3, name: 'Premier Accounting Group', contact: 'Sarah Davis', email: 'sarah@premieraccounting.com', phone: '+1 (555) 456-7890', status: 'pending', level: 'user' }
  ]);

  const userLevels = [
    { value: 'admin', label: 'Admin', description: 'Full system access' },
    { value: 'super_user', label: 'Super User', description: 'Advanced features access' },
    { value: 'user', label: 'User', description: 'Standard user access' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'admin': return 'bg-[#F87171]/20 text-[#F87171]';
      case 'super_user': return 'bg-[#F59E0B]/20 text-[#F59E0B]';
      case 'user': return 'bg-[#3AB7BF]/20 text-[#3AB7BF]';
      case 'viewer': return 'bg-gray-200 text-gray-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getLevelLabel = (level: string) => {
    const levelObj = userLevels.find(l => l.value === level);
    return levelObj ? levelObj.label : level;
  };

  const handleEditMember = (member: any) => {
    setEditingMember(member);
    setShowEditModal(true);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      level: member.level
    });
  };

  const handleSaveMember = () => {
    setTeamMembers(prev => prev.map(member => 
      member.id === editingMember?.id 
        ? { ...member, ...editForm }
        : member
    ));
    setEditingMember(null);
    setShowEditModal(false);
    setEditForm({ name: '', email: '', role: '', department: '', level: '' });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setShowEditModal(false);
    setEditForm({ name: '', email: '', role: '', department: '', level: '' });
  };

  const handleEditFirm = (firm: any) => {
    setEditingFirm(firm);
    setShowEditFirmModal(true);
    setFirmEditForm({
      name: firm.name,
      contact: firm.contact,
      email: firm.email,
      phone: firm.phone,
      level: firm.level
    });
  };

  const handleSaveFirm = () => {
    setAccountingFirms(prev => prev.map(firm => 
      firm.id === editingFirm?.id 
        ? { ...firm, ...firmEditForm }
        : firm
    ));
    setEditingFirm(null);
    setShowEditFirmModal(false);
    setFirmEditForm({ name: '', contact: '', email: '', phone: '', level: '' });
  };

  const handleCancelFirmEdit = () => {
    setEditingFirm(null);
    setShowEditFirmModal(false);
    setFirmEditForm({ name: '', contact: '', email: '', phone: '', level: '' });
  };

  const handleAddMember = () => {
    if (addMemberForm.name.trim() && addMemberForm.email.trim()) {
      const newMember = {
        id: Math.max(...teamMembers.map(m => m.id)) + 1,
        name: addMemberForm.name,
        email: addMemberForm.email,
        role: addMemberForm.role,
        department: addMemberForm.department,
        status: 'pending',
        level: addMemberForm.level,
        avatar: null
      };
      setTeamMembers(prev => [...prev, newMember]);
      setAddMemberForm({ name: '', email: '', role: '', department: 'Finance', level: 'user' });
      setShowAddMemberModal(false);
    }
  };

  const handleCancelAddMember = () => {
    setAddMemberForm({ name: '', email: '', role: '', department: 'Finance', level: 'user' });
    setShowAddMemberModal(false);
  };

  const handleAddFirm = () => {
    if (addFirmForm.name.trim() && addFirmForm.contact.trim() && addFirmForm.email.trim()) {
      const newFirm = {
        id: Math.max(...accountingFirms.map(f => f.id)) + 1,
        name: addFirmForm.name,
        contact: addFirmForm.contact,
        email: addFirmForm.email,
        phone: addFirmForm.phone,
        status: 'pending',
        level: addFirmForm.level
      };
      setAccountingFirms(prev => [...prev, newFirm]);
      setAddFirmForm({ name: '', contact: '', email: '', phone: '', level: 'user' });
      setShowAddFirmModal(false);
    }
  };

  const handleCancelAddFirm = () => {
    setAddFirmForm({ name: '', contact: '', email: '', phone: '', level: 'user' });
    setShowAddFirmModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#101010]">Team Management</h2>
          <p className="text-gray-600 mt-1">Manage your team members and accounting firm partnerships</p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'team' ? (
            <button 
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:text-[#4F46E5] hover:bg-[#F7F8FD]" 
              style={{ backgroundColor: '#4F46E5' }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Team Member
            </button>
          ) : (
            <button 
              onClick={() => setShowAddFirmModal(true)}
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:text-[#4F46E5] hover:bg-[#F7F8FD]" 
              style={{ backgroundColor: '#4F46E5' }}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Add Accounting Firm
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('team')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'team'
              ? 'bg-white text-[#4F46E5] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 mr-2 inline" />
          Team Members
        </button>
        <button
          onClick={() => setActiveTab('firms')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'firms'
              ? 'bg-white text-[#4F46E5] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4 mr-2 inline" />
          Accounting Firms
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'team' ? (
        <>
          {/* Team Members Header */}
          <Card>
            <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg font-semibold text-gray-700 text-sm mb-4">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Client Access</div>
              <div className="col-span-2">Creation Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
            <div className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-4 px-4 hover:bg-gray-50 transition-colors relative">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center">
                    <div className="w-10 h-10 bg-[#4F46E5] rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#101010]">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-gray-900">{member.role}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-gray-900">{getLevelLabel(member.level)}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Jan 15, 2025</p>
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === 'active' 
                        ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                        : member.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-[#F87171]/20 text-[#F87171]'
                    }`}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="col-span-1 text-center">
                    <button 
                      onClick={() => handleEditMember(member)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Accounting Firms Grid */}
          <Card>
            <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 rounded-lg font-semibold text-gray-700 text-sm mb-4">
              <div className="col-span-3">Name</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Client Access</div>
              <div className="col-span-2">Creation Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>
            <div className="divide-y divide-gray-200">
              {accountingFirms.map((firm) => (
                <div key={firm.id} className="py-4 px-4 hover:bg-gray-50 transition-colors relative">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 flex items-center">
                      <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center mr-4">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#101010]">{firm.name}</h3>
                        <p className="text-sm text-gray-600">{firm.email}</p>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-sm text-gray-900">{firm.contact}</p>
                      <p className="text-sm text-gray-600">{firm.phone}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-sm text-gray-900">{getLevelLabel(firm.level)}</p>
                    </div>
                    
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Jan 15, 2025</p>
                    </div>
                    
                    <div className="col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        firm.status === 'active' 
                          ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {firm.status.charAt(0).toUpperCase() + firm.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <button 
                        onClick={() => handleEditFirm(firm)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Add Team Member</h3>
              <button
                onClick={handleCancelAddMember}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={addMemberForm.name}
                    onChange={(e) => setAddMemberForm({...addMemberForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={addMemberForm.email}
                    onChange={(e) => setAddMemberForm({...addMemberForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={addMemberForm.role}
                  onChange={(e) => setAddMemberForm({...addMemberForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  placeholder="Enter job title/role"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={addMemberForm.department}
                    onChange={(e) => setAddMemberForm({...addMemberForm, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="IT">Information Technology</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    value={addMemberForm.level}
                    onChange={(e) => setAddMemberForm({...addMemberForm, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  >
                    {userLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={handleCancelAddMember}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!addMemberForm.name.trim() || !addMemberForm.email.trim()}
                className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4F46E5' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                  }
                }}
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Accounting Firm Modal */}
      {showAddFirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Add Accounting Firm</h3>
              <button
                onClick={handleCancelAddFirm}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                  <input
                    type="text"
                    value={addFirmForm.name}
                    onChange={(e) => setAddFirmForm({...addFirmForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Enter firm name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={addFirmForm.contact}
                    onChange={(e) => setAddFirmForm({...addFirmForm, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Enter contact person name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={addFirmForm.email}
                    onChange={(e) => setAddFirmForm({...addFirmForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={addFirmForm.phone}
                    onChange={(e) => setAddFirmForm({...addFirmForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                <select
                  value={addFirmForm.level}
                  onChange={(e) => setAddFirmForm({...addFirmForm, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                >
                  {userLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={handleCancelAddFirm}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFirm}
                disabled={!addFirmForm.name.trim() || !addFirmForm.contact.trim() || !addFirmForm.email.trim()}
                className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4F46E5' }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                  }
                }}
              >
                Add Accounting Firm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Team Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Edit Team Member</h3>
              <button
                onClick={handleCancelEdit}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={editForm.department}
                    onChange={(e) => setEditForm({...editForm, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="HR">Human Resources</option>
                    <option value="IT">Information Technology</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    value={editForm.level}
                    onChange={(e) => setEditForm({...editForm, level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  >
                    {userLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this team member? This action cannot be undone.')) {
                    setTeamMembers(prev => prev.filter(m => m.id !== editingMember?.id));
                    setEditingMember(null);
                    setShowEditModal(false);
                    setEditForm({ name: '', email: '', role: '', department: '', level: '' });
                  }
                }}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Member
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMember}
                  className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium"
                  style={{ backgroundColor: '#4F46E5' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Accounting Firm Modal */}
      {showEditFirmModal && editingFirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Edit Accounting Firm</h3>
              <button
                onClick={handleCancelFirmEdit}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firm Name</label>
                  <input
                    type="text"
                    value={firmEditForm.name}
                    onChange={(e) => setFirmEditForm({...firmEditForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                  <input
                    type="text"
                    value={firmEditForm.contact}
                    onChange={(e) => setFirmEditForm({...firmEditForm, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={firmEditForm.email}
                    onChange={(e) => setFirmEditForm({...firmEditForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={firmEditForm.phone}
                    onChange={(e) => setFirmEditForm({...firmEditForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                <select
                  value={firmEditForm.level}
                  onChange={(e) => setFirmEditForm({...firmEditForm, level: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                >
                  {userLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this accounting firm? This action cannot be undone.')) {
                    setAccountingFirms(prev => prev.filter(f => f.id !== editingFirm?.id));
                    setEditingFirm(null);
                    setShowEditFirmModal(false);
                    setFirmEditForm({ name: '', contact: '', email: '', phone: '', level: '' });
                  }
                }}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Firm
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelFirmEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFirm}
                  className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium"
                  style={{ backgroundColor: '#4F46E5' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4338CA';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#4F46E5';
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;