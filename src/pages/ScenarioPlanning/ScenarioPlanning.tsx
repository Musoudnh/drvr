import React, { useState } from 'react';
import { Target, Plus, Copy, Play, BarChart3, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, X, Save, Edit3, Trash2, MoreHorizontal } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'optimistic' | 'pessimistic' | 'target' | 'custom';
  assumptions: {
    revenueGrowth: number;
    marketGrowth: number;
    pricingChange: number;
    newProductLaunch: boolean;
    economicDownturn: boolean;
    competitorEntry: boolean;
  };
  results: {
    revenue: number;
    profit: number;
    cashFlow: number;
    runway: number;
  };
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
}

const ScenarioPlanning: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: '1',
      name: 'Base Case',
      description: 'Current trajectory with existing growth rates',
      type: 'target',
      assumptions: {
        revenueGrowth: 15.4,
        marketGrowth: 8.2,
        pricingChange: 0,
        newProductLaunch: false,
        economicDownturn: false,
        competitorEntry: false
      },
      results: {
        revenue: 10200000,
        profit: 2856000,
        cashFlow: 2244000,
        runway: 18.5
      },
      createdAt: new Date('2025-01-10'),
      createdBy: 'Sarah Johnson',
      isActive: true
    },
    {
      id: '2',
      name: 'Aggressive Growth',
      description: 'Optimistic scenario with new product launch and market expansion',
      type: 'optimistic',
      assumptions: {
        revenueGrowth: 28.7,
        marketGrowth: 12.5,
        pricingChange: 8,
        newProductLaunch: true,
        economicDownturn: false,
        competitorEntry: false
      },
      results: {
        revenue: 14800000,
        profit: 4292000,
        cashFlow: 3654000,
        runway: 24.2
      },
      createdAt: new Date('2025-01-12'),
      createdBy: 'Michael Chen',
      isActive: false
    },
    {
      id: '3',
      name: 'Economic Downturn',
      description: 'Conservative scenario with market contraction and pricing pressure',
      type: 'pessimistic',
      assumptions: {
        revenueGrowth: 3.2,
        marketGrowth: -2.1,
        pricingChange: -12,
        newProductLaunch: false,
        economicDownturn: true,
        competitorEntry: true
      },
      results: {
        revenue: 7650000,
        profit: 1147500,
        cashFlow: 918000,
        runway: 12.3
      },
      createdAt: new Date('2025-01-14'),
      createdBy: 'Emily Rodriguez',
      isActive: false
    }
  ]);

  const [selectedScenarios, setSelectedScenarios] = useState<string[]>(['1', '2']);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<Scenario | null>(null);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    type: 'custom' as const,
    assumptions: {
      revenueGrowth: 15.4,
      marketGrowth: 8.2,
      pricingChange: 0,
      newProductLaunch: false,
      economicDownturn: false,
      competitorEntry: false
    }
  });

  const handleCreateScenario = () => {
    const scenario: Scenario = {
      id: Date.now().toString(),
      ...newScenario,
      results: calculateScenarioResults(newScenario.assumptions),
      createdAt: new Date(),
      createdBy: 'Current User',
      isActive: false
    };
    
    setScenarios(prev => [...prev, scenario]);
    setNewScenario({
      name: '',
      description: '',
      type: 'custom',
      assumptions: {
        revenueGrowth: 15.4,
        marketGrowth: 8.2,
        pricingChange: 0,
        newProductLaunch: false,
        economicDownturn: false,
        competitorEntry: false
      }
    });
    setShowCreateModal(false);
  };

  const calculateScenarioResults = (assumptions: any) => {
    const baseRevenue = 8470000;
    const adjustedRevenue = baseRevenue * (1 + assumptions.revenueGrowth / 100) * (1 + assumptions.pricingChange / 100);
    const marketImpact = assumptions.economicDownturn ? 0.85 : assumptions.newProductLaunch ? 1.15 : 1;
    const finalRevenue = adjustedRevenue * marketImpact;
    
    return {
      revenue: Math.round(finalRevenue),
      profit: Math.round(finalRevenue * 0.28),
      cashFlow: Math.round(finalRevenue * 0.22),
      runway: Math.round((finalRevenue * 0.22) / 120000)
    };
  };

  const handleScenarioToggle = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Scenario Planning</h2>
          <p className="text-gray-600 mt-1">Create and compare multiple financial scenarios</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>

      {/* Scenario Comparison */}
      <Card title="Scenario Comparison">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            {scenarios.map(scenario => {
              const Icon = getScenarioIcon(scenario.type);
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleScenarioToggle(scenario.id)}
                  className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                    selectedScenarios.includes(scenario.id)
                      ? 'border-current shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ 
                    color: selectedScenarios.includes(scenario.id) ? getScenarioColor(scenario.type) : '#6B7280',
                    backgroundColor: selectedScenarios.includes(scenario.id) ? `${getScenarioColor(scenario.type)}10` : 'white'
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {scenario.name}
                </button>
              );
            })}
          </div>

          {/* Comparison Chart */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-[#1E2A38] mb-4">Revenue Projection Comparison</h3>
            <div className="relative h-64">
              <svg className="w-full h-full">
                {selectedScenarios.map((scenarioId, index) => {
                  const scenario = scenarios.find(s => s.id === scenarioId);
                  if (!scenario) return null;
                  
                  const color = getScenarioColor(scenario.type);
                  const months = 12;
                  const baseRevenue = 8470000;
                  
                  return (
                    <g key={scenarioId}>
                      <polyline
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        points={Array.from({ length: months }, (_, i) => {
                          const x = 50 + (i * 60);
                          const monthlyGrowth = scenario.assumptions.revenueGrowth / 100 / 12;
                          const revenue = baseRevenue * Math.pow(1 + monthlyGrowth, i);
                          const y = 200 - (revenue - baseRevenue) / 50000;
                          return `${x},${Math.max(20, Math.min(200, y))}`;
                        }).join(' ')}
                      />
                      {Array.from({ length: months }, (_, i) => {
                        const x = 50 + (i * 60);
                        const monthlyGrowth = scenario.assumptions.revenueGrowth / 100 / 12;
                        const revenue = baseRevenue * Math.pow(1 + monthlyGrowth, i);
                        const y = 200 - (revenue - baseRevenue) / 50000;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={Math.max(20, Math.min(200, y))}
                            r="4"
                            fill={color}
                          />
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-center gap-6 mt-4">
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

          {/* Results Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Scenario</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Profit</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Cash Flow</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Runway</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map(scenario => {
                  const Icon = getScenarioIcon(scenario.type);
                  return (
                    <tr key={scenario.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Icon 
                            className="w-4 h-4 mr-3" 
                            style={{ color: getScenarioColor(scenario.type) }}
                          />
                          <div>
                            <p className="font-medium text-[#1E2A38]">{scenario.name}</p>
                            <p className="text-sm text-gray-600">{scenario.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#3AB7BF]">
                        ${(scenario.results.revenue / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#4ADE80]">
                        ${(scenario.results.profit / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#F59E0B]">
                        ${(scenario.results.cashFlow / 1000000).toFixed(1)}M
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#8B5CF6]">
                        {scenario.results.runway} months
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingScenario(scenario)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit3 className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => {
                              const newScenario = { ...scenario, id: Date.now().toString(), name: `${scenario.name} (Copy)` };
                              setScenarios(prev => [...prev, newScenario]);
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Scenario Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedScenarios.slice(0, 2).map(scenarioId => {
          const scenario = scenarios.find(s => s.id === scenarioId);
          if (!scenario) return null;
          
          const Icon = getScenarioIcon(scenario.type);
          
          return (
            <Card key={scenarioId} title={scenario.name}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon 
                      className="w-5 h-5 mr-2" 
                      style={{ color: getScenarioColor(scenario.type) }}
                    />
                    <span className="font-medium text-[#1E2A38]">{scenario.type.charAt(0).toUpperCase() + scenario.type.slice(1)}</span>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${getScenarioColor(scenario.type)}20`,
                      color: getScenarioColor(scenario.type)
                    }}
                  >
                    {scenario.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{scenario.description}</p>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[#1E2A38]">Key Assumptions</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenue Growth:</span>
                      <span className="font-medium">{scenario.assumptions.revenueGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Market Growth:</span>
                      <span className="font-medium">{scenario.assumptions.marketGrowth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pricing Change:</span>
                      <span className="font-medium">{scenario.assumptions.pricingChange}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">New Product:</span>
                      <span className="font-medium">{scenario.assumptions.newProductLaunch ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-[#1E2A38]">Projected Results</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-bold text-[#3AB7BF]">${(scenario.results.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                      <p className="text-sm text-gray-600">Profit</p>
                      <p className="font-bold text-[#4ADE80]">${(scenario.results.profit / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="p-3 bg-[#F59E0B]/10 rounded-lg">
                      <p className="text-sm text-gray-600">Cash Flow</p>
                      <p className="font-bold text-[#F59E0B]">${(scenario.results.cashFlow / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="p-3 bg-[#8B5CF6]/10 rounded-lg">
                      <p className="text-sm text-gray-600">Runway</p>
                      <p className="font-bold text-[#8B5CF6]">{scenario.results.runway} months</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Risk Assessment */}
      <Card title="Risk Assessment">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <CheckCircle className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Low Risk</h3>
            <p className="text-sm text-gray-600">Base case scenario has 85% probability of achievement</p>
          </div>
          
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <AlertTriangle className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Medium Risk</h3>
            <p className="text-sm text-gray-600">Market volatility could impact growth by ±15%</p>
          </div>
          
          <div className="text-center p-4 bg-[#F87171]/10 rounded-lg">
            <TrendingDown className="w-8 h-8 text-[#F87171] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">High Risk</h3>
            <p className="text-sm text-gray-600">Economic downturn scenario requires immediate action</p>
          </div>
        </div>
      </Card>

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Create New Scenario</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  placeholder="e.g., Market Expansion"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({...newScenario, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  rows={3}
                  placeholder="Describe the scenario assumptions and context"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Revenue Growth (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newScenario.assumptions.revenueGrowth}
                    onChange={(e) => setNewScenario({
                      ...newScenario,
                      assumptions: { ...newScenario.assumptions, revenueGrowth: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Market Growth (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newScenario.assumptions.marketGrowth}
                    onChange={(e) => setNewScenario({
                      ...newScenario,
                      assumptions: { ...newScenario.assumptions, marketGrowth: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Change (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newScenario.assumptions.pricingChange}
                  onChange={(e) => setNewScenario({
                    ...newScenario,
                    assumptions: { ...newScenario.assumptions, pricingChange: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-[#1E2A38]">Market Conditions</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newScenario.assumptions.newProductLaunch}
                      onChange={(e) => setNewScenario({
                        ...newScenario,
                        assumptions: { ...newScenario.assumptions, newProductLaunch: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#8B5CF6] border-gray-300 rounded focus:ring-[#8B5CF6] mr-3"
                    />
                    <span className="text-sm text-gray-700">New Product Launch</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newScenario.assumptions.economicDownturn}
                      onChange={(e) => setNewScenario({
                        ...newScenario,
                        assumptions: { ...newScenario.assumptions, economicDownturn: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#8B5CF6] border-gray-300 rounded focus:ring-[#8B5CF6] mr-3"
                    />
                    <span className="text-sm text-gray-700">Economic Downturn</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newScenario.assumptions.competitorEntry}
                      onChange={(e) => setNewScenario({
                        ...newScenario,
                        assumptions: { ...newScenario.assumptions, competitorEntry: e.target.checked }
                      })}
                      className="w-4 h-4 text-[#8B5CF6] border-gray-300 rounded focus:ring-[#8B5CF6] mr-3"
                    />
                    <span className="text-sm text-gray-700">New Competitor Entry</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateScenario}
                disabled={!newScenario.name.trim()}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioPlanning;