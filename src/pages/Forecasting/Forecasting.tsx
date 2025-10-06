import React, { useState, useEffect, useRef } from 'react';
import { Target, Calendar, Filter, Download, Settings, BarChart3, TrendingUp, TrendingDown, Plus, Search, Eye, CreditCard as Edit3, Save, X, ChevronDown, ChevronRight, History, MoreVertical, CreditCard as Edit2, EyeOff, Hash, Bell, AlertTriangle, CheckCircle, Info, DollarSign, PieChart, Sparkles, Calculator, MessageSquare, Copy, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { SaveForecastModal } from '../../components/Forecasting/SaveForecastModal';
import { VersionComparisonModal } from '../../components/Forecasting/VersionComparisonModal';
import ViewSettingsPanel from '../../components/Forecasting/ViewSettingsPanel';
import SalesScenarioModal from '../../components/Forecasting/SalesScenarioModal';
import { forecastService } from '../../services/forecastService';
import { SalesDriverService } from '../../services/salesDriverService';
import type { ForecastLineItem } from '../../types/forecast';
import PayrollCalculator from '../../components/Payroll/PayrollCalculator';
import type { PayrollResult } from '../../services/payrollService';
import type { SalesScenario } from '../../types/salesDriver';
import { getViewSettings, updateViewSetting } from '../../utils/viewSettings';

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
  isSalesDriverScenario?: boolean;
  salesScenarioData?: SalesScenario;
  createdBy: string;
  isActive: boolean;
}

const Forecasting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const deptDropdownRef = useRef<HTMLDivElement>(null);
  const [multiYearView, setMultiYearView] = useState(false);
  const [showGLScenarioModal, setShowGLScenarioModal] = useState(false);
  const [showSalesScenarioModal, setShowSalesScenarioModal] = useState(false);
  const [editingSalesScenario, setEditingSalesScenario] = useState<SalesScenario | null>(null);
  const [salesScenarios, setSalesScenarios] = useState<SalesScenario[]>([]);
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
  const [hiddenDrivers, setHiddenDrivers] = useState<string[]>([]);
  const [appliedScenarios, setAppliedScenarios] = useState<AppliedScenario[]>([]);
  const [expandedScenarios, setExpandedScenarios] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{glCode: string, month: string, type?: 'ytd' | 'fy'} | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedCells, setSelectedCells] = useState<{glCode: string, month: string}[]>([]);
  const [showBulkAdjustPanel, setShowBulkAdjustPanel] = useState(false);
  const [bulkAdjustment, setBulkAdjustment] = useState({
    type: 'percentage' as 'percentage' | 'fixed' | 'set',
    value: 0
  });
  const [showScenarioSidePanel, setShowScenarioSidePanel] = useState(false);
  const [showSaveForecastModal, setShowSaveForecastModal] = useState(false);
  const [showVersionHistorySidebar, setShowVersionHistorySidebar] = useState(false);
  const [showVersionComparisonModal, setShowVersionComparisonModal] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState<[string, string] | null>(null);
  const [showScenarioAuditSidebar, setShowScenarioAuditSidebar] = useState(false);
  const [scenarioMenuOpen, setScenarioMenuOpen] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingScenario, setEditingScenario] = useState<AppliedScenario | null>(null);
  const [showEditScenarioModal, setShowEditScenarioModal] = useState(false);
  const [scenarioSearchTerm, setScenarioSearchTerm] = useState('');
  const [showAlertsSidebar, setShowAlertsSidebar] = useState(false);
  const [alertFilter, setAlertFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [versionHistory, setVersionHistory] = useState<any[]>([]);
  const [selectedVersionForAction, setSelectedVersionForAction] = useState<string | null>(null);
  const [dateViewMode, setDateViewMode] = useState<'months' | 'quarters' | 'years'>('months');
  const [hideEmptyAccounts, setHideEmptyAccounts] = useState(() => getViewSettings().hideEmptyAccounts);
  const [showAccountCodes, setShowAccountCodes] = useState(() => getViewSettings().showAccountCodes);
  const [showActualsAsAmount, setShowActualsAsAmount] = useState(() => getViewSettings().showActualsAsAmount);
  const [numberFormat, setNumberFormat] = useState<'actual' | 'thousands' | 'millions'>(() => getViewSettings().numberFormat);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [showViewSettingsPanel, setShowViewSettingsPanel] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, rowData: any} | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const [driverDropdownOpen, setDriverDropdownOpen] = useState<string | null>(null);
  const driverDropdownRef = useRef<HTMLDivElement>(null);

  // Debug: Log component version
  React.useEffect(() => {
    console.log('🚀 Forecasting Component Loaded - Sales Driver Edit Fix v2.0');
  }, []);

  // Context menu effect
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
      if (driverDropdownRef.current && !driverDropdownRef.current.contains(event.target as Node)) {
        setDriverDropdownOpen(null);
      }
    };

    const handleScroll = () => {
      setContextMenu(null);
      setDriverDropdownOpen(null);
    };

    if (contextMenu || driverDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [contextMenu, driverDropdownOpen]);

  const handleContextMenu = (event: React.MouseEvent, rowData: any) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      rowData,
    });
  };

  const handleDrillDown = (rowData: any) => {
    console.log('Drill down:', rowData);
    setContextMenu(null);
  };

  const handleAddNote = (rowData: any) => {
    console.log('Add note:', rowData);
    setContextMenu(null);
  };

  const handleViewDetails = (rowData: any) => {
    console.log('View details:', rowData);
    setSelectedGLCode(rowData);
    setExpandedGLCodes(prev => [...prev, rowData.code]);
    setContextMenu(null);
  };

  const handleEditRow = (rowData: any) => {
    console.log('Edit row:', rowData);
    setSelectedGLCode(rowData);
    setShowScenarioSidePanel(true);
    setContextMenu(null);
  };

  const handleDuplicateRow = (rowData: any) => {
    console.log('Duplicate row:', rowData);
    setContextMenu(null);
  };

  const handleDeleteRow = (rowData: any) => {
    console.log('Delete row:', rowData);
    setContextMenu(null);
  };

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

  const [startMonthDropdownOpen, setStartMonthDropdownOpen] = useState(false);
  const [startYearDropdownOpen, setStartYearDropdownOpen] = useState(false);
  const [endMonthDropdownOpen, setEndMonthDropdownOpen] = useState(false);
  const [endYearDropdownOpen, setEndYearDropdownOpen] = useState(false);
  const [adjustmentTypeDropdownOpen, setAdjustmentTypeDropdownOpen] = useState(false);
  const [sidePanelStartMonthDropdownOpen, setSidePanelStartMonthDropdownOpen] = useState(false);
  const [sidePanelEndMonthDropdownOpen, setSidePanelEndMonthDropdownOpen] = useState(false);
  const [sidePanelAdjustmentTypeDropdownOpen, setSidePanelAdjustmentTypeDropdownOpen] = useState(false);
  const startMonthDropdownRef = useRef<HTMLDivElement>(null);
  const startYearDropdownRef = useRef<HTMLDivElement>(null);
  const endMonthDropdownRef = useRef<HTMLDivElement>(null);
  const endYearDropdownRef = useRef<HTMLDivElement>(null);
  const adjustmentTypeDropdownRef = useRef<HTMLDivElement>(null);
  const sidePanelStartMonthDropdownRef = useRef<HTMLDivElement>(null);
  const sidePanelEndMonthDropdownRef = useRef<HTMLDivElement>(null);
  const sidePanelAdjustmentTypeDropdownRef = useRef<HTMLDivElement>(null);

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

  const formatNumber = (value: number): string => {
    if (numberFormat === 'thousands') {
      return `${(value / 1000).toFixed(1)}K`;
    } else if (numberFormat === 'millions') {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return value.toLocaleString();
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

  const availableYears = [2023, 2024, 2025, 2026, 2027];

  const getMonthIndex = (monthYear: string): number => {
    const monthName = monthYear.split(' ')[0];
    return months.indexOf(monthName);
  };

  const getScenarioMonthImpact = (scenario: AppliedScenario, month: string, glCode: string): number => {
    const startIndex = getMonthIndex(scenario.startMonth);
    const endIndex = getMonthIndex(scenario.endMonth);
    const monthIndex = months.indexOf(month);

    if (monthIndex < startIndex || monthIndex > endIndex || !scenario.isActive) {
      return 0;
    }

    const monthKey = `${month} ${selectedYear}`;
    const baseAmount = forecastData.find(
      item => item.glCode === glCode && item.month === monthKey
    )?.forecastedAmount || 0;

    if (scenario.adjustmentType === 'percentage') {
      return (baseAmount * scenario.adjustmentValue) / 100;
    } else {
      return scenario.adjustmentValue;
    }
  };

  const getDatePeriods = () => {
    if (dateViewMode === 'months') {
      return months;
    } else if (dateViewMode === 'quarters') {
      return availableYears.flatMap(year =>
        ['Q1', 'Q2', 'Q3', 'Q4'].map(q => ({ period: q, year }))
      );
    } else {
      return availableYears.map(year => ({ period: 'FY', year }));
    }
  };

  const getDateLabel = (period: any, index: number) => {
    if (dateViewMode === 'months') {
      return period;
    } else if (dateViewMode === 'quarters') {
      const yearAbbr = period.year.toString().slice(-2);
      const isSelectedYear = period.year === selectedYear;
      return { label: `${period.period} ${yearAbbr}'`, isSelectedYear, year: period.year };
    } else {
      const isSelectedYear = period.year === selectedYear;
      return { label: `${period.year}`, isSelectedYear, year: period.year };
    }
  };

  const datePeriods = getDatePeriods();

  const getQuarterMonths = (quarter: string): string[] => {
    const quarterMap: { [key: string]: string[] } = {
      'Q1': ['Jan', 'Feb', 'Mar'],
      'Q2': ['Apr', 'May', 'Jun'],
      'Q3': ['Jul', 'Aug', 'Sep'],
      'Q4': ['Oct', 'Nov', 'Dec']
    };
    return quarterMap[quarter] || [];
  };

  const getQuarterLabel = (quarter: string): string => {
    const labelMap: { [key: string]: string } = {
      'Q1': 'Jan-Mar',
      'Q2': 'Apr-Jun',
      'Q3': 'Jul-Sep',
      'Q4': 'Oct-Dec'
    };
    return labelMap[quarter] || '';
  };

  const getAggregatedAmount = (glCode: string, period: any): number => {
    if (dateViewMode === 'months') {
      const monthData = forecastData.find(
        item => item.glCode === glCode && item.month === `${period} ${selectedYear}`
      );
      return monthData?.forecastedAmount || 0;
    } else if (dateViewMode === 'quarters') {
      const quarterMonths = getQuarterMonths(period.period);
      const year = period.year;
      return quarterMonths.reduce((sum, month) => {
        const monthData = forecastData.find(
          item => item.glCode === glCode && item.month === `${month} ${year}`
        );
        return sum + (monthData?.forecastedAmount || 0);
      }, 0);
    } else {
      const year = period.year;
      return months.reduce((sum, month) => {
        const monthData = forecastData.find(
          item => item.glCode === glCode && item.month === `${month} ${year}`
        );
        return sum + (monthData?.forecastedAmount || 0);
      }, 0);
    }
  };

  // Generate forecast data for all years
  const [forecastData, setForecastData] = useState<MonthlyForecast[]>(() => {
    const data: MonthlyForecast[] = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    glCodes.forEach(glCode => {
      availableYears.forEach(year => {
        let cumulativeYTD = 0;
        let previousAmount = 0;
        const yearOffset = (year - 2025);

        months.forEach((month, index) => {
          const isHistorical = year < currentYear || (year === currentYear && index <= currentMonth);
          const baseAmount = getBaseAmount(glCode.code);
          const seasonalFactor = getSeasonalFactor(month);
          const annualGrowth = Math.pow(1 + (scenarioAssumptions[0].value / 100), yearOffset);
          const growthFactor = annualGrowth * Math.pow(1 + (scenarioAssumptions[0].value / 100), index / 12);

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
            month: `${month} ${year}`,
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

    if (hideEmptyAccounts) {
      const hasActivity = forecastData.some(item =>
        item.glCode === glCode.code &&
        item.forecastedAmount > 0
      );
      return matchesSearch && matchesCategory && hasActivity;
    }

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

  const getVarianceColor = (variance: number, glCodeValue: string) => {
    const glCodeData = glCodes.find(gl => gl.code === glCodeValue);
    if (!glCodeData) return 'text-gray-600';

    const isRevenue = glCodeData.type === 'revenue';

    if (isRevenue) {
      return variance >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]';
    } else {
      return variance <= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]';
    }
  };

  const handleSaveForecast = async (name: string, description: string) => {
    const lineItems: Omit<ForecastLineItem, 'id' | 'version_id' | 'created_at'>[] = [];

    forecastData.forEach(item => {
      const glCode = glCodes.find(gl => gl.code === item.glCode);
      if (glCode) {
        lineItems.push({
          gl_code: item.glCode,
          gl_name: glCode.name,
          gl_type: glCode.type,
          month: item.month,
          year: selectedYear,
          forecasted_amount: item.forecastedAmount,
          actual_amount: item.actualAmount,
          variance: item.variance,
          is_actualized: !item.isEditable,
          notes: undefined,
        });
      }
    });

    await forecastService.saveForecast({
      year: selectedYear,
      name,
      description,
      lineItems,
    });
  };

  const loadVersionHistory = async () => {
    try {
      const versions = await forecastService.getVersionHistory(selectedYear);
      setVersionHistory(versions);
    } catch (error) {
      console.error('Failed to load version history:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setYearDropdownOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(event.target as Node)) {
        setDeptDropdownOpen(false);
      }
      if (startMonthDropdownRef.current && !startMonthDropdownRef.current.contains(event.target as Node)) {
        setStartMonthDropdownOpen(false);
      }
      if (startYearDropdownRef.current && !startYearDropdownRef.current.contains(event.target as Node)) {
        setStartYearDropdownOpen(false);
      }
      if (endMonthDropdownRef.current && !endMonthDropdownRef.current.contains(event.target as Node)) {
        setEndMonthDropdownOpen(false);
      }
      if (endYearDropdownRef.current && !endYearDropdownRef.current.contains(event.target as Node)) {
        setEndYearDropdownOpen(false);
      }
      if (adjustmentTypeDropdownRef.current && !adjustmentTypeDropdownRef.current.contains(event.target as Node)) {
        setAdjustmentTypeDropdownOpen(false);
      }
      if (sidePanelStartMonthDropdownRef.current && !sidePanelStartMonthDropdownRef.current.contains(event.target as Node)) {
        setSidePanelStartMonthDropdownOpen(false);
      }
      if (sidePanelEndMonthDropdownRef.current && !sidePanelEndMonthDropdownRef.current.contains(event.target as Node)) {
        setSidePanelEndMonthDropdownOpen(false);
      }
      if (sidePanelAdjustmentTypeDropdownRef.current && !sidePanelAdjustmentTypeDropdownRef.current.contains(event.target as Node)) {
        setSidePanelAdjustmentTypeDropdownOpen(false);
      }
      const formatDropdown = document.querySelector('.format-dropdown-container');
      if (formatDropdown && !formatDropdown.contains(event.target as Node)) {
        setShowFormatDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showVersionHistorySidebar) {
      loadVersionHistory();
    }
  }, [showVersionHistorySidebar, selectedYear]);

  const handleLoadVersion = async (versionId: string) => {
    try {
      await forecastService.setActiveVersion(versionId, selectedYear);
      setShowVersionHistorySidebar(false);
    } catch (error) {
      console.error('Failed to load version:', error);
    }
  };

  const handleCompareVersions = (version1Id: string, version2Id: string) => {
    setComparisonVersions([version1Id, version2Id]);
    setShowVersionHistorySidebar(false);
    setShowVersionComparisonModal(true);
  };

  const handleDeleteVersion = async (versionId: string) => {
    try {
      await forecastService.deleteVersion(versionId);
      await loadVersionHistory();
      setShowDeleteConfirm(null);
      setSelectedVersionForAction(null);
    } catch (error) {
      console.error('Failed to delete version:', error);
    }
  };

  const handleCellSelection = (glCode: string, month: string, isActualized: boolean, event: React.MouseEvent) => {
    if (isActualized) return;

    const cellKey = { glCode, month };
    const isSelected = selectedCells.some(cell => cell.glCode === glCode && cell.month === month);

    if (event.ctrlKey || event.metaKey) {
      if (isSelected) {
        setSelectedCells(prev => prev.filter(cell => !(cell.glCode === glCode && cell.month === month)));
      } else {
        setSelectedCells(prev => [...prev, cellKey]);
      }
    } else if (event.shiftKey && selectedCells.length > 0) {
      const lastSelected = selectedCells[selectedCells.length - 1];
      const newSelection = expandSelection(lastSelected, cellKey);
      setSelectedCells(newSelection);
    } else {
      setSelectedCells([cellKey]);
    }
  };

  const expandSelection = (start: {glCode: string, month: string}, end: {glCode: string, month: string}) => {
    const selection: {glCode: string, month: string}[] = [];
    const glCodesList = glCodes.map(gl => gl.code);
    const startGLIndex = glCodesList.indexOf(start.glCode);
    const endGLIndex = glCodesList.indexOf(end.glCode);
    const startMonthIndex = months.indexOf(start.month.split(' ')[0]);
    const endMonthIndex = months.indexOf(end.month.split(' ')[0]);

    const minGLIndex = Math.min(startGLIndex, endGLIndex);
    const maxGLIndex = Math.max(startGLIndex, endGLIndex);
    const minMonthIndex = Math.min(startMonthIndex, endMonthIndex);
    const maxMonthIndex = Math.max(startMonthIndex, endMonthIndex);

    for (let gi = minGLIndex; gi <= maxGLIndex; gi++) {
      for (let mi = minMonthIndex; mi <= maxMonthIndex; mi++) {
        const month = `${months[mi]} ${selectedYear}`;
        if (!isMonthActualized(month)) {
          selection.push({ glCode: glCodesList[gi], month });
        }
      }
    }

    return selection;
  };

  // Apply or remove scenario adjustments to forecast
  const applyScenarioToForecast = (scenario: AppliedScenario, shouldApply: boolean) => {
    setForecastData(prev => prev.map(item => {
      const itemMonthName = item.month.split(' ')[0];
      const itemYear = parseInt(item.month.split(' ')[1]);

      if (item.glCode === scenario.glCode) {
        const scenarioStartMonthName = scenario.startMonth.split(' ')[0];
        const scenarioEndMonthName = scenario.endMonth.split(' ')[0];
        const scenarioStartMonth = months.indexOf(scenarioStartMonthName);
        const scenarioEndMonth = months.indexOf(scenarioEndMonthName);
        const itemMonthIndex = months.indexOf(itemMonthName);

        const scenarioStartYear = parseInt(scenario.startMonth.split(' ')[1] || selectedYear.toString());
        const scenarioEndYear = parseInt(scenario.endMonth.split(' ')[1] || selectedYear.toString());

        const isInRange = (
          (itemYear > scenarioStartYear || (itemYear === scenarioStartYear && itemMonthIndex >= scenarioStartMonth)) &&
          (itemYear < scenarioEndYear || (itemYear === scenarioEndYear && itemMonthIndex <= scenarioEndMonth))
        );

        if (isInRange) {
          let adjustedAmount = item.forecastedAmount;

          if (scenario.adjustmentType === 'percentage') {
            if (shouldApply) {
              adjustedAmount = item.forecastedAmount * (1 + scenario.adjustmentValue / 100);
            } else {
              adjustedAmount = item.forecastedAmount / (1 + scenario.adjustmentValue / 100);
            }
          } else {
            if (shouldApply) {
              adjustedAmount = item.forecastedAmount + scenario.adjustmentValue;
            } else {
              adjustedAmount = item.forecastedAmount - scenario.adjustmentValue;
            }
          }

          return {
            ...item,
            forecastedAmount: Math.round(adjustedAmount)
          };
        }
      }

      return item;
    }));
  };

  // Toggle scenario active state
  const toggleScenario = (scenarioId: string) => {
    const scenario = appliedScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    const newActiveState = !scenario.isActive;

    // Apply or remove the scenario adjustment
    applyScenarioToForecast(scenario, newActiveState);

    // Update scenario state
    setAppliedScenarios(prev =>
      prev.map(s =>
        s.id === scenarioId
          ? { ...s, isActive: newActiveState }
          : s
      )
    );

    setScenarioMenuOpen(null);
  };

  // Remove scenario completely
  const removeScenario = (scenarioId: string) => {
    const scenario = appliedScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    // If scenario was active, remove its impact
    if (scenario.isActive) {
      applyScenarioToForecast(scenario, false);
    }

    // Remove scenario from list
    setAppliedScenarios(prev => prev.filter(s => s.id !== scenarioId));
    setScenarioMenuOpen(null);
    setShowDeleteConfirm(null);
  };

  const applyBulkAdjustment = () => {
    if (selectedCells.length === 0) return;

    setForecastData(prev => prev.map(item => {
      const isSelected = selectedCells.some(
        cell => cell.glCode === item.glCode && cell.month === item.month
      );

      if (isSelected && item.isEditable) {
        let newAmount = item.forecastedAmount;

        switch (bulkAdjustment.type) {
          case 'percentage':
            newAmount = item.forecastedAmount * (1 + bulkAdjustment.value / 100);
            break;
          case 'fixed':
            newAmount = item.forecastedAmount + bulkAdjustment.value;
            break;
          case 'set':
            newAmount = bulkAdjustment.value;
            break;
        }

        return { ...item, forecastedAmount: Math.round(newAmount) };
      }

      return item;
    }));

    setSelectedCells([]);
    setShowBulkAdjustPanel(false);
    setBulkAdjustment({ type: 'percentage', value: 0 });
  };

  const clearSelection = () => {
    setSelectedCells([]);
  };

  const isCellSelected = (glCode: string, month: string) => {
    return selectedCells.some(cell => cell.glCode === glCode && cell.month === month);
  };

  const renderGLSpecificInputs = () => {
    if (!selectedGLCode) return null;

    switch (selectedGLCode.code) {
      case '6000': // Payroll & Benefits
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-[#101010] mb-4">Payroll Calculator</h4>
            <PayrollCalculator
              onCalculate={(result: PayrollResult) => {
                setGLScenarioForm({
                  ...glScenarioForm,
                  headcount: 1,
                  averageSalary: Math.round(result.grossPay)
                });
              }}
            />
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
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avg Trip Cost</label>
                <input
                  type="number"
                  value={glScenarioForm.averageTripCost}
                  onChange={(e) => setGLScenarioForm({...glScenarioForm, averageTripCost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
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
              <div className="relative" ref={adjustmentTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setAdjustmentTypeDropdownOpen(!adjustmentTypeDropdownOpen)}
                  className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>{glScenarioForm.adjustmentType === 'percentage' ? 'Percentage Change' : 'Fixed Amount'}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {adjustmentTypeDropdownOpen && (
                  <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[200px]">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setGLScenarioForm({...glScenarioForm, adjustmentType: 'percentage'});
                          setAdjustmentTypeDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                          glScenarioForm.adjustmentType === 'percentage'
                            ? 'bg-[#7B68EE] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Percentage Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGLScenarioForm({...glScenarioForm, adjustmentType: 'fixed'});
                          setAdjustmentTypeDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                          glScenarioForm.adjustmentType === 'fixed'
                            ? 'bg-[#7B68EE] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        Fixed Amount
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
                      ? 'border-[#7B68EE] bg-[#7B68EE]/5 text-[#7B68EE]'
                      : 'border-gray-300 hover:border-[#7B68EE]/40 text-gray-700'
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
                      ? 'border-[#7B68EE] bg-[#7B68EE]/5 text-[#7B68EE]'
                      : 'border-gray-300 hover:border-[#7B68EE]/40 text-gray-700'
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
                        <div className="relative" ref={startMonthDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setStartMonthDropdownOpen(!startMonthDropdownOpen)}
                            className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{glScenarioForm.startMonth}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>
                          {startMonthDropdownOpen && (
                            <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px] max-h-64 overflow-y-auto">
                              <div className="flex flex-col gap-1">
                                {months.map(month => {
                                  const monthData = forecastData.find(item =>
                                    item.glCode === selectedGLCode?.code &&
                                    item.month === `${month} ${selectedYear}`
                                  );
                                  const isActualized = monthData?.actualAmount !== undefined;
                                  return (
                                    <button
                                      key={month}
                                      type="button"
                                      disabled={isActualized}
                                      onClick={() => {
                                        setGLScenarioForm({...glScenarioForm, startMonth: month});
                                        setStartMonthDropdownOpen(false);
                                      }}
                                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                                        glScenarioForm.startMonth === month
                                          ? 'bg-[#7B68EE] text-white'
                                          : isActualized
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {month}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative" ref={startYearDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setStartYearDropdownOpen(!startYearDropdownOpen)}
                            className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{glScenarioForm.startYear}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>
                          {startYearDropdownOpen && (
                            <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px]">
                              <div className="flex flex-col gap-1">
                                {[2024, 2025, 2026, 2027].map((year) => (
                                  <button
                                    key={year}
                                    type="button"
                                    onClick={() => {
                                      setGLScenarioForm({...glScenarioForm, startYear: year});
                                      setStartYearDropdownOpen(false);
                                    }}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                                      glScenarioForm.startYear === year
                                        ? 'bg-[#7B68EE] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    {year}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="relative" ref={endMonthDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setEndMonthDropdownOpen(!endMonthDropdownOpen)}
                            className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{glScenarioForm.endMonth}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>
                          {endMonthDropdownOpen && (
                            <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px] max-h-64 overflow-y-auto">
                              <div className="flex flex-col gap-1">
                                {months.map(month => {
                                  const monthData = forecastData.find(item =>
                                    item.glCode === selectedGLCode?.code &&
                                    item.month === `${month} ${selectedYear}`
                                  );
                                  const isActualized = monthData?.actualAmount !== undefined;
                                  return (
                                    <button
                                      key={month}
                                      type="button"
                                      disabled={isActualized}
                                      onClick={() => {
                                        setGLScenarioForm({...glScenarioForm, endMonth: month});
                                        setEndMonthDropdownOpen(false);
                                      }}
                                      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                                        glScenarioForm.endMonth === month
                                          ? 'bg-[#7B68EE] text-white'
                                          : isActualized
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-gray-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      {month}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="relative" ref={endYearDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setEndYearDropdownOpen(!endYearDropdownOpen)}
                            className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                          >
                            <span>{glScenarioForm.endYear}</span>
                            <ChevronDown className="w-4 h-4 ml-1" />
                          </button>
                          {endYearDropdownOpen && (
                            <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px]">
                              <div className="flex flex-col gap-1">
                                {[2024, 2025, 2026, 2027].map((year) => (
                                  <button
                                    key={year}
                                    type="button"
                                    onClick={() => {
                                      setGLScenarioForm({...glScenarioForm, endYear: year});
                                      setEndYearDropdownOpen(false);
                                    }}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                                      glScenarioForm.endYear === year
                                        ? 'bg-[#7B68EE] text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    {year}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
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
        createdBy: 'Current User',
        isActive: true
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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {/* Left Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/forecasting')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/forecasting'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            Forecasting
          </button>
          <button
            onClick={() => navigate('/reports/balance')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/reports/balance'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            Balance Sheet
          </button>
          <button
            onClick={() => navigate('/reports/cashflow')}
            className={`px-2 py-1 rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center ${
              location.pathname === '/reports/cashflow'
                ? 'bg-[#7B68EE] text-white'
                : 'bg-white text-[#7B68EE]'
            }`}
          >
            Cash Flow
          </button>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSaveForecastModal(true)}
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Forecast
          </button>
          <button
            onClick={() => setShowScenarioAuditSidebar(true)}
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <History className="w-4 h-4 mr-2" />
            Applied Drivers
          </button>
          <button
            onClick={() => setShowVersionHistorySidebar(true)}
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <History className="w-4 h-4 mr-2" />
            Version History
          </button>
          <button
            onClick={() => setShowAlertsSidebar(true)}
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </button>
          <button
            className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Selection Actions Bar */}
      {selectedCells.length > 0 && (
        <div className="bg-[#F5F3FF] border border-[#7B68EE] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[#101010]">
              {selectedCells.length} cell{selectedCells.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setShowBulkAdjustPanel(true)}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Adjust Selected
            </button>
            <button
              onClick={() => {}}
              className="px-3 py-1.5 bg-[#7B68EE] text-white rounded-lg text-sm font-medium hover:bg-[#6B58DE] transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Forecast with AI
            </button>
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Clear Selection
            </button>
          </div>
          <span className="text-xs text-gray-600">
            Tip: Hold Ctrl/Cmd to select multiple cells, Shift for range selection, or double-click to edit
          </span>
        </div>
      )}

      {/* Controls */}
      <Card>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1">
              <button
                onClick={() => setDateViewMode('months')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  dateViewMode === 'months'
                    ? 'bg-white text-[#7B68EE] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Months
              </button>
              <button
                onClick={() => setDateViewMode('quarters')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  dateViewMode === 'quarters'
                    ? 'bg-white text-[#7B68EE] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Quarters
              </button>
              <button
                onClick={() => setDateViewMode('years')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                  dateViewMode === 'years'
                    ? 'bg-white text-[#7B68EE] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Years
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <div className="relative" ref={yearDropdownRef}>
              <button
                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
              >
                <span>{selectedYear}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {yearDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px]">
                  <div className="flex flex-col gap-1">
                    {[2024, 2025, 2026, 2027].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          setSelectedYear(year);
                          setYearDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                          selectedYear === year
                            ? 'bg-[#7B68EE] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Department:</label>
            <div className="relative" ref={deptDropdownRef}>
              <button
                onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                className="px-2 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center"
              >
                <span>{selectedCategory === 'All' ? 'All Categories' : selectedCategory}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {deptDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[180px]">
                  <div className="flex flex-col gap-1">
                    {[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Revenue', label: 'Revenue' },
                      { value: 'COGS', label: 'Cost of Goods Sold' },
                      { value: 'OPEX', label: 'Operating Expenses' },
                      { value: 'Other', label: 'Other' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedCategory(option.value);
                          setDeptDropdownOpen(false);
                        }}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                          selectedCategory === option.value
                            ? 'bg-[#7B68EE] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {(dateViewMode === 'quarters' || dateViewMode === 'years') && (
            <div className="h-8 w-px bg-gray-400"></div>
          )}

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Search GL:</label>
            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search codes..."
                className="w-full pl-10 pr-4 py-1 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                const allGLCodes = glCodes.map(gl => gl.code);
                if (expandedGLCodes.length === allGLCodes.length) {
                  setExpandedGLCodes([]);
                } else {
                  setExpandedGLCodes(allGLCodes);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={expandedGLCodes.length === glCodes.length ? "Collapse all" : "Expand all"}
            >
              {expandedGLCodes.length === glCodes.length ? (
                <EyeOff className="w-4 h-4 text-gray-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {expandedGLCodes.length === glCodes.length ? "Collapse All" : "Expand All"}
              </span>
            </button>
            <button
              onClick={() => setShowViewSettingsPanel(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title="View settings"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">View Settings</span>
            </button>
          </div>
        </div>
      </Card>

        {/* Main Forecast Table */}
        <div className="w-full">
          <Card title={
            dateViewMode === 'months'
              ? `${selectedYear} Monthly Forecast`
              : dateViewMode === 'quarters'
              ? `Quarterly Forecast (All Years)`
              : `Yearly Forecast (All Years)`
          }>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-4 font-bold text-gray-800 w-64 sticky left-0 bg-white">Account</th>
                    {dateViewMode === 'months' && (
                      <th className="text-left py-3 px-2 font-bold text-gray-800 w-20"></th>
                    )}
                    {datePeriods.map((period, index) => {
                      const labelData = getDateLabel(period, index);
                      const isOuterYear = dateViewMode !== 'months' && labelData.year !== selectedYear;

                      return (
                        <th
                          key={index}
                          className={`py-3 font-bold ${
                            isOuterYear ? 'text-gray-500 bg-gray-50' : 'text-gray-800'
                          } ${
                            dateViewMode === 'months'
                              ? 'text-center px-2 min-w-[120px]'
                              : dateViewMode === 'quarters'
                              ? 'text-center px-2 min-w-[100px]'
                              : 'text-center px-2 min-w-[100px]'
                          }`}
                        >
                          {dateViewMode === 'years' ? (
                            <div className="flex flex-col">
                              <span className={`text-sm ${
                                isOuterYear ? 'text-gray-500 font-normal' : 'font-bold'
                              }`}>FY{labelData.label}</span>
                              <span className="text-xs font-normal text-gray-400">
                                {(() => {
                                  const year = parseInt(labelData.label);
                                  const currentYear = new Date().getFullYear();
                                  if (year < currentYear) return 'Actuals';
                                  if (year === currentYear) return 'Act + Fcst';
                                  return 'Forecast';
                                })()}
                              </span>
                            </div>
                          ) : dateViewMode === 'quarters' ? (
                            <div className="flex flex-col">
                              <span className={`text-sm ${
                                isOuterYear ? 'text-gray-500 font-normal' : 'font-bold'
                              }`}>{labelData.label}</span>
                              <span className="text-xs font-normal text-gray-400">{getQuarterLabel(period.period)}</span>
                            </div>
                          ) : (
                            period
                          )}
                        </th>
                      );
                    })}
                    {dateViewMode === 'months' && (
                      <th className="text-center py-3 px-2 font-bold text-gray-800 min-w-[120px]">FY Total</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {['Revenue', 'COGS', 'OPEX', 'Other'].map(category => {
                    const categoryGLCodes = filteredGLCodes.filter(gl => gl.category === category);
                    if (categoryGLCodes.length === 0) return null;

                    return (
                      <React.Fragment key={category}>
                        {/* Category Header */}
                        <tr>
                          <td colSpan={dateViewMode === 'months' ? datePeriods.length + 3 : datePeriods.length + 1} className="py-2 px-0">
                            <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
                              <button
                                onClick={() => toggleCategory(category)}
                                className="flex items-center font-bold text-[#101010] hover:text-[#3AB7BF] transition-colors"
                              >
                                {expandedCategories.includes(category) ? (
                                  <ChevronDown className="w-4 h-4 mr-2" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 mr-2" />
                                )}
                                {category}
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* GL Code Rows */}
                        {expandedCategories.includes(category) && categoryGLCodes.map((glCode, glIndex) => {
                          const hasOpenScenario = appliedScenarios.some(s => s.glCode === glCode.code && scenarioMenuOpen === s.id);
                          return (
                          <React.Fragment key={glCode.code}>
                            <tr
                              className="border-b border-gray-100 hover:bg-gray-50 group"
                              onContextMenu={(e) => handleContextMenu(e, glCode)}
                            >
                              <td className="py-3 px-4 text-sm sticky left-0 bg-white group-hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-[#101010]">
                                      {showAccountCodes && <span className="font-mono text-xs text-gray-500 mr-2">{glCode.code}</span>}
                                      {glCode.name}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="relative">
                                      <button
                                        onClick={() => {
                                          setDriverDropdownOpen(driverDropdownOpen === glCode.code ? null : glCode.code);
                                        }}
                                        className="p-1 hover:bg-[#9333ea]/10 rounded transition-colors text-[#9333ea]"
                                        title="Add driver"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </button>
                                      {driverDropdownOpen === glCode.code && (
                                        <div
                                          ref={driverDropdownRef}
                                          className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]"
                                        >
                                          <button
                                            onClick={() => {
                                              setSelectedGLCode(glCode);
                                              setShowGLScenarioModal(true);
                                              setDriverDropdownOpen(null);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                            Quick Driver
                                          </button>
                                          <button
                                            onClick={() => {
                                              setSelectedGLCode(glCode);
                                              setShowSalesScenarioModal(true);
                                              setDriverDropdownOpen(null);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700 border-t border-gray-100"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                            Customer Driver
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => {
                                        setExpandedGLCodes(prev =>
                                          prev.includes(glCode.code)
                                            ? prev.filter(code => code !== glCode.code)
                                            : [...prev, glCode.code]
                                        );
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded transition-all duration-300"
                                      title="Toggle details"
                                    >
                                      {expandedGLCodes.includes(glCode.code) ? (
                                        <ChevronDown className="w-3 h-3" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3" />
                                      )}
                                    </button>
                                    {expandedGLCodes.includes(glCode.code) && appliedScenarios.filter(s => s.glCode === glCode.code).length > 0 && (
                                      <button
                                        onClick={() => {
                                          setHiddenDrivers(prev =>
                                            prev.includes(glCode.code)
                                              ? prev.filter(code => code !== glCode.code)
                                              : [...prev, glCode.code]
                                          );
                                        }}
                                        className="p-1 hover:bg-[#9333ea]/10 rounded transition-all duration-300 text-[#9333ea]"
                                        title={hiddenDrivers.includes(glCode.code) ? "Show drivers" : "Hide drivers"}
                                      >
                                        {hiddenDrivers.includes(glCode.code) ? (
                                          <Eye className="w-3 h-3" />
                                        ) : (
                                          <EyeOff className="w-3 h-3" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </td>
                              {dateViewMode === 'months' && (
                                <td className="py-3 px-2 text-xs text-gray-600 font-medium border-r border-gray-300" style={{ verticalAlign: expandedGLCodes.includes(glCode.code) ? 'top' : 'middle' }}>
                                  <div className="overflow-hidden">
                                    <div className={`flex items-center ${!expandedGLCodes.includes(glCode.code) ? 'h-[20px]' : ''}`}>
                                      Act:
                                    </div>
                                    <div className={`${expandedGLCodes.includes(glCode.code) ? 'mt-1' : 'hidden'}`}>
                                      <div className="h-[20px] flex items-center">
                                        {selectedYear < new Date().getFullYear() ? 'Prior Year:' : 'Budget:'}
                                      </div>
                                      <div className="h-[18px] flex items-center mt-1">Change:</div>
                                    </div>
                                  </div>
                                </td>
                              )}
                              {datePeriods.map((period, periodIndex) => {
                                const aggregatedAmount = getAggregatedAmount(glCode.code, period);
                                const labelData = dateViewMode !== 'months' ? getDateLabel(period, periodIndex) : null;
                                const isOuterYear = dateViewMode !== 'months' && labelData && labelData.year !== selectedYear;
                                const periodKey = dateViewMode === 'months' ? `${period} ${selectedYear}` : period;
                                const isActualized = dateViewMode === 'months' ? isMonthActualized(periodKey) : false;
                                const isEditing = dateViewMode === 'months' && editingCell?.glCode === glCode.code && editingCell?.month === periodKey;
                                const isSelected = dateViewMode === 'months' && isCellSelected(glCode.code, periodKey);

                                return (
                                  <td
                                    key={periodIndex}
                                    className={`py-3 ${
                                      isOuterYear ? 'bg-gray-50/50' : ''
                                    } ${
                                      dateViewMode === 'months'
                                        ? 'text-center px-2'
                                        : 'text-center px-2'
                                    }`}
                                  >
                                    <div className="relative" style={{ verticalAlign: expandedGLCodes.includes(glCode.code) ? 'top' : 'middle' }}>
                                      <div className="overflow-hidden">
                                        <div className={`flex items-center justify-center ${!expandedGLCodes.includes(glCode.code) ? 'h-[20px]' : ''}`}>
                                          {dateViewMode === 'months' && (() => {
                                            const monthData = forecastData.find(item => item.glCode === glCode.code && item.month === periodKey);
                                            if (monthData?.actualAmount !== undefined) {
                                              return (
                                                <div className="text-sm text-[#212b36] font-medium bg-gray-100 rounded px-1 py-0.5">
                                                  ${formatNumber(monthData.actualAmount)}
                                                </div>
                                              );
                                            } else {
                                              return (
                                                <div className="text-sm text-[#212b36] font-medium bg-gray-100 rounded px-1 py-0.5">
                                                  -
                                                </div>
                                              );
                                            }
                                          })()}
                                        </div>
                                        <div className={`${expandedGLCodes.includes(glCode.code) ? 'mt-1 space-y-1' : 'hidden'}`}>
                                          <div className={`rounded px-1 ${
                                            isOuterYear ? 'font-normal text-gray-500' : 'font-semibold'
                                          } ${
                                            isSelected
                                              ? 'bg-[#3AB7BF]/20 border-2 border-[#3AB7BF]'
                                              : !isActualized && dateViewMode === 'months'
                                                ? 'cursor-pointer hover:bg-[#EEF2FF]'
                                                : ''
                                          } text-sm`}>
                                            {isEditing ? (
                                              <input
                                                type="text"
                                                inputMode="numeric"
                                                value={editValue}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
                                                    setEditValue(value);
                                                  }
                                                }}
                                                onBlur={handleCellSave}
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') handleCellSave();
                                                  if (e.key === 'Escape') handleCellCancel();
                                                }}
                                                className="w-full px-1 py-0.5 text-center border border-[#A5B4FC] rounded text-sm"
                                                autoFocus
                                                onFocus={(e) => e.target.select()}
                                              />
                                            ) : (
                                              <span
                                                onClick={(e) => {
                                                  if (!isActualized && dateViewMode === 'months' && aggregatedAmount) {
                                                    if (e.detail === 2) {
                                                      handleCellEdit(glCode.code, periodKey, aggregatedAmount);
                                                    } else {
                                                      handleCellSelection(glCode.code, periodKey, isActualized, e);
                                                    }
                                                  }
                                                }}
                                                className={`text-sm ${isActualized ? 'text-gray-600' : 'text-[#101010] hover:text-[#4F46E5] select-none'}`}
                                              >
                                                ${formatNumber(aggregatedAmount)}
                                              </span>
                                            )}
                                          </div>
                                          {dateViewMode === 'months' && (() => {
                                            const monthData = forecastData.find(item => item.glCode === glCode.code && item.month === periodKey);
                                            if (monthData?.actualAmount !== undefined) {
                                              const variance = ((monthData.actualAmount - aggregatedAmount) / aggregatedAmount) * 100;
                                              const varianceDollar = monthData.actualAmount - aggregatedAmount;
                                              const varianceColor = getVarianceColor(variance, glCode.code);
                                              return (
                                                <div className={`text-sm font-medium ${varianceColor}`}>
                                                  {showActualsAsAmount
                                                    ? `${varianceDollar >= 0 ? '+' : ''}$${formatNumber(Math.abs(varianceDollar))}`
                                                    : `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`
                                                  }
                                                </div>
                                              );
                                            } else {
                                              return (
                                                <div className="text-sm font-medium text-gray-400">
                                                  -
                                                </div>
                                              );
                                            }
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}
                              {dateViewMode === 'months' && (
                                <td className="py-3 px-2 text-sm text-center border-l border-gray-300">
                                  <div className="space-y-1">
                                    {editingCell?.glCode === glCode.code && editingCell?.type === 'fy' ? (
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={editValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
                                            setEditValue(value);
                                          }
                                        }}
                                        onBlur={handleCellSave}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleCellSave();
                                          if (e.key === 'Escape') handleCellCancel();
                                        }}
                                        className="w-full px-2 py-1 text-right border border-[#A5B4FC] rounded text-sm"
                                        autoFocus
                                        onFocus={(e) => e.target.select()}
                                      />
                                    ) : (() => {
                                      const yearData = forecastData.filter(item => item.glCode === glCode.code && item.month.includes(selectedYear.toString()));
                                      const totalActuals = yearData.reduce((sum, item) => sum + (item.actualAmount || 0), 0);
                                      const totalForecast = yearData.reduce((sum, item) => sum + item.forecastedAmount, 0);
                                      const remainingForecast = yearData
                                        .filter(item => !item.actualAmount)
                                        .reduce((sum, item) => sum + item.forecastedAmount, 0);
                                      const actualsAndRemaining = totalActuals + remainingForecast;
                                      const variance = totalForecast !== 0 ? ((actualsAndRemaining - totalForecast) / totalForecast) * 100 : 0;
                                      const varianceDollar = actualsAndRemaining - totalForecast;
                                      const varianceColor = getVarianceColor(variance, glCode.code);

                                      return (
                                        <>
                                          <div className="text-sm text-[#212b36] font-medium bg-gray-100 rounded px-1 py-0.5">
                                            ${formatNumber(totalActuals)}
                                          </div>
                                          {expandedGLCodes.includes(glCode.code) && (
                                            <>
                                              <div className="text-center">
                                                <span
                                                  onClick={() => {
                                                    setEditingCell({ glCode: glCode.code, month: 'FY', type: 'fy' });
                                                    setEditValue(totalForecast.toString());
                                                  }}
                                                  className="cursor-pointer hover:bg-[#EEF2FF] rounded px-2 py-1 inline-block font-medium text-[#101010]"
                                                >
                                                  ${formatNumber(actualsAndRemaining)}
                                                </span>
                                              </div>
                                              <div className={`text-sm font-medium text-center ${varianceColor}`}>
                                                {showActualsAsAmount
                                                  ? `${varianceDollar >= 0 ? '+' : ''}$${formatNumber(Math.abs(varianceDollar))}`
                                                  : `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`
                                                }
                                              </div>
                                            </>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </td>
                              )}
                            </tr>


                            {/* Expanded GL Code Scenarios */}
                            {expandedGLCodes.includes(glCode.code) && !hiddenDrivers.includes(glCode.code) && dateViewMode === 'months' && appliedScenarios.filter(scenario => scenario.glCode === glCode.code).length > 0 && (
                              <tr>
                                <td colSpan={dateViewMode === 'months' ? datePeriods.length + 3 : datePeriods.length + 1} className="py-0 px-0">
                                  <div className="border-t border-gray-200 bg-gray-50/50">
                                    <div className="p-4">
                                      <h5 className="text-xs text-gray-500 mb-2">Drivers for {glCode.name}</h5>
                                      <div className="space-y-1.5">
                                      {appliedScenarios.filter(scenario => scenario.glCode === glCode.code).map(scenario => (
                                        <div key={scenario.id} className={`p-2.5 bg-white rounded border-l-4 border-l-[#9333ea] ${scenarioMenuOpen === scenario.id ? 'border-2 border-[#9333ea]' : 'border border-gray-200'}`}>
                                            <div className="flex items-start justify-between gap-3">
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                  <h6 className="font-medium text-[#101010]">{scenario.name}</h6>
                                                  {scenario.isSalesDriverScenario && (
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#9333EA]/10 text-[#9333EA]">
                                                      Customer Driver
                                                    </span>
                                                  )}
                                                  {!scenario.isSalesDriverScenario && (
                                                    <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#9333EA]/10 text-[#9333EA]">
                                                      Quick Driver
                                                    </span>
                                                  )}
                                                  <span className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                                                    scenario.isActive
                                                      ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                                                      : 'bg-gray-200 text-gray-600'
                                                  }`}>
                                                    {scenario.isActive ? 'Active' : 'Inactive'}
                                                  </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                  {scenario.startMonth} - {scenario.endMonth} •
                                                  {scenario.adjustmentType === 'percentage' ?
                                                    ` ${scenario.adjustmentValue}% change` :
                                                    ` $${scenario.adjustmentValue.toLocaleString()} adjustment`
                                                  }
                                                </p>
                                              </div>
                                              <button
                                                onClick={() => setScenarioMenuOpen(scenarioMenuOpen === scenario.id ? null : scenario.id)}
                                                className="px-3 py-1.5 bg-[#eff1f4] hover:bg-[#e5e7ea] text-gray-700 text-xs font-medium rounded transition-colors flex items-center gap-1.5 flex-shrink-0"
                                              >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                Edit
                                              </button>
                                            </div>

                                            {/* Activity Cards for this scenario */}
                                            <div className="mt-1">
                                              <table className="w-full">
                                                <tbody>
                                                  <tr>
                                                    <td className="py-1 px-4 text-sm sticky left-0 bg-white w-64"></td>
                                                    {months.map((month, index) => {
                                                      const startIndex = getMonthIndex(scenario.startMonth);
                                                      const endIndex = getMonthIndex(scenario.endMonth);
                                                      const isActive = index >= startIndex && index <= endIndex && scenario.isActive;
                                                      const impact = getScenarioMonthImpact(scenario, month, glCode.code);
                                                      const hasActivity = isActive && impact !== 0;

                                                      return (
                                                        <td key={index} className="py-1 text-center px-2 min-w-[120px]">
                                                          <div className={`text-xs font-semibold rounded px-2 py-1 ${hasActivity ? 'bg-[#4ADE80] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {hasActivity ? `${impact >= 0 ? '+' : ''}$${formatNumber(Math.abs(impact))}` : '-'}
                                                          </div>
                                                        </td>
                                                      );
                                                    })}
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>

                                            {scenarioMenuOpen === scenario.id && (
                                              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex gap-2">
                                                  <button
                                                    onClick={() => {
                                                      const isSalesDriver = scenario.isSalesDriverScenario ||
                                                        scenario.description?.includes('driver') ||
                                                        (scenario.salesScenarioData !== undefined);

                                                      console.log('🔧 Adjust clicked:', {
                                                        scenarioName: scenario.name,
                                                        isSalesDriverScenario: scenario.isSalesDriverScenario,
                                                        hasSalesScenarioData: !!scenario.salesScenarioData,
                                                        salesScenarioData: scenario.salesScenarioData,
                                                        description: scenario.description,
                                                        isSalesDriver,
                                                        fullScenario: scenario
                                                      });

                                                      if (isSalesDriver && scenario.salesScenarioData) {
                                                        console.log('✅ Opening Sales Scenario Modal with data:', scenario.salesScenarioData);
                                                        const glCode = glCodes.find(gl => gl.code === scenario.glCode) || null;
                                                        console.log('Setting states:', {
                                                          editingSalesScenario: scenario.salesScenarioData,
                                                          selectedGLCode: glCode,
                                                          showSalesScenarioModal: true
                                                        });
                                                        setEditingSalesScenario(scenario.salesScenarioData);
                                                        setSelectedGLCode(glCode);
                                                        setShowSalesScenarioModal(true);
                                                        setScenarioMenuOpen(null);
                                                        console.log('✅ Sales Scenario Builder should now be open!');
                                                        return;
                                                      } else if (isSalesDriver && !scenario.salesScenarioData) {
                                                        console.error('❌ ERROR: This is a sales driver scenario but data is missing!');
                                                        console.error('This scenario was likely created before the data persistence fix.');
                                                        console.error('Please delete and recreate this scenario.');
                                                        alert('This sales driver scenario is missing its configuration data.\n\nThis happens when scenarios were created before the latest update.\n\nPlease:\n1. Delete this scenario\n2. Create a new one with the same settings\n\nThe new scenario will save all driver data correctly.');
                                                        setScenarioMenuOpen(null);
                                                        return;
                                                      }

                                                      console.log('⚠️ Opening Quick Scenario Modal (this is a quick scenario, not a sales driver)');
                                                      setEditingScenario(scenario);
                                                      setGLScenarioForm({
                                                        ...glScenarioForm,
                                                        title: scenario.name,
                                                        description: scenario.description,
                                                        adjustmentType: scenario.adjustmentType,
                                                        adjustmentValue: scenario.adjustmentValue,
                                                        startMonth: scenario.startMonth.split(' ')[0],
                                                        endMonth: scenario.endMonth.split(' ')[0]
                                                      });
                                                      setSelectedGLCode(glCodes.find(gl => gl.code === scenario.glCode) || null);
                                                      setShowEditScenarioModal(true);
                                                      setScenarioMenuOpen(null);
                                                    }}
                                                    className="px-2.5 py-1.5 text-xs font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                                                  >
                                                    Adjust
                                                  </button>
                                                  <button
                                                    onClick={() => toggleScenario(scenario.id)}
                                                    className="px-2.5 py-1.5 text-xs font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                                                  >
                                                    {scenario.isActive ? 'Deactivate' : 'Activate'}
                                                  </button>
                                                  <button
                                                    onClick={() => setShowDeleteConfirm(scenario.id)}
                                                    className="px-2.5 py-1.5 text-xs font-medium bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                  >
                                                    Remove
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                      ))}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                        })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

     {/* GL Scenario Modal */}
     {showGLScenarioModal && selectedGLCode && (
       <>
         <div
           className="fixed inset-0 bg-black bg-opacity-50 z-40"
           onClick={() => {
             setShowGLScenarioModal(false);
             setSelectedGLCode(null);
           }}
         />
         <div className="fixed right-0 top-0 bottom-0 z-50 w-[600px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
           <div className="flex items-center justify-between p-6 border-b border-gray-200">
             <h3 className="text-xl font-semibold text-[#101010]">
               Add Scenario for {selectedGLCode.name} ({selectedGLCode.code})
             </h3>
             <button
               onClick={() => {
                 setShowGLScenarioModal(false);
                 setSelectedGLCode(null);
               }}
               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <X className="w-5 h-5 text-gray-500" />
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
               <input
                 type="text"
                 value={glScenarioForm.title}
                 onChange={(e) => setGLScenarioForm({...glScenarioForm, title: e.target.value})}
                 className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                 placeholder="e.g., Q2 Marketing Campaign"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
               <textarea
                 value={glScenarioForm.description}
                 onChange={(e) => setGLScenarioForm({...glScenarioForm, description: e.target.value})}
                 className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                 rows={3}
                 placeholder="Describe the scenario and its impact"
               />
             </div>
             
             {renderGLSpecificInputs()}
             
             <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
               <p className="text-sm text-gray-700">{getImpactPreview()}</p>
             </div>
           </div>

           <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
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
                     createdBy: 'Current User',
                     isActive: true
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
               className="px-4 py-2 bg-[#101010] text-white rounded-lg hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Apply Scenario
             </button>
           </div>
         </div>
       </>
     )}

     {/* Edit Scenario Modal */}
     {showEditScenarioModal && editingScenario && selectedGLCode && (
       <>
         <div
           className="fixed inset-0 bg-black bg-opacity-50 z-40"
           onClick={() => {
             setShowEditScenarioModal(false);
             setEditingScenario(null);
             setSelectedGLCode(null);
           }}
         />
         <div className="fixed right-0 top-0 bottom-0 z-50 w-[600px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
           <div className="flex items-center justify-between p-6 border-b border-gray-200">
             <h3 className="text-xl font-semibold text-[#101010]">
               Adjust Scenario: {editingScenario.name}
             </h3>
             <button
               onClick={() => {
                 setShowEditScenarioModal(false);
                 setEditingScenario(null);
                 setSelectedGLCode(null);
               }}
               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <X className="w-5 h-5 text-gray-500" />
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
               <input
                 type="text"
                 value={glScenarioForm.title}
                 onChange={(e) => setGLScenarioForm({...glScenarioForm, title: e.target.value})}
                 className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                 placeholder="e.g., Q2 Marketing Campaign"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
               <textarea
                 value={glScenarioForm.description}
                 onChange={(e) => setGLScenarioForm({...glScenarioForm, description: e.target.value})}
                 className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                 rows={3}
                 placeholder="Describe the scenario and its impact"
               />
             </div>

             {renderGLSpecificInputs()}

             <div className="p-3 bg-[#3AB7BF]/10 rounded-lg">
               <p className="text-sm text-gray-700">{getImpactPreview()}</p>
             </div>
           </div>

           <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
             <button
               onClick={() => {
                 setShowEditScenarioModal(false);
                 setEditingScenario(null);
                 setSelectedGLCode(null);
               }}
               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
             >
               Cancel
             </button>
             <button
               onClick={() => {
                 if (editingScenario && isScenarioValid()) {
                   // Remove old scenario impact if it was active
                   if (editingScenario.isActive) {
                     applyScenarioToForecast(editingScenario, false);
                   }

                   // Update scenario with new values
                   const updatedScenario: AppliedScenario = {
                     ...editingScenario,
                     name: glScenarioForm.title,
                     description: glScenarioForm.description,
                     startMonth: glScenarioForm.startMonth,
                     endMonth: glScenarioForm.endMonth,
                     adjustmentType: glScenarioForm.adjustmentType,
                     adjustmentValue: glScenarioForm.adjustmentValue,
                   };

                   // Apply new scenario impact if active
                   if (updatedScenario.isActive) {
                     const startMonthIndex = months.indexOf(updatedScenario.startMonth);
                     const endMonthIndex = months.indexOf(updatedScenario.endMonth);

                     setForecastData(prev => prev.map(item => {
                       if (item.glCode === updatedScenario.glCode) {
                         const itemMonthIndex = months.indexOf(item.month.split(' ')[0]);
                         if (itemMonthIndex >= startMonthIndex && itemMonthIndex <= endMonthIndex) {
                           let adjustedAmount = item.forecastedAmount;
                           if (updatedScenario.adjustmentType === 'percentage') {
                             adjustedAmount = item.forecastedAmount * (1 + updatedScenario.adjustmentValue / 100);
                           } else {
                             adjustedAmount = item.forecastedAmount + updatedScenario.adjustmentValue;
                           }
                           return { ...item, forecastedAmount: Math.round(adjustedAmount) };
                         }
                       }
                       return item;
                     }));
                   }

                   // Update scenario in list
                   setAppliedScenarios(prev =>
                     prev.map(s => s.id === editingScenario.id ? updatedScenario : s)
                   );

                   setShowEditScenarioModal(false);
                   setEditingScenario(null);
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
               className="px-4 py-2 bg-[#101010] text-white rounded-lg hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               Update Scenario
             </button>
           </div>
         </div>
       </>
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
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent appearance-none"
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
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                    placeholder="e.g., Q2 Marketing Campaign"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={sidePanelForm.description}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
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
                    <div className="relative" ref={sidePanelStartMonthDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setSidePanelStartMonthDropdownOpen(!sidePanelStartMonthDropdownOpen)}
                        className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{sidePanelForm.startMonth}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {sidePanelStartMonthDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px] max-h-64 overflow-y-auto">
                          <div className="flex flex-col gap-1">
                            {months.map(month => {
                              const monthData = forecastData.find(item =>
                                item.glCode === editingScenario?.glCode &&
                                item.month === `${month} ${selectedYear}`
                              );
                              const isActualized = monthData?.actualAmount !== undefined;
                              return (
                                <button
                                  key={month}
                                  type="button"
                                  disabled={isActualized}
                                  onClick={() => {
                                    setSidePanelForm({...sidePanelForm, startMonth: month});
                                    setSidePanelStartMonthDropdownOpen(false);
                                  }}
                                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                                    sidePanelForm.startMonth === month
                                      ? 'bg-[#7B68EE] text-white'
                                      : isActualized
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {month}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Month</label>
                    <div className="relative" ref={sidePanelEndMonthDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setSidePanelEndMonthDropdownOpen(!sidePanelEndMonthDropdownOpen)}
                        className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{sidePanelForm.endMonth}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                      {sidePanelEndMonthDropdownOpen && (
                        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px] max-h-64 overflow-y-auto">
                          <div className="flex flex-col gap-1">
                            {months.map(month => {
                              const monthData = forecastData.find(item =>
                                item.glCode === editingScenario?.glCode &&
                                item.month === `${month} ${selectedYear}`
                              );
                              const isActualized = monthData?.actualAmount !== undefined;
                              return (
                                <button
                                  key={month}
                                  type="button"
                                  disabled={isActualized}
                                  onClick={() => {
                                    setSidePanelForm({...sidePanelForm, endMonth: month});
                                    setSidePanelEndMonthDropdownOpen(false);
                                  }}
                                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                                    sidePanelForm.endMonth === month
                                      ? 'bg-[#7B68EE] text-white'
                                      : isActualized
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {month}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
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
                  <div className="relative" ref={sidePanelAdjustmentTypeDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setSidePanelAdjustmentTypeDropdownOpen(!sidePanelAdjustmentTypeDropdownOpen)}
                      className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{sidePanelForm.adjustmentType === 'percentage' ? 'Percentage Change (%)' : 'Fixed Amount ($)'}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {sidePanelAdjustmentTypeDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[200px]">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSidePanelForm({...sidePanelForm, adjustmentType: 'percentage'});
                              setSidePanelAdjustmentTypeDropdownOpen(false);
                            }}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                              sidePanelForm.adjustmentType === 'percentage'
                                ? 'bg-[#7B68EE] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Percentage Change (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSidePanelForm({...sidePanelForm, adjustmentType: 'fixed'});
                              setSidePanelAdjustmentTypeDropdownOpen(false);
                            }}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors text-left ${
                              sidePanelForm.adjustmentType === 'fixed'
                                ? 'bg-[#7B68EE] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            Fixed Amount ($)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    {sidePanelForm.adjustmentType === 'percentage' ? 'Percentage Change (%)' : 'Fixed Amount ($)'}
                  </label>
                  <input
                    type="number"
                    value={sidePanelForm.adjustmentValue}
                    onChange={(e) => setSidePanelForm({...sidePanelForm, adjustmentValue: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
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

      <SaveForecastModal
        isOpen={showSaveForecastModal}
        onClose={() => setShowSaveForecastModal(false)}
        onSave={handleSaveForecast}
      />


      {comparisonVersions && (
        <VersionComparisonModal
          isOpen={showVersionComparisonModal}
          onClose={() => {
            setShowVersionComparisonModal(false);
            setComparisonVersions(null);
          }}
          version1Id={comparisonVersions[0]}
          version2Id={comparisonVersions[1]}
        />
      )}

      <ViewSettingsPanel
        isOpen={showViewSettingsPanel}
        onClose={() => setShowViewSettingsPanel(false)}
        hideEmptyAccounts={hideEmptyAccounts}
        onHideEmptyAccountsChange={(value) => {
          setHideEmptyAccounts(value);
          updateViewSetting('hideEmptyAccounts', value);
        }}
        showAccountCodes={showAccountCodes}
        onShowAccountCodesChange={(value) => {
          setShowAccountCodes(value);
          updateViewSetting('showAccountCodes', value);
        }}
        showActualsAsAmount={showActualsAsAmount}
        onShowActualsAsAmountChange={(value) => {
          setShowActualsAsAmount(value);
          updateViewSetting('showActualsAsAmount', value);
        }}
        numberFormat={numberFormat}
        onNumberFormatChange={(value) => {
          setNumberFormat(value);
          updateViewSetting('numberFormat', value);
        }}
        onSave={() => {}}
      />


      {/* Bulk Adjustment Modal */}
      {showBulkAdjustPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Adjust Selected Cells</h2>
              <button
                onClick={() => setShowBulkAdjustPanel(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Apply adjustment to {selectedCells.length} selected cell{selectedCells.length > 1 ? 's' : ''}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Type
                </label>
                <select
                  value={bulkAdjustment.type}
                  onChange={(e) => setBulkAdjustment({ ...bulkAdjustment, type: e.target.value as 'percentage' | 'fixed' | 'set' })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                >
                  <option value="percentage">Percentage Change</option>
                  <option value="fixed">Fixed Amount Change</option>
                  <option value="set">Set to Specific Value</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bulkAdjustment.type === 'percentage' && 'Percentage (%)'}
                  {bulkAdjustment.type === 'fixed' && 'Amount ($)'}
                  {bulkAdjustment.type === 'set' && 'New Value ($)'}
                </label>
                <input
                  type="number"
                  value={bulkAdjustment.value}
                  onChange={(e) => setBulkAdjustment({ ...bulkAdjustment, value: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
                  placeholder="Enter value"
                  step={bulkAdjustment.type === 'percentage' ? '0.1' : '1'}
                />
              </div>

              <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-lg p-3">
                <p className="text-sm text-[#312E81]">
                  <strong>Preview:</strong>
                  {bulkAdjustment.type === 'percentage' && (
                    <span> All selected values will be {bulkAdjustment.value >= 0 ? 'increased' : 'decreased'} by {Math.abs(bulkAdjustment.value)}%</span>
                  )}
                  {bulkAdjustment.type === 'fixed' && (
                    <span> {bulkAdjustment.value >= 0 ? '+' : ''}{bulkAdjustment.value.toLocaleString()} will be applied to all selected values</span>
                  )}
                  {bulkAdjustment.type === 'set' && (
                    <span> All selected values will be set to ${bulkAdjustment.value.toLocaleString()}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 flex gap-3">
              <button
                onClick={() => setShowBulkAdjustPanel(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={applyBulkAdjustment}
                className="flex-1 px-4 py-2 bg-[#7B68EE] text-white rounded-lg hover:bg-[#6A5ADB] transition-colors font-medium"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Sidebar */}
      {showAlertsSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#101010]">Forecast Alerts</h3>
                  <p className="text-sm text-gray-600 mt-1">Monitor budget variances and anomalies</p>
                </div>
                <button
                  onClick={() => setShowAlertsSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Alert Filter Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-0.5 gap-1">
                <button
                  onClick={() => setAlertFilter('all')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    alertFilter === 'all'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All Alerts
                </button>
                <button
                  onClick={() => setAlertFilter('critical')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    alertFilter === 'critical'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Critical
                </button>
                <button
                  onClick={() => setAlertFilter('warning')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    alertFilter === 'warning'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Warnings
                </button>
                <button
                  onClick={() => setAlertFilter('info')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    alertFilter === 'info'
                      ? 'bg-white text-[#7B68EE] shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Info
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* Critical Alert */}
                {(alertFilter === 'all' || alertFilter === 'critical') && (
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#101010] text-sm">High Variance Detected</h4>
                    <span className="text-xs text-red-600 font-medium">Critical</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Payroll & Benefits (GL 6000) shows a 35% variance above forecast for Q3
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Affected Period: Jul - Sep 2025</span>
                    <span className="text-gray-400">2 hours ago</span>
                  </div>
                </div>
                )}

                {/* Warning Alert */}
                {(alertFilter === 'all' || alertFilter === 'warning') && (
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#101010] text-sm">Budget Threshold Approaching</h4>
                    <span className="text-xs text-amber-600 font-medium">Warning</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Marketing expenses at 85% of annual budget with 3 months remaining
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">GL 6200 - Marketing</span>
                    <span className="text-gray-400">5 hours ago</span>
                  </div>
                </div>
                )}

                {/* Info Alert */}
                {(alertFilter === 'all' || alertFilter === 'info') && (
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#101010] text-sm">Scenario Applied</h4>
                    <span className="text-xs text-blue-600 font-medium">Info</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    "Q4 Expansion Plan" scenario has been applied to Revenue accounts
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Applied by John Doe</span>
                    <span className="text-gray-400">1 day ago</span>
                  </div>
                </div>
                )}

                {/* Success Alert */}
                {alertFilter === 'all' && (
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#101010] text-sm">Under Budget</h4>
                    <span className="text-xs text-green-600 font-medium">Success</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Travel & Entertainment expenses are 15% below forecast YTD
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">GL 6400 - Travel</span>
                    <span className="text-gray-400">2 days ago</span>
                  </div>
                </div>
                )}

                {/* Info Alert */}
                {(alertFilter === 'all' || alertFilter === 'info') && (
                <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-[#101010] text-sm">Forecast Saved</h4>
                    <span className="text-xs text-blue-600 font-medium">Info</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    Version "2025 Annual Budget v3" has been saved successfully
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Saved by Current User</span>
                    <span className="text-gray-400">3 days ago</span>
                  </div>
                </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>5</strong> active alerts
                </p>
                <button
                  onClick={() => setShowAlertsSidebar(false)}
                  className="w-full px-4 py-2 bg-[#101010] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applied Drivers Audit Sidebar */}
      {showScenarioAuditSidebar && (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
          <div className="w-[500px] bg-white/95 backdrop-blur-md h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#101010]">Applied Drivers</h3>
                  <p className="text-sm text-gray-600 mt-1">Audit history of all scenario changes</p>
                </div>
                <button
                  onClick={() => setShowScenarioAuditSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search by P&L Account */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={scenarioSearchTerm}
                  onChange={(e) => setScenarioSearchTerm(e.target.value)}
                  placeholder="Search by P&L account..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB7BF] focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {appliedScenarios.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No scenarios applied yet</p>
                  <p className="text-sm text-gray-400 mt-2">Applied scenarios will appear here</p>
                </div>
              ) : (() => {
                const filteredScenarios = appliedScenarios.filter((scenario) => {
                  if (!scenarioSearchTerm) return true;
                  const glAccount = glCodes.find(gl => gl.code === scenario.glCode);
                  const accountName = glAccount?.name || scenario.glCode;
                  return accountName.toLowerCase().includes(scenarioSearchTerm.toLowerCase()) ||
                         scenario.glCode.toLowerCase().includes(scenarioSearchTerm.toLowerCase());
                });

                if (filteredScenarios.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No scenarios found</p>
                      <p className="text-sm text-gray-400 mt-2">Try adjusting your search term</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filteredScenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg p-4 hover:shadow-md transition-all duration-300 shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[#101010] text-sm">{scenario.name}</h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded transition-all ${
                              scenario.isActive
                                ? 'bg-[#4ADE80]/10 text-[#4ADE80]'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {scenario.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Account: {glCodes.find(gl => gl.code === scenario.glCode)?.name || scenario.glCode}
                          </p>
                        </div>
                        <button
                          onClick={() => setScenarioMenuOpen(scenarioMenuOpen === scenario.id ? null : scenario.id)}
                          className="px-3 py-1.5 bg-[#eff1f4] hover:bg-[#e5e7ea] text-gray-700 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </div>

                      {scenarioMenuOpen === scenario.id && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const isSalesDriver = scenario.isSalesDriverScenario ||
                                  scenario.description?.includes('driver') ||
                                  (scenario.salesScenarioData !== undefined);

                                if (isSalesDriver && scenario.salesScenarioData) {
                                  console.log('✅ (Audit Sidebar) Opening Sales Scenario Modal');
                                  setEditingSalesScenario(scenario.salesScenarioData);
                                  setSelectedGLCode(glCodes.find(gl => gl.code === scenario.glCode) || null);
                                  setShowSalesScenarioModal(true);
                                  setScenarioMenuOpen(null);
                                  setShowScenarioAuditSidebar(false);
                                  return;
                                } else if (isSalesDriver && !scenario.salesScenarioData) {
                                  console.error('❌ (Audit Sidebar) Sales driver data missing');
                                  alert('This sales driver scenario is missing its configuration data.\n\nPlease delete and recreate this scenario.');
                                  return;
                                }

                                setEditingScenario(scenario);
                                setGLScenarioForm({
                                  ...glScenarioForm,
                                  title: scenario.name,
                                  description: scenario.description,
                                  adjustmentType: scenario.adjustmentType,
                                  adjustmentValue: scenario.adjustmentValue,
                                  startMonth: scenario.startMonth.split(' ')[0],
                                  endMonth: scenario.endMonth.split(' ')[0]
                                });
                                setSelectedGLCode(glCodes.find(gl => gl.code === scenario.glCode) || null);
                                setShowEditScenarioModal(true);
                                setScenarioMenuOpen(null);
                                setShowScenarioAuditSidebar(false);
                              }}
                              className="flex-1 px-3 py-2 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                            >
                              Adjust
                            </button>
                            <button
                              onClick={() => toggleScenario(scenario.id)}
                              className="flex-1 px-3 py-2 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors"
                            >
                              {scenario.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(scenario.id)}
                              className="flex-1 px-3 py-2 text-sm font-medium bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Adjustment:</span>
                          <span className="font-medium text-[#101010]">
                            {scenario.adjustmentType === 'percentage'
                              ? `${scenario.adjustmentValue > 0 ? '+' : ''}${scenario.adjustmentValue}%`
                              : `$${scenario.adjustmentValue.toLocaleString()}`
                            }
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Period:</span>
                          <span className="font-medium text-[#101010]">
                            {scenario.startMonth} - {scenario.endMonth}
                          </span>
                        </div>

                        {scenario.bonusImpact && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Bonus Impact:</span>
                            <span className="font-medium text-[#F59E0B]">
                              ${scenario.bonusImpact.toLocaleString()}
                            </span>
                          </div>
                        )}

                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Applied by {scenario.createdBy}</span>
                            <span className="text-gray-400">
                              {new Date(scenario.appliedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{appliedScenarios.length}</strong> {appliedScenarios.length === 1 ? 'scenario' : 'scenarios'} applied
                </p>
                <button
                  onClick={() => setShowScenarioAuditSidebar(false)}
                  className="w-full px-4 py-2 bg-[#101010] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Sidebar */}
      {showVersionHistorySidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#101010]">Version History</h3>
                  <p className="text-sm text-gray-600 mt-1">View and manage forecast versions for {selectedYear}</p>
                </div>
                <button
                  onClick={() => setShowVersionHistorySidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {versionHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No versions saved yet</p>
                  <p className="text-sm text-gray-400 mt-2">Saved forecasts will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {versionHistory.map((version) => (
                    <div
                      key={version.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-[#101010] text-sm">{version.name}</h4>
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                              v{version.version_number}
                            </span>
                            {version.is_active && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded bg-[#4ADE80]/10 text-[#4ADE80]">
                                Active
                              </span>
                            )}
                          </div>
                          {version.description && (
                            <p className="text-xs text-gray-500 mt-1">{version.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => setSelectedVersionForAction(selectedVersionForAction === version.id ? null : version.id)}
                          className="px-3 py-1.5 bg-[#eff1f4] hover:bg-[#e5e7ea] text-gray-700 text-xs font-medium rounded transition-colors"
                        >
                          Actions
                        </button>
                      </div>

                      {selectedVersionForAction === version.id && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex flex-col gap-2">
                            {!version.is_active && (
                              <button
                                onClick={() => handleLoadVersion(version.id)}
                                className="px-3 py-2 text-sm font-medium bg-[#7B68EE] text-white hover:bg-[#6A5ACD] rounded transition-colors"
                              >
                                Load Version
                              </button>
                            )}
                            <button
                              onClick={() => {
                                const otherVersion = versionHistory.find(v => v.id !== version.id);
                                if (otherVersion) {
                                  handleCompareVersions(version.id, otherVersion.id);
                                }
                              }}
                              disabled={versionHistory.length < 2}
                              className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Compare Versions
                            </button>
                            {!version.is_active && (
                              <button
                                onClick={() => setShowDeleteConfirm(version.id)}
                                className="px-3 py-2 text-sm font-medium bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                Delete Version
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Total Forecasted:</span>
                          <span className="font-medium text-[#101010]">
                            ${version.total_forecasted_amount?.toLocaleString() || '0'}
                          </span>
                        </div>

                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Created {version.created_by ? `by ${version.created_by}` : ''}</span>
                            <span className="text-gray-400">
                              {new Date(version.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{versionHistory.length}</strong> {versionHistory.length === 1 ? 'version' : 'versions'} saved
                </p>
                <button
                  onClick={() => setShowVersionHistorySidebar(false)}
                  className="w-full px-4 py-2 bg-[#101010] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101010]">
                    {versionHistory.some(v => v.id === showDeleteConfirm) ? 'Delete Version' : 'Remove Scenario'}
                  </h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-900">
                  {versionHistory.some(v => v.id === showDeleteConfirm)
                    ? 'Deleting this version will permanently remove it from your history. Are you sure you want to continue?'
                    : 'Removing this scenario will permanently delete it and remove any adjustments it made to your forecast. Are you sure you want to continue?'
                  }
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(null);
                    setScenarioMenuOpen(null);
                    setSelectedVersionForAction(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (versionHistory.some(v => v.id === showDeleteConfirm)) {
                      handleDeleteVersion(showDeleteConfirm);
                    } else {
                      removeScenario(showDeleteConfirm);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  {versionHistory.some(v => v.id === showDeleteConfirm) ? 'Delete Version' : 'Remove Scenario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Scenario Modal */}
      <SalesScenarioModal
        isOpen={showSalesScenarioModal}
        onClose={() => {
          setShowSalesScenarioModal(false);
          setSelectedGLCode(null);
          setEditingSalesScenario(null);
        }}
        initialScenario={editingSalesScenario || undefined}
        forecastData={forecastData}
        selectedYear={selectedYear}
        glCode={selectedGLCode?.code || ''}
        onSave={(scenario) => {
          const isEditing = !!editingSalesScenario;

          if (isEditing) {
            setSalesScenarios(prev => prev.map(s => s.id === scenario.id ? scenario : s));
          } else {
            setSalesScenarios([...salesScenarios, scenario]);
          }

          if (selectedGLCode) {
            const impacts = SalesDriverService.calculateScenarioImpacts(scenario);
            const totalAnnualImpact = impacts.reduce((sum, month) => sum + month.totalImpact, 0);
            const totalAnnualBase = scenario.baseRevenue * 12;
            const avgImpactPercent = totalAnnualBase > 0 ? (totalAnnualImpact / totalAnnualBase) * 100 : 0;

            const driverCount = scenario.drivers?.filter(d => d.isActive).length || 0;
            const driverNames = scenario.drivers
              ?.filter(d => d.isActive)
              .map(d => d.driverName)
              .join(', ') || 'No drivers';

            const updatedAppliedScenario: AppliedScenario = {
              id: scenario.id || Date.now().toString(),
              glCode: selectedGLCode.code,
              name: scenario.name,
              description: scenario.description || `${driverCount} driver${driverCount !== 1 ? 's' : ''}: ${driverNames}`,
              startMonth: scenario.startMonth,
              endMonth: scenario.endMonth,
              adjustmentType: 'percentage',
              adjustmentValue: Math.round(avgImpactPercent * 10) / 10,
              appliedAt: new Date(),
              createdBy: 'Current User',
              isActive: true,
              isSalesDriverScenario: true,
              salesScenarioData: scenario
            };

            console.log('💾 Saving Applied Scenario:', {
              name: updatedAppliedScenario.name,
              isSalesDriverScenario: updatedAppliedScenario.isSalesDriverScenario,
              hasSalesScenarioData: !!updatedAppliedScenario.salesScenarioData,
              driverCount: scenario.drivers?.length,
              drivers: scenario.drivers,
              fullScenario: updatedAppliedScenario
            });

            if (isEditing) {
              setAppliedScenarios(prev => prev.map(s =>
                s.id === scenario.id ? updatedAppliedScenario : s
              ));
            } else {
              setAppliedScenarios(prev => [...prev, updatedAppliedScenario]);
            }

            const startMonthIndex = months.indexOf(scenario.startMonth);
            const endMonthIndex = months.indexOf(scenario.endMonth);

            setForecastData(prev => prev.map(item => {
              if (item.glCode === selectedGLCode.code) {
                const itemMonth = item.month.split(' ')[0];
                const monthImpact = impacts.find(i => i.month === itemMonth);

                if (monthImpact) {
                  const itemMonthIndex = months.indexOf(itemMonth);
                  if (itemMonthIndex >= startMonthIndex && itemMonthIndex <= endMonthIndex) {
                    const impactPercent = item.forecastedAmount > 0
                      ? (monthImpact.totalImpact / item.forecastedAmount) * 100
                      : 0;
                    const adjustedAmount = item.forecastedAmount * (1 + impactPercent / 100);
                    return { ...item, forecastedAmount: Math.round(adjustedAmount) };
                  }
                }
              }
              return item;
            }));
          }

          setShowSalesScenarioModal(false);
          setSelectedGLCode(null);
          setEditingSalesScenario(null);
        }}
      />

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
        >
          <button
            onClick={() => handleDrillDown(contextMenu.rowData)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-[#3AB7BF]" />
            Drill Down
          </button>
          <button
            onClick={() => handleAddNote(contextMenu.rowData)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-[#F59E0B]" />
            Add Note
          </button>
          <button
            onClick={() => handleViewDetails(contextMenu.rowData)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#3AB7BF]" />
            View Details
          </button>
          <button
            onClick={() => handleEditRow(contextMenu.rowData)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-[#3AB7BF]" />
            Edit
          </button>
          <button
            onClick={() => handleDuplicateRow(contextMenu.rowData)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Copy className="w-4 h-4 text-[#3AB7BF]" />
            Duplicate
          </button>
          <div className="border-t border-gray-200 my-2"></div>
          <button
            onClick={() => handleDeleteRow(contextMenu.rowData)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}

    </div>
  );
};

export default Forecasting;