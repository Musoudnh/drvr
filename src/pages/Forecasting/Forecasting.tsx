import React, { useState, useEffect } from 'react';
import { Target, Calendar, Filter, Download, Settings, BarChart3, TrendingUp, TrendingDown, Plus, Search, Eye, Edit3, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface GLCode {
  code: string;
  name: string;
  category: 'Revenue' | 'COGS' | 'OPEX' | 'Other';
  type: 'revenue' | 'expense';
}

interface MonthlyForecast {
  glCode: string;
  month: string;
  forecastedAmount: number;
  actualAmount?: number;
  variance?: number;
  changeVsPrior?: number;
  cumulativeYTD: number;
  isEditable: boolean;
}

interface ScenarioAssumption {
  name: string;
  value: number;
  unit: '%' | '$' | 'count';
  min: number;
  max: number;
  step: number;
}

interface AppliedScenario {
  id: string;
  glCode: string;
  name: string;
  description: string;
  startMonth: string;
  endMonth: string;
  bonusImpact?: number;
  adjustmentType: 'percentage' | 'fixed';
  adjustmentValue: number;
  appliedAt: Date;
}

const Forecasting: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [multiYearView, setMultiYearView] = useState(false);
  const [yearRange, setYearRange] = useState([2025, 2026]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Revenue', 'OPEX']);
  const [showScenarioPanel, setShowScenarioPanel] = useState(true);
  const [showGLScenarioModal, setShowGLScenarioModal] = useState(false);
  const [selectedGLCode, setSelectedGLCode] = useState<GLCode | null>(null);
  const [appliedScenarios, setAppliedScenarios] = useState<AppliedScenario[]>([]);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);
  const [glScenarioForm, setGLScenarioForm] = useState({
    title: '',
    description: '',
    owner: 'Current User',
    startMonth: 'Jan',
    endMonth: 'Dec',
    startYear: selectedYear,
    endYear: selectedYear,
    scenarioType: 'custom',
    // Sales/Revenue assumptions
    revenueGrowthPercent: 0,
    salesVolumeAssumption: 0,
    pricingAssumption: 0,
    churnRatePercent: 0,
    marketExpansion: 0,
    // Expense assumptions
    marketingSpendPercent: 0,
    cogsPercent: 0,
    rdPercent: 0,
    overheadCosts: 0,
    variableFixedSplit: 50,
    // Payroll specific
    headcount: 0,
    headcountGrowthPercent: 0,
    averageSalary: 0,
    payrollTaxRate: 15.3,
    benefitsRate: 25,
    hiringPlan: 0,
    attritionRatePercent: 15,
    // Travel specific
    numberOfTrips: 0,
    averageTripCost: 0,
    // Marketing specific
    campaignBudget: 0,
    numberOfCampaigns: 0,
    // Office/Rent specific
    squareFootage: 0,
    pricePerSqFt: 0,
    // Technology specific
    numberOfLicenses: 0,
    costPerLicense: 0,
    // General
    adjustmentType: 'percentage' as 'percentage' | 'fixed',
    adjustmentValue: 0
  });

  // Helper functions - moved before useState to avoid initialization errors
  const getBaseAmount = (glCode: string): number => {
    const baseAmounts: { [key: string]: number } = {
      '4000': 285000, '4100': 95000, '4200': 35000, '4300': 15000,
      '5000': 125000, '5100': 45000, '5200': 35000,
      '6000': 128000, '6100': 35000, '6200': 25000, '6300': 18500, '6400': 12000, '6500': 8000,
      '7000': 5000, '7100': 15000
    };
    return baseAmounts[glCode] || 10000;
  };

  const getSeasonalFactor = (month: string): number => {
    const factors: { [key: string]: number } = {
      'Jan': 0.95, 'Feb': 0.98, 'Mar': 1.05, 'Apr': 1.08, 'May': 1.12, 'Jun': 1.15,
      'Jul': 1.18, 'Aug': 1.10, 'Sep': 1.06, 'Oct': 1.02, 'Nov': 0.92, 'Dec': 0.88
    };
    return factors[month] || 1.0;
  };

  const glCodes: GLCode[] = [
    { code: '4000', name: 'Product Sales', category: 'Revenue', type: 'revenue' },
    { code: '4100', name: 'Service Revenue', category: 'Revenue', type: 'revenue' },
    { code: '4200', name: 'Licensing Revenue', category: 'Revenue', type: 'revenue' },
    { code: '4300', name: 'Other Income', category: 'Revenue', type: 'revenue' },
    { code: '5000', name: 'Cost of Goods Sold', category: 'COGS', type: 'expense' },
    { code: '5100', name: 'Direct Labor', category: 'COGS', type: 'expense' },
    { code: '5200', name: 'Materials & Supplies', category: 'COGS', type: 'expense' },
    { code: '6000', name: 'Payroll & Benefits', category: 'OPEX', type: 'expense' },
    { code: '6100', name: 'Marketing & Advertising', category: 'OPEX', type: 'expense' },
    { code: '6200', name: 'Rent & Utilities', category: 'OPEX', type: 'expense' },
    { code: '6300', name: 'Technology & Software', category: 'OPEX', type: 'expense' },
    { code: '6400', name: 'Professional Services', category: 'OPEX', type: 'expense' },
    { code: '6500', name: 'Travel & Entertainment', category: 'OPEX', type: 'expense' },
    { code: '7000', name: 'Interest Expense', category: 'Other', type: 'expense' },
    { code: '7100', name: 'Depreciation', category: 'Other', type: 'expense' }
  ];

  const [scenarioAssumptions, setScenarioAssumptions] = useState<ScenarioAssumption[]>([
    { name: 'Revenue Growth', value: 15.4, unit: '%', min: -20, max: 50, step: 0.1 },
    { name: 'Headcount Growth', value: 8.2, unit: '%', min: -10, max: 30, step: 0.1 },
    { name: 'Marketing Spend', value: 12.5, unit: '%', min: 0, max: 25, step: 0.1 },
    { name: 'Salary Inflation', value: 4.5, unit: '%', min: 0, max: 15, step: 0.1 },
    { name: 'Office Rent Increase', value: 3.0, unit: '%', min: 0, max: 10, step: 0.1 }
  ]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate forecast data
  const [forecastData, setForecastData] = useState<MonthlyForecast[]>(() => {
    const data: MonthlyForecast[] = [];
    const currentMonth = new Date().getMonth();
    
    glCodes.forEach(glCode => {
      let cumulativeYTD = 0;
      let previousAmount = 0;
      
      months.forEach((month, index) => {
        const isHistorical = index <= currentMonth;
        const baseAmount = getBaseAmount(glCode.code);
        const seasonalFactor = getSeasonalFactor(month);
        const growthFactor = Math.pow(1 + (scenarioAssumptions[0].value / 100), index / 12);
        
        let forecastedAmount = baseAmount * seasonalFactor * growthFactor;
        
        // Apply scenario assumptions
        if (glCode.code === '6000') { // Payroll
          forecastedAmount *= (1 + scenarioAssumptions[1].value / 100) * (1 + scenarioAssumptions[3].value / 100);
        } else if (glCode.code === '6100') { // Marketing
          forecastedAmount *= (1 + scenarioAssumptions[2].value / 100);
        } else if (glCode.code === '6200') { // Rent
          forecastedAmount *= (1 + scenarioAssumptions[4].value / 100);
        }
        
        cumulativeYTD += forecastedAmount;
        const changeVsPrior = previousAmount > 0 ? ((forecastedAmount - previousAmount) / previousAmount) * 100 : 0;
        
        const actualAmount = isHistorical ? forecastedAmount * (0.95 + Math.random() * 0.1) : undefined;
        const variance = actualAmount ? ((actualAmount - forecastedAmount) / forecastedAmount) * 100 : undefined;
        
        data.push({
          glCode: glCode.code,
          month: `${month} ${selectedYear}`,
          forecastedAmount: Math.round(forecastedAmount),
          actualAmount: actualAmount ? Math.round(actualAmount) : undefined,
          variance,
          changeVsPrior: index > 0 ? changeVsPrior : undefined,
          cumulativeYTD: Math.round(cumulativeYTD),
          isEditable: !isHistorical
        });
        
        previousAmount = forecastedAmount;
      });
    });
    
    return data;
  });

  const updateForecastAmount = (glCode: string, month: string, newAmount: number) => {
    setForecastData(prev => prev.map(item => 
      item.glCode === glCode && item.month === month
        ? { ...item, forecastedAmount: newAmount }
        : item
    ));
  };

  const updateScenarioAssumption = (name: string, value: number) => {
    setScenarioAssumptions(prev => prev.map(assumption =>
      assumption.name === name ? { ...assumption, value } : assumption
    ));
    
    // Recalculate forecast data based on new assumptions
    // This would trigger a recalculation of all forecast amounts
  };

  const getMonthlyData = (month: string) => {
    return forecastData.filter(item => item.month === month);
  };

  const getMonthlyTotal = (month: string, type: 'revenue' | 'expense') => {
    const monthData = getMonthlyData(month);
    return monthData
      .filter(item => {
        const glCode = glCodes.find(gl => gl.code === item.glCode);
        return glCode?.type === type;
      })
      .reduce((sum, item) => sum + item.forecastedAmount, 0);
  };

  const getNetProfit = (month: string) => {
    const revenue = getMonthlyTotal(month, 'revenue');
    const expenses = getMonthlyTotal(month, 'expense');
    return revenue - expenses;
  };

  const filteredGLCodes = glCodes.filter(glCode => {
    const matchesSearch = glCode.code.includes(searchTerm) || 
                         glCode.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || glCode.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Revenue': return '#4ADE80';
      case 'COGS': return '#F87171';
      case 'OPEX': return '#3AB7BF';
      case 'Other': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getVarianceColor = (variance: number) => {
    if (Math.abs(variance) < 5) return 'text-[#4ADE80]';
    if (Math.abs(variance) < 15) return 'text-[#F59E0B]';
    return 'text-[#F87171]';
  };

  const renderGLSpecificInputs = () => {
    if (!selectedGLCode) return null;

    switch (selectedGLCode.code) {
      case '6000': // Payroll & Benefits
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-[#1E2A38]">Payroll Assumptions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Headcount</label>
                <input
                  type="number"
                  value={glScenarioForm.headcount}
                  onChange={(e) => setGLScenarioForm({...glScenarioForm, headcount: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avg Salary</label>
                <input
                  type="number"
                  value={glScenarioForm.averageSalary}
                  onChange={(e) => setGLScenarioForm({...glScenarioForm, averageSalary: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
      
      case '6500': // Travel & Entertainment
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-[#1E2A38]">Travel Assumptions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Trips</label>
                <input
                  type="number"
                  value={glScenarioForm.numberOfTrips}
                  onChange={(e) => setGLScenarioForm({...glScenarioForm, numberOfTrips: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avg Trip Cost</label>
                <input
                  type="number"
                  value={glScenarioForm.averageTripCost}
                  onChange={(e) => setGLScenarioForm({...glScenarioForm, averageTripCost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment Type</label>
              <select
                value={glScenarioForm.adjustmentType}
                onChange={(e) => setGLScenarioForm({...glScenarioForm, adjustmentType: e.target.value as 'percentage' | 'fixed'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              >
                <option value="percentage">Percentage Change</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {glScenarioForm.adjustmentType === 'percentage' ? 'Percentage Change (%)' : 'Fixed Amount ($)'}
              </label>
              <input
                type="number"
                value={glScenarioForm.adjustmentValue}
                onChange={(e) => setGLScenarioForm({...glScenarioForm, adjustmentValue: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                step={glScenarioForm.adjustmentType === 'percentage' ? '0.1' : '100'}
              />
            </div>
          </div>
        );
    }
  };

  const getImpactPreview = () => {
    if (!selectedGLCode) return '';
    
    const baseAmount = getBaseAmount(selectedGLCode.code);
    let impact = 0;
    
    if (glScenarioForm.adjustmentType === 'percentage') {
      impact = baseAmount * (glScenarioForm.adjustmentValue / 100);
    } else {
      impact = glScenarioForm.adjustmentValue;
    }
    
    return `This scenario will ${impact >= 0 ? 'increase' : 'decrease'} monthly amounts by approximately $${Math.abs(impact).toLocaleString()}`;
  };

  const isScenarioValid = () => {
    return glScenarioForm.title.trim() !== '' && glScenarioForm.adjustmentValue !== 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Financial Forecasting</h2>
          <p className="text-gray-600 mt-1">Monthly GL code forecasting with scenario planning</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" className="bg-[#3AB7BF] hover:bg-[#2A9BA3]">
            <Save className="w-4 h-4 mr-2" />
            Save Forecast
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={multiYearView}
                  onChange={(e) => setMultiYearView(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#3AB7BF]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3AB7BF]"></div>
              </label>
              <span className="ml-2 text-sm text-gray-700">Multi-Year</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
            >
              <option value="All">All Categories</option>
              <option value="Revenue">Revenue</option>
              <option value="COGS">Cost of Goods Sold</option>
              <option value="OPEX">Operating Expenses</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search GL Codes</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search codes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => setShowScenarioPanel(!showScenarioPanel)}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Scenarios
            </Button>
          </div>
        </div>
      </Card>

      {/* Budget vs Prior Year and Actuals vs Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Budget vs Prior Year">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Annual Comparison ({selectedYear} vs {selectedYear - 1})</span>
              <span className="text-sm text-[#4ADE80] font-medium">+12.8% vs Prior Year</span>
            </div>
            <div className="relative h-48">
              <svg className="w-full h-full">
                {/* Prior Year bars */}
                {months.slice(0, 6).map((month, index) => {
                  const x = 40 + index * 80;
                  const priorYearRevenue = getMonthlyTotal(`${month} ${selectedYear - 1}`, 'revenue') * 0.85;
                  const currentYearRevenue = getMonthlyTotal(`${month} ${selectedYear}`, 'revenue');
                  const maxRevenue = Math.max(priorYearRevenue, currentYearRevenue);
                  const priorHeight = (priorYearRevenue / maxRevenue) * 120;
                  const currentHeight = (currentYearRevenue / maxRevenue) * 120;
                  
                  return (
                    <g key={index}>
                      {/* Prior year bar */}
                      <rect
                        x={x - 15}
                        y={140 - priorHeight}
                        width="12"
                        height={priorHeight}
                        fill="#94A3B8"
                        rx="2"
                      />
                      {/* Current year bar */}
                      <rect
                        x={x + 3}
                        y={140 - currentHeight}
                        width="12"
                        height={currentHeight}
                        fill="#3AB7BF"
                        rx="2"
                      />
                      {/* Month label */}
                      <text x={x} y={160} textAnchor="middle" className="text-xs fill-gray-500">
                        {month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-center gap-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#94A3B8] rounded mr-2"></div>
                <span className="text-sm text-gray-600">{selectedYear - 1}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#3AB7BF] rounded mr-2"></div>
                <span className="text-sm text-gray-600">{selectedYear}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-[#3AB7BF]">
                  ${months.reduce((sum, month) => sum + getMonthlyTotal(`${month} ${selectedYear}`, 'revenue'), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{selectedYear} Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#94A3B8]">
                  ${Math.round(months.reduce((sum, month) => sum + getMonthlyTotal(`${month} ${selectedYear}`, 'revenue'), 0) * 0.85).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{selectedYear - 1} Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#4ADE80]">+12.8%</p>
                <p className="text-xs text-gray-500">YoY Growth</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Actuals vs Budget">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">YTD Performance vs Budget</span>
              <span className="text-sm text-[#4ADE80] font-medium">+8.4% vs Budget</span>
            </div>
            <div className="relative h-48">
              <svg className="w-full h-full">
                {/* Budget vs Actual comparison */}
                {months.slice(0, 6).map((month, index) => {
                  const x = 40 + index * 80;
                  const budgetRevenue = getMonthlyTotal(`${month} ${selectedYear}`, 'revenue') * 0.92;
                  const actualRevenue = getMonthlyTotal(`${month} ${selectedYear}`, 'revenue');
                  const maxRevenue = Math.max(budgetRevenue, actualRevenue);
                  const budgetHeight = (budgetRevenue / maxRevenue) * 120;
                  const actualHeight = (actualRevenue / maxRevenue) * 120;
                  
                  return (
                    <g key={index}>
                      {/* Budget bar */}
                      <rect
                        x={x - 15}
                        y={140 - budgetHeight}
                        width="12"
                        height={budgetHeight}
                        fill="#F59E0B"
                        rx="2"
                      />
                      {/* Actual bar */}
                      <rect
                        x={x + 3}
                        y={140 - actualHeight}
                        width="12"
                        height={actualHeight}
                        fill="#4ADE80"
                        rx="2"
                      />
                      {/* Month label */}
                      <text x={x} y={160} textAnchor="middle" className="text-xs fill-gray-500">
                        {month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
            
            <div className="flex justify-center gap-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#F59E0B] rounded mr-2"></div>
                <span className="text-sm text-gray-600">Budget</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4ADE80] rounded mr-2"></div>
                <span className="text-sm text-gray-600">Actuals</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-[#4ADE80]">
                  ${months.reduce((sum, month) => sum + getMonthlyTotal(`${month} ${selectedYear}`, 'revenue'), 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Actual Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#F59E0B]">
                  ${Math.round(months.reduce((sum, month) => sum + getMonthlyTotal(`${month} ${selectedYear}`, 'revenue'), 0) * 0.92).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Budget Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#4ADE80]">+8.4%</p>
                <p className="text-xs text-gray-500">vs Budget</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Analysis */}
      <Card title="Performance Analysis">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-[#1E2A38] mb-4">Budget vs Actuals (YTD)</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Revenue</span>
                  <div className="text-right">
                    <p className="font-bold text-[#4ADE80]">+8.4%</p>
                    <p className="text-xs text-gray-500">vs budget</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Operating Expenses</span>
                  <div className="text-right">
                    <p className="font-bold text-[#4ADE80]">-3.2%</p>
                    <p className="text-xs text-gray-500">vs budget</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Net Profit</span>
                  <div className="text-right">
                    <p className="font-bold text-[#4ADE80]">+28.7%</p>
                    <p className="text-xs text-gray-500">vs budget</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#1E2A38] mb-4">Prior Year Comparison</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Revenue Growth</span>
                  <div className="text-right">
                    <p className="font-bold text-[#4ADE80]">+12.8%</p>
                    <p className="text-xs text-gray-500">vs {selectedYear - 1}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Expense Growth</span>
                  <div className="text-right">
                    <p className="font-bold text-[#F59E0B]">+6.1%</p>
                    <p className="text-xs text-gray-500">vs {selectedYear - 1}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Profit Growth</span>
                  <div className="text-right">
                    <p className="font-bold text-[#4ADE80]">+24.3%</p>
                    <p className="text-xs text-gray-500">vs {selectedYear - 1}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

        {/* Main Forecast Table */}
        <div className="w-full">
          <Card title={`${selectedYear} Monthly Forecast by GL Code`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-800 w-32 sticky left-0 bg-white">GL Code</th>
                    <th className="text-left py-3 px-4 font-bold text-gray-800 w-48 sticky left-32 bg-white">Description</th>
                    {months.map((month, index) => (
                      <th key={index} className="text-center py-3 px-2 font-bold text-gray-800 min-w-[120px]">
                        {month} {selectedYear}
                      </th>
                    ))}
                    <th className="text-right py-3 px-4 font-bold text-gray-800 w-32">YTD Total</th>
                  </tr>
                </thead>
                <tbody>
                  {['Revenue', 'COGS', 'OPEX', 'Other'].map(category => {
                    const categoryGLCodes = filteredGLCodes.filter(gl => gl.category === category);
                    if (categoryGLCodes.length === 0) return null;
                    
                    return (
                      <React.Fragment key={category}>
                        {/* Category Header */}
                        <tr className="bg-gray-100 border-b border-gray-200">
                          <td colSpan={months.length + 3} className="py-3 px-4">
                            <button
                              onClick={() => toggleCategory(category)}
                              className="flex items-center font-bold text-[#1E2A38] hover:text-[#3AB7BF] transition-colors"
                            >
                              {expandedCategories.includes(category) ? (
                                <ChevronDown className="w-4 h-4 mr-2" />
                              ) : (
                                <ChevronRight className="w-4 h-4 mr-2" />
                              )}
                              <div 
                                className="w-3 h-3 rounded-full mr-2"
                                style={{ backgroundColor: getCategoryColor(category) }}
                              />
                              {category}
                            </button>
                          </td>
                        </tr>
                        
                        {/* GL Code Rows */}
                        {expandedCategories.includes(category) && categoryGLCodes.map(glCode => (
                          <React.Fragment key={glCode.code}>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 group"