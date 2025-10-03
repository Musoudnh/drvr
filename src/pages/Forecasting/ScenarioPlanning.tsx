import React, { useState, useEffect } from 'react';
import { Target, Plus, Copy, Play, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, X, Save, CreditCard as Edit3, Trash2, Download, Share2, RefreshCw, Brain, Lightbulb, Calculator, DollarSign, Users, Zap, Eye, Settings, Filter, Calendar, ArrowRight, ArrowUp, ArrowDown, Minus, Info, Lock, Unlock } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import SalesScenarioModal from '../../components/Forecasting/SalesScenarioModal';
import type { SalesScenario } from '../../types/salesDriver';

interface ScenarioAssumptions {
  revenueGrowth: number;
  marketGrowth: number;
  pricingChange: number;
  hiringPlan: number;
  marketingSpend: number;
  operatingExpenses: number;
  newProductLaunch: boolean;
  economicDownturn: boolean;
  competitorEntry: boolean;
  marketExpansion: boolean;
}

interface ScenarioResults {
  revenue: number;
  profit: number;
  cashFlow: number;
  runway: number;
  headcount: number;
  burnRate: number;
  grossMargin: number;
  operatingMargin: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'optimistic' | 'pessimistic' | 'target' | 'custom';
  assumptions: ScenarioAssumptions;
  results: ScenarioResults;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  isLocked: boolean;
  version: number;
  aiSummary?: string;
}

interface ComparisonMetric {
  label: string;
  key: keyof ScenarioResults;
  format: 'currency' | 'percentage' | 'number' | 'months';
  color: string;
}

const ScenarioPlanning: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Base Case',
      description: 'Current trajectory with existing growth rates and market conditions',
      type: 'target',
      assumptions: {
        revenueGrowth: 15.4,
        marketGrowth: 8.2,
        pricingChange: 0,
        hiringPlan: 12,
        marketingSpend: 45000,
        operatingExpenses: 285000,
        newProductLaunch: false,
        economicDownturn: false,
        competitorEntry: false,
        marketExpansion: false
      },
      results: {
        revenue: 10200000,
        profit: 2856000,
        cashFlow: 2244000,
        runway: 18.5,
        headcount: 36,
        burnRate: 125000,
        grossMargin: 62.1,
        operatingMargin: 28.0
      },
      createdAt: new Date('2025-01-10'),
      createdBy: 'Sarah Johnson',
      isActive: true,
      isLocked: false,
      version: 1,
      aiSummary: 'Conservative growth scenario with steady market conditions. Maintains healthy cash position with moderate expansion.'
    },
    {
      id: '2',
      name: 'Aggressive Growth',
      description: 'Optimistic scenario with new product launch, market expansion, and accelerated hiring',
      type: 'optimistic',
      assumptions: {
        revenueGrowth: 28.7,
        marketGrowth: 12.5,
        pricingChange: 8,
        hiringPlan: 24,
        marketingSpend: 85000,
        operatingExpenses: 425000,
        newProductLaunch: true,
        economicDownturn: false,
        competitorEntry: false,
        marketExpansion: true
      },
      results: {
        revenue: 14800000,
        profit: 4292000,
        cashFlow: 3654000,
        runway: 24.2,
        headcount: 48,
        burnRate: 185000,
        grossMargin: 65.8,
        operatingMargin: 29.0
      },
      createdAt: new Date('2025-01-12'),
      createdBy: 'Michael Chen',
      isActive: false,
      isLocked: false,
      version: 2,
      aiSummary: 'High-growth scenario leveraging market opportunities. Requires significant investment but offers substantial returns.'
    },
    {
      id: '3',
      name: 'Economic Downturn',
      description: 'Conservative scenario with market contraction, pricing pressure, and cost optimization',
      type: 'pessimistic',
      assumptions: {
        revenueGrowth: 3.2,
        marketGrowth: -2.1,
        pricingChange: -12,
        hiringPlan: 3,
        marketingSpend: 25000,
        operatingExpenses: 195000,
        newProductLaunch: false,
        economicDownturn: true,
        competitorEntry: true,
        marketExpansion: false
      },
      results: {
        revenue: 7650000,
        profit: 1147500,
        cashFlow: 918000,
        runway: 12.3,
        headcount: 27,
        burnRate: 75000,
        grossMargin: 58.2,
        operatingMargin: 15.0
      },
      createdAt: new Date('2025-01-14'),
      createdBy: 'Emily Rodriguez',
      isActive: false,
      isLocked: true,
      version: 1,
      aiSummary: 'Defensive scenario focused on cash preservation. Emphasizes operational efficiency and cost control.'
    }
  ]);

  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['1', '2']);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [showAIInsightsModal, setShowAIInsightsModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'comparison' | 'detailed'>('grid');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [comparisonMetrics, setComparisonMetrics] = useState<string[]>(['revenue', 'profit', 'cashFlow', 'runway']);
  const [showSalesScenarioModal, setShowSalesScenarioModal] = useState(false);
  const [salesScenarios, setSalesScenarios] = useState<SalesScenario[]>([]);
  
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    type: 'custom' as const,
    assumptions: {
      revenueGrowth: 15.4,
      marketGrowth: 8.2,
      pricingChange: 0,
      hiringPlan: 12,
      marketingSpend: 45000,
      operatingExpenses: 285000,
      newProductLaunch: false,
      economicDownturn: false,
      competitorEntry: false,
      marketExpansion: false
    }
  });

  const comparisonMetricOptions: ComparisonMetric[] = [
    { label: 'Revenue', key: 'revenue', format: 'currency', color: '#4ADE80' },
    { label: 'Profit', key: 'profit', format: 'currency', color: '#3AB7BF' },
    { label: 'Cash Flow', key: 'cashFlow', format: 'currency', color: '#F59E0B' },
    { label: 'Runway', key: 'runway', format: 'months', color: '#8B5CF6' },
    { label: 'Headcount', key: 'headcount', format: 'number', color: '#EC4899' },
    { label: 'Burn Rate', key: 'burnRate', format: 'currency', color: '#F87171' },
    { label: 'Gross Margin', key: 'grossMargin', format: 'percentage', color: '#10B981' },
    { label: 'Operating Margin', key: 'operatingMargin', format: 'percentage', color: '#6366F1' }
  ];

  // Real-time calculation of scenario results based on assumptions
  const calculateScenarioResults = (assumptions: ScenarioAssumptions): ScenarioResults => {
    const baseRevenue = 8470000;
    const baseExpenses = 5614000;
    
    // Revenue calculations
    const marketImpact = assumptions.economicDownturn ? 0.85 : assumptions.marketExpansion ? 1.15 : 1;
    const competitorImpact = assumptions.competitorEntry ? 0.92 : 1;
    const productLaunchImpact = assumptions.newProductLaunch ? 1.25 : 1;
    
    const adjustedRevenue = baseRevenue * 
      (1 + assumptions.revenueGrowth / 100) * 
      (1 + assumptions.pricingChange / 100) * 
      marketImpact * 
      competitorImpact * 
      productLaunchImpact;
    
    // Expense calculations
    const hiringCost = assumptions.hiringPlan * 85000; // Average salary
    const adjustedExpenses = assumptions.operatingExpenses * 12 + 
      assumptions.marketingSpend * 12 + 
      hiringCost;
    
    const profit = adjustedRevenue - adjustedExpenses;
    const cashFlow = profit * 0.85; // Assume 85% cash conversion
    const burnRate = adjustedExpenses / 12;
    const runway = cashFlow > 0 ? (cashFlow / burnRate) : 0;
    
    return {
      revenue: Math.round(adjustedRevenue),
      profit: Math.round(profit),
      cashFlow: Math.round(cashFlow),
      runway: Math.round(runway * 10) / 10,
      headcount: 24 + assumptions.hiringPlan,
      burnRate: Math.round(burnRate),
      grossMargin: Math.round(((adjustedRevenue - adjustedExpenses * 0.6) / adjustedRevenue) * 1000) / 10,
      operatingMargin: Math.round((profit / adjustedRevenue) * 1000) / 10
    };
  };

  // Real-time updates when assumptions change
  useEffect(() => {
    if (editingScenario) {
      const updatedResults = calculateScenarioResults(editingScenario.assumptions);
      setEditingScenario(prev => prev ? { ...prev, results: updatedResults } : null);
    }
  }, [editingScenario?.assumptions]);

  const handleCreateScenario = () => {
    const scenario: Scenario = {
      id: Date.now().toString(),
      ...newScenario,
      results: calculateScenarioResults(newScenario.assumptions),
      createdAt: new Date(),
      createdBy: 'Current User',
      isActive: false,
      isLocked: false,
      version: 1
    };
    
    setScenarios(prev => [...prev, scenario]);
    resetNewScenario();
    setShowCreateModal(false);
  };

  const resetNewScenario = () => {
    setNewScenario({
      name: '',
      description: '',
      type: 'custom',
      assumptions: {
        revenueGrowth: 15.4,
        marketGrowth: 8.2,
        pricingChange: 0,
        hiringPlan: 12,
        marketingSpend: 45000,
        operatingExpenses: 285000,
        newProductLaunch: false,
        economicDownturn: false,
        competitorEntry: false,
        marketExpansion: false
      }
    });
  };

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : prev.length < 3 ? [...prev, scenarioId] : prev
    );
  };

  const handleCloneScenario = (scenario: Scenario) => {
    const clonedScenario: Scenario = {
      ...scenario,
      id: Date.now().toString(),
      name: `${scenario.name} (Copy)`,
      createdAt: new Date(),
      createdBy: 'Current User',
      isActive: false,
      isLocked: false,
      version: 1
    };
    setScenarios(prev => [...prev, clonedScenario]);
  };

  const generateAIInsights = async () => {
    setIsGeneratingAI(true);
    // Simulate AI processing
    setTimeout(() => {
      setIsGeneratingAI(false);
      setShowAIInsightsModal(true);
    }, 2000);
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return value >= 1000000 
          ? `$${(value / 1000000).toFixed(1)}M`
          : value >= 1000 
          ? `$${(value / 1000).toFixed(0)}K`
          : `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'months':
        return `${value} months`;
      case 'number':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'optimistic': return '#4ADE80';
      case 'pessimistic': return '#F87171';
      case 'target': return '#3AB7BF';
      default: return '#8B5CF6';
    }
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'optimistic': return TrendingUp;
      case 'pessimistic': return TrendingDown;
      case 'target': return Target;
      default: return BarChart3;
    }
  };

  const getVarianceColor = (current: number, base: number) => {
    const variance = ((current - base) / base) * 100;
    if (Math.abs(variance) < 5) return '#6B7280';
    return variance > 0 ? '#4ADE80' : '#F87171';
  };

  const getVarianceIcon = (current: number, base: number) => {
    const variance = ((current - base) / base) * 100;
    if (Math.abs(variance) < 5) return Minus;
    return variance > 0 ? ArrowUp : ArrowDown;
  };

  const renderScenarioCard = (scenario: Scenario) => {
    const Icon = getScenarioIcon(scenario.type);
    const color = getScenarioColor(scenario.type);
    const isSelected = selectedScenarios.includes(scenario.id);
    
    return (
      <div
        key={scenario.id}
        className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
          isSelected 
            ? 'border-current shadow-md transform scale-[1.02]' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        style={{ 
          borderColor: isSelected ? color : undefined,
          backgroundColor: isSelected ? `${color}08` : 'white'
        }}
        onClick={() => handleScenarioToggle(scenario.id)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <h3 className="font-bold text-[#101010] text-lg">{scenario.name}</h3>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {scenario.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${color}20`,
                color: color
              }}
            >
              v{scenario.version}
            </span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Revenue</p>
            <p className="font-bold text-[#4ADE80]">{formatValue(scenario.results.revenue, 'currency')}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Profit</p>
            <p className="font-bold text-[#3AB7BF]">{formatValue(scenario.results.profit, 'currency')}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Cash Flow</p>
            <p className="font-bold text-[#F59E0B]">{formatValue(scenario.results.cashFlow, 'currency')}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Runway</p>
            <p className="font-bold text-[#8B5CF6]">{formatValue(scenario.results.runway, 'months')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingScenario(scenario);
            }}
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Edit3 className="w-3 h-3 mr-1 inline" />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloneScenario(scenario);
            }}
            className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-3 h-3 mr-1 inline" />
            Clone
          </button>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  const renderComparisonChart = () => {
    const baseScenario = scenarios.find(s => s.id === '1');
    if (!baseScenario) return null;

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#101010] text-lg">Scenario Comparison</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowComparisonModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="relative h-80 mb-6">
          <svg className="w-full h-full">
            {selectedScenarios.map((scenarioId, index) => {
              const scenario = scenarios.find(s => s.id === scenarioId);
              if (!scenario) return null;
              
              const color = getScenarioColor(scenario.type);
              const months = 12;
              
              return (
                <g key={scenarioId}>
                  <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    points={Array.from({ length: months }, (_, i) => {
                      const x = 60 + (i * 60);
                      const monthlyGrowth = scenario.assumptions.revenueGrowth / 100 / 12;
                      const revenue = 8470000 * Math.pow(1 + monthlyGrowth, i);
                      const y = 280 - (revenue - 8470000) / 50000;
                      return `${x},${Math.max(40, Math.min(280, y))}`;
                    }).join(' ')}
                  />
                  {Array.from({ length: months }, (_, i) => {
                    const x = 60 + (i * 60);
                    const monthlyGrowth = scenario.assumptions.revenueGrowth / 100 / 12;
                    const revenue = 8470000 * Math.pow(1 + monthlyGrowth, i);
                    const y = 280 - (revenue - 8470000) / 50000;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={Math.max(40, Math.min(280, y))}
                        r="4"
                        fill={color}
                        className="hover:r-6 transition-all cursor-pointer"
                        title={`${scenario.name}: ${formatValue(revenue, 'currency')}`}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
          
          {/* Chart Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-12">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6">
          {selectedScenarios.map(scenarioId => {
            const scenario = scenarios.find(s => s.id === scenarioId);
            if (!scenario) return null;
            return (
              <div key={scenarioId} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded mr-2"
                  style={{ backgroundColor: getScenarioColor(scenario.type) }}
                />
                <span className="text-sm text-gray-600">{scenario.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDetailedComparison = () => {
    const selectedScenarioData = selectedScenarios.map(id => scenarios.find(s => s.id === id)).filter(Boolean) as Scenario[];
    const baseScenario = selectedScenarioData[0];
    
    if (!baseScenario) return null;

    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-[#101010] text-lg">Detailed Comparison</h3>
          <p className="text-sm text-gray-600 mt-1">Side-by-side analysis of selected scenarios</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-bold text-gray-800">Metric</th>
                {selectedScenarioData.map(scenario => (
                  <th key={scenario.id} className="text-center py-4 px-6 font-bold text-gray-800">
                    <div className="flex items-center justify-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: getScenarioColor(scenario.type) }}
                      />
                      {scenario.name}
                    </div>
                  </th>
                ))}
                <th className="text-center py-4 px-6 font-bold text-gray-800">Variance</th>
              </tr>
            </thead>
            <tbody>
              {comparisonMetricOptions.filter(metric => comparisonMetrics.includes(metric.key)).map(metric => (
                <tr key={metric.key} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#101010]">{metric.label}</td>
                  {selectedScenarioData.map((scenario, index) => {
                    const value = scenario.results[metric.key];
                    const isBase = index === 0;
                    
                    return (
                      <td key={scenario.id} className="py-4 px-6 text-center">
                        <span 
                          className="font-bold"
                          style={{ color: isBase ? '#1E2A38' : getScenarioColor(scenario.type) }}
                        >
                          {formatValue(value, metric.format)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-4 px-6 text-center">
                    {selectedScenarioData.length > 1 && (
                      <div className="space-y-1">
                        {selectedScenarioData.slice(1).map(scenario => {
                          const baseValue = baseScenario.results[metric.key];
                          const currentValue = scenario.results[metric.key];
                          const variance = ((currentValue - baseValue) / baseValue) * 100;
                          const VarianceIcon = getVarianceIcon(currentValue, baseValue);
                          
                          return (
                            <div key={scenario.id} className="flex items-center justify-center">
                              <VarianceIcon 
                                className="w-3 h-3 mr-1" 
                                style={{ color: getVarianceColor(currentValue, baseValue) }}
                              />
                              <span 
                                className="text-sm font-medium"
                                style={{ color: getVarianceColor(currentValue, baseValue) }}
                              >
                                {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAssumptionSlider = (
    label: string,
    value: number,
    onChange: (value: number) => void,
    min: number,
    max: number,
    step: number = 0.1,
    suffix: string = '%'
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-[#101010]">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}{suffix}</span>
        <span>{max}{suffix}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#101010]">Scenario Planning</h2>
          <p className="text-gray-600 mt-2">Model different business scenarios and compare outcomes with real-time calculations</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={generateAIInsights}
            disabled={isGeneratingAI || selectedScenarios.length === 0}
            className="bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6] hover:bg-[#8B5CF6]/20"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                AI Insights
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowSalesScenarioModal(true)}
            className="bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80] hover:bg-[#4ADE80]/20"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Sales Scenario
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="bg-[#3AB7BF] hover:bg-[#2A9BA3] focus:ring-[#3AB7BF]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Scenario
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-[#3AB7BF] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2 inline" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'comparison'
                ? 'bg-white text-[#3AB7BF] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Target className="w-4 h-4 mr-2 inline" />
            Comparison
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'detailed'
                ? 'bg-white text-[#3AB7BF] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Calculator className="w-4 h-4 mr-2 inline" />
            Detailed
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {selectedScenarios.length} of 3 scenarios selected
          </span>
          {selectedScenarios.length > 0 && (
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Analysis
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {scenarios.map(renderScenarioCard)}
        </div>
      )}

      {viewMode === 'comparison' && (
        <div className="space-y-6">
          {renderComparisonChart()}
          {selectedScenarios.length > 0 && renderDetailedComparison()}
        </div>
      )}

      {viewMode === 'detailed' && selectedScenarios.length > 0 && (
        <div className="space-y-6">
          {renderDetailedComparison()}
          {renderComparisonChart()}
        </div>
      )}

      {/* Risk Assessment */}
      <Card title="Risk Assessment & Probability Analysis">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-[#4ADE80]/10 rounded-xl">
            <CheckCircle className="w-12 h-12 text-[#4ADE80] mx-auto mb-4" />
            <h3 className="font-bold text-[#101010] mb-2 text-lg">Base Case</h3>
            <p className="text-sm text-gray-600 mb-3">85% probability of achievement based on historical performance</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#4ADE80] h-2 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          
          <div className="text-center p-6 bg-[#F59E0B]/10 rounded-xl">
            <AlertTriangle className="w-12 h-12 text-[#F59E0B] mx-auto mb-4" />
            <h3 className="font-bold text-[#101010] mb-2 text-lg">Market Volatility</h3>
            <p className="text-sm text-gray-600 mb-3">External factors could impact growth by ±15% from projections</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
          
          <div className="text-center p-6 bg-[#F87171]/10 rounded-xl">
            <TrendingDown className="w-12 h-12 text-[#F87171] mx-auto mb-4" />
            <h3 className="font-bold text-[#101010] mb-2 text-lg">Downside Risk</h3>
            <p className="text-sm text-gray-600 mb-3">Economic downturn scenario requires immediate cost optimization</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#F87171] h-2 rounded-full" style={{ width: '25%' }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Create/Edit Scenario Modal */}
      {(showCreateModal || editingScenario) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-8 w-[900px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#101010]">
                {editingScenario ? 'Edit Scenario' : 'Create New Scenario'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingScenario(null);
                  resetNewScenario();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Panel - Scenario Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Scenario Name</label>
                  <input
                    type="text"
                    value={editingScenario ? editingScenario.name : newScenario.name}
                    onChange={(e) => editingScenario 
                      ? setEditingScenario({...editingScenario, name: e.target.value})
                      : setNewScenario({...newScenario, name: e.target.value})
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder="e.g., Market Expansion"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Description</label>
                  <textarea
                    value={editingScenario ? editingScenario.description : newScenario.description}
                    onChange={(e) => editingScenario 
                      ? setEditingScenario({...editingScenario, description: e.target.value})
                      : setNewScenario({...newScenario, description: e.target.value})
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    rows={4}
                    placeholder="Describe the scenario assumptions and business context"
                  />
                </div>

                {/* Financial Assumptions */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#101010] text-lg">Financial Assumptions</h4>
                  
                  {renderAssumptionSlider(
                    'Revenue Growth Rate',
                    editingScenario ? editingScenario.assumptions.revenueGrowth : newScenario.assumptions.revenueGrowth,
                    (value) => editingScenario 
                      ? setEditingScenario({...editingScenario, assumptions: {...editingScenario.assumptions, revenueGrowth: value}})
                      : setNewScenario({...newScenario, assumptions: {...newScenario.assumptions, revenueGrowth: value}}),
                    -20,
                    50
                  )}
                  
                  {renderAssumptionSlider(
                    'Pricing Change',
                    editingScenario ? editingScenario.assumptions.pricingChange : newScenario.assumptions.pricingChange,
                    (value) => editingScenario 
                      ? setEditingScenario({...editingScenario, assumptions: {...editingScenario.assumptions, pricingChange: value}})
                      : setNewScenario({...newScenario, assumptions: {...newScenario.assumptions, pricingChange: value}}),
                    -25,
                    25
                  )}
                  
                  {renderAssumptionSlider(
                    'New Hires',
                    editingScenario ? editingScenario.assumptions.hiringPlan : newScenario.assumptions.hiringPlan,
                    (value) => editingScenario 
                      ? setEditingScenario({...editingScenario, assumptions: {...editingScenario.assumptions, hiringPlan: value}})
                      : setNewScenario({...newScenario, assumptions: {...newScenario.assumptions, hiringPlan: value}}),
                    0,
                    50,
                    1,
                    ' people'
                  )}
                  
                  {renderAssumptionSlider(
                    'Monthly Marketing Spend',
                    editingScenario ? editingScenario.assumptions.marketingSpend : newScenario.assumptions.marketingSpend,
                    (value) => editingScenario 
                      ? setEditingScenario({...editingScenario, assumptions: {...editingScenario.assumptions, marketingSpend: value}})
                      : setNewScenario({...newScenario, assumptions: {...newScenario.assumptions, marketingSpend: value}}),
                    10000,
                    150000,
                    1000,
                    'K'
                  )}
                </div>

                {/* Market Conditions */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[#101010] text-lg">Market Conditions</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'newProductLaunch', label: 'New Product Launch', description: 'Major product release driving growth' },
                      { key: 'marketExpansion', label: 'Market Expansion', description: 'Entry into new geographic markets' },
                      { key: 'economicDownturn', label: 'Economic Downturn', description: 'Recession or market contraction' },
                      { key: 'competitorEntry', label: 'New Competitor Entry', description: 'Major competitor enters market' }
                    ].map(condition => (
                      <label key={condition.key} className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={editingScenario 
                            ? editingScenario.assumptions[condition.key as keyof ScenarioAssumptions] as boolean
                            : newScenario.assumptions[condition.key as keyof ScenarioAssumptions] as boolean
                          }
                          onChange={(e) => editingScenario 
                            ? setEditingScenario({...editingScenario, assumptions: {...editingScenario.assumptions, [condition.key]: e.target.checked}})
                            : setNewScenario({...newScenario, assumptions: {...newScenario.assumptions, [condition.key]: e.target.checked}})
                          }
                          className="w-5 h-5 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF] mr-4 mt-0.5"
                        />
                        <div>
                          <p className="font-medium text-[#101010]">{condition.label}</p>
                          <p className="text-sm text-gray-600">{condition.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Panel - Live Results */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-xl p-6 border border-[#3AB7BF]/20">
                  <h4 className="font-bold text-[#101010] text-lg mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-[#3AB7BF]" />
                    Live Results Preview
                  </h4>
                  
                  {(() => {
                    const currentAssumptions = editingScenario ? editingScenario.assumptions : newScenario.assumptions;
                    const results = calculateScenarioResults(currentAssumptions);
                    
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Annual Revenue</p>
                          <p className="text-xl font-bold text-[#4ADE80]">{formatValue(results.revenue, 'currency')}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Net Profit</p>
                          <p className="text-xl font-bold text-[#3AB7BF]">{formatValue(results.profit, 'currency')}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Cash Flow</p>
                          <p className="text-xl font-bold text-[#F59E0B]">{formatValue(results.cashFlow, 'currency')}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Runway</p>
                          <p className="text-xl font-bold text-[#8B5CF6]">{formatValue(results.runway, 'months')}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Team Size</p>
                          <p className="text-xl font-bold text-[#EC4899]">{formatValue(results.headcount, 'number')}</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-600 mb-1">Burn Rate</p>
                          <p className="text-xl font-bold text-[#F87171]">{formatValue(results.burnRate, 'currency')}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Impact Analysis */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-bold text-[#101010] text-lg mb-4">Impact Analysis</h4>
                  {(() => {
                    const baseScenario = scenarios.find(s => s.type === 'target');
                    const currentAssumptions = editingScenario ? editingScenario.assumptions : newScenario.assumptions;
                    const currentResults = calculateScenarioResults(currentAssumptions);
                    
                    if (!baseScenario) return null;
                    
                    return (
                      <div className="space-y-3">
                        {comparisonMetricOptions.slice(0, 4).map(metric => {
                          const baseValue = baseScenario.results[metric.key];
                          const currentValue = currentResults[metric.key];
                          const variance = ((currentValue - baseValue) / baseValue) * 100;
                          const VarianceIcon = getVarianceIcon(currentValue, baseValue);
                          
                          return (
                            <div key={metric.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium text-[#101010]">{metric.label}</span>
                              <div className="flex items-center">
                                <VarianceIcon 
                                  className="w-4 h-4 mr-2" 
                                  style={{ color: getVarianceColor(currentValue, baseValue) }}
                                />
                                <span 
                                  className="font-bold"
                                  style={{ color: getVarianceColor(currentValue, baseValue) }}
                                >
                                  {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingScenario(null);
                  resetNewScenario();
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <Button
                variant="primary"
                onClick={editingScenario ? () => {
                  setScenarios(prev => prev.map(s => s.id === editingScenario.id ? editingScenario : s));
                  setEditingScenario(null);
                } : handleCreateScenario}
                disabled={editingScenario ? !editingScenario.name.trim() : !newScenario.name.trim()}
                className="px-6 py-3"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingScenario ? 'Save Changes' : 'Create Scenario'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {showAIInsightsModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-8 w-[800px] max-w-[95vw] max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-[#101010] flex items-center">
                <Brain className="w-6 h-6 mr-3 text-[#8B5CF6]" />
                AI Scenario Insights
              </h3>
              <button
                onClick={() => setShowAIInsightsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {selectedScenarios.map(scenarioId => {
                const scenario = scenarios.find(s => s.id === scenarioId);
                if (!scenario) return null;
                
                return (
                  <div key={scenarioId} className="p-6 border border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
                    <div className="flex items-center mb-4">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                        style={{ backgroundColor: `${getScenarioColor(scenario.type)}20` }}
                      >
                        {React.createElement(getScenarioIcon(scenario.type), { 
                          className: "w-4 h-4", 
                          style: { color: getScenarioColor(scenario.type) } 
                        })}
                      </div>
                      <h4 className="font-bold text-[#101010] text-lg">{scenario.name}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-[#8B5CF6]/10 rounded-lg">
                        <div className="flex items-start">
                          <Lightbulb className="w-5 h-5 text-[#8B5CF6] mr-3 mt-0.5" />
                          <div>
                            <h5 className="font-medium text-[#101010] mb-2">AI Summary</h5>
                            <p className="text-sm text-gray-700">{scenario.aiSummary}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                          <h6 className="font-medium text-[#101010] mb-1">Key Strengths</h6>
                          <p className="text-xs text-gray-600">
                            {scenario.type === 'optimistic' ? 'High growth potential with strong market position' :
                             scenario.type === 'pessimistic' ? 'Resilient cost structure and cash preservation' :
                             'Balanced approach with manageable risk profile'}
                          </p>
                        </div>
                        <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                          <h6 className="font-medium text-[#101010] mb-1">Key Risks</h6>
                          <p className="text-xs text-gray-600">
                            {scenario.type === 'optimistic' ? 'High execution risk and market dependency' :
                             scenario.type === 'pessimistic' ? 'Limited growth and competitive disadvantage' :
                             'Market volatility could impact projections'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Analysis
              </Button>
              <button
                onClick={() => setShowAIInsightsModal(false)}
                className="px-6 py-3 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Metrics Modal */}
      {showComparisonModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-[500px] max-w-[90vw] shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#101010]">Customize Comparison</h3>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select metrics to include in the comparison view</p>
              <div className="space-y-2">
                {comparisonMetricOptions.map(metric => (
                  <label key={metric.key} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={comparisonMetrics.includes(metric.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setComparisonMetrics(prev => [...prev, metric.key]);
                        } else {
                          setComparisonMetrics(prev => prev.filter(m => m !== metric.key));
                        }
                      }}
                      className="w-4 h-4 text-[#3AB7BF] border-gray-300 rounded focus:ring-[#3AB7BF] mr-3"
                    />
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: metric.color }}
                      />
                      <span className="font-medium text-[#101010]">{metric.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowComparisonModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <Button variant="primary">
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sales Scenario Modal */}
      <SalesScenarioModal
        isOpen={showSalesScenarioModal}
        onClose={() => setShowSalesScenarioModal(false)}
        onSave={(scenario) => {
          setSalesScenarios([...salesScenarios, scenario]);
          setShowSalesScenarioModal(false);
        }}
      />
    </div>
  );
};

export default ScenarioPlanning;