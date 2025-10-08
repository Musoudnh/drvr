import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, TrendingDown, DollarSign, Users, Calendar, Plus, CreditCard as Edit3, Copy, Lock, Unlock, Archive, Download, Share2, Save, RotateCcw, RotateCw, Settings, MessageSquare, FileText, AlertTriangle, CheckCircle, Clock, BarChart3, LineChart, PieChart, Zap, X, ChevronDown, ChevronRight, Filter, Search, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown, Percent, Hash, Building2, UserPlus, Layers, TrendingUp as TrendIcon, Send, AtSign, Paperclip, MoreHorizontal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { AddRoleModal } from '../../components/Hiring/AddRoleModal';
import { HiringRole } from '../../types/hiring';
import { supabase } from '../../lib/supabase';

interface Scenario {
  id: string;
  name: string;
  description: string;
  startMonth: string;
  horizonMonths: number;
  locked: boolean;
  status: 'draft' | 'pending' | 'approved' | 'archived';
  createdBy: string;
  createdAt: Date;
  lastModified: Date;
  color: string;
}

interface Driver {
  id: string;
  name: string;
  type: 'REVENUE_GROWTH' | 'PRICE_CHANGE' | 'HEADCOUNT_ADD' | 'HEADCOUNT_CUT' | 'OPEX_CHANGE' | 'CAC_CHANGE' | 'CHURN_DELTA' | 'ONE_TIME_COST' | 'CAPEX';
  scope: 'global' | 'scenario';
  scenarioId?: string;
  startMonth: string;
  endMonth: string;
  magnitude: number;
  department?: string;
  category?: string;
  priority: number;
  enabled: boolean;
  color: string;
  notes: string;
  impact: number; // Percentage impact on runway
  shape: 'step' | 'linear' | 'curve';
}

interface HiringPlanItem {
  id: string;
  role: string;
  department: string;
  level: string;
  startMonth: string;
  endMonth: string;
  fte: number;
  baseSalary: number;
  bonusPercent: number;
  benefitsPercent: number;
  location: string;
  backfill: boolean;
  color: string;
}

interface Comment {
  id: string;
  entityId: string;
  entityType: 'driver' | 'scenario' | 'hire';
  author: string;
  content: string;
  mentions: string[];
  timestamp: Date;
  attachments: string[];
}

interface AuditEntry {
  id: string;
  entityId: string;
  entityType: 'driver' | 'scenario' | 'hire';
  action: string;
  user: string;
  timestamp: Date;
  beforeValue: any;
  afterValue: any;
  field: string;
}

interface ForecastData {
  months: string[];
  scenarios: {
    [scenarioId: string]: {
      cashEom: number[];
      revenue: number[];
      cogs: number[];
      opex: number[];
      netIncome: number[];
      headcount: number[];
      mrr: number[];
      burn: number[];
      runway: number[];
    };
  };
}

const RunwayPlanning: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState('base');
  const [compareScenarios, setCompareScenarios] = useState<string[]>([]);
  const [showDriverDrawer, setShowDriverDrawer] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<{ type: 'driver' | 'scenario' | 'hire'; id: string } | null>(null);
  const [showHiringGantt, setShowHiringGantt] = useState(true);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'properties' | 'comments' | 'audit'>('properties');
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [draggedDriver, setDraggedDriver] = useState<string | null>(null);
  const [editingPoint, setEditingPoint] = useState<{ scenarioId: string; month: number; metric: string; value: number } | null>(null);

  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 'base',
      name: 'Base Case',
      description: 'Conservative growth assumptions',
      startMonth: '2025-01',
      horizonMonths: 36,
      locked: false,
      status: 'approved',
      createdBy: 'Sarah Johnson',
      createdAt: new Date('2025-01-01'),
      lastModified: new Date('2025-01-15'),
      color: '#6B7280'
    },
    {
      id: 'best',
      name: 'Best Case',
      description: 'Optimistic growth with market expansion',
      startMonth: '2025-01',
      horizonMonths: 36,
      locked: false,
      status: 'draft',
      createdBy: 'Michael Chen',
      createdAt: new Date('2025-01-10'),
      lastModified: new Date('2025-01-15'),
      color: '#10B981'
    },
    {
      id: 'worst',
      name: 'Worst Case',
      description: 'Conservative assumptions with market downturn',
      startMonth: '2025-01',
      horizonMonths: 36,
      locked: false,
      status: 'pending',
      createdBy: 'Emily Rodriguez',
      createdAt: new Date('2025-01-12'),
      lastModified: new Date('2025-01-15'),
      color: '#F59E0B'
    }
  ]);

  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 'd1',
      name: '+2 Sales Hires/Month',
      type: 'HEADCOUNT_ADD',
      scope: 'scenario',
      scenarioId: 'base',
      startMonth: '2025-03',
      endMonth: '2025-12',
      magnitude: 2,
      department: 'Sales',
      priority: 1,
      enabled: true,
      color: '#4F46E5',
      notes: 'Aggressive sales team expansion to capture market opportunity',
      impact: 15.2,
      shape: 'linear'
    },
    {
      id: 'd2',
      name: 'Price Increase +5%',
      type: 'PRICE_CHANGE',
      scope: 'global',
      startMonth: '2025-06',
      endMonth: '2025-06',
      magnitude: 0.05,
      priority: 2,
      enabled: true,
      color: '#10B981',
      notes: 'Annual price adjustment based on market analysis',
      impact: 8.7,
      shape: 'step'
    },
    {
      id: 'd3',
      name: 'Reduce CAC by 10%',
      type: 'CAC_CHANGE',
      scope: 'scenario',
      scenarioId: 'best',
      startMonth: '2025-04',
      endMonth: '2025-12',
      magnitude: -0.10,
      priority: 3,
      enabled: true,
      color: '#F59E0B',
      notes: 'Improved marketing efficiency and conversion optimization',
      impact: 12.3,
      shape: 'linear'
    },
    {
      id: 'd4',
      name: 'Office Expansion',
      type: 'ONE_TIME_COST',
      scope: 'scenario',
      scenarioId: 'base',
      startMonth: '2025-08',
      endMonth: '2025-08',
      magnitude: 150000,
      category: 'Facilities',
      priority: 4,
      enabled: true,
      color: '#8B5CF6',
      notes: 'New office setup and equipment for expanded team',
      impact: -3.2,
      shape: 'step'
    }
  ]);

  const [hiringPlan, setHiringPlan] = useState<HiringPlanItem[]>([
    {
      id: 'h1',
      role: 'Account Executive',
      department: 'Sales',
      level: 'Mid',
      startMonth: '2025-03',
      endMonth: '2025-12',
      fte: 2,
      baseSalary: 95000,
      bonusPercent: 0.10,
      benefitsPercent: 0.18,
      location: 'US-Remote',
      backfill: false,
      color: '#4F46E5'
    },
    {
      id: 'h2',
      role: 'Product Manager',
      department: 'Product',
      level: 'Senior',
      startMonth: '2025-04',
      endMonth: '2025-12',
      fte: 1,
      baseSalary: 135000,
      bonusPercent: 0.15,
      benefitsPercent: 0.20,
      location: 'US-SF',
      backfill: false,
      color: '#10B981'
    },
    {
      id: 'h3',
      role: 'Software Engineer',
      department: 'Engineering',
      level: 'Mid',
      startMonth: '2025-05',
      endMonth: '2025-12',
      fte: 3,
      baseSalary: 125000,
      bonusPercent: 0.12,
      benefitsPercent: 0.18,
      location: 'US-Remote',
      backfill: false,
      color: '#F59E0B'
    }
  ]);

  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<HiringRole | null>(null);
  const [comprehensiveRoles, setComprehensiveRoles] = useState<HiringRole[]>([]);

  useEffect(() => {
    loadComprehensiveRoles();
  }, []);

  const loadComprehensiveRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('hiring_roles')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;
      setComprehensiveRoles(data || []);
    } catch (error) {
      console.error('Error loading comprehensive roles:', error);
    }
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      entityId: 'd1',
      entityType: 'driver',
      author: 'Sarah Johnson',
      content: 'This hiring plan looks aggressive but achievable given our current pipeline.',
      mentions: [],
      timestamp: new Date('2025-01-15T10:30:00'),
      attachments: []
    }
  ]);

  const [auditLog, setAuditLog] = useState<AuditEntry[]>([
    {
      id: 'a1',
      entityId: 'd1',
      entityType: 'driver',
      action: 'Updated magnitude',
      user: 'Sarah Johnson',
      timestamp: new Date('2025-01-15T14:30:00'),
      beforeValue: 1,
      afterValue: 2,
      field: 'magnitude'
    },
    {
      id: 'a2',
      entityId: 'base',
      entityType: 'scenario',
      action: 'Created scenario',
      user: 'Michael Chen',
      timestamp: new Date('2025-01-10T09:15:00'),
      beforeValue: null,
      afterValue: 'Base Case',
      field: 'name'
    }
  ]);

  const [forecastData] = useState<ForecastData>({
    months: ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12'],
    scenarios: {
      base: {
        cashEom: [485200, 456800, 428400, 399200, 371800, 345600, 320400, 296800, 274200, 252600, 232000, 212400],
        revenue: [847500, 865200, 883100, 901200, 919500, 938000, 956700, 975600, 994700, 1014000, 1033500, 1053200],
        cogs: [254250, 259560, 264930, 270360, 275850, 281400, 287010, 292680, 298410, 304200, 310050, 315960],
        opex: [623200, 635600, 648200, 661000, 674000, 687200, 700600, 714200, 728000, 742000, 756200, 770600],
        netIncome: [-29950, -29960, -29030, -30160, -30350, -30600, -30910, -31280, -31710, -32200, -32750, -33360],
        headcount: [22, 22, 24, 25, 28, 28, 28, 28, 28, 28, 28, 28],
        mrr: [120000, 123600, 127300, 131100, 135000, 139000, 143100, 147300, 151600, 156000, 160500, 165100],
        burn: [28400, 28000, 27600, 27200, 26800, 26400, 26000, 25600, 25200, 24800, 24400, 24000],
        runway: [17.1, 16.3, 15.5, 14.7, 13.9, 13.1, 12.3, 11.6, 10.9, 10.2, 9.5, 8.9]
      },
      best: {
        cashEom: [485200, 468400, 452800, 438400, 425200, 413200, 402400, 392800, 384400, 377200, 371200, 366400],
        revenue: [847500, 890300, 934600, 980400, 1027700, 1076500, 1126800, 1178600, 1231900, 1286700, 1343000, 1400800],
        cogs: [254250, 267090, 280380, 294120, 308310, 322950, 338040, 353580, 369570, 386010, 402900, 420240],
        opex: [623200, 635600, 648200, 661000, 674000, 687200, 700600, 714200, 728000, 742000, 756200, 770600],
        netIncome: [-29950, -12390, 6020, 25280, 45390, 66350, 88160, 110820, 134330, 158690, 183900, 209960],
        headcount: [22, 22, 24, 25, 28, 30, 32, 34, 36, 38, 40, 42],
        mrr: [120000, 126000, 132300, 138900, 145800, 153000, 160500, 168300, 176400, 184800, 193500, 202500],
        burn: [28400, 16800, 5200, -6400, -18000, -29600, -41200, -52800, -64400, -76000, -87600, -99200],
        runway: [17.1, 27.9, 87.1, -62.4, -20.7, -13.9, -9.8, -7.5, -6.1, -5.1, -4.4, -3.8]
      },
      worst: {
        cashEom: [485200, 445600, 405200, 363800, 321400, 278000, 233600, 188200, 141800, 94400, 46000, -3400],
        revenue: [847500, 822400, 798100, 774600, 751900, 730000, 708900, 688600, 669100, 650400, 632500, 615400],
        cogs: [254250, 246720, 239430, 232380, 225570, 219000, 212670, 206580, 200730, 195120, 189750, 184620],
        opex: [623200, 635600, 648200, 661000, 674000, 687200, 700600, 714200, 728000, 742000, 756200, 770600],
        netIncome: [-29950, -59920, -89530, -118780, -147670, -176200, -204370, -232180, -259630, -286720, -313450, -339820],
        headcount: [22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11],
        mrr: [120000, 116400, 112900, 109500, 106200, 103000, 99900, 96900, 94000, 91200, 88500, 85900],
        burn: [39600, 39600, 39600, 39600, 39600, 39600, 39600, 39600, 39600, 39600, 39600, 39600],
        runway: [12.3, 11.3, 10.2, 9.2, 8.1, 7.0, 5.9, 4.8, 3.6, 2.4, 1.2, -0.1]
      }
    }
  });

  const formatCurrency = (amount: number) => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const formatMonths = (months: number) => {
    if (months < 0) return 'Infinite';
    if (months > 100) return 'Infinite';
    return `${months.toFixed(1)} months`;
  };

  const getDriverTypeLabel = (type: string) => {
    switch (type) {
      case 'REVENUE_GROWTH': return 'Revenue Growth';
      case 'PRICE_CHANGE': return 'Price Change';
      case 'HEADCOUNT_ADD': return 'Hiring';
      case 'HEADCOUNT_CUT': return 'Layoffs';
      case 'OPEX_CHANGE': return 'OpEx Change';
      case 'CAC_CHANGE': return 'CAC Change';
      case 'CHURN_DELTA': return 'Churn Change';
      case 'ONE_TIME_COST': return 'One-time Cost';
      case 'CAPEX': return 'CapEx';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Sales': return '#4F46E5';
      case 'Engineering': return '#10B981';
      case 'Product': return '#F59E0B';
      case 'Marketing': return '#EF4444';
      case 'Operations': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenario);
  const currentData = forecastData.scenarios[selectedScenario];
  const currentMonth = forecastData.months[0];
  const currentCash = currentData?.cashEom[0] || 0;
  const currentBurn = currentData?.burn[0] || 0;
  const currentRunway = currentData?.runway[0] || 0;

  const toggleDriver = (driverId: string) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, enabled: !driver.enabled }
        : driver
    ));
  };

  const toggleScenarioCompare = (scenarioId: string) => {
    setCompareScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : prev.length < 3 ? [...prev, scenarioId] : prev
    );
  };

  const handleDragStart = (e: React.DragEvent, driverId: string) => {
    setDraggedDriver(driverId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDriverId: string) => {
    e.preventDefault();
    if (!draggedDriver || draggedDriver === targetDriverId) return;

    const draggedIndex = drivers.findIndex(d => d.id === draggedDriver);
    const targetIndex = drivers.findIndex(d => d.id === targetDriverId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newDrivers = [...drivers];
    const [draggedItem] = newDrivers.splice(draggedIndex, 1);
    newDrivers.splice(targetIndex, 0, draggedItem);
    
    // Update priorities
    newDrivers.forEach((driver, index) => {
      driver.priority = index + 1;
    });
    
    setDrivers(newDrivers);
    setDraggedDriver(null);
  };

  const handleChartPointEdit = (scenarioId: string, monthIndex: number, metric: string, newValue: number) => {
    setEditingPoint({ scenarioId, month: monthIndex, metric, value: newValue });
  };

  const confirmChartEdit = () => {
    if (!editingPoint) return;
    
    // Create a one-time adjustment driver
    const newDriver: Driver = {
      id: `adj_${Date.now()}`,
      name: `One-time Adjustment - ${editingPoint.metric}`,
      type: 'ONE_TIME_COST',
      scope: 'scenario',
      scenarioId: editingPoint.scenarioId,
      startMonth: forecastData.months[editingPoint.month],
      endMonth: forecastData.months[editingPoint.month],
      magnitude: editingPoint.value,
      priority: drivers.length + 1,
      enabled: true,
      color: '#8B5CF6',
      notes: 'Manual adjustment from chart editing',
      impact: 0,
      shape: 'step'
    };
    
    setDrivers(prev => [...prev, newDriver]);
    setEditingPoint(null);
  };

  const addComment = () => {
    if (!newComment.trim() || !selectedEntity) return;
    
    const comment: Comment = {
      id: `c_${Date.now()}`,
      entityId: selectedEntity.id,
      entityType: selectedEntity.type,
      author: 'Current User',
      content: newComment,
      mentions: [],
      timestamp: new Date(),
      attachments: []
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  const getEntityComments = () => {
    if (!selectedEntity) return [];
    return comments.filter(c => c.entityId === selectedEntity.id && c.entityType === selectedEntity.type);
  };

  const getEntityAuditLog = () => {
    if (!selectedEntity) return [];
    return auditLog.filter(a => a.entityId === selectedEntity.id && a.entityType === selectedEntity.type);
  };

  const exportBoardPack = () => {
    // Simulate board pack generation
    console.log('Generating board pack with scenarios:', [selectedScenario, ...compareScenarios]);
    alert('Board pack exported successfully! (This would generate a PDF with cover, KPIs, charts, and scenario comparison)');
    setShowExportModal(false);
  };

  const duplicateScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    const newScenario: Scenario = {
      ...scenario,
      id: `${scenarioId}_copy_${Date.now()}`,
      name: `${scenario.name} (Copy)`,
      status: 'draft',
      createdAt: new Date(),
      lastModified: new Date()
    };
    
    setScenarios(prev => [...prev, newScenario]);
  };

  const lockScenario = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, locked: !s.locked } : s
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Current Staff Management */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Card title="Current Staff">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">Manage your current team members</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddRoleModal(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>

              {/* Staff Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Level</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Salary</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Start Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiringPlan.map(employee => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                              style={{ backgroundColor: getDepartmentColor(employee.department) + '20' }}
                            >
                              <span className="text-xs font-medium" style={{ color: getDepartmentColor(employee.department) }}>
                                {employee.role.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{employee.role}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{employee.role}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{
                            backgroundColor: getDepartmentColor(employee.department) + '20',
                            color: getDepartmentColor(employee.department)
                          }}>
                            {employee.department}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{employee.level}</td>
                        <td className="py-3 px-4 text-right font-medium text-gray-900">
                          {formatCurrency(employee.baseSalary)}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{employee.startMonth}</td>
                        <td className="py-3 px-4 text-gray-700">{employee.location}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingRole(employee as any);
                              setShowAddRoleModal(true);
                            }}
                            className="text-[#101010] hover:text-gray-600 text-xs font-medium"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {hiringPlan.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No employees added yet</p>
                    <p className="text-sm text-gray-400 mb-4">Add your current team members to get started</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setShowAddRoleModal(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Employee
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {/* Comprehensive Add Role Modal */}
      <AddRoleModal
        isOpen={showAddRoleModal}
        onClose={() => {
          setShowAddRoleModal(false);
          setEditingRole(null);
        }}
        onRoleAdded={loadComprehensiveRoles}
        editRole={editingRole}
      />
    </div>
  );
};



export default RunwayPlanning