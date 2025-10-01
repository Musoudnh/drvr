import React, { useState } from 'react';
import { Building, Plus, CreditCard as Edit3, Trash2, Users, DollarSign, TrendingUp, Target, PieChart, ArrowRight, Download, Upload, Settings, ChevronDown, ChevronRight, BarChart3, AlertCircle, CheckCircle, X } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Department {
  id: string;
  name: string;
  code: string;
  manager: string;
  headcount: number;
  budget: number;
  spent: number;
  costCenters: CostCenter[];
  kpis: DepartmentKPI[];
  parentId?: string;
}

interface CostCenter {
  id: string;
  name: string;
  code: string;
  budget: number;
  spent: number;
  type: 'direct' | 'indirect' | 'overhead';
}

interface DepartmentKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

interface Allocation {
  fromDept: string;
  toDept: string;
  amount: number;
  type: 'expense' | 'revenue';
  description: string;
}

const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: '1',
      name: 'Engineering',
      code: 'ENG',
      manager: 'Sarah Chen',
      headcount: 24,
      budget: 3200000,
      spent: 2450000,
      costCenters: [
        { id: 'cc1', name: 'Product Development', code: 'ENG-PD', budget: 1800000, spent: 1350000, type: 'direct' },
        { id: 'cc2', name: 'Infrastructure', code: 'ENG-INF', budget: 800000, spent: 600000, type: 'direct' },
        { id: 'cc3', name: 'DevOps', code: 'ENG-DO', budget: 600000, spent: 500000, type: 'indirect' }
      ],
      kpis: [
        { id: 'k1', name: 'Velocity', value: 42, target: 40, unit: 'points', trend: 'up' },
        { id: 'k2', name: 'Deploy Frequency', value: 18, target: 15, unit: 'per week', trend: 'up' },
        { id: 'k3', name: 'Bug Rate', value: 2.1, target: 3.0, unit: '%', trend: 'down' }
      ]
    },
    {
      id: '2',
      name: 'Sales & Marketing',
      code: 'SMK',
      manager: 'Michael Rodriguez',
      headcount: 16,
      budget: 1800000,
      spent: 1425000,
      costCenters: [
        { id: 'cc4', name: 'Digital Marketing', code: 'SMK-DM', budget: 600000, spent: 480000, type: 'direct' },
        { id: 'cc5', name: 'Enterprise Sales', code: 'SMK-ES', budget: 800000, spent: 650000, type: 'direct' },
        { id: 'cc6', name: 'Sales Operations', code: 'SMK-SO', budget: 400000, spent: 295000, type: 'indirect' }
      ],
      kpis: [
        { id: 'k4', name: 'MQLs', value: 450, target: 400, unit: 'leads', trend: 'up' },
        { id: 'k5', name: 'Conversion Rate', value: 3.2, target: 2.8, unit: '%', trend: 'up' },
        { id: 'k6', name: 'CAC', value: 145, target: 125, unit: '$', trend: 'up' }
      ]
    },
    {
      id: '3',
      name: 'Operations',
      code: 'OPS',
      manager: 'Emily Johnson',
      headcount: 8,
      budget: 950000,
      spent: 720000,
      costCenters: [
        { id: 'cc7', name: 'Finance', code: 'OPS-FIN', budget: 400000, spent: 310000, type: 'overhead' },
        { id: 'cc8', name: 'HR', code: 'OPS-HR', budget: 350000, spent: 260000, type: 'overhead' },
        { id: 'cc9', name: 'Legal', code: 'OPS-LEG', budget: 200000, spent: 150000, type: 'overhead' }
      ],
      kpis: [
        { id: 'k7', name: 'Time to Hire', value: 28, target: 30, unit: 'days', trend: 'down' },
        { id: 'k8', name: 'Employee Satisfaction', value: 4.2, target: 4.0, unit: '/5', trend: 'up' }
      ]
    }
  ]);

  const [allocations, setAllocations] = useState<Allocation[]>([
    { fromDept: 'Engineering', toDept: 'Sales & Marketing', amount: 50000, type: 'expense', description: 'Engineering support for enterprise deals' },
    { fromDept: 'Operations', toDept: 'Engineering', amount: 25000, type: 'expense', description: 'HR recruiting costs' }
  ]);

  const [expandedDepts, setExpandedDepts] = useState<string[]>(['1']);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'costcenters' | 'allocations' | 'kpis'>('overview');

  const toggleDepartment = (deptId: string) => {
    setExpandedDepts(prev =>
      prev.includes(deptId) ? prev.filter(id => id !== deptId) : [...prev, deptId]
    );
  };

  const formatCurrency = (value: number) => {
    return value >= 1000000
      ? `$${(value / 1000000).toFixed(1)}M`
      : value >= 1000
      ? `$${(value / 1000).toFixed(0)}K`
      : `$${value.toLocaleString()}`;
  };

  const getUtilization = (spent: number, budget: number) => {
    return ((spent / budget) * 100).toFixed(1);
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 90) return '#F87171';
    if (utilization > 75) return '#F59E0B';
    return '#4ADE80';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#1E2A38]">Department Management</h2>
          <p className="text-gray-600 mt-2">Manage departments, cost centers, and budget allocations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Building },
            { id: 'costcenters', label: 'Cost Centers', icon: PieChart },
            { id: 'allocations', label: 'Allocations', icon: ArrowRight },
            { id: 'kpis', label: 'KPIs', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 border-b-2 font-medium transition-colors flex items-center ${
                  isActive
                    ? 'border-[#3AB7BF] text-[#3AB7BF]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Departments</p>
                  <p className="text-2xl font-bold text-[#1E2A38] mt-1">{departments.length}</p>
                </div>
                <Building className="w-10 h-10 text-[#3AB7BF]" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Headcount</p>
                  <p className="text-2xl font-bold text-[#1E2A38] mt-1">
                    {departments.reduce((sum, d) => sum + d.headcount, 0)}
                  </p>
                </div>
                <Users className="w-10 h-10 text-[#4ADE80]" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-[#1E2A38] mt-1">
                    {formatCurrency(departments.reduce((sum, d) => sum + d.budget, 0))}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-[#F59E0B]" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Utilization</p>
                  <p className="text-2xl font-bold text-[#1E2A38] mt-1">
                    {(
                      departments.reduce((sum, d) => sum + (d.spent / d.budget) * 100, 0) /
                      departments.length
                    ).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-[#8B5CF6]" />
              </div>
            </Card>
          </div>

          <Card title="Department Overview">
            <div className="space-y-4">
              {departments.map(dept => {
                const isExpanded = expandedDepts.includes(dept.id);
                const utilization = parseFloat(getUtilization(dept.spent, dept.budget));
                const utilizationColor = getUtilizationColor(utilization);

                return (
                  <div key={dept.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-6 bg-white hover:bg-gray-50 cursor-pointer" onClick={() => toggleDepartment(dept.id)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <button className="mr-4">
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-[#1E2A38] text-lg">{dept.name}</h3>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                {dept.code}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">Manager: {dept.manager}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-6 ml-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Headcount</p>
                            <p className="font-bold text-[#1E2A38]">{dept.headcount}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Budget</p>
                            <p className="font-bold text-[#1E2A38]">{formatCurrency(dept.budget)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Spent</p>
                            <p className="font-bold text-[#1E2A38]">{formatCurrency(dept.spent)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Utilization</p>
                            <p className="font-bold" style={{ color: utilizationColor }}>
                              {utilization}%
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-6" onClick={e => e.stopPropagation()}>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            onClick={() => setSelectedDept(dept)}
                          >
                            <Edit3 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(utilization, 100)}%`,
                              backgroundColor: utilizationColor
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-6 bg-gray-50 border-t border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-bold text-[#1E2A38] mb-3">Cost Centers</h4>
                            <div className="space-y-2">
                              {dept.costCenters.map(cc => (
                                <div key={cc.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="font-medium text-[#1E2A38]">{cc.name}</p>
                                      <p className="text-xs text-gray-500">{cc.code}</p>
                                    </div>
                                    <span
                                      className={`px-2 py-1 rounded text-xs font-medium ${
                                        cc.type === 'direct'
                                          ? 'bg-blue-100 text-blue-700'
                                          : cc.type === 'indirect'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      {cc.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                      {formatCurrency(cc.spent)} / {formatCurrency(cc.budget)}
                                    </span>
                                    <span className="font-medium text-[#3AB7BF]">
                                      {getUtilization(cc.spent, cc.budget)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-[#1E2A38] mb-3">Key Performance Indicators</h4>
                            <div className="space-y-2">
                              {dept.kpis.map(kpi => {
                                const isOnTarget = kpi.value >= kpi.target;
                                return (
                                  <div key={kpi.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-[#1E2A38]">{kpi.name}</p>
                                        <p className="text-xs text-gray-500">
                                          Target: {kpi.target} {kpi.unit}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-[#1E2A38]">
                                          {kpi.value} {kpi.unit}
                                        </p>
                                        {isOnTarget ? (
                                          <CheckCircle className="w-4 h-4 text-[#4ADE80] ml-auto" />
                                        ) : (
                                          <AlertCircle className="w-4 h-4 text-[#F59E0B] ml-auto" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'costcenters' && (
        <Card title="Cost Center Analysis">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Direct Costs</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(
                    departments.reduce(
                      (sum, d) =>
                        sum + d.costCenters.filter(cc => cc.type === 'direct').reduce((s, cc) => s + cc.spent, 0),
                      0
                    )
                  )}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-900">Indirect Costs</span>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">
                  {formatCurrency(
                    departments.reduce(
                      (sum, d) =>
                        sum + d.costCenters.filter(cc => cc.type === 'indirect').reduce((s, cc) => s + cc.spent, 0),
                      0
                    )
                  )}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Overhead</span>
                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    departments.reduce(
                      (sum, d) =>
                        sum + d.costCenters.filter(cc => cc.type === 'overhead').reduce((s, cc) => s + cc.spent, 0),
                      0
                    )
                  )}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-bold text-gray-800">Cost Center</th>
                    <th className="text-left py-4 px-6 font-bold text-gray-800">Department</th>
                    <th className="text-center py-4 px-6 font-bold text-gray-800">Type</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-800">Budget</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-800">Spent</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-800">Remaining</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-800">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.flatMap(dept =>
                    dept.costCenters.map(cc => {
                      const remaining = cc.budget - cc.spent;
                      const utilization = parseFloat(getUtilization(cc.spent, cc.budget));
                      return (
                        <tr key={cc.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-[#1E2A38]">{cc.name}</p>
                              <p className="text-xs text-gray-500">{cc.code}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">{dept.name}</td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                cc.type === 'direct'
                                  ? 'bg-blue-100 text-blue-700'
                                  : cc.type === 'indirect'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {cc.type}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-[#1E2A38]">
                            {formatCurrency(cc.budget)}
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-[#1E2A38]">
                            {formatCurrency(cc.spent)}
                          </td>
                          <td className="py-4 px-6 text-right font-medium text-gray-600">
                            {formatCurrency(remaining)}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span
                              className="font-bold"
                              style={{ color: getUtilizationColor(utilization) }}
                            >
                              {utilization}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'allocations' && (
        <Card title="Inter-Department Allocations">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Manage cost allocations and charge-backs between departments</p>
              <Button onClick={() => setShowAllocationModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Allocation
              </Button>
            </div>

            <div className="space-y-4">
              {allocations.map((allocation, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center flex-1">
                      <div className="text-center">
                        <p className="font-bold text-[#1E2A38]">{allocation.fromDept}</p>
                        <p className="text-xs text-gray-500">From</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-[#3AB7BF] mx-6" />
                      <div className="text-center">
                        <p className="font-bold text-[#1E2A38]">{allocation.toDept}</p>
                        <p className="text-xs text-gray-500">To</p>
                      </div>
                      <div className="ml-6 flex-1">
                        <p className="text-sm text-gray-700">{allocation.description}</p>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-2xl font-bold text-[#3AB7BF]">{formatCurrency(allocation.amount)}</p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          allocation.type === 'expense'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {allocation.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#3AB7BF]/10 p-6 rounded-xl">
              <h4 className="font-bold text-[#1E2A38] mb-4">Allocation Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Allocations</p>
                  <p className="text-xl font-bold text-[#1E2A38]">{allocations.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-[#1E2A38]">
                    {formatCurrency(allocations.reduce((sum, a) => sum + a.amount, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Avg Allocation</p>
                  <p className="text-xl font-bold text-[#1E2A38]">
                    {formatCurrency(allocations.reduce((sum, a) => sum + a.amount, 0) / allocations.length)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'kpis' && (
        <Card title="Department KPI Dashboard">
          <div className="space-y-6">
            {departments.map(dept => (
              <div key={dept.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-[#1E2A38] text-lg">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Manager: {dept.manager}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure KPIs
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dept.kpis.map(kpi => {
                    const progress = (kpi.value / kpi.target) * 100;
                    const isOnTarget = kpi.value >= kpi.target;
                    return (
                      <div key={kpi.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-medium text-[#1E2A38]">{kpi.name}</p>
                          {isOnTarget ? (
                            <CheckCircle className="w-5 h-5 text-[#4ADE80]" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <p className="text-2xl font-bold text-[#1E2A38]">
                            {kpi.value}
                          </p>
                          <p className="text-sm text-gray-600">
                            / {kpi.target} {kpi.unit}
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${Math.min(progress, 100)}%`,
                              backgroundColor: isOnTarget ? '#4ADE80' : '#F59E0B'
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {progress.toFixed(0)}% of target
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DepartmentManagement;
