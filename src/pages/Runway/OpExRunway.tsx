import React, { useState } from 'react';
import { TrendingDown, AlertTriangle, Plus, Users, Building, DollarSign, Calendar, Target, BarChart3, X, Trash2, MoreHorizontal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const OpExRunway: React.FC = () => {
  const [startingOpEx] = useState(285000);
  const [opexGrowthRate] = useState(4.2);
  const [showAddModal, setShowAddModal] = useState(false);
  const [opexExpenses, setOpexExpenses] = useState([
    { id: 1, name: 'Salaries & Benefits', amount: 128000, startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Payroll', active: true },
    { id: 2, name: 'Office Rent', amount: 25000, startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Facilities', active: true },
    { id: 3, name: 'Software Licenses', amount: 18500, startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Technology', active: true },
    { id: 4, name: 'Marketing Spend', amount: 35000, startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Marketing', active: true }
  ]);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    startMonth: 'Jan 2025',
    endMonth: 'Dec 2025',
    category: 'Operations',
    customCategory: ''
  });

  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
    'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
  ];

  const opexDrivers = [
    { id: 1, name: 'Office Lease Renewal', impact: '+$8K/month', startMonth: 'Mar 2025', active: true, type: 'Facilities' },
    { id: 2, name: 'Software License Optimization', impact: '-$12K/month', startMonth: 'Feb 2025', active: true, type: 'Technology' },
    { id: 3, name: 'Marketing Campaign', impact: '+$25K/month', startMonth: 'Apr 2025', active: false, type: 'Marketing' },
    { id: 4, name: 'Process Automation', impact: '-$15K/month', startMonth: 'Jun 2025', active: true, type: 'Operations' }
  ];

  const handleAddExpense = () => {
    if (newExpense.name.trim() && newExpense.amount) {
      const finalCategory = newExpense.category === 'Custom' ? newExpense.customCategory : newExpense.category;
      const expense = {
        id: Math.max(...opexExpenses.map(e => e.id)) + 1,
        name: newExpense.name,
        amount: parseInt(newExpense.amount),
        startMonth: newExpense.startMonth,
        endMonth: newExpense.endMonth,
        category: finalCategory,
        active: true
      };
      setOpexExpenses(prev => [...prev, expense]);
      setNewExpense({ name: '', amount: '', startMonth: 'Jan 2025', endMonth: 'Dec 2025', category: 'Operations', customCategory: '' });
      setShowAddModal(false);
    }
  };

  const handleDeleteExpense = (id: number) => {
    setOpexExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getMonthIndex = (month: string) => {
    return months.indexOf(month);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Payroll': return '#F87171';
      case 'Facilities': return '#F59E0B';
      case 'Technology': return '#8B5CF6';
      case 'Marketing': return '#EC4899';
      case 'Operations': return '#6B7280';
      default: return '#9CA3AF';
    }
  };

  const calculateOpExProjection = () => {
    return months.map((month, index) => {
      let baseOpEx = startingOpEx * Math.pow(1 + opexGrowthRate / 100, index);
      
      // Apply active drivers
      opexDrivers.forEach(driver => {
        if (driver.active) {
          const driverStartIndex = months.indexOf(driver.startMonth);
          if (index >= driverStartIndex) {
            const impact = parseInt(driver.impact.replace(/[^0-9-]/g, '')) * 1000;
            baseOpEx += impact;
          }
        }
      });

      // Apply OpEx expenses
      opexExpenses.forEach(expense => {
        if (expense.active) {
          const expenseStartIndex = getMonthIndex(expense.startMonth);
          const expenseEndIndex = getMonthIndex(expense.endMonth);
          if (index >= expenseStartIndex && index <= expenseEndIndex) {
            baseOpEx += expense.amount;
          }
        }
      });
      return {
        month,
        opex: baseOpEx,
        growth: index === 0 ? 0 : ((baseOpEx - (startingOpEx * Math.pow(1 + opexGrowthRate / 100, index - 1))) / (startingOpEx * Math.pow(1 + opexGrowthRate / 100, index - 1))) * 100
      };
    });
  };

  const projectionData = calculateOpExProjection();
  const totalProjectedOpEx = projectionData.reduce((sum, month) => sum + month.opex, 0);
  const averageGrowthRate = projectionData.reduce((sum, month) => sum + month.growth, 0) / projectionData.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#101010]">OpEx Scenario Planning</h2>
        <p className="text-gray-600 mt-1">Model operational expense scenarios and optimize costs</p>
      </div>

      {/* OpEx Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Current OpEx</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">${startingOpEx.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-1">Monthly operational</p>
            </div>
            <TrendingDown className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{opexGrowthRate}%</p>
              <p className="text-xs text-gray-600 mt-1">Monthly increase</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">12M Projection</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">${(totalProjectedOpEx / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-[#F87171] mt-1">+{averageGrowthRate.toFixed(1)}% avg growth</p>
            </div>
            <Target className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Active Drivers</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{opexDrivers.filter(d => d.active).length}</p>
              <p className="text-xs text-gray-600 mt-1">Cost initiatives</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>
      </div>

      {/* OpEx Expenses Management */}
      <Card title="OpEx Expense Categories">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-gray-600">Manage your operational expense categories and timeline</p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add OpEx Category
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {opexExpenses.map(expense => (
            <div key={expense.id} className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-[#F87171] transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className={`w-4 h-4 rounded-full mr-4 ${
                      expense.active ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]'
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-[#101010] text-lg">{expense.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{expense.category} • ${expense.amount.toLocaleString()}/month</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    expense.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {expense.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Timeline:</span> {expense.startMonth} - {expense.endMonth}
                </div>
                <div className="text-xs font-semibold" style={{ color: getCategoryColor(expense.category) }}>
                  ${(expense.amount * 12).toLocaleString()}/year
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OpEx Timeline Gantt Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold text-[#101010] mb-6 text-lg">OpEx Timeline</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-4 px-4 font-bold text-gray-800 w-48">OpEx Category</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Category</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Type</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Start</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Duration</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-800 w-24">Monthly</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Annual</th>
                    <th className="text-center py-4 px-4 font-bold text-gray-800 w-20">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {opexExpenses.map((expense, expenseIndex) => (
                    <tr key={expense.id} className="border-b border-gray-200 hover:bg-white/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div 
                            className={`w-4 h-4 rounded-full mr-4 ${
                              expense.active ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]'
                            }`}
                          />
                          <span className="font-semibold text-[#101010]">{expense.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-xs font-medium text-gray-700">{expense.category}</td>
                      <td className="py-3 px-4 text-center text-xs text-gray-600">Recurring</td>
                      <td className="py-3 px-4 text-center text-xs text-gray-600">{expense.startMonth.split(' ')[0]}</td>
                      <td className="py-3 px-4 text-center text-xs text-gray-600">12 months</td>
                      <td className="py-3 px-4 text-right text-xs font-bold" style={{ color: getCategoryColor(expense.category) }}>${expense.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center text-xs font-semibold text-gray-700">${(expense.amount * 12).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium`}
                            style={{
                              backgroundColor: expense.active ? `${getCategoryColor(expense.category)}20` : '#E5E7EB',
                              color: expense.active ? getCategoryColor(expense.category) : '#6B7280'
                            }}>
                            {expense.active ? 'Active' : 'Inactive'}
                          </span>
                          <div className="relative group">
                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-400" />
                            </button>
                            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 min-w-[120px]">
                              <button
                                onClick={() => setOpexExpenses(prev => prev.map(e => e.id === expense.id ? {...e, active: !e.active} : e))}
                                className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                {expense.active ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(expense.id)}
                                className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center"
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
            <h4 className="font-bold text-[#101010] mb-6 text-lg">OpEx Timeline</h4>
            <div className="overflow-x-auto">
              <div className="min-w-[1200px]">
                {/* Timeline Header */}
                <div className="flex mb-2">
                  <div className="w-48 text-xs font-bold text-gray-800 p-3 bg-gray-100 rounded-l-lg">OpEx Category</div>
                  <div className="flex-1 grid grid-cols-12 gap-1 bg-gray-100 rounded-r-lg p-3">
                    {months.map((month, index) => (
                      <div key={index} className="text-xs font-bold text-gray-700 text-center">
                        {month.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Timeline Rows */}
                {opexExpenses.map(expense => (
                  <div key={expense.id} className="flex mb-3 items-center bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="w-48 text-xs font-medium text-[#101010] p-2 truncate">
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-3 ${
                            expense.active ? 'bg-[#4ADE80]' : 'bg-[#9CA3AF]'
                          }`}
                        />
                        {expense.name}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-12 gap-1">
                      {months.map((month, index) => {
                        const startIndex = getMonthIndex(expense.startMonth);
                        const endIndex = getMonthIndex(expense.endMonth);
                        const isActive = index >= startIndex && index <= endIndex && expense.active;
                        
                        return (
                          <div
                            key={index}
                            className={`h-8 rounded-lg mx-1`}
                            style={{ 
                              backgroundColor: isActive ? '#4ADE80' : 'transparent'
                            }}
                            title={isActive ? `${expense.name}: $${expense.amount.toLocaleString()}` : ''}
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

      {/* OpEx Drivers */}
      <Card title="Operational Expense Drivers">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-gray-600">Manage cost optimization and expense planning initiatives</p>
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
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opexDrivers.map(driver => (
            <div key={driver.id} className={`p-6 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md ${
              driver.active ? 'border-[#F87171] bg-[#F87171]/5' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#101010] text-lg">{driver.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">Category: {driver.type}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  driver.active ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-300 text-gray-600'
                }`}>
                  {driver.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Impact:</span>
                  <span className={`font-medium ${driver.impact.includes('-') ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    {driver.impact}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-semibold text-[#101010]">{driver.startMonth}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* OpEx Projection Table */}
      <Card title="12-Month OpEx Projection">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600">Monthly OpEx Growth</span>
            <span className="text-xs text-[#F87171] font-medium">+{averageGrowthRate.toFixed(1)}% avg growth</span>
          </div>
          <div className="relative h-64">
            {/* Chart Container */}
            <div className="h-48 relative">
              {/* Base OpEx Line (Blue) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  points={projectionData.map((data, index) => {
                    const baseOpEx = startingOpEx * Math.pow(1 + opexGrowthRate / 100, index);
                    const x = 30 + index * 60;
                    const y = 140 - (baseOpEx - startingOpEx) / 5000;
                    return `${x},${Math.max(20, Math.min(140, y))}`;
                  }).join(' ')}
                />
                {/* Data points for base OpEx */}
                {projectionData.map((data, index) => {
                  const baseOpEx = startingOpEx * Math.pow(1 + opexGrowthRate / 100, index);
                  const x = 30 + index * 60;
                  const y = 140 - (baseOpEx - startingOpEx) / 5000;
                  return (
                    <circle 
                      key={index} 
                      cx={x} 
                      cy={Math.max(20, Math.min(140, y))} 
                      r="4" 
                      fill="#3B82F6"
                      title={`Base OpEx: $${baseOpEx.toLocaleString()}`}
                    />
                  );
                })}
              </svg>
              
              {/* Driver Impact Line (Red) */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                <polyline
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="3"
                  points={projectionData.map((data, index) => {
                    const x = 30 + index * 60;
                    const y = 140 - (data.opex - startingOpEx) / 5000;
                    return `${x},${Math.max(20, Math.min(140, y))}`;
                  }).join(' ')}
                />
                {/* Data points for total OpEx */}
                {projectionData.map((data, index) => {
                  const x = 30 + index * 60;
                  const y = 140 - (data.opex - startingOpEx) / 5000;
                  return (
                    <circle 
                      key={index} 
                      cx={x} 
                      cy={Math.max(20, Math.min(140, y))} 
                      r="4" 
                      fill="#F87171"
                      title={`Total OpEx: $${data.opex.toLocaleString()}`}
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Month Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index} className="flex-1 text-center">{month}</span>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3B82F6] rounded mr-2"></div>
              <span className="text-xs text-gray-600">Base OpEx</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#F87171] rounded mr-2"></div>
              <span className="text-xs text-gray-600">Total OpEx (with drivers)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#3B82F6]">${projectionData[projectionData.length - 1]?.opex.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Final Month</p>
              <p className="text-xs text-[#F87171]">+{projectionData[projectionData.length - 1]?.growth.toFixed(1)}% vs Start</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#F87171]">${(totalProjectedOpEx / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Total 12M</p>
              <p className="text-xs text-[#F87171]">+{averageGrowthRate.toFixed(1)}% avg growth</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#F59E0B]">${((totalProjectedOpEx - startingOpEx * 12) / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Driver Impact</p>
              <p className="text-xs text-[#F87171]">Additional costs</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Cost Optimization Insights */}
      <Card title="Cost Optimization Opportunities">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Potential Savings</h3>
            <p className="text-xs text-gray-600">Software optimization could save $144K annually</p>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <Building className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Facility Costs</h3>
            <p className="text-xs text-gray-600">Lease renewal will increase costs by $96K annually</p>
          </div>
          
          <div className="text-center p-4 bg-[#8B5CF6]/10 rounded-lg">
            <Users className="w-8 h-8 text-[#8B5CF6] mx-auto mb-3" />
            <h3 className="font-semibold text-[#101010] mb-2">Efficiency Gains</h3>
            <p className="text-xs text-gray-600">Automation could reduce operational costs by 8%</p>
          </div>
        </div>
      </Card>

      {/* Summary boxes at bottom of page */}
      <div className="grid grid-cols-3 gap-4 text-center mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-[#3B82F6]">${(startingOpEx * 12 / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500">Base OpEx</p>
          <p className="text-xs text-gray-600">(12M)</p>
          <p className="text-xs text-[#3B82F6]">Organic growth at {opexGrowthRate}% monthly</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-[#F87171]">${(totalProjectedOpEx / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500">Total Scenario</p>
          <p className="text-xs text-gray-600">(12M)</p>
          <p className="text-xs text-[#F87171]">With all active drivers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-2xl font-bold text-[#F59E0B]">+${((totalProjectedOpEx - startingOpEx * 12) / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-500">Driver Impact</p>
          <p className="text-xs text-gray-600">(12M)</p>
          <p className="text-xs text-[#F87171]">Additional costs</p>
        </div>
      </div>

      {/* Add OpEx Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Add OpEx Category</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Expense Name</label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                  placeholder="e.g., Cloud Infrastructure"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Monthly Amount ($)</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                    placeholder="15000"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                  >
                    <option value="Payroll">Payroll</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Custom">Custom (Enter your own)</option>
                  </select>
                </div>
                
                {newExpense.category === 'Custom' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Custom Category Name</label>
                    <input
                      type="text"
                      value={newExpense.customCategory}
                      onChange={(e) => setNewExpense({...newExpense, customCategory: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                      placeholder="Enter custom category name"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Start Month</label>
                  <select
                    value={newExpense.startMonth}
                    onChange={(e) => setNewExpense({...newExpense, startMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">End Month</label>
                  <select
                    value={newExpense.endMonth}
                    onChange={(e) => setNewExpense({...newExpense, endMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                disabled={!newExpense.name.trim() || !newExpense.amount || (newExpense.category === 'Custom' && !newExpense.customCategory.trim())}
                className="px-4 py-2 bg-[#F87171] text-white rounded-lg hover:bg-[#F56565] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpExRunway;