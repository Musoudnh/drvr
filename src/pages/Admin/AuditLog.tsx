import React, { useState } from 'react';
import { Search, Filter, Download, Calendar, User, Activity, AlertTriangle, CheckCircle, ChevronDown, X } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AuditLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserFilter, setShowUserFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const availableUsers = [
    'John Doe',
    'Sarah Johnson', 
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Lisa Thompson',
    'Unknown'
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-01-15 14:32:15',
      user: 'John Doe',
      action: 'User Login',
      resource: 'Authentication System',
      ip: '192.168.1.100',
      status: 'success',
      details: 'Successful login from Chrome browser'
    },
    {
      id: 2,
      timestamp: '2025-01-15 14:28:42',
      user: 'Sarah Johnson',
      action: 'Data Export',
      resource: 'Financial Reports',
      ip: '192.168.1.105',
      status: 'success',
      details: 'Exported Q4 financial summary'
    },
    {
      id: 3,
      timestamp: '2025-01-15 14:15:33',
      user: 'Michael Chen',
      action: 'Permission Change',
      resource: 'User Management',
      ip: '192.168.1.102',
      status: 'success',
      details: 'Updated user role for Emily Rodriguez'
    },
    {
      id: 4,
      timestamp: '2025-01-15 13:45:21',
      user: 'Unknown',
      action: 'Failed Login',
      resource: 'Authentication System',
      ip: '203.0.113.45',
      status: 'failed',
      details: 'Multiple failed login attempts'
    },
    {
      id: 5,
      timestamp: '2025-01-15 13:22:18',
      user: 'David Kim',
      action: 'Settings Update',
      resource: 'System Configuration',
      ip: '192.168.1.108',
      status: 'success',
      details: 'Updated security policy settings'
    }
  ];

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUserFilter = selectedUsers.length === 0 || selectedUsers.includes(log.user);
    
    return matchesSearch && matchesUserFilter;
  });

  const handleUserToggle = (user: string) => {
    setSelectedUsers(prev => 
      prev.includes(user) 
        ? prev.filter(u => u !== user)
        : [...prev, user]
    );
  };

  const clearUserFilter = () => {
    setSelectedUsers([]);
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
          />
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <Button 
              variant="outline" 
              size="md"
              onClick={() => setShowUserFilter(!showUserFilter)}
              className="px-6 py-2 h-10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {selectedUsers.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-[#3AB7BF] text-white text-xs rounded-full">
                  {selectedUsers.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            
            {/* User Filter Dropdown */}
            {showUserFilter && (
              <div className="absolute top-full mt-2 right-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#101010]">Filter by User</h4>
                    {selectedUsers.length > 0 && (
                      <button
                        onClick={clearUserFilter}
                        className="text-xs text-[#3AB7BF] hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto p-2">
                  {availableUsers.map(user => (
                    <label key={user} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user)}
                        onChange={() => handleUserToggle(user)}
                        className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF] mr-3"
                      />
                      <span className="text-sm text-gray-700">{user}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="md"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-6 py-2 h-10"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
              {(dateRange.startDate || dateRange.endDate) && (
                <span className="ml-2 px-1.5 py-0.5 bg-[#3AB7BF] text-white text-xs rounded-full">
                  •
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            
            {/* Date Range Picker */}
            {showDatePicker && (
              <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-[#101010]">Select Date Range</h4>
                    {(dateRange.startDate || dateRange.endDate) && (
                      <button
                        onClick={clearDateFilter}
                        className="text-xs text-[#3AB7BF] hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setShowDatePicker(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card title="Recent Activity">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Resource</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">IP Address</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-[#101010]">{log.user}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#101010]">{log.action}</td>
                  <td className="py-3 px-4 text-gray-600">{log.resource}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{log.ip}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.status === 'success'
                        ? 'bg-[#4ADE80]/20 text-[#4ADE80]'
                        : 'bg-[#F87171]/20 text-[#F87171]'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};

export default AuditLog;