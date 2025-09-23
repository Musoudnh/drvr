import React, { useState } from 'react';
import { TrendingUp, DollarSign, Target, BarChart3, Calendar, Brain, AlertTriangle, Lightbulb, RefreshCw, Download, Settings, Filter, Eye, Plus, X, Save, Edit3, Trash2 } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ForecastModel {
  id: string;
  name: string;
  type: 'revenue' | 'expense' | 'cash_flow' | 'custom';
  accuracy: number;
  lastUpdated: Date;
  isActive: boolean;
}

interface ForecastAssumption {
  id: string;
  name: string;
  value: number;
  unit: string;
  category: 'growth' | 'market' | 'operational' | 'external';
  confidence: number;
}

const Forecasting: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('12-months');
  const [selectedModel, setSelectedModel] = useState('revenue');
  const [showAssumptionsModal, setShowAssumptionsModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [editingAssumption, setEditingAssumption] = useState<ForecastAssumption | null>(null);

  const [forecastModels] = useState<ForecastModel[]>([
    {
      id: '1',
      name: 'Revenue Forecast Model',
      type: 'revenue',
      accuracy: 87.3,
      lastUpdated: new Date('2025-01-15'),
      isActive: true
    },
    {
      id: '2',
      name: 'Expense Projection Model',
      type: 'expense',
      accuracy: 92.1,
      lastUpdated: new Date('2025-01-14'),
      isActive: true
    },
    {
      id: '3',
      name: 'Cash Flow Model',
      type: 'cash_flow',
      accuracy: 89.5,
      lastUpdated: new Date('2025-01-13'),
      isActive: false
    }
  ]);

  const [assumptions, setAssumptions] = useState<ForecastAssumption[]>([
    {
      id: '1',
      name: 'Monthly Revenue Growth',
      value: 8.5,
      unit: '%',
      category: 'growth',
      confidence: 85
    },
    {
      id: '2',
      name: 'Market Expansion Rate',
      value: 12.3,
      unit: '%',
      category: 'market',
      confidence: 78
    },
    {
      id: '3',
      name: 'Customer Acquisition Cost',
      value: 145,
      unit: '$',
      category: 'operational',
      confidence: 92
    },
    {
      id: '4',
      name: 'Churn Rate',
      value: 2.1,
      unit: '%',
      category: 'operational',
      confidence: 88
    }
  ]);

  const [newAssumption, setNewAssumption] = useState({
    name: '',
    value: '',
    unit: '%',
    category: 'growth' as const,
    confidence: 80
  });

  const handleAddAssumption = () => {
    if (newAssumption.name.trim() && newAssumption.value) {
      const assumption: ForecastAssumption = {
        id: Date.now().toString(),
        name: newAssumption.name,
        value: parseFloat(newAssumption.value),
        unit: newAssumption.unit,
        category: newAssumption.category,
        confidence: newAssumption.confidence
      };
      setAssumptions(prev => [...prev, assumption]);
      setNewAssumption({ name: '', value: '', unit: '%', category: 'growth', confidence: 80 });
    }
  };

  const handleEditAssumption = (assumption: ForecastAssumption) => {
    setEditingAssumption(assumption);
    setNewAssumption({
      name: assumption.name,
      value: assumption.value.toString(),
      unit: assumption.unit,
      category: assumption.category,
      confidence: assumption.confidence
    });
  };

  const handleSaveAssumption = () => {
    if (editingAssumption && newAssumption.name.trim() && newAssumption.value) {
      setAssumptions(prev => prev.map(a => 
        a.id === editingAssumption.id 
          ? {
              ...a,
              name: newAssumption.name,
              value: parseFloat(newAssumption.value),
              unit: newAssumption.unit,
              category: newAssumption.category,
              confidence: newAssumption.confidence
            }
          : a
      ));
      setEditingAssumption(null);
      setNewAssumption({ name: '', value: '', unit: '%', category: 'growth', confidence: 80 });
    }
  };

  const handleDeleteAssumption = (id: string) => {
    setAssumptions(prev => prev.filter(a => a.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'growth': return '#4ADE80';
      case 'market': return '#3AB7BF';
      case 'operational': return '#F59E0B';
      case 'external': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return '#4ADE80';
      case 'expense': return '#F87171';
      case 'cash_flow': return '#3AB7BF';
      default: return '#8B5CF6';
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <h2 className="text-xl font-bold text-[#1E2A38]">Financial Forecasting</h2>
        <p className="text-gray-600 mt-1 text-sm">AI-powered financial projections and scenario modeling</p>
      </div>

      {/* Forecast Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Forecast Period</label>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="12-months">12 Months</option>
              <option value="24-months">24 Months</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Model Type</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
              <option value="cash_flow">Cash Flow</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Confidence Level</label>
            <select
              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value="70">70%</option>
              <option value="80">80%</option>
              <option value="90">90%</option>
              <option value="95">95%</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setShowAssumptionsModal(true)}
              className="w-full"
            >
              <Settings className="w-3 h-3 mr-1" />
              Assumptions
            </Button>
          </div>
        </div>
      </Card>

      {/* Forecast Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Revenue Forecast</p>
              <p className="text-lg font-bold text-[#4ADE80] mt-0.5">$12.4M</p>
              <p className="text-xs text-[#4ADE80] mt-0.5">+18.7% projected</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Expense Forecast</p>
              <p className="text-lg font-bold text-[#F87171] mt-0.5">$8.9M</p>
              <p className="text-xs text-gray-600 mt-0.5">+12.3% projected</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Net Income</p>
              <p className="text-lg font-bold text-[#3AB7BF] mt-0.5">$3.5M</p>
              <p className="text-xs text-[#4ADE80] mt-0.5">+28.2% projected</p>
            </div>
            <DollarSign className="w-5 h-5 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Model Accuracy</p>
              <p className="text-lg font-bold text-[#8B5CF6] mt-0.5">87.3%</p>
              <p className="text-xs text-gray-600 mt-0.5">High confidence</p>
            </div>
            <Target className="w-5 h-5 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card title="12-Month Financial Forecast">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">AI-Powered Projections with Confidence Intervals</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Brain className="w-3 h-3 mr-1" />
                AI Insights
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="relative h-48">
            {/* Enhanced Chart with Multiple Lines */}
            <div className="h-36 relative">
              {/* Revenue forecast line */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                <polyline
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="3"
                  points="30,120 90,115 150,110 210,105 270,100 330,95 390,90 450,85 510,80 570,75 630,70 690,65"
                />
                {/* Confidence band for revenue */}
                <polygon
                  fill="#4ADE80"
                  fillOpacity="0.1"
                  points="30,110 90,105 150,100 210,95 270,90 330,85 390,80 450,75 510,70 570,65 630,60 690,55 690,75 630,80 570,85 510,90 450,95 390,100 330,105 270,110 210,115 150,120 90,125 30,130"
                />
              </svg>
              
              {/* Expense forecast line */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 2 }}>
                <polyline
                  fill="none"
                  stroke="#F87171"
                  strokeWidth="3"
                  points="30,140 90,138 150,136 210,134 270,132 330,130 390,128 450,126 510,124 570,122 630,120 690,118"
                />
              </svg>
              
              {/* Net income line */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 3 }}>
                <polyline
                  fill="none"
                  stroke="#3AB7BF"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  points="30,130 90,127 150,124 210,121 270,118 330,115 390,112 450,109 510,106 570,103 630,100 690,97"
                />
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
          <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#4ADE80] rounded mr-1.5"></div>
              <span className="text-xs text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#F87171] rounded mr-1.5"></div>
              <span className="text-xs text-gray-600">Expenses</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-[#3AB7BF] mr-1.5" style={{ borderTop: '2px dashed #3AB7BF' }}></div>
              <span className="text-xs text-gray-600">Net Income</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#4ADE80] opacity-20 rounded mr-1.5"></div>
              <span className="text-xs text-gray-600">Confidence Band</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-[#4ADE80]">$1.2M</p>
              <p className="text-xs text-gray-500">Projected Revenue (Next Month)</p>
              <p className="text-xs text-[#4ADE80]">87% confidence</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#3AB7BF]">$12.4M</p>
              <p className="text-xs text-gray-500">Annual Projection</p>
              <p className="text-xs text-[#4ADE80]">+18.7% growth</p>
            </div>
            <div>
              <p className="text-lg font-bold text-[#F59E0B]">$3.5M</p>
              <p className="text-xs text-gray-500">Net Income Forecast</p>
              <p className="text-xs text-[#4ADE80]">28.2% margin</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Forecast Models */}
      <Card title="Forecast Models">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">AI models trained on your historical data</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowModelModal(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Model
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {forecastModels.map(model => (
              <div 
                key={model.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  model.isActive ? 'border-[#4ADE80] bg-[#4ADE80]/5' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${getModelTypeColor(model.type)}20` }}
                  >
                    <Brain className="w-4 h-4" style={{ color: getModelTypeColor(model.type) }} />
                  </div>
                  <span className="text-lg font-bold" style={{ color: getModelTypeColor(model.type) }}>
                    {model.accuracy}%
                  </span>
                </div>
                <h3 className="font-semibold text-[#1E2A38] mb-1">{model.name}</h3>
                <p className="text-xs text-gray-500">Updated: {model.lastUpdated.toLocaleDateString()}</p>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.isActive ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {model.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Key Assumptions */}
      <Card title="Forecast Assumptions">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Key variables driving your forecasts</p>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setShowAssumptionsModal(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Assumption
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assumptions.map(assumption => (
              <div key={assumption.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#3AB7BF] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[#1E2A38]">{assumption.name}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditAssumption(assumption)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit3 className="w-3 h-3 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteAssumption(assumption.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#3AB7BF]">
                    {assumption.value}{assumption.unit}
                  </span>
                  <div className="text-right">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${getCategoryColor(assumption.category)}20`,
                        color: getCategoryColor(assumption.category)
                      }}
                    >
                      {assumption.category}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{assumption.confidence}% confidence</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* AI Insights */}
      <Card title="AI Forecast Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#4ADE80]/10 rounded-lg">
            <div className="flex items-center mb-2">
              <Lightbulb className="w-4 h-4 text-[#4ADE80] mr-2" />
              <h4 className="font-semibold text-[#1E2A38]">Growth Opportunity</h4>
            </div>
            <p className="text-sm text-gray-700">
              Revenue growth is accelerating. Consider increasing marketing spend by 15% to capture additional market share.
            </p>
          </div>
          
          <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] mr-2" />
              <h4 className="font-semibold text-[#1E2A38]">Risk Alert</h4>
            </div>
            <p className="text-sm text-gray-700">
              Expense growth is outpacing revenue in Q2. Monitor operational efficiency closely.
            </p>
          </div>
          
          <div className="p-4 bg-[#3AB7BF]/10 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="w-4 h-4 text-[#3AB7BF] mr-2" />
              <h4 className="font-semibold text-[#1E2A38]">Optimization</h4>
            </div>
            <p className="text-sm text-gray-700">
              Cash flow timing suggests optimal hiring window in months 4-6 for maximum efficiency.
            </p>
          </div>
        </div>
      </Card>

      {/* Assumptions Modal */}
      {showAssumptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">
                {editingAssumption ? 'Edit Assumption' : 'Add Forecast Assumption'}
              </h3>
              <button
                onClick={() => {
                  setShowAssumptionsModal(false);
                  setEditingAssumption(null);
                  setNewAssumption({ name: '', value: '', unit: '%', category: 'growth', confidence: 80 });
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assumption Name</label>
                <input
                  type="text"
                  value={newAssumption.name}
                  onChange={(e) => setNewAssumption({...newAssumption, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Monthly Revenue Growth Rate"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAssumption.value}
                    onChange={(e) => setNewAssumption({...newAssumption, value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder="8.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={newAssumption.unit}
                    onChange={(e) => setNewAssumption({...newAssumption, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="%">Percentage (%)</option>
                    <option value="$">Dollar ($)</option>
                    <option value="units">Units</option>
                    <option value="days">Days</option>
                    <option value="ratio">Ratio</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newAssumption.category}
                    onChange={(e) => setNewAssumption({...newAssumption, category: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="growth">Growth</option>
                    <option value="market">Market</option>
                    <option value="operational">Operational</option>
                    <option value="external">External</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confidence (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAssumption.confidence}
                    onChange={(e) => setNewAssumption({...newAssumption, confidence: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAssumptionsModal(false);
                  setEditingAssumption(null);
                  setNewAssumption({ name: '', value: '', unit: '%', category: 'growth', confidence: 80 });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingAssumption ? handleSaveAssumption : handleAddAssumption}
                disabled={!newAssumption.name.trim() || !newAssumption.value}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingAssumption ? 'Save Changes' : 'Add Assumption'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Model Configuration Modal */}
      {showModelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Forecast Model</h3>
              <button
                onClick={() => setShowModelModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Q2 Revenue Model"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="revenue">Revenue Forecast</option>
                  <option value="expense">Expense Projection</option>
                  <option value="cash_flow">Cash Flow Model</option>
                  <option value="custom">Custom Model</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Training Period</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="12">Last 12 months</option>
                  <option value="24">Last 24 months</option>
                  <option value="36">Last 36 months</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModelModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModelModal(false)}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] transition-colors"
              >
                Create Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecasting;