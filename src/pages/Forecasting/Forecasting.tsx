import React, { useState, useEffect } from 'react';
import { Target, Calendar, Filter, Download, Settings, BarChart3, TrendingUp, TrendingDown, Plus, Search, Eye, CreditCard as Edit3, Save, X, ChevronDown, ChevronRight } from 'lucide-react';
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
  createdBy: string;
}

const Forecasting: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [multiYearView, setMultiYearView] = useState(false);
  const [showGLScenarioModal, setShowGLScenarioModal] = useState(false);
  const [newGLScenario, setNewGLScenario] = useState({
    name: '',
    description: '',
    glAccount: '',
    adjustmentType: 'percentage' as 'percentage' | 'fixed',
    adjustmentValue: '',
    startMonth: 'Jan 2025',
    endMonth: 'Dec 2025'
  });
  const [yearRange, setYearRange] = useState([2025, 2026]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Revenue', 'OPEX']);
  const [showScenarioPanel, setShowScenarioPanel] = useState(true);
  const [selectedGLCode, setSelectedGLCode] = useState<GLCode | null>(null);
  const [expandedGLCodes, setExpandedGLCodes] = useState<string[]>([]);
  const [appliedScenarios, setAppliedScenarios] = useState<AppliedScenario[]>([]);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{glCode: string, month: string} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showScenarioSidePanel, setShowScenarioSidePanel] = useState(false);
  const [sidePanelForm, setSidePanelForm] = useState({
    selectedGLCode: '',
    scenarioName: '',
    description: '',
    adjustmentType: 'percentage' as 'percentage' | 'fixed',
    adjustmentValue: 0,
    startMonth: 'Jan',
    endMonth: 'Dec',
    keyAssumptions: [
      { id: '1', name: '', value: '', description: '' }
    ]
  });
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

  const glAccounts = [
    { code: '4000', name: 'Product Revenue', category: 'Revenue' },
    { code: '4100', name: 'Service Revenue', category: 'Revenue' },
    { code: '4200', name: 'Other Income', category: 'Revenue' },
    { code: '5000', name: 'Cost of Goods Sold', category: 'COGS' },
    { code: '6000', name: 'Salaries & Benefits', category: 'Operating Expenses' },
    { code: '6100', name: 'Marketing Expenses', category: 'Operating Expenses' },
    { code: '6200', name: 'Office Rent', category: 'Operating Expenses' },
    { code: '6300', name: 'Technology & Software', category: 'Operating Expenses' },
    { code: '7000', name: 'Interest Expense', category: 'Other Expenses' }
  ];

  const handleCreateGLScenario = () => {
    if (newGLScenario.name.trim() && newGLScenario.adjustmentValue) {
      const scenario = {
        id: Date.now().toString(),
        name: newGLScenario.name,
        description: newGLScenario.description,
        glAccount: newGLScenario.glAccount || null,
        adjustmentType: newGLScenario.adjustmentType,
        adjustmentValue: parseFloat(newGLScenario.adjustmentValue),
        startMonth: newGLScenario.startMonth,
        endMonth: newGLScenario.endMonth,
        createdAt: new Date(),
        createdBy: 'Current User',
        isActive: true
      };
      
      setScenarios(prev => [...prev, scenario]);
      setNewGLScenario({
        name: '',
        description: '',
        glAccount: '',
        adjustmentType: 'percentage',
        adjustmentValue: '',
        startMonth: 'Jan 2025',
        endMonth: 'Dec 2025'
      });
      setShowGLScenarioModal(false);
    }
  };

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

  const handleCellEdit = (glCode: string, month: string, currentAmount: number) => {
    setEditingCell({ glCode, month });
    setEditValue(currentAmount.toString());
  };

  const handleCellSave = () => {
    if (editingCell && editValue.trim()) {
      const newAmount = parseFloat(editValue);
      if (!isNaN(newAmount)) {
        updateForecastAmount(editingCell.glCode, editingCell.month, newAmount);
      }
    }
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const isMonthActualized = (month: string) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthIndex = months.indexOf(month.split(' ')[0]);
    const year = parseInt(month.split(' ')[1]);
    
    return year < currentYear || (year === currentYear && monthIndex <= currentMonth);
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
            <h4 className="font-medium text-[#101010]">Payroll Assumptions</h4>
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
            <h4 className="font-medium text-[#101010]">Travel Assumptions</h4>
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
            
            {/* Date Range Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Date Range</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Button 1: Date Range Selector */}
                <button
                  type="button"
                  onClick={() => {
                    // Toggle date range picker visibility
                    const isCurrentlyFromThisMonth = glScenarioForm.startMonth === months[new Date().getMonth()] && 
                                                   glScenarioForm.startYear === new Date().getFullYear() && 
                                                   glScenarioForm.endMonth === 'Dec' && 
                                                   glScenarioForm.endYear === selectedYear;
                    
                    if (isCurrentlyFromThisMonth) {
                      // Reset to custom range
                      setGLScenarioForm({
                        ...glScenarioForm,
                        startMonth: 'Jan',
                        endMonth: 'Dec',
                        startYear: selectedYear,
                        endYear: selectedYear
                      });
                    }
                  }}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    !(glScenarioForm.startMonth === months[new Date().getMonth()] && 
                      glScenarioForm.startYear === new Date().getFullYear() && 
                      glScenarioForm.endMonth === 'Dec' && 
                      glScenarioForm.endYear === selectedYear)
                      ? 'border-[#3AB7BF] bg-[#3AB7BF]/5 text-[#3AB7BF]'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">Select Month Range</div>
                  <div className="text-xs mt-1">
                    {!(glScenarioForm.startMonth === months[new Date().getMonth()] && 
                      glScenarioForm.startYear === new Date().getFullYear() && 
                      glScenarioForm.endMonth === 'Dec' && 
                      glScenarioForm.endYear === selectedYear)
                      ? `From ${glScenarioForm.startMonth} ${glScenarioForm.startYear} to ${glScenarioForm.endMonth} ${glScenarioForm.endYear}`
                      : 'Click to select custom range'
                    }
                  </div>
                </button>

                {/* Button 2: Forward Date Selector */}
                <button
                  type="button"
                  onClick={() => {
                    const currentMonth = months[new Date().getMonth()];
                    const currentYear = new Date().getFullYear();
                    setGLScenarioForm({
                      ...glScenarioForm,
                      startMonth: currentMonth,
                      endMonth: 'Dec',
                      startYear: currentYear,
                      endYear: selectedYear
                    });
                  }}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    glScenarioForm.startMonth === months[new Date().getMonth()] && 
                    glScenarioForm.startYear === new Date().getFullYear() && 
                    glScenarioForm.endMonth === 'Dec' && 
                    glScenarioForm.endYear === selectedYear
                      ? 'border-[#4ADE80] bg-[#4ADE80]/5 text-[#4ADE80]'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm">From This Month Forward</div>
                  <div className="text-xs mt-1">
                    {glScenarioForm.startMonth === months[new Date().getMonth()] && 
                     glScenarioForm.startYear === new Date().getFullYear() && 
                     glScenarioForm.endMonth === 'Dec' && 
                     glScenarioForm.endYear === selectedYear
                      ? `From ${months[new Date().getMonth()]} ${new Date().getFullYear()} - Ongoing`
                      : 'Click to select from current month'
                    }
                  </div>
                </button>
              </div>
              
              {/* Custom Date Range Inputs - Show when Button 1 is selected */}
              {!(glScenarioForm.startMonth === months[new Date().getMonth()] && 
                glScenarioForm.startYear === new Date().getFullYear() && 
                glScenarioForm.endMonth === 'Dec' && 
                glScenarioForm.endYear === selectedYear) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-[#101010] mb-3">Custom Date Range</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={glScenarioForm.startMonth}
                          onChange={(e) => setGLScenarioForm({...glScenarioForm, startMonth: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                        >
                          {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={glScenarioForm.startYear}
                          onChange={(e) => setGLScenarioForm({...glScenarioForm, startYear: parseInt(e.target.value)})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                        >
                          <option value={2024}>2024</option>
                          <option value={2025}>2025</option>
                          <option value={2026}>2026</option>
                          <option value={2027}>2027</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={glScenarioForm.endMonth}
                          onChange={(e) => setGLScenarioForm({...glScenarioForm, endMonth: e.target.value})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                        >
                          {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={glScenarioForm.endYear}
                          onChange={(e) => setGLScenarioForm({...glScenarioForm, endYear: parseInt(e.target.value)})}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                        >
                          <option value={2024}>2024</option>
                          <option value={2025}>2025</option>
                          <option value={2026}>2026</option>
                          <option value={2027}>2027</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

  const handleAddAssumption = () => {
    setSidePanelForm(prev => ({
      ...prev,
      keyAssumptions: [
        ...prev.keyAssumptions,
        { id: Date.now().toString(), name: '', value: '', description: '' }
      ]
    }));
  };

  const handleRemoveAssumption = (id: string) => {
    setSidePanelForm(prev => ({
      ...prev,
      keyAssumptions: prev.keyAssumptions.filter(assumption => assumption.id !== id)
    }));
  };

  const handleUpdateAssumption = (id: string, field: string, value: string) => {
    setSidePanelForm(prev => ({
      ...prev,
      keyAssumptions: prev.keyAssumptions.map(assumption =>
        assumption.id === id ? { ...assumption, [field]: value } : assumption
      )
    }));
  };

  const handleCreateScenarioFromPanel = () => {
    if (sidePanelForm.selectedGLCode && sidePanelForm.scenarioName.trim()) {
      const newScenario: AppliedScenario = {
        id: Date.now().toString(),
        glCode: sidePanelForm.selectedGLCode,
        name: sidePanelForm.scenarioName,
        description: sidePanelForm.description,
        startMonth: sidePanelForm.startMonth,
        endMonth: sidePanelForm.endMonth,
        adjustmentType: sidePanelForm.adjustmentType,
        adjustmentValue: sidePanelForm.adjustmentValue,
        appliedAt: new Date(),
        createdBy: 'Current User' // Replace with actual user context
      };
      
      setAppliedScenarios(prev => [...prev, newScenario]);
      
      // Auto-integrate scenario into monthly budgets
      const startMonthIndex = months.indexOf(newScenario.startMonth);
      const endMonthIndex = months.indexOf(newScenario.endMonth);
      
      setForecastData(prev => prev.map(item => {
        if (item.glCode === sidePanelForm.selectedGLCode) {
          const itemMonthIndex = months.indexOf(item.month.split(' ')[0]);
          if (itemMonthIndex >= startMonthIndex && itemMonthIndex <= endMonthIndex) {
            let adjustedAmount = item.forecastedAmount;
            if (newScenario.adjustmentType === 'percentage') {
              adjustedAmount = item.forecastedAmount * (1 + newScenario.adjustmentValue / 100);
            } else {
              adjustedAmount = item.forecastedAmount + newScenario.adjustmentValue;
            }
            return { ...item, forecastedAmount: Math.round(adjustedAmount) };
          }
        }
        return item;
      }));
      
      // Reset form and close panel
      setSidePanelForm({
        selectedGLCode: '',
        scenarioName: '',
        description: '',
        adjustmentType: 'percentage',
        adjustmentValue: 0,
        startMonth: 'Jan',
        endMonth: 'Dec',
        keyAssumptions: [
          { id: '1', name: '', value: '', description: '' }
        ]
      });
      setShowScenarioSidePanel(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#101010]">Financial Forecasting</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
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
                    <th className="text-right py-3 px-4 font-bold text-gray-800 w-32">FY Total</th>
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
                              className="flex items-center font-bold text-[#101010] hover:text-[#3AB7BF] transition-colors"
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
                            <tr className="border-b border-gray-100 hover:bg-gray-50 group">
                              <td className="py-3 px-4 font-mono text-sm sticky left-0 bg-white group-hover:bg-gray-50">
                                {glCode.code}
                              </td>
                              <td className="py-3 px-4 text-sm sticky left-32 bg-white group-hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <span>{glCode.name}</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        setSelectedGLCode(glCode);
                                        setShowGLScenarioModal(true);
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                                      title="Add scenario"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        const glScenarios = appliedScenarios.filter(s => s.glCode === glCode.code);
                                        if (glScenarios.length > 0) {
                                          setExpandedGLCodes(prev =>
                                            prev.includes(glCode.code)
                                              ? prev.filter(code => code !== glCode.code)
                                              : [...prev, glCode.code]
                                          );
                                        }
                                      }}
                                      className={`p-1 hover:bg-gray-100 rounded transition-colors ${
                                        appliedScenarios.filter(s => s.glCode === glCode.code).length === 0 
                                          ? 'opacity-30 cursor-not-allowed' 
                                          : ''
                                      }`}
                                      title={`${appliedScenarios.filter(s => s.glCode === glCode.code).length} scenarios`}
                                      disabled={appliedScenarios.filter(s => s.glCode === glCode.code).length === 0}
                                    >
                                      {expandedGLCodes.includes(glCode.code) ? (
                                        <ChevronDown className="w-3 h-3" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </td>
                              {months.map((month, monthIndex) => {
                                const monthData = forecastData.find(
                                  item => item.glCode === glCode.code && item.month === `${month} ${selectedYear}`
                                );
                                const isActualized = isMonthActualized(`${month} ${selectedYear}`);
                                const isEditing = editingCell?.glCode === glCode.code && editingCell?.month === `${month} ${selectedYear}`;
                                
                                return (
                                  <td key={monthIndex} className="py-3 px-2 text-center text-sm">
                                    <div className="space-y-1 relative">
                                      <div className={`font-medium ${!isActualized ? 'cursor-pointer hover:bg-blue-50 rounded px-1' : ''}`}>
                                        {isEditing ? (
                                          <input
                                            type="number"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={handleCellSave}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter') handleCellSave();
                                              if (e.key === 'Escape') handleCellCancel();
                                            }}
                                            className="w-full px-1 py-0.5 text-center border border-blue-300 rounded text-xs"
                                            autoFocus
                                          />
                                        ) : (
                                          <span
                                            onClick={() => {
                                              if (!isActualized && monthData) {
                                                handleCellEdit(glCode.code, `${month} ${selectedYear}`, monthData.forecastedAmount);
                                              }
                                            }}
                                            className={isActualized ? 'text-gray-600' : 'text-[#101010] hover:text-blue-600'}
                                          >
                                            ${monthData?.forecastedAmount.toLocaleString() || '0'}
                                          </span>
                                        )}
                                      </div>
                                      {monthData?.actualAmount && (
                                        <div className="text-xs text-gray-500 bg-gray-100 rounded px-1">
                                          Act: ${monthData.actualAmount.toLocaleString()}
                                        </div>
                                      )}
                                      {monthData?.variance && (
                                        <div className={`text-xs ${getVarianceColor(monthData.variance)}`}>
                                          {monthData.variance > 0 ? '+' : ''}{monthData.variance.toFixed(1)}%
                                        </div>
                                      )}
                                      {isActualized && (
                                        <div className="absolute top-0 right-0 w-2 h-2 bg-gray-400 rounded-full" title="Actualized" />
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="py-3 px-4 text-right text-sm font-medium">
                                ${forecastData
                                  .filter(item => item.glCode === glCode.code)
                                  .slice(0, new Date().getMonth() + 1)
                                  .reduce((sum, item) => sum + item.forecastedAmount, 0)
                                  .toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-right text-sm font-medium">
                                ${forecastData
                                  .filter(item => item.glCode === glCode.code)
                                  .reduce((sum, item) => sum + item.forecastedAmount, 0)
                                  .toLocaleString()}
                              </td>
                            </tr>
                            
                            {/* Expanded GL Code Scenarios */}
                            {expandedGLCodes.includes(glCode.code) && (
                              <tr>
                                <td colSpan={months.length + 4} className="py-0">
                                  <div className="bg-gray-50 border-l-4 border-[#3AB7BF] p-4 mx-4 mb-2 rounded">
                                    <h5 className="font-medium text-[#101010] mb-3">Applied Scenarios for {glCode.name}</h5>
                                    {appliedScenarios.filter(scenario => scenario.glCode === glCode.code).length === 0 ? (
                                      <p className="text-sm text-gray-600 italic">No scenarios applied to this GL code yet.</p>
                                    ) : (
                                      <div className="space-y-2">
                                        {appliedScenarios.filter(scenario => scenario.glCode === glCode.code).map(scenario => (
                                          <div key={scenario.id} className="p-3 bg-white rounded border border-gray-200">
                                            <div className="flex items-center justify-between">
                                              <div>
                                                <h6 className="font-medium text-[#101010]">{scenario.name}</h6>
                                                <p className="text-sm text-gray-600">{scenario.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-xs text-gray-500">
                                                    Added by {scenario.createdBy} • {scenario.appliedAt.toLocaleDateString()}
                                                  </span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                  {scenario.startMonth} - {scenario.endMonth} • 
                                                  {scenario.adjustmentType === 'percentage' ? 
                                                    ` ${scenario.adjustmentValue}% change` : 
                                                    ` $${scenario.adjustmentValue.toLocaleString()} adjustment`
                                                  }
                                                </p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 bg-[#3AB7BF]/20 text-[#3AB7BF] rounded-full text-xs">
                                                  Active
                                                </span>
                                                <button
                                                  onClick={() => {
                                                    setAppliedScenarios(prev => prev.filter(s => s.id !== scenario.id));
                                                    // Recalculate forecast data after removing scenario
                                                    // This would trigger a recalculation in a real implementation
                                                  }}
                                                  className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                                                  title="Remove scenario"
                                                >
                                                  <X className="w-3 h-3" />
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      {/* GL Scenario Configuration Modal */}
      {showGLScenarioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#101010]">Create Scenario</h3>
              <button
                onClick={() => setShowGLScenarioModal(false)}
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
                  value={newGLScenario.name}
                  onChange={(e) => setNewGLScenario({...newGLScenario, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  placeholder="e.g., Q2 Revenue Boost"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newGLScenario.description}
                  onChange={(e) => setNewGLScenario({...newGLScenario, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  rows={3}
                  placeholder="Describe the scenario assumptions and context"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GL Account (Optional)
                </label>
                <select
                  value={newGLScenario.glAccount}
                  onChange={(e) => setNewGLScenario({...newGLScenario, glAccount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                >
                  <option value="">Select GL Account (Optional)</option>
                  {glAccounts.map(account => (
                    <option key={account.code} value={account.code}>
                      {account.code} - {account.name} ({account.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment Type</label>
                  <select
                    value={newGLScenario.adjustmentType}
                    onChange={(e) => setNewGLScenario({...newGLScenario, adjustmentType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newGLScenario.adjustmentType === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                  </label>
                  <input
                    type="number"
                    step={newGLScenario.adjustmentType === 'percentage' ? '0.1' : '1000'}
                    value={newGLScenario.adjustmentValue}
                    onChange={(e) => setNewGLScenario({...newGLScenario, adjustmentValue: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder={newGLScenario.adjustmentType === 'percentage' ? '15.0' : '50000'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                  <select
                    value={newGLScenario.startMonth}
                    onChange={(e) => setNewGLScenario({...newGLScenario, startMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                  <select
                    value={newGLScenario.endMonth}
                    onChange={(e) => setNewGLScenario({...newGLScenario, endMonth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
              </div>

              {newGLScenario.glAccount && (
                <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
                  <h5 className="font-medium text-[#101010] mb-1">GL Account Impact</h5>
                  <p className="text-sm text-gray-700">
                    This scenario will apply a {newGLScenario.adjustmentValue}
                    {newGLScenario.adjustmentType === 'percentage' ? '%' : ' dollar'} adjustment to 
                    GL {newGLScenario.glAccount} from {newGLScenario.startMonth} to {newGLScenario.endMonth}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowGLScenarioModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGLScenario}
                disabled={!newGLScenario.name.trim() || !newGLScenario.adjustmentValue}
                className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Scenario
              </button>
            </div>
          </div>
        </div>
      )}
     {/* GL Scenario Modal */}
     {showGLScenarioModal && selectedGLCode && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-semibold text-[#101010]">
               Add Scenario for {selectedGLCode.name} ({selectedGLCode.code})
             </h3>
             <button
               onClick={() => {
                 setShowGLScenarioModal(false);
                 setSelectedGLCode(null);
               }}
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
                 value={glScenarioForm.title}
                 onChange={(e) => setGLScenarioForm({...glScenarioForm, title: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                 placeholder="e.g., Q2 Marketing Campaign"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
               <textarea
                 value={glScenarioForm.description}
                 onChange={(e) => setGLScenarioForm({...glScenarioForm, description: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                 rows={3}
                 placeholder="Describe the scenario and its impact"
               />
             </div>
             
             {renderGLSpecificInputs()}
             
             <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
               <p className="text-sm text-gray-700">{getImpactPreview()}</p>
             </div>
           </div>
           
           <div className="flex justify-end gap-3 mt-6">
             <button
               onClick={() => {
                 setShowGLScenarioModal(false);
                 setSelectedGLCode(null);
               }}
               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
             >
               Cancel
             </button>
             <button
               onClick={() => {
                 if (isScenarioValid()) {
                   const newScenario: AppliedScenario = {
                     id: Date.now().toString(),
                     glCode: selectedGLCode.code,
                     name: glScenarioForm.title,
                     description: glScenarioForm.description,
                     startMonth: glScenarioForm.startMonth,
                     endMonth: glScenarioForm.endMonth,
                     adjustmentType: glScenarioForm.adjustmentType,
                     adjustmentValue: glScenarioForm.adjustmentValue,
                     appliedAt: new Date(),
                     createdBy: 'Current User'
                   };
                   setAppliedScenarios(prev => [...prev, newScenario]);
                   
                   // Auto-integrate scenario into monthly budgets
                   const startMonthIndex = months.indexOf(newScenario.startMonth);
                   const endMonthIndex = months.indexOf(newScenario.endMonth);
                   
                   setForecastData(prev => prev.map(item => {
                     if (item.glCode === selectedGLCode.code) {
                       const itemMonthIndex = months.indexOf(item.month.split(' ')[0]);
                       if (itemMonthIndex >= startMonthIndex && itemMonthIndex <= endMonthIndex) {
                         let adjustedAmount = item.forecastedAmount;
                         if (newScenario.adjustmentType === 'percentage') {
                           adjustedAmount = item.forecastedAmount * (1 + newScenario.adjustmentValue / 100);
                         } else {
                           adjustedAmount = item.forecastedAmount + newScenario.adjustmentValue;
                         }
                         return { ...item, forecastedAmount: Math.round(adjustedAmount) };
                       }
                     }
                     return item;
                   }));
                   
                   setShowGLScenarioModal(false);
                   setSelectedGLCode(null);
                   setGLScenarioForm({
                     title: '',
                     description: '',
                     owner: 'Current User',
                     startMonth: 'Jan',
                     endMonth: 'Dec',
                     startYear: selectedYear,
                     endYear: selectedYear,
                     scenarioType: 'custom',
                     revenueGrowthPercent: 0,
                     salesVolumeAssumption: 0,
                     pricingAssumption: 0,
                     churnRatePercent: 0,
                     marketExpansion: 0,
                     marketingSpendPercent: 0,
                     cogsPercent: 0,
                     rdPercent: 0,
                     overheadCosts: 0,
                     variableFixedSplit: 50,
                     headcount: 0,
                     headcountGrowthPercent: 0,
                     averageSalary: 0,
                     payrollTaxRate: 15.3,
                     benefitsRate: 25,
                     hiringPlan: 0,
                     attritionRatePercent: 15,
                     numberOfTrips: 0,
                     averageTripCost: 0,
                     campaignBudget: 0,
                     numberOfCampaigns: 0,
                     squareFootage: 0,
                     pricePerSqFt: 0,
                     numberOfLicenses: 0,
                     costPerLicense: 0,
                     adjustmentType: 'percentage',
                     adjustmentValue: 0
                   });
                 }
               }}
               disabled={!isScenarioValid()}
               className="px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Apply Scenario
             </button>
           </div>
         </div>
       </div>
     )}
      {/* Scenario Configuration Side Panel */}
      {showScenarioSidePanel && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowScenarioSidePanel(false)}
          />
          
          {/* Side Panel */}
          <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200 transform transition-transform duration-300 ease-in-out">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-[#3AB7BF]/5">
              <div>
                <h3 className="text-xl font-semibold text-[#101010]">Scenario Configuration</h3>
                <p className="text-sm text-gray-600 mt-1">Create and configure budget scenarios</p>
              </div>
              <button
                onClick={() => setShowScenarioSidePanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* GL Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Target className="w-4 h-4 inline mr-2" />
                  Select GL Account
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={sidePanelForm.selectedGLCode}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, selectedGLCode: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Choose GL Account...</option>
                    {glCodes.map(glCode => (
                      <option key={glCode.code} value={glCode.code}>
                        {glCode.code} - {glCode.name} ({glCode.category})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Scenario Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
                  <input
                    type="text"
                    value={sidePanelForm.scenarioName}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, scenarioName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    placeholder="e.g., Q2 Marketing Campaign"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={sidePanelForm.description}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    rows={3}
                    placeholder="Describe the scenario and its business context"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Month</label>
                    <select
                      value={sidePanelForm.startMonth}
                      onChange={(e) => setSidePanelForm({...sidePanelForm, startMonth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Month</label>
                    <select
                      value={sidePanelForm.endMonth}
                      onChange={(e) => setSidePanelForm({...sidePanelForm, endMonth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Adjustment Configuration */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Budget Adjustment
                </label>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-2">Adjustment Type</label>
                  <select
                    value={sidePanelForm.adjustmentType}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, adjustmentType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                  >
                    <option value="percentage">Percentage Change (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    {sidePanelForm.adjustmentType === 'percentage' ? 'Percentage Change (%)' : 'Fixed Amount ($)'}
                  </label>
                  <input
                    type="number"
                    value={sidePanelForm.adjustmentValue}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, adjustmentValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent"
                    step={sidePanelForm.adjustmentType === 'percentage' ? '0.1' : '100'}
                    placeholder={sidePanelForm.adjustmentType === 'percentage' ? '15.5' : '50000'}
                  />
                </div>
              </div>

              {/* Key Assumptions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    <Lightbulb className="w-4 h-4 inline mr-2" />
                    Key Assumptions
                  </label>
                  <button
                    onClick={handleAddAssumption}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Add assumption"
                  >
                    <Plus className="w-4 h-4 text-[#3AB7BF]" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {sidePanelForm.keyAssumptions.map((assumption, index) => (
                    <div key={assumption.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600">Assumption {index + 1}</span>
                        {sidePanelForm.keyAssumptions.length > 1 && (
                          <button
                            onClick={() => handleRemoveAssumption(assumption.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={assumption.name}
                          onChange={(e) => handleUpdateAssumption(assumption.id, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#3AB7BF] focus:border-transparent"
                          placeholder="Assumption name"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={assumption.value}
                            onChange={(e) => handleUpdateAssumption(assumption.id, 'value', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#3AB7BF] focus:border-transparent"
                            placeholder="Value"
                          />
                          <input
                            type="text"
                            value={assumption.description}
                            onChange={(e) => handleUpdateAssumption(assumption.id, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#3AB7BF] focus:border-transparent"
                            placeholder="Description"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Preview */}
              {sidePanelForm.selectedGLCode && sidePanelForm.adjustmentValue !== 0 && (
                <div className="p-4 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
                  <h4 className="font-medium text-[#101010] mb-2 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Impact Preview
                  </h4>
                  <p className="text-sm text-gray-700">
                    This scenario will {sidePanelForm.adjustmentValue >= 0 ? 'increase' : 'decrease'} the selected GL account by{' '}
                    {sidePanelForm.adjustmentType === 'percentage' 
                      ? `${Math.abs(sidePanelForm.adjustmentValue)}%`
                      : `$${Math.abs(sidePanelForm.adjustmentValue).toLocaleString()}`
                    } from {sidePanelForm.startMonth} to {sidePanelForm.endMonth}.
                  </p>
                </div>
              )}
            </div>
            
            {/* Panel Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowScenarioSidePanel(false)}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateScenarioFromPanel}
                  disabled={!sidePanelForm.selectedGLCode || !sidePanelForm.scenarioName.trim()}
                  className="flex-1 px-4 py-2 bg-[#3AB7BF] text-white rounded-lg hover:bg-[#2A9BA3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Save className="w-4 h-4 mr-2 inline" />
                  Create Scenario
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