import React, { useState } from 'react';
import { DollarSign, Users, Plus, Target, BarChart3, TrendingUp, Calculator, X, Trash2, Edit3, MoreHorizontal, Calendar, Building, Zap, Brain, Eye, Settings, RefreshCw } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface SalesTeamMember {
  id: string;
  name: string;
  role: string;
  baseSalary: number;
  commissionPlanId: string;
  territory?: string;
  quota: number;
  startDate: string;
  isActive: boolean;
}

interface CommissionPlan {
  id: string;
  name: string;
  type: 'flat_rate' | 'tiered' | 'bonus' | 'accelerator';
  description: string;
  structure: {
    flatRate?: number;
    tiers?: { minSales: number; maxSales: number; rate: number }[];
    bonusTarget?: number;
    bonusRate?: number;
    acceleratorThreshold?: number;
    acceleratorMultiplier?: number;
  };
  isActive: boolean;
}

interface CommissionProjection {
  memberId: string;
  memberName: string;
  month: string;
  projectedSales: number;
  commissionAmount: number;
  totalCompensation: number;
}

interface SalesTarget {
  id: string;
  name: string;
  targetAmount: number;
  timeframe: 'monthly' | 'quarterly' | 'annual';
  assignedTo: string[];
  startDate: string;
  endDate: string;
}

const Commissions: React.FC = () => {
  const [salesTeamMembers, setSalesTeamMembers] = useState<SalesTeamMember[]>([
    {
      id: '1',
      name: 'Alex Rodriguez',
      role: 'Senior Sales Rep',
      baseSalary: 6000,
      commissionPlanId: '1',
      territory: 'West Coast',
      quota: 50000,
      startDate: 'Jan 2025',
      isActive: true
    },
    {
      id: '2',
      name: 'Sarah Kim',
      role: 'Account Manager',
      baseSalary: 7500,
      commissionPlanId: '2',
      territory: 'Enterprise',
      quota: 75000,
      startDate: 'Jan 2025',
      isActive: true
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Sales Manager',
      baseSalary: 9000,
      commissionPlanId: '3',
      territory: 'National',
      quota: 100000,
      startDate: 'Jan 2025',
      isActive: true
    }
  ]);

  const [commissionPlans, setCommissionPlans] = useState<CommissionPlan[]>([
    {
      id: '1',
      name: 'Standard Sales Rep Plan',
      type: 'tiered',
      description: 'Tiered commission structure for sales representatives',
      structure: {
        tiers: [
          { minSales: 0, maxSales: 25000, rate: 3 },
          { minSales: 25000, maxSales: 50000, rate: 5 },
          { minSales: 50000, maxSales: 999999, rate: 7 }
        ]
      },
      isActive: true
    },
    {
      id: '2',
      name: 'Account Manager Plan',
      type: 'flat_rate',
      description: 'Flat rate commission for account managers',
      structure: {
        flatRate: 4
      },
      isActive: true
    },
    {
      id: '3',
      name: 'Sales Manager Bonus Plan',
      type: 'bonus',
      description: 'Base rate plus bonus for exceeding targets',
      structure: {
        flatRate: 2,
        bonusTarget: 80000,
        bonusRate: 3
      },
      isActive: true
    }
  ]);

  const [salesTargets, setSalesTargets] = useState<SalesTarget[]>([
    {
      id: '1',
      name: 'Q1 2025 Team Target',
      targetAmount: 750000,
      timeframe: 'quarterly',
      assignedTo: ['1', '2', '3'],
      startDate: 'Jan 2025',
      endDate: 'Mar 2025'
    }
  ]);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showProjectionModal, setShowProjectionModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [editingMember, setEditingMember] = useState<SalesTeamMember | null>(null);
  const [editingPlan, setEditingPlan] = useState<CommissionPlan | null>(null);

  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Sales Rep',
    baseSalary: '',
    commissionPlanId: '',
    territory: '',
    quota: '',
    startDate: 'Jan 2025'
  });

  const [newPlan, setNewPlan] = useState({
    name: '',
    type: 'flat_rate' as const,
    description: '',
    flatRate: '',
    tiers: [{ minSales: '', maxSales: '', rate: '' }],
    bonusTarget: '',
    bonusRate: ''
  });

  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
    'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
  ];

  // Calculate commission for a member based on their plan and projected sales
  const calculateCommission = (member: SalesTeamMember, projectedSales: number): number => {
    const plan = commissionPlans.find(p => p.id === member.commissionPlanId);
    if (!plan) return 0;

    let commission = 0;

    switch (plan.type) {
      case 'flat_rate':
        commission = projectedSales * (plan.structure.flatRate || 0) / 100;
        break;
      
      case 'tiered':
        if (plan.structure.tiers) {
          for (const tier of plan.structure.tiers) {
            const tierMin = tier.minSales;
            const tierMax = tier.maxSales;
            const salesInTier = Math.max(0, Math.min(projectedSales, tierMax) - tierMin);
            if (salesInTier > 0) {
              commission += salesInTier * tier.rate / 100;
            }
          }
        }
        break;
      
      case 'bonus':
        // Base commission
        commission = projectedSales * (plan.structure.flatRate || 0) / 100;
        // Bonus if over target
        if (plan.structure.bonusTarget && projectedSales > plan.structure.bonusTarget) {
          const bonusSales = projectedSales - plan.structure.bonusTarget;
          commission += bonusSales * (plan.structure.bonusRate || 0) / 100;
        }
        break;
      
      case 'accelerator':
        commission = projectedSales * (plan.structure.flatRate || 0) / 100;
        if (plan.structure.acceleratorThreshold && projectedSales > plan.structure.acceleratorThreshold) {
          commission *= (plan.structure.acceleratorMultiplier || 1);
        }
        break;
    }

    return commission;
  };

  // Generate commission projections for all members across all months
  const generateCommissionProjections = (): CommissionProjection[] => {
    const projections: CommissionProjection[] = [];
    const baseMonthlyRevenue = 425000; // From existing revenue data
    const salesPercentage = 0.85; // Assume 85% of revenue is from sales

    salesTeamMembers.forEach(member => {
      if (!member.isActive) return;

      months.forEach((month, index) => {
        // Calculate projected sales growth (using similar logic to revenue runway)
        const growthRate = 0.08; // 8% monthly growth
        const monthlyRevenue = baseMonthlyRevenue * Math.pow(1 + growthRate, index);
        const totalSales = monthlyRevenue * salesPercentage;
        
        // Distribute sales among team members based on their quota
        const totalQuota = salesTeamMembers.filter(m => m.isActive).reduce((sum, m) => sum + m.quota, 0);
        const memberSalesShare = (member.quota / totalQuota) * totalSales;
        
        const commission = calculateCommission(member, memberSalesShare);
        const totalCompensation = member.baseSalary + commission;

        projections.push({
          memberId: member.id,
          memberName: member.name,
          month,
          projectedSales: memberSalesShare,
          commissionAmount: commission,
          totalCompensation
        });
      });
    });

    return projections;
  };

  const commissionProjections = generateCommissionProjections();

  // Calculate totals for overview cards
  const totalBaseSalaries = salesTeamMembers.filter(m => m.isActive).reduce((sum, m) => sum + m.baseSalary, 0);
  const totalMonthlyCommissions = commissionProjections
    .filter(p => p.month === 'Jan 2025')
    .reduce((sum, p) => sum + p.commissionAmount, 0);
  const totalSalesTeamCost = totalBaseSalaries + totalMonthlyCommissions;
  const averageCommissionRate = commissionProjections.length > 0 
    ? (commissionProjections.reduce((sum, p) => sum + (p.commissionAmount / p.projectedSales * 100), 0) / commissionProjections.filter(p => p.month === 'Jan 2025').length)
    : 0;

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.baseSalary && newMember.commissionPlanId) {
      const member: SalesTeamMember = {
        id: Date.now().toString(),
        name: newMember.name,
        role: newMember.role,
        baseSalary: parseInt(newMember.baseSalary),
        commissionPlanId: newMember.commissionPlanId,
        territory: newMember.territory,
        quota: parseInt(newMember.quota),
        startDate: newMember.startDate,
        isActive: true
      };
      setSalesTeamMembers(prev => [...prev, member]);
      setNewMember({
        name: '',
        role: 'Sales Rep',
        baseSalary: '',
        commissionPlanId: '',
        territory: '',
        quota: '',
        startDate: 'Jan 2025'
      });
      setShowAddMemberModal(false);
    }
  };

  const handleAddPlan = () => {
    if (newPlan.name.trim()) {
      const plan: CommissionPlan = {
        id: Date.now().toString(),
        name: newPlan.name,
        type: newPlan.type,
        description: newPlan.description,
        structure: newPlan.type === 'flat_rate' 
          ? { flatRate: parseFloat(newPlan.flatRate) }
          : newPlan.type === 'tiered'
          ? { tiers: newPlan.tiers.map(t => ({ 
              minSales: parseInt(t.minSales), 
              maxSales: parseInt(t.maxSales), 
              rate: parseFloat(t.rate) 
            })) }
          : { 
              flatRate: parseFloat(newPlan.flatRate), 
              bonusTarget: parseInt(newPlan.bonusTarget), 
              bonusRate: parseFloat(newPlan.bonusRate) 
            },
        isActive: true
      };
      setCommissionPlans(prev => [...prev, plan]);
      setNewPlan({
        name: '',
        type: 'flat_rate',
        description: '',
        flatRate: '',
        tiers: [{ minSales: '', maxSales: '', rate: '' }],
        bonusTarget: '',
        bonusRate: ''
      });
      setShowAddPlanModal(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    setSalesTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleDeletePlan = (id: string) => {
    setCommissionPlans(prev => prev.filter(p => p.id !== id));
  };

  const addTier = () => {
    setNewPlan({
      ...newPlan,
      tiers: [...newPlan.tiers, { minSales: '', maxSales: '', rate: '' }]
    });
  };

  const removeTier = (index: number) => {
    setNewPlan({
      ...newPlan,
      tiers: newPlan.tiers.filter((_, i) => i !== index)
    });
  };

  const updateTier = (index: number, field: string, value: string) => {
    const updatedTiers = [...newPlan.tiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setNewPlan({ ...newPlan, tiers: updatedTiers });
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'flat_rate': return '#3AB7BF';
      case 'tiered': return '#4ADE80';
      case 'bonus': return '#F59E0B';
      case 'accelerator': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const formatPlanStructure = (plan: CommissionPlan) => {
    switch (plan.type) {
      case 'flat_rate':
        return `${plan.structure.flatRate}% flat rate`;
      case 'tiered':
        return `${plan.structure.tiers?.length || 0} tiers`;
      case 'bonus':
        return `${plan.structure.flatRate}% + bonus above $${plan.structure.bonusTarget?.toLocaleString()}`;
      case 'accelerator':
        return `${plan.structure.flatRate}% with ${plan.structure.acceleratorMultiplier}x accelerator`;
      default:
        return 'Custom structure';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Sales Commissions</h2>
          <p className="text-gray-600 mt-1">Manage sales team compensation and commission structures</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowProjectionModal(true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Projections
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowTargetModal(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            Sales Targets
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowAddMemberModal(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sales Rep
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sales Team Cost</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">${totalSalesTeamCost.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Monthly (base + commission)</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commission Expense</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">${totalMonthlyCommissions.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Projected monthly</p>
            </div>
            <Calculator className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Commission Rate</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">{averageCommissionRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 mt-1">Of sales revenue</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sales Team Size</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">{salesTeamMembers.filter(m => m.isActive).length}</p>
              <p className="text-sm text-gray-600 mt-1">Active members</p>
            </div>
            <Users className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>
      </div>

      {/* Sales Team Members */}
      <Card title="Sales Team Members">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">Manage sales team compensation and commission assignments</p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddMemberModal(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Base Salary</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Commission Plan</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Monthly Quota</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Territory</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salesTeamMembers.map(member => {
                const plan = commissionPlans.find(p => p.id === member.commissionPlanId);
                const monthlyProjection = commissionProjections.find(p => p.memberId === member.id && p.month === 'Jan 2025');
                
                return (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-[#1E2A38]">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{member.role}</td>
                    <td className="py-3 px-4 text-right font-medium text-[#1E2A38]">${member.baseSalary.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${getPlanTypeColor(plan?.type || '')}20`,
                          color: getPlanTypeColor(plan?.type || '')
                        }}
                      >
                        {plan?.name || 'No Plan'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-[#3AB7BF]">${member.quota.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-700">{member.territory || 'Unassigned'}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.isActive ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Edit3 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Commission Plans */}
      <Card title="Commission Plans">
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">Define and manage commission structures for different roles</p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddPlanModal(true)}
            className="bg-[#4ADE80] hover:bg-[#3BC66F] focus:ring-[#4ADE80]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Commission Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commissionPlans.map(plan => (
            <div key={plan.id} className="p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-4"
                    style={{ backgroundColor: getPlanTypeColor(plan.type) }}
                  />
                  <div>
                    <h3 className="font-semibold text-[#1E2A38] text-lg">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    plan.isActive ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium" style={{ color: getPlanTypeColor(plan.type) }}>
                    {plan.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Structure:</span>
                  <span className="font-semibold text-[#1E2A38]">{formatPlanStructure(plan)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="font-medium text-[#1E2A38]">
                    {salesTeamMembers.filter(m => m.commissionPlanId === plan.id).length} members
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Commission Impact on OpEx */}
      <Card title="Impact on Operating Expenses">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[#1E2A38]">Sales Team Cost Integration</h3>
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Sync with OpEx Runway
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-[#8B5CF6]/10 rounded-lg">
              <DollarSign className="w-8 h-8 text-[#8B5CF6] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1E2A38] mb-2">Base Salaries</h3>
              <p className="text-lg font-bold text-[#8B5CF6]">${totalBaseSalaries.toLocaleString()}/mo</p>
              <p className="text-sm text-gray-600">Fixed cost component</p>
            </div>
            
            <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
              <Calculator className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1E2A38] mb-2">Variable Commissions</h3>
              <p className="text-lg font-bold text-[#4ADE80]">${totalMonthlyCommissions.toLocaleString()}/mo</p>
              <p className="text-sm text-gray-600">Performance-based cost</p>
            </div>
            
            <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
              <TrendingUp className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
              <h3 className="font-semibold text-[#1E2A38] mb-2">Total Impact</h3>
              <p className="text-lg font-bold text-[#F59E0B]">${(totalSalesTeamCost * 12 / 1000000).toFixed(1)}M/yr</p>
              <p className="text-sm text-gray-600">Annual OpEx impact</p>
            </div>
          </div>
          
          <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
            <h4 className="font-medium text-[#1E2A38] mb-2">Integration Notes</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Sales team costs automatically factor into OpEx runway calculations</li>
              <li>• Commission projections scale with revenue growth assumptions</li>
              <li>• Variable commission costs provide natural expense scaling with performance</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 12-Month Commission Projection */}
      <Card title="12-Month Commission Projection">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Monthly Commission Expense Forecast</span>
            <span className="text-sm text-[#4ADE80] font-medium">Scales with revenue growth</span>
          </div>
          
          <div className="relative h-64">
            <div className="h-48 relative">
              {/* Commission expense line */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  points={months.map((month, index) => {
                    const monthlyCommissions = commissionProjections
                      .filter(p => p.month === month)
                      .reduce((sum, p) => sum + p.commissionAmount, 0);
                    const x = 30 + index * 60;
                    const y = 140 - (monthlyCommissions - totalMonthlyCommissions) / 2000;
                    return `${x},${Math.max(20, Math.min(140, y))}`;
                  }).join(' ')}
                />
                {/* Data points */}
                {months.map((month, index) => {
                  const monthlyCommissions = commissionProjections
                    .filter(p => p.month === month)
                    .reduce((sum, p) => sum + p.commissionAmount, 0);
                  const x = 30 + index * 60;
                  const y = 140 - (monthlyCommissions - totalMonthlyCommissions) / 2000;
                  return (
                    <circle 
                      key={index} 
                      cx={x} 
                      cy={Math.max(20, Math.min(140, y))} 
                      r="4" 
                      fill="#8B5CF6"
                      title={`Commission Expense: $${monthlyCommissions.toLocaleString()}`}
                    />
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index} className="flex-1 text-center">{month}</span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#8B5CF6]">${totalMonthlyCommissions.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Current Month</p>
              <p className="text-xs text-[#4ADE80]">Commission Expense</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#4ADE80]">${(totalMonthlyCommissions * 12 / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500">Annual Projection</p>
              <p className="text-xs text-[#4ADE80]">Total Commission Cost</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#F59E0B]">{averageCommissionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Avg Rate</p>
              <p className="text-xs text-[#4ADE80]">Of sales revenue</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Team Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Sales Team Member</h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    placeholder="Full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  >
                    <option value="Sales Rep">Sales Rep</option>
                    <option value="Senior Sales Rep">Senior Sales Rep</option>
                    <option value="Account Manager">Account Manager</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="VP Sales">VP Sales</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary (Monthly)</label>
                  <input
                    type="number"
                    value={newMember.baseSalary}
                    onChange={(e) => setNewMember({...newMember, baseSalary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    placeholder="6000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Quota</label>
                  <input
                    type="number"
                    value={newMember.quota}
                    onChange={(e) => setNewMember({...newMember, quota: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    placeholder="50000"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Plan</label>
                  <select
                    value={newMember.commissionPlanId}
                    onChange={(e) => setNewMember({...newMember, commissionPlanId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  >
                    <option value="">Select a plan</option>
                    {commissionPlans.filter(p => p.isActive).map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Territory</label>
                  <input
                    type="text"
                    value={newMember.territory}
                    onChange={(e) => setNewMember({...newMember, territory: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    placeholder="e.g., West Coast, Enterprise"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!newMember.name.trim() || !newMember.baseSalary || !newMember.commissionPlanId}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Commission Plan Modal */}
      {showAddPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[700px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Commission Plan</h3>
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                  placeholder="e.g., Senior Sales Rep Plan"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of the commission structure"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan({...newPlan, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                >
                  <option value="flat_rate">Flat Rate</option>
                  <option value="tiered">Tiered</option>
                  <option value="bonus">Bonus</option>
                  <option value="accelerator">Accelerator</option>
                </select>
              </div>

              {/* Conditional fields based on plan type */}
              {newPlan.type === 'flat_rate' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPlan.flatRate}
                    onChange={(e) => setNewPlan({...newPlan, flatRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                    placeholder="5.0"
                  />
                </div>
              )}

              {newPlan.type === 'tiered' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Commission Tiers</label>
                    <Button variant="outline" size="sm" onClick={addTier}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Tier
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {newPlan.tiers.map((tier, index) => (
                      <div key={index} className="grid grid-cols-4 gap-3 items-end">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Min Sales ($)</label>
                          <input
                            type="number"
                            value={tier.minSales}
                            onChange={(e) => updateTier(index, 'minSales', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Max Sales ($)</label>
                          <input
                            type="number"
                            value={tier.maxSales}
                            onChange={(e) => updateTier(index, 'maxSales', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                            placeholder="25000"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Rate (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={tier.rate}
                            onChange={(e) => updateTier(index, 'rate', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                            placeholder="3.0"
                          />
                        </div>
                        <div>
                          <button
                            onClick={() => removeTier(index)}
                            className="p-1 hover:bg-red-100 rounded text-red-500"
                            disabled={newPlan.tiers.length === 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {newPlan.type === 'bonus' && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlan.flatRate}
                      onChange={(e) => setNewPlan({...newPlan, flatRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                      placeholder="2.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Target ($)</label>
                    <input
                      type="number"
                      value={newPlan.bonusTarget}
                      onChange={(e) => setNewPlan({...newPlan, bonusTarget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                      placeholder="80000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPlan.bonusRate}
                      onChange={(e) => setNewPlan({...newPlan, bonusRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent"
                      placeholder="3.0"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddPlanModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlan}
                disabled={!newPlan.name.trim()}
                className="px-4 py-2 bg-[#4ADE80] text-white rounded-lg hover:bg-[#3BC66F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Projections Modal */}
      {showProjectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[900px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Commission Projections</h3>
              <button
                onClick={() => setShowProjectionModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Projected Sales</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Comp</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Commission %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionProjections.filter(p => p.month === 'Jan 2025').map(projection => (
                      <tr key={projection.memberId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-[#1E2A38]">{projection.memberName}</td>
                        <td className="py-3 px-4 text-right font-medium text-[#3AB7BF]">
                          ${projection.projectedSales.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#4ADE80]">
                          ${projection.commissionAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#8B5CF6]">
                          ${projection.totalCompensation.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-[#F59E0B]">
                          {((projection.commissionAmount / projection.projectedSales) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#3AB7BF]">
                    ${commissionProjections.filter(p => p.month === 'Jan 2025').reduce((sum, p) => sum + p.projectedSales, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Projected Sales</p>
                </div>
                <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#4ADE80]">
                    ${commissionProjections.filter(p => p.month === 'Jan 2025').reduce((sum, p) => sum + p.commissionAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Commissions</p>
                </div>
                <div className="p-4 bg-[#8B5CF6]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#8B5CF6]">
                    ${commissionProjections.filter(p => p.month === 'Jan 2025').reduce((sum, p) => sum + p.totalCompensation, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Compensation</p>
                </div>
                <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
                  <p className="text-lg font-bold text-[#F59E0B]">{averageCommissionRate.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">Avg Commission Rate</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Export Projections
              </Button>
              <button
                onClick={() => setShowProjectionModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Targets Modal */}
      {showTargetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Sales Targets</h3>
              <button
                onClick={() => setShowTargetModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {salesTargets.map(target => (
                <div key={target.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#1E2A38]">{target.name}</h4>
                    <span className="text-lg font-bold text-[#3AB7BF]">
                      ${target.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Timeframe</p>
                      <p className="font-medium text-[#1E2A38]">{target.timeframe}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Period</p>
                      <p className="font-medium text-[#1E2A38]">{target.startDate} - {target.endDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Assigned To</p>
                      <p className="font-medium text-[#1E2A38]">{target.assignedTo.length} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Target
              </Button>
              <button
                onClick={() => setShowTargetModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commissions;