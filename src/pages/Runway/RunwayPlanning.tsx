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
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Target className="w-6 h-6 text-[#4F46E5] mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Runway Planning</h1>
            </div>
            
            {/* Scenario Switcher */}
            <div className="relative">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
              >
                {scenarios.map(scenario => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Scenario Status & Actions */}
            {currentScenario && (
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentScenario.status)}`}>
                  {currentScenario.status}
                </span>
                {currentScenario.locked && (
                  <Lock className="w-4 h-4 text-gray-400" title="Scenario is locked" />
                )}
                <button
                  onClick={() => duplicateScenario(selectedScenario)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Duplicate scenario"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => lockScenario(selectedScenario)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title={currentScenario.locked ? "Unlock scenario" : "Lock scenario"}
                >
                  {currentScenario.locked ? <Unlock className="w-4 h-4 text-gray-400" /> : <Lock className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            )}

            {/* Compare Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Compare:</span>
              {scenarios.filter(s => s.id !== selectedScenario).map(scenario => (
                <label key={scenario.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={compareScenarios.includes(scenario.id)}
                    onChange={() => toggleScenarioCompare(scenario.id)}
                    className="w-4 h-4 text-[#4F46E5] border-gray-300 rounded focus:ring-[#4F46E5] mr-2"
                  />
                  <span className="text-sm text-gray-700">{scenario.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="outline" size="sm">
              <RotateCw className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="primary" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Driver Cards Rail */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Active Drivers</h2>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={() => setShowScenarioModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Scenario
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Driver
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {drivers
                .filter(driver => driver.scope === 'global' || driver.scenarioId === selectedScenario)
                .sort((a, b) => a.priority - b.priority)
                .map(driver => (
                <div
                  key={driver.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, driver.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, driver.id)}
                  className={`flex-shrink-0 w-72 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    driver.enabled 
                      ? 'border-[#4F46E5] bg-[#4F46E5]/5 shadow-md' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedDriver(driver);
                    setSelectedEntity({ type: 'driver', id: driver.id });
                    setShowDriverDrawer(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        driver.scope === 'global' ? 'bg-purple-100 text-purple-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {getDriverTypeLabel(driver.type)}
                      </span>
                      {driver.scope === 'global' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Global
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDriver(driver.id);
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        driver.enabled 
                          ? 'border-[#4F46E5] bg-[#4F46E5]' 
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {driver.enabled && <CheckCircle className="w-3 h-3 text-white" />}
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">{driver.name}</h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">
                      {driver.startMonth} → {driver.endMonth}
                    </span>
                    <span className={`text-xs font-medium ${
                      driver.impact >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {driver.impact >= 0 ? '+' : ''}{driver.impact.toFixed(1)}% runway
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      {driver.type.includes('PERCENT') || driver.type.includes('CHANGE') 
                        ? `${(driver.magnitude * 100).toFixed(1)}%`
                        : driver.type === 'HEADCOUNT_ADD' || driver.type === 'HEADCOUNT_CUT'
                        ? `${driver.magnitude} ${driver.magnitude === 1 ? 'person' : 'people'}`
                        : formatCurrency(driver.magnitude)
                      }
                    </span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: driver.color }}
                    />
                  </div>
                  
                  {driver.department && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">{driver.department}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Forecast Charts */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Cash Runway Chart */}
              <Card title="Cash Runway">
                <div className="h-64 relative">
                  <svg className="w-full h-full">
                    {/* Cash line for selected scenario */}
                    <polyline
                      fill="none"
                      stroke={currentScenario?.color || '#6B7280'}
                      strokeWidth="3"
                      points={currentData?.cashEom.map((cash, index) => 
                        `${(index / (forecastData.months.length - 1)) * 100}%,${100 - (Math.max(0, cash) / Math.max(...currentData.cashEom)) * 80}%`
                      ).join(' ')}
                    />
                    
                    {/* Comparison scenarios */}
                    {compareScenarios.map(scenarioId => {
                      const compareData = forecastData.scenarios[scenarioId];
                      const compareScenario = scenarios.find(s => s.id === scenarioId);
                      return (
                        <polyline
                          key={scenarioId}
                          fill="none"
                          stroke={compareScenario?.color || '#8B5CF6'}
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          points={compareData?.cashEom.map((cash, index) => 
                            `${(index / (forecastData.months.length - 1)) * 100}%,${100 - (Math.max(0, cash) / Math.max(...currentData.cashEom)) * 80}%`
                          ).join(' ')}
                        />
                      );
                    })}
                    
                    {/* Zero line */}
                    <line
                      x1="0%"
                      y1="100%"
                      x2="100%"
                      y2="100%"
                      stroke="#EF4444"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      opacity="0.5"
                    />
                  </svg>
                  
                  {/* Interactive points for editing */}
                  {currentData?.cashEom.map((cash, index) => (
                    <button
                      key={index}
                      className="absolute w-3 h-3 bg-white border-2 rounded-full hover:scale-125 transition-transform"
                      style={{
                        left: `${(index / (forecastData.months.length - 1)) * 100}%`,
                        top: `${100 - (Math.max(0, cash) / Math.max(...currentData.cashEom)) * 80}%`,
                        borderColor: currentScenario?.color || '#6B7280',
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => handleChartPointEdit(selectedScenario, index, 'cashEom', cash)}
                      title={`${forecastData.months[index]}: ${formatCurrency(cash)}`}
                    />
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Cash</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(currentCash)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Runway</p>
                    <p className="text-lg font-bold text-gray-900">{formatMonths(currentRunway)}</p>
                  </div>
                </div>
              </Card>

              {/* Revenue Forecast */}
              <Card title="Revenue Forecast">
                <div className="h-64 relative">
                  <svg className="w-full h-full">
                    {/* Revenue area for selected scenario */}
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={currentScenario?.color || '#6B7280'} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={currentScenario?.color || '#6B7280'} stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    <polygon
                      fill="url(#revenueGradient)"
                      stroke={currentScenario?.color || '#6B7280'}
                      strokeWidth="2"
                      points={`0,100% ${currentData?.revenue.map((rev, index) => 
                        `${(index / (forecastData.months.length - 1)) * 100}%,${100 - (rev / Math.max(...currentData.revenue)) * 80}%`
                      ).join(' ')} 100%,100%`}
                    />
                    
                    {/* Comparison scenarios */}
                    {compareScenarios.map(scenarioId => {
                      const compareData = forecastData.scenarios[scenarioId];
                      const compareScenario = scenarios.find(s => s.id === scenarioId);
                      return (
                        <polyline
                          key={scenarioId}
                          fill="none"
                          stroke={compareScenario?.color || '#8B5CF6'}
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          points={compareData?.revenue.map((rev, index) => 
                            `${(index / (forecastData.months.length - 1)) * 100}%,${100 - (rev / Math.max(...currentData.revenue)) * 80}%`
                          ).join(' ')}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Interactive points */}
                  {currentData?.revenue.map((rev, index) => (
                    <button
                      key={index}
                      className="absolute w-3 h-3 bg-white border-2 rounded-full hover:scale-125 transition-transform"
                      style={{
                        left: `${(index / (forecastData.months.length - 1)) * 100}%`,
                        top: `${100 - (rev / Math.max(...currentData.revenue)) * 80}%`,
                        borderColor: currentScenario?.color || '#6B7280',
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => handleChartPointEdit(selectedScenario, index, 'revenue', rev)}
                      title={`${forecastData.months[index]}: ${formatCurrency(rev)}`}
                    />
                  ))}
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current MRR</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(currentData?.mrr[0] || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className="text-lg font-bold text-gray-900">+12.5%</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* KPI Strip */}
            <Card title="Key Metrics">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Monthly Burn</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(Math.abs(currentBurn))}</p>
                  {compareScenarios.length > 0 && (
                    <p className="text-xs text-green-600">vs +15% best</p>
                  )}
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Runway</p>
                  <p className="text-lg font-bold text-gray-900">{formatMonths(currentRunway)}</p>
                  {compareScenarios.length > 0 && (
                    <p className="text-xs text-green-600">vs +28% best</p>
                  )}
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Cash EOM</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(currentCash)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">MRR</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(currentData?.mrr[0] || 0)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Net Income</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(currentData?.netIncome[0] || 0)}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Headcount</p>
                  <p className="text-lg font-bold text-gray-900">{currentData?.headcount[0] || 0}</p>
                </div>
              </div>
            </Card>

            {/* Scenario Comparison Table */}
            {compareScenarios.length > 0 && (
              <Card title="Scenario Comparison" className="mt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Metric</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">
                          <div className="flex items-center justify-end">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: currentScenario?.color }} />
                            {currentScenario?.name}
                          </div>
                        </th>
                        {compareScenarios.map(scenarioId => {
                          const scenario = scenarios.find(s => s.id === scenarioId);
                          return (
                            <th key={scenarioId} className="text-right py-3 px-4 font-medium text-gray-700">
                              <div className="flex items-center justify-end">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: scenario?.color }} />
                                {scenario?.name}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Cash EOM (12M)', key: 'cashEom', index: 11 },
                        { label: 'Revenue (12M)', key: 'revenue', index: 11 },
                        { label: 'Runway (months)', key: 'runway', index: 0 },
                        { label: 'Monthly Burn', key: 'burn', index: 0 },
                        { label: 'Headcount (12M)', key: 'headcount', index: 11 }
                      ].map(metric => (
                        <tr key={metric.label} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-700">{metric.label}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            {metric.key === 'runway' 
                              ? formatMonths(forecastData.scenarios[selectedScenario][metric.key as keyof typeof forecastData.scenarios.base][metric.index] as number)
                              : formatCurrency(forecastData.scenarios[selectedScenario][metric.key as keyof typeof forecastData.scenarios.base][metric.index] as number)
                            }
                          </td>
                          {compareScenarios.map(scenarioId => {
                            const baseValue = forecastData.scenarios[selectedScenario][metric.key as keyof typeof forecastData.scenarios.base][metric.index] as number;
                            const compareValue = forecastData.scenarios[scenarioId][metric.key as keyof typeof forecastData.scenarios.base][metric.index] as number;
                            const delta = baseValue !== 0 ? ((compareValue - baseValue) / Math.abs(baseValue)) * 100 : 0;
                            
                            return (
                              <td key={scenarioId} className="py-3 px-4 text-right">
                                <div className="flex flex-col items-end">
                                  <span className="font-medium text-gray-900">
                                    {metric.key === 'runway' 
                                      ? formatMonths(compareValue)
                                      : formatCurrency(compareValue)
                                    }
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    delta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {delta >= 0 ? '+' : ''}{delta.toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Hiring Plan with Gantt */}
            <Card title="Hiring Plan" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="font-semibold text-gray-900">Team Expansion Timeline</h3>
                  <button
                    onClick={() => setShowHiringGantt(!showHiringGantt)}
                    className="text-sm text-[#4F46E5] hover:underline"
                  >
                    {showHiringGantt ? 'Hide' : 'Show'} Gantt View
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddRoleModal(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>

              {/* Hiring Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Role</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Department</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Level</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-700">Start</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-700">FTE</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-700">Base Salary</th>
                      <th className="text-right py-2 px-3 font-medium text-gray-700">Fully Loaded</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hiringPlan.map(hire => {
                      const fullyLoaded = hire.baseSalary * hire.fte * (1 + hire.bonusPercent + hire.benefitsPercent);
                      return (
                        <tr 
                          key={hire.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedEntity({ type: 'hire', id: hire.id });
                            setShowDriverDrawer(true);
                          }}
                        >
                          <td className="py-3 px-3 font-medium text-gray-900">{hire.role}</td>
                          <td className="py-3 px-3">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: getDepartmentColor(hire.department) }}
                              />
                              {hire.department}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-700">{hire.level}</td>
                          <td className="py-3 px-3 text-center text-gray-700">{hire.startMonth}</td>
                          <td className="py-3 px-3 text-center text-gray-700">{hire.fte}</td>
                          <td className="py-3 px-3 text-right font-medium text-gray-900">{formatCurrency(hire.baseSalary)}</td>
                          <td className="py-3 px-3 text-right font-medium text-gray-900">{formatCurrency(fullyLoaded)}</td>
                          <td className="py-3 px-3 text-gray-700">{hire.location}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Gantt Chart */}
              {showHiringGantt && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-4">Hiring Timeline</h4>
                  <div className="space-y-3">
                    {/* Month headers */}
                    <div className="flex items-center">
                      <div className="w-48 text-sm font-medium text-gray-700">Role</div>
                      <div className="flex-1 grid grid-cols-12 gap-1">
                        {forecastData.months.map(month => (
                          <div key={month} className="text-xs text-gray-500 text-center">
                            {month.split('-')[1]}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Hiring rows */}
                    {hiringPlan.map(hire => {
                      const startIndex = forecastData.months.indexOf(hire.startMonth);
                      const endIndex = forecastData.months.indexOf(hire.endMonth);
                      
                      return (
                        <div key={hire.id} className="flex items-center group">
                          <div className="w-48 text-sm text-gray-900 pr-4">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: getDepartmentColor(hire.department) }}
                              />
                              {hire.role}
                            </div>
                            <div className="text-xs text-gray-500">{hire.fte} FTE</div>
                          </div>
                          <div className="flex-1 grid grid-cols-12 gap-1 relative">
                            {forecastData.months.map((month, index) => {
                              const isActive = index >= startIndex && index <= endIndex;
                              const isStart = index === startIndex;
                              const isEnd = index === endIndex;
                              
                              return (
                                <div
                                  key={month}
                                  className={`h-6 rounded-sm transition-all ${
                                    isActive 
                                      ? 'opacity-100' 
                                      : 'bg-gray-200 opacity-30'
                                  }`}
                                  style={{
                                    backgroundColor: isActive ? getDepartmentColor(hire.department) : undefined
                                  }}
                                  title={isActive ? `${hire.role} - ${formatCurrency(hire.baseSalary * hire.fte * (1 + hire.bonusPercent + hire.benefitsPercent) / 12)}/month` : ''}
                                >
                                  {isStart && (
                                    <div className="absolute -top-6 left-0 text-xs text-gray-600 whitespace-nowrap">
                                      Start: {hire.startMonth}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Department Legend */}
                  <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
                    {Array.from(new Set(hiringPlan.map(h => h.department))).map(dept => (
                      <div key={dept} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getDepartmentColor(dept) }}
                        />
                        <span className="text-xs text-gray-600">{dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Drawer */}
        {showDriverDrawer && selectedEntity && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedEntity.type === 'driver' ? 'Driver Properties' : 
                   selectedEntity.type === 'scenario' ? 'Scenario Properties' : 'Hire Properties'}
                </h3>
                <button
                  onClick={() => setShowDriverDrawer(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              <div className="flex space-x-1 mt-4">
                {(['properties', 'comments', 'audit'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 text-sm font-medium rounded ${
                      activeTab === tab
                        ? 'bg-[#4F46E5] text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'properties' && selectedDriver && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                    <input
                      type="text"
                      value={selectedDriver.name}
                      onChange={(e) => setSelectedDriver({...selectedDriver, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={selectedDriver.type}
                      onChange={(e) => setSelectedDriver({...selectedDriver, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    >
                      <option value="REVENUE_GROWTH">Revenue Growth</option>
                      <option value="PRICE_CHANGE">Price Change</option>
                      <option value="HEADCOUNT_ADD">Headcount Add</option>
                      <option value="HEADCOUNT_CUT">Headcount Cut</option>
                      <option value="OPEX_CHANGE">OpEx Change</option>
                      <option value="CAC_CHANGE">CAC Change</option>
                      <option value="CHURN_DELTA">Churn Delta</option>
                      <option value="ONE_TIME_COST">One-time Cost</option>
                      <option value="CAPEX">CapEx</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                      <select
                        value={selectedDriver.startMonth}
                        onChange={(e) => setSelectedDriver({...selectedDriver, startMonth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      >
                        {forecastData.months.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                      <select
                        value={selectedDriver.endMonth}
                        onChange={(e) => setSelectedDriver({...selectedDriver, endMonth: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      >
                        {forecastData.months.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Magnitude</label>
                    <input
                      type="number"
                      value={selectedDriver.magnitude}
                      onChange={(e) => setSelectedDriver({...selectedDriver, magnitude: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
                    <select
                      value={selectedDriver.shape}
                      onChange={(e) => setSelectedDriver({...selectedDriver, shape: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                    >
                      <option value="step">Step Function</option>
                      <option value="linear">Linear Ramp</option>
                      <option value="curve">S-Curve</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Scope</label>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={selectedDriver.scope === 'global'}
                          onChange={() => setSelectedDriver({...selectedDriver, scope: 'global'})}
                          className="w-4 h-4 text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] mr-2"
                        />
                        <span className="text-sm text-gray-700">Global</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={selectedDriver.scope === 'scenario'}
                          onChange={() => setSelectedDriver({...selectedDriver, scope: 'scenario'})}
                          className="w-4 h-4 text-[#4F46E5] border-gray-300 focus:ring-[#4F46E5] mr-2"
                        />
                        <span className="text-sm text-gray-700">Scenario-specific</span>
                      </label>
                    </div>
                  </div>
                  
                  {selectedDriver.department && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={selectedDriver.department}
                        onChange={(e) => setSelectedDriver({...selectedDriver, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={selectedDriver.notes}
                      onChange={(e) => setSelectedDriver({...selectedDriver, notes: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                      rows={3}
                      placeholder="Add notes about this driver..."
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Runway Impact</span>
                      <span className={`text-sm font-bold ${
                        selectedDriver.impact >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedDriver.impact >= 0 ? '+' : ''}{selectedDriver.impact.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {/* Comments List */}
                  <div className="space-y-3">
                    {getEntityComments().map(comment => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-[#4F46E5] rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs text-white font-medium">
                                {comment.author.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {comment.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Add Comment */}
                  <div className="border-t border-gray-200 pt-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment... Use @ to mention someone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <AtSign className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={addComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'audit' && (
                <div className="space-y-3">
                  {getEntityAuditLog().map(entry => (
                    <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-[#4F46E5] rounded-full flex items-center justify-center mr-2">
                            <span className="text-xs text-white font-medium">
                              {entry.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{entry.user}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{entry.action}</p>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">{entry.field}:</span>
                        {entry.beforeValue && (
                          <span className="text-red-600 line-through ml-1">{entry.beforeValue}</span>
                        )}
                        <span className="text-green-600 ml-1">{entry.afterValue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setShowHiringGantt(!showHiringGantt)}>
              <Users className="w-4 h-4 mr-2" />
              {showHiringGantt ? 'Hide' : 'Show'} Hiring Gantt
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4 mr-2" />
              Export Board Pack
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Import Actuals
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last saved: 2 minutes ago</span>
          </div>
        </div>
      </div>

      {/* Chart Edit Confirmation Modal */}
      {editingPoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Chart Edit</h3>
            <p className="text-sm text-gray-600 mb-4">
              You're about to adjust {editingPoint.metric} for {forecastData.months[editingPoint.month]} 
              to {formatCurrency(editingPoint.value)}. This will create a one-time adjustment driver.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingPoint(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmChartEdit}>
                Create Driver
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Export Board Pack</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Workbook</option>
                  <option value="powerpoint">PowerPoint Slides</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include Scenarios</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#4F46E5] border-gray-300 rounded focus:ring-[#4F46E5] mr-2" />
                    <span className="text-sm text-gray-700">{currentScenario?.name} (Primary)</span>
                  </label>
                  {compareScenarios.map(scenarioId => {
                    const scenario = scenarios.find(s => s.id === scenarioId);
                    return (
                      <label key={scenarioId} className="flex items-center">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#4F46E5] border-gray-300 rounded focus:ring-[#4F46E5] mr-2" />
                        <span className="text-sm text-gray-700">{scenario?.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Sections</label>
                <div className="space-y-2">
                  {[
                    'Executive Summary',
                    'Key Metrics Dashboard',
                    'Cash Runway Analysis',
                    'Revenue Forecast',
                    'Scenario Comparison',
                    'Driver Impact Analysis',
                    'Hiring Plan Timeline',
                    'Risk Assessment'
                  ].map(section => (
                    <label key={section} className="flex items-center">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#4F46E5] border-gray-300 rounded focus:ring-[#4F46E5] mr-2" />
                      <span className="text-sm text-gray-700">{section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={exportBoardPack}>
                <Download className="w-4 h-4 mr-2" />
                Generate Board Pack
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Scenario Modal */}
      {showScenarioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create New Scenario</h3>
              <button
                onClick={() => setShowScenarioModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="e.g., Aggressive Growth, Market Downturn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Copy From</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                  <option value="">Start from scratch</option>
                  {scenarios.map(scenario => (
                    <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Brief description of this scenario's assumptions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horizon</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent">
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="60">60 months</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowScenarioModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                disabled={!newScenarioName.trim()}
                onClick={() => {
                  // Handle scenario creation
                  const newScenario: Scenario = {
                    id: `scenario_${Date.now()}`,
                    name: newScenarioName,
                    description: 'New scenario',
                    startMonth: '2025-01',
                    horizonMonths: 36,
                    locked: false,
                    status: 'draft',
                    createdBy: 'Current User',
                    createdAt: new Date(),
                    lastModified: new Date(),
                    color: '#8B5CF6'
                  };
                  setScenarios(prev => [...prev, newScenario]);
                  setShowScenarioModal(false);
                  setNewScenarioName('');
                }}
              >
                Create Scenario
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Add Role Modal */}
      <AddRoleModal
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        onRoleAdded={loadComprehensiveRoles}
      />
    </div>
  );
};



export default RunwayPlanning