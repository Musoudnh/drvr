import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, BarChart3, Plus, X, Search, ChevronDown, Minus, Settings } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface GLCode {
  code: string;
  name: string;
  category: 'Revenue' | 'Expenses' | 'Assets' | 'Liabilities';
  currentValue: number;
}

interface ForecastData {
  glCode: string;
  glName: string;
  category: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
}

interface AppliedScenario {
  id: string;
  name: string;
  description: string;
  glCode: string;
  adjustmentType: 'percentage' | 'fixed';
  adjustmentValue: number;
  startMonth: string;
  endMonth: string;
  assumptions: { name: string; value: string; description: string }[];
  createdBy: string;
  createdAt: Date;
}

interface ScenarioAssumption {
  name: string;
  value: string;
  description: string;
}

const Forecasting: React.FC = () => {
  const [showScenarioPanel, setShowScenarioPanel] = useState(false);
  const [appliedScenarios, setAppliedScenarios] = useState<AppliedScenario[]>([
    {
      id: '1',
      name: 'Q2 Marketing Campaign',
      description: 'Increased marketing spend for product launch',
      glCode: '5100',
      adjustmentType: 'percentage',
      adjustmentValue: 25,
      startMonth: 'Apr 2025',
      endMonth: 'Jun 2025',
      assumptions: [
        { name: 'Campaign Budget', value: '$50,000', description: 'Additional marketing spend for Q2' },
        { name: 'Expected ROI', value: '3.2x', description: 'Return on marketing investment' }
      ],
      createdBy: 'Sarah Johnson',
      createdAt: new Date('2025-01-15')
    }
  ]);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);
  const [selectedGLCode, setSelectedGLCode] = useState('');
  const [scenarioForm, setScenarioForm] = useState({
    name: '',
    description: '',
    adjustmentType: 'percentage' as 'percentage' | 'fixed',
    adjustmentValue: 0,
    startMonth: 'Jan 2025',
    endMonth: 'Dec 2025'
  });
  const [assumptions, setAssumptions] = useState<ScenarioAssumption[]>([
    { name: '', value: '', description: '' }
  ]);

  const months = [
    'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025',
    'Jul 2025', 'Aug 2025', 'Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025'
  ];

  const glCodes: GLCode[] = [
    { code: '4000', name: 'Product Revenue', category: 'Revenue', currentValue: 485000 },
    { code: '4100', name: 'Service Revenue', category: 'Revenue', currentValue: 245000 },
    { code: '4200', name: 'Other Income', category: 'Revenue', currentValue: 87500 },
    { code: '5000', name: 'Cost of Goods Sold', category: 'Expenses', currentValue: 285000 },
    { code: '5100', name: 'Marketing Expenses', category: 'Expenses', currentValue: 45000 },
    { code: '5200', name: 'Salaries & Benefits', category: 'Expenses', currentValue: 128000 },
    { code: '5300', name: 'Office & Administrative', category: 'Expenses', currentValue: 35000 },
    { code: '5400', name: 'Technology & Software', category: 'Expenses', currentValue: 18500 }
  ];

  const forecastData: ForecastData[] = [
    {
      glCode: '4000',
      glName: 'Product Revenue',
      category: 'Revenue',
      jan: 485000, feb: 502000, mar: 518000, apr: 535000, may: 552000, jun: 570000,
      jul: 588000, aug: 607000, sep: 626000, oct: 646000, nov: 667000, dec: 688000
    },
    {
      glCode: '4100',
      glName: 'Service Revenue',
      category: 'Revenue',
      jan: 245000, feb: 253000, mar: 261000, apr: 270000, may: 279000, jun: 288000,
      jul: 297000, aug: 307000, sep: 317000, oct: 327000, nov: 338000, dec: 349000
    },
    {
      glCode: '5000',
      glName: 'Cost of Goods Sold',
      category: 'Expenses',
      jan: 285000, feb: 295000, mar: 305000, apr: 315000, may: 325000, jun: 336000,
      jul: 347000, aug: 358000, sep: 370000, oct: 382000, nov: 395000, dec: 408000
    },
    {
      glCode: '5100',
      glName: 'Marketing Expenses',
      category: 'Expenses',
      jan: 45000, feb: 46000, mar: 47000, apr: 58750, may: 60000, jun: 61250,
      jul: 49000, aug: 50000, sep: 51000, oct: 52000, nov: 53000, dec: 54000
    },
    {
      glCode: '5200',
      glName: 'Salaries & Benefits',
      category: 'Expenses',
      jan: 128000, feb: 131000, mar: 134000, apr: 137000, may: 140000, jun: 143000,
      jul: 146000, aug: 149000, sep: 152000, oct: 155000, nov: 158000, dec: 161000
    }
  ];

  const applyScenarioToForecast = (data: ForecastData[], scenarios: AppliedScenario[]): ForecastData[] => {
    return data.map(row => {
      let adjustedRow = { ...row };
      
      scenarios.forEach(scenario => {
        if (scenario.glCode === row.glCode) {
          const startIndex = months.indexOf(scenario.startMonth);
          const endIndex = months.indexOf(scenario.endMonth);
          
          const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
          
          monthKeys.forEach((month, index) => {
            if (index >= startIndex && index <= endIndex) {
              if (scenario.adjustmentType === 'percentage') {
                adjustedRow[month] = adjustedRow[month] * (1 + scenario.adjustmentValue / 100);
              } else {
                adjustedRow[month] = adjustedRow[month] + scenario.adjustmentValue;
              }
            }
          });
        }
      });
      
      return adjustedRow;
    });
  };

  const adjustedForecastData = applyScenarioToForecast(forecastData, appliedScenarios);

  const calculateYTD = (row: ForecastData): number => {
    const currentMonth = new Date().getMonth(); // 0-based (0 = January)
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
    
    return monthKeys.slice(0, currentMonth + 1).reduce((sum, month) => sum + row[month], 0);
  };

  const calculateFY = (row: ForecastData): number => {
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
    return monthKeys.reduce((sum, month) => sum + row[month], 0);
  };

  const toggleScenarioExpansion = (scenarioId: string) => {
    setExpandedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const removeScenario = (scenarioId: string) => {
    setAppliedScenarios(prev => prev.filter(s => s.id !== scenarioId));
  };

  const addAssumption = () => {
    setAssumptions(prev => [...prev, { name: '', value: '', description: '' }]);
  };

  const removeAssumption = (index: number) => {
    if (assumptions.length > 1) {
      setAssumptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateAssumption = (index: number, field: keyof ScenarioAssumption, value: string) => {
    setAssumptions(prev => prev.map((assumption, i) => 
      i === index ? { ...assumption, [field]: value } : assumption
    ));
  };

  const handleCreateScenario = () => {
    if (scenarioForm.name.trim() && selectedGLCode) {
      const newScenario: AppliedScenario = {
        id: Date.now().toString(),
        ...scenarioForm,
        glCode: selectedGLCode,
        assumptions: assumptions.filter(a => a.name.trim()),
        createdBy: 'Current User',
        createdAt: new Date()
      };
      
      setAppliedScenarios(prev => [...prev, newScenario]);
      
      // Reset form
      setScenarioForm({
        name: '',
        description: '',
        adjustmentType: 'percentage',
        adjustmentValue: 0,
        startMonth: 'Jan 2025',
        endMonth: 'Dec 2025'
      });
      setSelectedGLCode('');
      setAssumptions([{ name: '', value: '', description: '' }]);
      setShowScenarioPanel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Financial Forecasting</h2>
          <p className="text-gray-600 mt-1">Plan and model your financial future with scenario analysis</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="primary" 
            onClick={() => setShowScenarioPanel(true)}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
          >
            <Settings className="w-4 h-4 mr-2" />
            Scenarios
          </Button>
        </div>
      </div>

      {/* Applied Scenarios */}
      {appliedScenarios.length > 0 && (
        <Card title="Applied Scenarios">
          <div className="space-y-3">
            {appliedScenarios.map(scenario => (
              <div key={scenario.id} className="border border-gray-200 rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleScenarioExpansion(scenario.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-[#8B5CF6] rounded-full mr-3"></div>
                      <div>
                        <h3 className="font-semibold text-[#1E2A38]">{scenario.name}</h3>
                        <p className="text-sm text-gray-600">
                          {scenario.glCode} • {scenario.adjustmentType === 'percentage' ? `${scenario.adjustmentValue}%` : `$${scenario.adjustmentValue.toLocaleString()}`} • 
                          {scenario.startMonth} - {scenario.endMonth}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeScenario(scenario.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedScenarios.includes(scenario.id) ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </div>
                
                {expandedScenarios.includes(scenario.id) && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="pt-3 space-y-3">
                      <p className="text-sm text-gray-700">{scenario.description}</p>
                      
                      <div className="text-xs text-gray-500">
                        Added by {scenario.createdBy} • {scenario.createdAt.toLocaleDateString()}
                      </div>
                      
                      {scenario.assumptions.length > 0 && (
                        <div>
                          <h4 className="font-medium text-[#1E2A38] mb-2">Key Assumptions:</h4>
                          <div className="space-y-2">
                            {scenario.assumptions.map((assumption, index) => (
                              <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                                <div className="flex justify-between items-start">
                                  <span className="font-medium text-gray-700">{assumption.name}</span>
                                  <span className="text-[#8B5CF6] font-medium">{assumption.value}</span>
                                </div>
                                {assumption.description && (
                                  <p className="text-gray-600 mt-1">{assumption.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Forecast Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">$6.98M</p>
              <p className="text-sm text-[#4ADE80] mt-1">+15.4% projected</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-[#F87171] mt-1">$4.12M</p>
              <p className="text-sm text-gray-600 mt-1">+8.7% projected</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[#F87171]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Income</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">$2.86M</p>
              <p className="text-sm text-[#4ADE80] mt-1">+28.4% projected</p>
            </div>
            <Target className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">41.0%</p>
              <p className="text-sm text-[#4ADE80] mt-1">+2.8% vs current</p>
            </div>
            <DollarSign className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>
      </div>

      {/* Forecast Table */}
      <Card title="12-Month Forecast by GL Code">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 sticky left-0 bg-white z-10 min-w-[200px]">GL Code</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Jan</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Feb</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Mar</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Apr</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">May</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Jun</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Jul</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Aug</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Sep</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Oct</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Nov</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 min-w-[80px]">Dec</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 w-32 bg-[#3AB7BF]/10">YTD Total</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700 w-32 bg-[#4ADE80]/10">FY Total</th>
              </tr>
            </thead>
            <tbody>
              {adjustedForecastData.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 sticky left-0 bg-white z-10">
                    <div>
                      <span className="font-medium text-[#1E2A38]">{row.glCode}</span>
                      <p className="text-xs text-gray-600">{row.glName}</p>
                    </div>
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.jan.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.feb.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.mar.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.apr.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.may.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.jun.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.jul.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.aug.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.sep.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.oct.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.nov.toLocaleString()}
                  </td>
                  <td className={`py-2 px-4 text-right font-medium ${row.category === 'Revenue' ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                    ${row.dec.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right font-bold text-[#3AB7BF] bg-[#3AB7BF]/5">
                    ${calculateYTD(row).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 text-right font-bold text-[#4ADE80] bg-[#4ADE80]/5">
                    ${calculateFY(row).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Scenario Configuration Side Panel */}
      {showScenarioPanel && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowScenarioPanel(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Configure Scenario</h3>
              <button
                onClick={() => setShowScenarioPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Scenario Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1E2A38] flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Scenario Details
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
                  <input
                    type="text"
                    value={scenarioForm.name}
                    onChange={(e) => setScenarioForm({...scenarioForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    placeholder="e.g., Q2 Growth Initiative"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={scenarioForm.description}
                    onChange={(e) => setScenarioForm({...scenarioForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    rows={3}
                    placeholder="Describe the scenario and its context"
                  />
                </div>
              </div>

              {/* GL Selection */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1E2A38] flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  GL Account Selection
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select GL Code</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={selectedGLCode}
                      onChange={(e) => setSelectedGLCode(e.target.value)}
                      className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent appearance-none"
                    >
                      <option value="">Select a GL account...</option>
                      {glCodes.map(gl => (
                        <option key={gl.code} value={gl.code}>
                          {gl.code} - {gl.name} ({gl.category})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Adjustment Configuration */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1E2A38] flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Adjustment Configuration
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={scenarioForm.adjustmentType}
                      onChange={(e) => setScenarioForm({...scenarioForm, adjustmentType: e.target.value as 'percentage' | 'fixed'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value {scenarioForm.adjustmentType === 'percentage' ? '(%)' : '($)'}
                    </label>
                    <input
                      type="number"
                      step={scenarioForm.adjustmentType === 'percentage' ? '0.1' : '1000'}
                      value={scenarioForm.adjustmentValue}
                      onChange={(e) => setScenarioForm({...scenarioForm, adjustmentValue: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                      placeholder={scenarioForm.adjustmentType === 'percentage' ? '15.0' : '50000'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                    <select
                      value={scenarioForm.startMonth}
                      onChange={(e) => setScenarioForm({...scenarioForm, startMonth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                    <select
                      value={scenarioForm.endMonth}
                      onChange={(e) => setScenarioForm({...scenarioForm, endMonth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Key Assumptions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#1E2A38] flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Key Assumptions
                  </h4>
                  <button
                    onClick={addAssumption}
                    className="p-1 hover:bg-gray-100 rounded text-[#8B5CF6]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {assumptions.map((assumption, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Assumption {index + 1}</span>
                        {assumptions.length > 1 && (
                          <button
                            onClick={() => removeAssumption(index)}
                            className="p-1 hover:bg-red-100 rounded text-red-500"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <input
                        type="text"
                        value={assumption.name}
                        onChange={(e) => updateAssumption(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent"
                        placeholder="Assumption name"
                      />
                      
                      <input
                        type="text"
                        value={assumption.value}
                        onChange={(e) => updateAssumption(index, 'value', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent"
                        placeholder="Value (e.g., $50K, 15%, 3 months)"
                      />
                      
                      <textarea
                        value={assumption.description}
                        onChange={(e) => updateAssumption(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#8B5CF6] focus:border-transparent"
                        rows={2}
                        placeholder="Description (optional)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Preview */}
              {selectedGLCode && scenarioForm.adjustmentValue !== 0 && (
                <div className="p-4 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
                  <h4 className="font-semibold text-[#1E2A38] mb-2">Impact Preview</h4>
                  <p className="text-sm text-gray-700">
                    This scenario will {scenarioForm.adjustmentValue > 0 ? 'increase' : 'decrease'} {' '}
                    {glCodes.find(gl => gl.code === selectedGLCode)?.name} by {' '}
                    {scenarioForm.adjustmentType === 'percentage' 
                      ? `${Math.abs(scenarioForm.adjustmentValue)}%`
                      : `$${Math.abs(scenarioForm.adjustmentValue).toLocaleString()}`
                    } from {scenarioForm.startMonth} to {scenarioForm.endMonth}.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowScenarioPanel(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateScenario}
                  disabled={!scenarioForm.name.trim() || !selectedGLCode}
                  className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply Scenario
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Forecasting;