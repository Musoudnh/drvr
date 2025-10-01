import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Plus, DollarSign, Calendar, Target, BarChart3, TrendingUp, Building, X, Trash2, MoreHorizontal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { AddRoleModal } from '../../components/Hiring/AddRoleModal';
import { RoleCard } from '../../components/Hiring/RoleCard';
import { HiringRole } from '../../types/hiring';
import { supabase } from '../../lib/supabase';

const HiringRunway: React.FC = () => {
  const [currentHeadcount] = useState(24);
  const [averageSalary] = useState(85000);
  const [showAddModal, setShowAddModal] = useState(false);
  const [roles, setRoles] = useState<HiringRole[]>([]);
  const [loading, setLoading] = useState(true);

  const getMonthYearFromDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const hiringPlans = roles.map(role => ({
    id: role.id,
    role: role.role_name,
    department: role.location_state,
    salary: role.base_compensation,
    startMonth: getMonthYearFromDate(role.start_date),
    endMonth: 'Dec 2025',
    active: true
  }));

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hiring_roles')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      const { error } = await supabase
        .from('hiring_roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadRoles();
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Failed to delete role. Please try again.');
    }
  };

  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
    'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
  ];

  const hiringDrivers = [
    { id: 1, name: 'Engineering Team Expansion', hires: 3, startMonth: 'Feb 2025', active: true, department: 'Engineering', avgSalary: 95000 },
    { id: 2, name: 'Sales Team Growth', hires: 2, startMonth: 'Mar 2025', active: true, department: 'Sales', avgSalary: 75000 },
    { id: 3, name: 'Customer Success Hire', hires: 1, startMonth: 'May 2025', active: false, department: 'Customer Success', avgSalary: 70000 },
    { id: 4, name: 'Finance Team Addition', hires: 1, startMonth: 'Jun 2025', active: true, department: 'Finance', avgSalary: 80000 }
  ];

  const getMonthIndex = (month: string) => {
    return months.indexOf(month);
  };

  const getDepartmentColor = (department: string) => {
    return '#9CA3AF'; // Light grey for all departments
  };

  const calculateHiringProjection = () => {
    return months.map((month, index) => {
      let headcount = currentHeadcount;
      let monthlyCost = currentHeadcount * (averageSalary / 12);
      
      // Apply active hiring drivers
      hiringDrivers.forEach(driver => {
        if (driver.active) {
          const driverStartIndex = months.indexOf(driver.startMonth);
          if (index >= driverStartIndex) {
            headcount += driver.hires;
            monthlyCost += driver.hires * (driver.avgSalary / 12);
          }
        }
      });

      // Apply hiring plans
      hiringPlans.forEach(plan => {
        if (plan.active) {
          const planStartIndex = getMonthIndex(plan.startMonth);
          const planEndIndex = getMonthIndex(plan.endMonth);
          if (index >= planStartIndex && index <= planEndIndex) {
            headcount += 1;
            monthlyCost += plan.salary / 12;
          }
        }
      });
      return {
        month,
        headcount,
        monthlyCost,
        annualizedCost: monthlyCost * 12,
        newHires: index === 0 ? 0 : headcount - currentHeadcount
      };
    });
  };

  const projectionData = calculateHiringProjection();
  const totalNewHires = Math.max(...projectionData.map(m => m.newHires));
  const finalHeadcount = projectionData[projectionData.length - 1]?.headcount || currentHeadcount;
  const totalAnnualCost = projectionData[projectionData.length - 1]?.annualizedCost || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">Hiring Scenario Planning</h2>
        <p className="text-gray-600 mt-1">Model team growth scenarios and analyze hiring impact</p>
      </div>

      {/* Hiring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Team</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{currentHeadcount}</p>
              <p className="text-sm text-gray-600 mt-1">Total employees</p>
            </div>
            <Users className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planned Hires</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">+{totalNewHires}</p>
              <p className="text-sm text-gray-600 mt-1">New positions</p>
            </div>
            <UserPlus className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Final Headcount</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{finalHeadcount}</p>
              <p className="text-sm text-[#4ADE80] mt-1">+{((finalHeadcount - currentHeadcount) / currentHeadcount * 100).toFixed(1)}% growth</p>
            </div>
            <Target className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Cost</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">${(totalAnnualCost / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600 mt-1">Total compensation</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Comprehensive Role Management */}
      <Card title="Hiring Roles">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-600">Comprehensive role planning with fully-loaded cost calculations</p>
            <p className="text-xs text-gray-500 mt-1">Includes base compensation, payroll taxes, and benefits</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading roles...</p>
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-2">No roles added yet</p>
            <p className="text-sm text-gray-500 mb-4">Add your first role to start planning your hiring budget</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Role
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roles.map((role) => (
              <RoleCard key={role.id} role={role} onDelete={handleDeleteRole} />
            ))}
          </div>
        )}

        {/* Budget Summary */}
        {roles.length > 0 && (
          <div className="bg-gradient-to-br from-[#101010] to-gray-800 rounded-lg p-6 mt-6">
            <h3 className="text-white font-semibold mb-4">Total Hiring Budget</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-300 text-sm mb-1">Total Roles</p>
                <p className="text-2xl font-bold text-white">{roles.length}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm mb-1">Base Compensation</p>
                <p className="text-2xl font-bold text-white">
                  ${roles.reduce((sum, role) => sum + role.base_compensation, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm mb-1">Total Loaded Cost</p>
                <p className="text-2xl font-bold text-[#4ADE80]">
                  ${roles.reduce((sum, role) => sum + role.total_loaded_cost, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Legacy Hiring Plans Management */}
      <Card title="Additional Hiring Plans">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">Quick hiring plans and payroll timeline</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Quick Plan
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {hiringPlans.map(plan => (
            <div key={plan.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#4ADE80] transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-4"
                    style={{ backgroundColor: plan.active ? '#4ADE80' : '#9CA3AF' }}
                  />
                  <div>
                    <h3 className="font-semibold text-[#101010] text-lg">{plan.role}</h3>
                    <p className="text-sm text-gray-600 mt-1">{plan.department} • ${plan.salary.toLocaleString()}/year</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    plan.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {plan.active ? 'Active' : 'Planned'}
                  </span>
                  <button
                    onClick={() => handleDeleteRole(plan.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Timeline:</span> {plan.startMonth} - {plan.endMonth}
                </div>
                <div className="text-sm font-semibold" style={{ color: getDepartmentColor(plan.department) }}>
                  ${(plan.salary * 1.3).toLocaleString()}/year fully loaded
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hiring Timeline Gantt Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-[#101010] mb-6 text-lg">Hiring Timeline</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-4 font-bold text-gray-800 w-48">Role</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Department</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Level</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Start</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">FTE</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-800 w-24">Base Salary</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Fully Loaded</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Location</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hiringPlans.map((plan, planIndex) => (
                    <tr key={plan.id} className="border-b border-gray-200 hover:bg-white/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-4"
                            style={{ backgroundColor: getDepartmentColor(plan.department) }}
                          />
                          <span className="font-semibold text-[#101010]">{plan.role}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-sm font-medium text-gray-700">{plan.department}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">Mid</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">{plan.startMonth.split(' ')[0]}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">1</td>
                      <td className="py-3 px-4 text-right text-sm font-bold" style={{ color: getDepartmentColor(plan.department) }}>${plan.salary.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-sm font-semibold text-gray-700">${(plan.salary * 1.3).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600">Remote</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {plan.active ? 'Active' : 'Planned'}
                          </span>
                          <div className="relative group">
                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-[120px]">
                              <button
                                onClick={() => handleDeleteRole(plan.id)}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Timeline Chart */}
          <div className="bg-white rounded-xl p-6 mt-6 border border-gray-200 shadow-sm">
            <h4 className="font-bold text-[#101010] mb-6 text-lg">Hiring Timeline</h4>
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Timeline Header */}
                <div className="flex mb-4">
                  <div className="w-48 text-sm font-bold text-gray-800 p-3 bg-gray-100 rounded-l-lg">Role</div>
                  <div className="flex-1 grid grid-cols-12 gap-1 bg-gray-100 rounded-r-lg p-3">
                    {months.map((month, index) => (
                      <div key={index} className="text-xs font-bold text-gray-700 text-center">
                        {month.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline Rows */}
                {hiringPlans.map(plan => (
                  <div key={plan.id} className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-48 text-sm font-medium text-[#101010] p-2 truncate">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: plan.active ? '#4ADE80' : '#9CA3AF' }}
                        />
                        {plan.role}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {months.map((month, index) => {
                        const startIndex = getMonthIndex(plan.startMonth);
                        const endIndex = getMonthIndex(plan.endMonth);
                        const isActive = index >= startIndex && index <= endIndex && plan.active;
                        
                        return (
                          <div
                            key={index}
                            className={`h-8 rounded-lg mx-1`}
                            style={{ 
                              backgroundColor: isActive ? '#4ADE80' : 'transparent'
                            }}
                            title={isActive ? `${plan.role}: $${plan.salary.toLocaleString()}/year` : ''}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
                
                {/* Legend */}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Hiring Drivers */}
      <Card title="Hiring Plans">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">Manage team expansion plans and hiring timeline</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Driver
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Hire
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hiringDrivers.map(driver => (
            <div key={driver.id} className={`p-6 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
              driver.active ? 'border-[#4ADE80] bg-[#4ADE80]/5' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#101010] text-lg">{driver.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Department: {driver.department}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  driver.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                }`}>
                  {driver.active ? 'Active' : 'Planned'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">New Hires:</span>
                  <span className="font-bold text-[#4ADE80]">{driver.hires} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Salary:</span>
                  <span className="font-semibold text-[#101010]">${driver.avgSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-semibold text-[#101010]">{driver.startMonth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Hiring Projection Table */}
      <Card title="12-Month Hiring Projection">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Month</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Headcount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">New Hires</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Monthly Cost</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Annual Cost</th>
              </tr>
            </thead>
            <tbody>
              {projectionData.map((monthData, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#101010]">{monthData.month}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#3AB7BF]">{monthData.headcount}</td>
                  <td className="py-3 px-4 text-right font-medium text-[#4ADE80]">
                    {monthData.newHires > 0 ? `+${monthData.newHires}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#F87171]">${monthData.monthlyCost.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right font-bold text-[#8B5CF6]">${monthData.annualizedCost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Hiring Insights */}
      <Card title="Team Growth Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Growth Rate</h3>
            <p className="text-sm text-gray-600">Team will grow by {((finalHeadcount - currentHeadcount) / currentHeadcount * 100).toFixed(1)}% over 12 months</p>
          </div>
          
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <Building className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Department Focus</h3>
            <p className="text-sm text-gray-600">Engineering and Sales are primary growth areas</p>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <Calendar className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Hiring Timeline</h3>
            <p className="text-sm text-gray-600">Peak hiring in Q2 with 4 new team members</p>
          </div>
        </div>
      </Card>

      {/* Summary boxes at bottom of page */}
      <div className="grid grid-cols-3 gap-4 text-center mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-[#3B82F6]">{currentHeadcount}</p>
          <p className="text-sm text-gray-500">Base Headcount</p>
          <p className="text-xs text-gray-600">(Current)</p>
          <p className="text-xs text-[#3B82F6]">Starting team size</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-[#4ADE80]">{finalHeadcount}</p>
          <p className="text-sm text-gray-500">Total Scenario</p>
          <p className="text-xs text-gray-600">(12M)</p>
          <p className="text-xs text-[#4ADE80]">With all active hires</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-[#F59E0B]">+{totalNewHires}</p>
          <p className="text-sm text-gray-500">Hiring Impact</p>
          <p className="text-xs text-gray-600">(12M)</p>
          <p className="text-xs text-[#4ADE80]">New team members</p>
        </div>
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onRoleAdded={loadRoles}
      />
    </div>
  );
};

export default HiringRunway;