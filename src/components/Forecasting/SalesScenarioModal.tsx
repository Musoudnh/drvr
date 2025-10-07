import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  TrendingUp,
  Users,
  RefreshCw,
  Filter,
  Calendar,
  FileText,
  Percent,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  DollarSign,
  BarChart3,
  Zap,
  Info,
  Bot,
  Send,
  Upload,
  Paperclip
} from 'lucide-react';
import Button from '../UI/Button';
import DriverImpactWaterfall from './DriverImpactWaterfall';
import {
  DRIVER_TEMPLATES,
  DriverType,
  SalesDriver,
  SalesScenario,
  VolumePriceParameters,
  CACParameters,
  RetentionParameters,
  FunnelParameters,
  SeasonalityParameters,
  ContractTermsParameters,
  RepProductivityParameters,
  DiscountingParameters,
  PayrollHeadcountParameters,
  PayrollSalaryParameters,
  PayrollMeritParameters,
  MarketingChannelsParameters,
  MarketingCACParameters,
  MarketingROIParameters,
  EquipmentPurchaseParameters,
  EquipmentFinancingParameters,
  EquipmentMaintenanceParameters
} from '../../types/salesDriver';
import { SalesDriverService } from '../../services/salesDriverService';

interface SalesScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scenario: SalesScenario) => void;
  initialScenario?: SalesScenario;
  forecastData?: any[];
  selectedYear?: number;
  glCode?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalesScenarioModal: React.FC<SalesScenarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialScenario,
  forecastData = [],
  selectedYear = 2025,
  glCode = ''
}) => {
  const [scenarioName, setScenarioName] = useState(initialScenario?.name || '');
  const [scenarioDescription, setScenarioDescription] = useState(initialScenario?.description || '');
  const [baseRevenue, setBaseRevenue] = useState(initialScenario?.baseRevenue || 100000);
  const [startMonth, setStartMonth] = useState(initialScenario?.startMonth || 'Jan');
  const [endMonth, setEndMonth] = useState(initialScenario?.endMonth || 'Dec');
  const [startYear, setStartYear] = useState(initialScenario?.startYear || 2025);

  const [activeDrivers, setActiveDrivers] = useState<SalesDriver[]>(initialScenario?.drivers || []);
  const [showDriverLibrary, setShowDriverLibrary] = useState(false);
  const [driverCategory, setDriverCategory] = useState<'sales' | 'payroll' | 'marketing' | 'equipment'>('sales');
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [editingDriver, setEditingDriver] = useState<SalesDriver | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'preview' | 'ai'>('overview');
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string, file?: {name: string, size: number, type: string}}>>([]);
  const [aiInput, setAiInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [startMonthDropdownOpen, setStartMonthDropdownOpen] = useState(false);
  const [endMonthDropdownOpen, setEndMonthDropdownOpen] = useState(false);
  const [startYearDropdownOpen, setStartYearDropdownOpen] = useState(false);
  const startMonthDropdownRef = React.useRef<HTMLDivElement>(null);
  const endMonthDropdownRef = React.useRef<HTMLDivElement>(null);
  const startYearDropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMonthDropdownRef.current && !startMonthDropdownRef.current.contains(event.target as Node)) {
        setStartMonthDropdownOpen(false);
      }
      if (endMonthDropdownRef.current && !endMonthDropdownRef.current.contains(event.target as Node)) {
        setEndMonthDropdownOpen(false);
      }
      if (startYearDropdownRef.current && !startYearDropdownRef.current.contains(event.target as Node)) {
        setStartYearDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      TrendingUp,
      Users,
      RefreshCw,
      Filter,
      Calendar,
      FileText,
      Percent
    };
    return icons[iconName] || TrendingUp;
  };

  const addDriver = (driverType: DriverType) => {
    const template = DRIVER_TEMPLATES.find(t => t.driverType === driverType);
    if (!template) return;

    const newDriver: SalesDriver = {
      id: `driver_${Date.now()}`,
      scenarioId: initialScenario?.id || '',
      driverType,
      driverName: template.name,
      isActive: true,
      startMonth: 'Jan',
      endMonth: 'Dec',
      parameters: template.defaultParameters as any,
      sortOrder: activeDrivers.length,
      createdAt: new Date()
    };

    setActiveDrivers([...activeDrivers, newDriver]);
    setShowDriverLibrary(false);
    setEditingDriver(newDriver);
  };

  const removeDriver = (driverId: string) => {
    setActiveDrivers(activeDrivers.filter(d => d.id !== driverId));
  };

  const updateDriver = (driverId: string, updates: Partial<SalesDriver>) => {
    setActiveDrivers(activeDrivers.map(d =>
      d.id === driverId ? { ...d, ...updates } : d
    ));
  };

  const calculateMonthlyImpact = (driver: SalesDriver, monthIndex: number): number => {
    const startIdx = MONTHS.indexOf(driver.startMonth);
    const endIdx = MONTHS.indexOf(driver.endMonth);

    if (monthIndex < startIdx || monthIndex > endIdx) {
      return 0;
    }

    switch (driver.driverType) {
      case 'volume_price':
        const vpParams = driver.parameters as VolumePriceParameters;
        return (vpParams.baseUnits * vpParams.basePrice * vpParams.volumeGrowthPercent / 100) +
               (vpParams.baseUnits * vpParams.basePrice * vpParams.priceGrowthPercent / 100);

      case 'cac':
        const cacParams = driver.parameters as CACParameters;
        return cacParams.customersAcquired * cacParams.averageRevenuePerCustomer;

      case 'retention':
        const retParams = driver.parameters as RetentionParameters;
        const churnReduction = (retParams.currentChurnRatePercent - retParams.targetChurnRatePercent) / 100;
        return retParams.currentMRR * churnReduction;

      case 'payroll_headcount':
        const payrollHCParams = driver.parameters as PayrollHeadcountParameters;
        return payrollHCParams.currentHeadcount * 10000;

      case 'payroll_salary':
        const payrollSalParams = driver.parameters as PayrollSalaryParameters;
        const monthlyBase = payrollSalParams.avgSalary / 12;
        const benefits = monthlyBase * (payrollSalParams.benefitsPct / 100);
        const taxes = monthlyBase * (payrollSalParams.taxesPct / 100);
        const bonus = monthlyBase * (payrollSalParams.bonusPct / 100);
        return monthlyBase + benefits + taxes + bonus;

      case 'payroll_merit':
        const payrollMeritParams = driver.parameters as PayrollMeritParameters;
        return 50000 * (payrollMeritParams.annualIncreasePct / 100);

      case 'marketing_channels':
        const mktChannelParams = driver.parameters as MarketingChannelsParameters;
        const leads = mktChannelParams.monthlyBudget / mktChannelParams.costPerLead;
        const customers = leads * (mktChannelParams.leadToCustomerRate / 100);
        return customers * mktChannelParams.avgARRPerCustomer / 12;

      case 'marketing_cac':
        const mktCACParams = driver.parameters as MarketingCACParameters;
        return mktCACParams.customersAcquired * 1000;

      case 'marketing_roi':
        const mktROIParams = driver.parameters as MarketingROIParameters;
        return mktROIParams.attributedRevenue - mktROIParams.campaignSpend;

      case 'equipment_purchase':
        const eqPurchaseParams = driver.parameters as EquipmentPurchaseParameters;
        const depreciationMonths = eqPurchaseParams.usefulLifeYears * 12;
        return (eqPurchaseParams.purchaseCost - eqPurchaseParams.salvageValue) / depreciationMonths;

      case 'equipment_financing':
        const eqFinanceParams = driver.parameters as EquipmentFinancingParameters;
        const principal = eqFinanceParams.purchaseCost * (1 - eqFinanceParams.downPaymentPct / 100);
        const monthlyRate = (eqFinanceParams.interestRatePct / 100) / 12;
        const payment = (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -eqFinanceParams.paymentTermMonths));
        return payment;

      case 'equipment_maintenance':
        const eqMaintParams = driver.parameters as EquipmentMaintenanceParameters;
        return (eqMaintParams.purchaseCost * eqMaintParams.maintenancePct / 100) / 12;

      default:
        return 5000 + (monthIndex * 500);
    }
  };

  const calculatePreview = () => {
    if (!initialScenario && activeDrivers.length === 0) return [];

    const scenario: SalesScenario = {
      id: initialScenario?.id || 'preview',
      name: scenarioName,
      description: scenarioDescription,
      scenarioType: 'revenue',
      baseRevenue,
      startMonth,
      endMonth,
      startYear,
      endYear: startYear,
      createdBy: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      drivers: activeDrivers
    };

    return SalesDriverService.calculateScenarioImpacts(scenario);
  };

  const previewData = calculatePreview();
  const totalImpact = previewData.reduce((sum, month) => sum + month.totalImpact, 0);
  const finalRevenue = previewData.reduce((sum, month) => sum + month.finalRevenue, 0);

  const handleSave = () => {
    const scenario: SalesScenario = {
      id: initialScenario?.id || '',
      name: scenarioName,
      description: scenarioDescription,
      scenarioType: 'revenue',
      baseRevenue,
      startMonth,
      endMonth,
      startYear,
      endYear: startYear,
      createdBy: '',
      createdAt: initialScenario?.createdAt || new Date(),
      updatedAt: new Date(),
      isActive: true,
      drivers: activeDrivers
    };

    onSave(scenario);
  };

  const renderDriverParameters = (driver: SalesDriver) => {
    const params = driver.parameters;

    switch (driver.driverType) {
      case 'volume_price':
        const vpParams = params as VolumePriceParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Volume Growth %</label>
              <input
                type="number"
                value={vpParams.volumeGrowthPercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...vpParams, volumeGrowthPercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Price Growth %</label>
              <input
                type="number"
                value={vpParams.priceGrowthPercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...vpParams, priceGrowthPercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Base Units</label>
              <input
                type="number"
                value={vpParams.baseUnits}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...vpParams, baseUnits: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Base Price</label>
              <input
                type="number"
                value={vpParams.basePrice}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...vpParams, basePrice: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'cac':
        const cacParams = params as CACParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Marketing Spend (Monthly)</label>
              <input
                type="number"
                value={cacParams.marketingSpendMonthly}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...cacParams, marketingSpendMonthly: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Customers Acquired</label>
              <input
                type="number"
                value={cacParams.customersAcquired}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...cacParams, customersAcquired: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Avg Revenue Per Customer</label>
              <input
                type="number"
                value={cacParams.averageRevenuePerCustomer}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...cacParams, averageRevenuePerCustomer: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">CAC Payback (Months)</label>
              <input
                type="number"
                value={cacParams.cacPaybackMonths}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...cacParams, cacPaybackMonths: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'retention':
        const retParams = params as RetentionParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Current Churn Rate %</label>
              <input
                type="number"
                value={retParams.currentChurnRatePercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...retParams, currentChurnRatePercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Target Churn Rate %</label>
              <input
                type="number"
                value={retParams.targetChurnRatePercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...retParams, targetChurnRatePercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Current MRR</label>
              <input
                type="number"
                value={retParams.currentMRR}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...retParams, currentMRR: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Avg Customer Count</label>
              <input
                type="number"
                value={retParams.averageCustomerCount}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...retParams, averageCustomerCount: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'funnel':
        const funnelParams = params as FunnelParameters;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Leads Per Month</label>
                <input
                  type="number"
                  value={funnelParams.leadsPerMonth}
                  onChange={(e) => updateDriver(driver.id, {
                    parameters: { ...funnelParams, leadsPerMonth: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Avg Deal Size</label>
                <input
                  type="number"
                  value={funnelParams.averageDealSize}
                  onChange={(e) => updateDriver(driver.id, {
                    parameters: { ...funnelParams, averageDealSize: parseFloat(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Conversion Stages</label>
              {funnelParams.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => {
                      const newStages = [...funnelParams.stages];
                      newStages[idx].name = e.target.value;
                      updateDriver(driver.id, { parameters: { ...funnelParams, stages: newStages } });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Stage name"
                  />
                  <input
                    type="number"
                    value={stage.conversionRate}
                    onChange={(e) => {
                      const newStages = [...funnelParams.stages];
                      newStages[idx].conversionRate = parseFloat(e.target.value);
                      updateDriver(driver.id, { parameters: { ...funnelParams, stages: newStages } });
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="%"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'seasonality':
        const seasonParams = params as SeasonalityParameters;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Baseline Revenue</label>
              <input
                type="number"
                value={seasonParams.baselineRevenue}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...seasonParams, baselineRevenue: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Monthly Multipliers</label>
              <div className="grid grid-cols-4 gap-2">
                {MONTHS.map(month => (
                  <div key={month}>
                    <label className="text-xs text-gray-600">{month}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={seasonParams.monthlyMultipliers[month] || 1.0}
                      onChange={(e) => {
                        const newMultipliers = { ...seasonParams.monthlyMultipliers, [month]: parseFloat(e.target.value) };
                        updateDriver(driver.id, { parameters: { ...seasonParams, monthlyMultipliers: newMultipliers } });
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'contract_terms':
        const contractParams = params as ContractTermsParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Avg Contract Length (Months)</label>
              <input
                type="number"
                value={contractParams.averageContractLengthMonths}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...contractParams, averageContractLengthMonths: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Renewal Rate %</label>
              <input
                type="number"
                value={contractParams.renewalRatePercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...contractParams, renewalRatePercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Expansion Revenue %</label>
              <input
                type="number"
                value={contractParams.expansionRevenuePercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...contractParams, expansionRevenuePercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">New ARR</label>
              <input
                type="number"
                value={contractParams.newARR}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...contractParams, newARR: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'rep_productivity':
        const repParams = params as RepProductivityParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Number of Reps</label>
              <input
                type="number"
                value={repParams.numberOfReps}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...repParams, numberOfReps: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Quota Per Rep (Monthly)</label>
              <input
                type="number"
                value={repParams.quotaPerRepMonthly}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...repParams, quotaPerRepMonthly: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Attainment %</label>
              <input
                type="number"
                value={repParams.attainmentPercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...repParams, attainmentPercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">New Hires</label>
              <input
                type="number"
                value={repParams.newHires}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...repParams, newHires: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'discounting':
        const discountParams = params as DiscountingParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Discount %</label>
              <input
                type="number"
                value={discountParams.discountPercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...discountParams, discountPercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Volume Lift %</label>
              <input
                type="number"
                value={discountParams.volumeLiftPercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...discountParams, volumeLiftPercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Affected Revenue %</label>
              <input
                type="number"
                value={discountParams.affectedRevenuePercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...discountParams, affectedRevenuePercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Margin Impact %</label>
              <input
                type="number"
                value={discountParams.marginImpactPercent}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...discountParams, marginImpactPercent: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'payroll_headcount':
        const payrollHCParams = params as PayrollHeadcountParameters;
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Department Name</label>
              <input
                type="text"
                value={payrollHCParams.departmentName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollHCParams, departmentName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Current Headcount</label>
              <input
                type="number"
                value={payrollHCParams.currentHeadcount}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollHCParams, currentHeadcount: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Planned Hires</label>
              <p className="text-xs text-gray-500 mb-2">Add hire plans by month (e.g., "2025-11" for November 2025)</p>
              {payrollHCParams.plannedHires.map((hire, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={hire.month}
                    onChange={(e) => {
                      const newHires = [...payrollHCParams.plannedHires];
                      newHires[idx].month = e.target.value;
                      updateDriver(driver.id, { parameters: { ...payrollHCParams, plannedHires: newHires } });
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2025-11"
                  />
                  <input
                    type="number"
                    value={hire.count}
                    onChange={(e) => {
                      const newHires = [...payrollHCParams.plannedHires];
                      newHires[idx].count = parseInt(e.target.value);
                      updateDriver(driver.id, { parameters: { ...payrollHCParams, plannedHires: newHires } });
                    }}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Count"
                  />
                  <button
                    onClick={() => {
                      const newHires = payrollHCParams.plannedHires.filter((_, i) => i !== idx);
                      updateDriver(driver.id, { parameters: { ...payrollHCParams, plannedHires: newHires } });
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newHires = [...payrollHCParams.plannedHires, { month: '', count: 1 }];
                  updateDriver(driver.id, { parameters: { ...payrollHCParams, plannedHires: newHires } });
                }}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Hire Plan
              </button>
            </div>
          </div>
        );

      case 'payroll_salary':
        const payrollSalParams = params as PayrollSalaryParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Department Name</label>
              <input
                type="text"
                value={payrollSalParams.departmentName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollSalParams, departmentName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Average Salary</label>
              <input
                type="number"
                value={payrollSalParams.avgSalary}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollSalParams, avgSalary: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Benefits %</label>
              <input
                type="number"
                value={payrollSalParams.benefitsPct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollSalParams, benefitsPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Taxes %</label>
              <input
                type="number"
                value={payrollSalParams.taxesPct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollSalParams, taxesPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Bonus %</label>
              <input
                type="number"
                value={payrollSalParams.bonusPct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollSalParams, bonusPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Commission % (Optional)</label>
              <input
                type="number"
                value={payrollSalParams.commissionPct || 0}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollSalParams, commissionPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'payroll_merit':
        const payrollMeritParams = params as PayrollMeritParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Department Name</label>
              <input
                type="text"
                value={payrollMeritParams.departmentName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollMeritParams, departmentName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Annual Increase %</label>
              <input
                type="number"
                value={payrollMeritParams.annualIncreasePct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollMeritParams, annualIncreasePct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Effective Month</label>
              <select
                value={payrollMeritParams.effectiveMonth}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...payrollMeritParams, effectiveMonth: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'marketing_channels':
        const mktChannelParams = params as MarketingChannelsParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Channel Name</label>
              <input
                type="text"
                value={mktChannelParams.channelName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktChannelParams, channelName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Monthly Budget</label>
              <input
                type="number"
                value={mktChannelParams.monthlyBudget}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktChannelParams, monthlyBudget: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Cost Per Lead</label>
              <input
                type="number"
                value={mktChannelParams.costPerLead}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktChannelParams, costPerLead: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Lead to Customer Rate %</label>
              <input
                type="number"
                value={mktChannelParams.leadToCustomerRate}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktChannelParams, leadToCustomerRate: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Avg ARR Per Customer</label>
              <input
                type="number"
                value={mktChannelParams.avgARRPerCustomer}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktChannelParams, avgARRPerCustomer: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Gross Margin %</label>
              <input
                type="number"
                value={mktChannelParams.grossMarginPct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktChannelParams, grossMarginPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'marketing_cac':
        const mktCACParams = params as MarketingCACParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Total Spend</label>
              <input
                type="number"
                value={mktCACParams.totalSpend}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktCACParams, totalSpend: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Leads Generated</label>
              <input
                type="number"
                value={mktCACParams.leadsGenerated}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktCACParams, leadsGenerated: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Customers Acquired</label>
              <input
                type="number"
                value={mktCACParams.customersAcquired}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktCACParams, customersAcquired: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Conversion Rate %</label>
              <input
                type="number"
                value={mktCACParams.conversionRate}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktCACParams, conversionRate: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'marketing_roi':
        const mktROIParams = params as MarketingROIParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Campaign Spend</label>
              <input
                type="number"
                value={mktROIParams.campaignSpend}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktROIParams, campaignSpend: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Attributed Revenue</label>
              <input
                type="number"
                value={mktROIParams.attributedRevenue}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktROIParams, attributedRevenue: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Gross Margin %</label>
              <input
                type="number"
                value={mktROIParams.grossMarginPct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...mktROIParams, grossMarginPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'equipment_purchase':
        const eqPurchaseParams = params as EquipmentPurchaseParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Asset Name</label>
              <input
                type="text"
                value={eqPurchaseParams.assetName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqPurchaseParams, assetName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Purchase Cost</label>
              <input
                type="number"
                value={eqPurchaseParams.purchaseCost}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqPurchaseParams, purchaseCost: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Purchase Month</label>
              <select
                value={eqPurchaseParams.purchaseMonth}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqPurchaseParams, purchaseMonth: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Useful Life (Years)</label>
              <input
                type="number"
                value={eqPurchaseParams.usefulLifeYears}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqPurchaseParams, usefulLifeYears: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Salvage Value</label>
              <input
                type="number"
                value={eqPurchaseParams.salvageValue}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqPurchaseParams, salvageValue: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Depreciation Method</label>
              <select
                value={eqPurchaseParams.depreciationMethod}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqPurchaseParams, depreciationMethod: e.target.value as 'straight-line' | 'accelerated' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="straight-line">Straight-Line</option>
                <option value="accelerated">Accelerated</option>
              </select>
            </div>
          </div>
        );

      case 'equipment_financing':
        const eqFinanceParams = params as EquipmentFinancingParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Asset Name</label>
              <input
                type="text"
                value={eqFinanceParams.assetName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqFinanceParams, assetName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Purchase Cost</label>
              <input
                type="number"
                value={eqFinanceParams.purchaseCost}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqFinanceParams, purchaseCost: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Payment Term (Months)</label>
              <input
                type="number"
                value={eqFinanceParams.paymentTermMonths}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqFinanceParams, paymentTermMonths: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Interest Rate %</label>
              <input
                type="number"
                value={eqFinanceParams.interestRatePct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqFinanceParams, interestRatePct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Down Payment %</label>
              <input
                type="number"
                value={eqFinanceParams.downPaymentPct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqFinanceParams, downPaymentPct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'equipment_maintenance':
        const eqMaintParams = params as EquipmentMaintenanceParameters;
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-2">Asset Name</label>
              <input
                type="text"
                value={eqMaintParams.assetName}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqMaintParams, assetName: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Purchase Cost</label>
              <input
                type="number"
                value={eqMaintParams.purchaseCost}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqMaintParams, purchaseCost: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Maintenance %</label>
              <input
                type="number"
                value={eqMaintParams.maintenancePct}
                onChange={(e) => updateDriver(driver.id, {
                  parameters: { ...eqMaintParams, maintenancePct: parseFloat(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-[600px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Scenario Builder</h2>
            <p className="text-xs text-gray-600 mt-1">Build advanced revenue scenarios with multiple drivers</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-xs border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-3 font-medium text-xs border-b-2 transition-colors ${
              activeTab === 'drivers'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            Drivers ({activeDrivers.length})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 font-medium text-xs border-b-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            AI Driver
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 font-medium text-xs border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Scenario Name</label>
                  <input
                    type="text"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Aggressive Q2 Growth"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Base Revenue (Monthly)</label>
                  <input
                    type="number"
                    value={baseRevenue}
                    onChange={(e) => setBaseRevenue(parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your scenario assumptions..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Start Month</label>
                  <div className="relative" ref={startMonthDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setStartMonthDropdownOpen(!startMonthDropdownOpen)}
                      className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{startMonth}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {startMonthDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px] max-h-64 overflow-y-auto">
                        <div className="flex flex-col gap-1">
                          {MONTHS.map(m => {
                            const monthData = forecastData.find((item: any) =>
                              item.glCode === glCode &&
                              item.month === `${m} ${selectedYear}`
                            );
                            const isActualized = monthData?.actualAmount !== undefined;
                            return (
                              <button
                                key={m}
                                type="button"
                                disabled={isActualized}
                                onClick={() => {
                                  setStartMonth(m);
                                  setStartMonthDropdownOpen(false);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                  startMonth === m
                                    ? 'bg-[#7B68EE] text-white'
                                    : isActualized
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">End Month</label>
                  <div className="relative" ref={endMonthDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setEndMonthDropdownOpen(!endMonthDropdownOpen)}
                      className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{endMonth}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {endMonthDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px] max-h-64 overflow-y-auto">
                        <div className="flex flex-col gap-1">
                          {MONTHS.map(m => {
                            const monthData = forecastData.find((item: any) =>
                              item.glCode === glCode &&
                              item.month === `${m} ${selectedYear}`
                            );
                            const isActualized = monthData?.actualAmount !== undefined;
                            return (
                              <button
                                key={m}
                                type="button"
                                disabled={isActualized}
                                onClick={() => {
                                  setEndMonth(m);
                                  setEndMonthDropdownOpen(false);
                                }}
                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                  endMonth === m
                                    ? 'bg-[#7B68EE] text-white'
                                    : isActualized
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Year</label>
                  <div className="relative" ref={startYearDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setStartYearDropdownOpen(!startYearDropdownOpen)}
                      className="w-full px-3 py-2 bg-white text-[#7B68EE] rounded text-xs font-medium shadow-sm transition-colors hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{startYear}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {startYearDropdownOpen && (
                      <div className="absolute top-full mt-2 left-0 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-1 min-w-[120px]">
                        <div className="flex flex-col gap-1">
                          {[2024, 2025, 2026, 2027].map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={() => {
                                setStartYear(year);
                                setStartYearDropdownOpen(false);
                              }}
                              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                                startYear === year
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
          )}

          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Active Drivers</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDriverLibrary(!showDriverLibrary)}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Driver
                  </button>
                </div>
              </div>

              {showDriverLibrary && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Driver Library</h4>
                    <select
                      value={driverCategory}
                      onChange={(e) => setDriverCategory(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="sales">Customer Drivers</option>
                      <option value="payroll">Payroll Drivers</option>
                      <option value="marketing">Marketing Drivers</option>
                      <option value="equipment">Equipment Drivers</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {driverCategory === 'sales' && DRIVER_TEMPLATES.filter(t => !t.driverType.startsWith('payroll_') && !t.driverType.startsWith('marketing_') && !t.driverType.startsWith('equipment_')).map(template => {
                      return (
                        <button
                          key={template.driverType}
                          onClick={() => addDriver(template.driverType)}
                          className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900 text-xs">{template.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          </div>
                        </button>
                      );
                    })}
                    {driverCategory === 'payroll' && DRIVER_TEMPLATES.filter(t => t.driverType.startsWith('payroll_')).map(template => {
                      return (
                        <button
                          key={template.driverType}
                          onClick={() => addDriver(template.driverType)}
                          className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900 text-xs">{template.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          </div>
                        </button>
                      );
                    })}
                    {driverCategory === 'marketing' && DRIVER_TEMPLATES.filter(t => t.driverType.startsWith('marketing_')).map(template => {
                      return (
                        <button
                          key={template.driverType}
                          onClick={() => addDriver(template.driverType)}
                          className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900 text-xs">{template.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          </div>
                        </button>
                      );
                    })}
                    {driverCategory === 'equipment' && DRIVER_TEMPLATES.filter(t => t.driverType.startsWith('equipment_')).map(template => {
                      return (
                        <button
                          key={template.driverType}
                          onClick={() => addDriver(template.driverType)}
                          className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900 text-xs">{template.name}</h5>
                            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {activeDrivers.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No drivers added yet</p>
                    <p className="text-xs text-gray-500 mt-1">Click "Add Driver" to start building your scenario</p>
                  </div>
                ) : (
                  activeDrivers.map(driver => {
                    const template = DRIVER_TEMPLATES.find(t => t.driverType === driver.driverType);
                    const Icon = template ? getIconComponent(template.icon) : TrendingUp;
                    const isExpanded = expandedDriver === driver.id;

                    return (
                      <div key={driver.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center flex-1">
                              <Icon className="w-5 h-5 text-gray-600 mr-3" />
                              <div>
                                <h4 className="font-medium text-gray-900">{driver.driverName}</h4>
                                <p className="text-xs text-gray-500">{template?.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={driver.isActive}
                                  onChange={(e) => updateDriver(driver.id, { isActive: e.target.checked })}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-xs text-gray-700">Active</span>
                              </label>
                              <button
                                onClick={() => setEditingDriver(driver)}
                                className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeDriver(driver.id)}
                                className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex overflow-x-auto">
                              {MONTHS.map((month, idx) => {
                                const startIdx = MONTHS.indexOf(driver.startMonth);
                                const endIdx = MONTHS.indexOf(driver.endMonth);
                                const isActive = idx >= startIdx && idx <= endIdx && driver.isActive;
                                const monthlyImpact = calculateMonthlyImpact(driver, idx);

                                return (
                                  <div
                                    key={month}
                                    className={`px-2 text-center min-w-[120px] transition-colors ${
                                      isActive
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                    }`}
                                    title={`${month}: ${isActive ? `$${Math.round(monthlyImpact).toLocaleString()}` : 'Not applied'}`}
                                  >
                                    <div className="py-1 h-12 flex items-center justify-center">
                                      <div className="text-xs font-bold text-white">
                                        {isActive ? `$${(monthlyImpact / 1000).toFixed(0)}k` : ''}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {aiMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Bot className="w-16 h-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Driver Assistant</h3>
                    <p className="text-gray-600 max-w-md">
                      Discuss your assumptions with AI to help build your customer drivers.
                      The AI can suggest parameters and help you think through your scenarios.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload files like spreadsheets, reports, or financial data for AI analysis.
                    </p>
                  </div>
                ) : (
                  aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-3 ${
                          msg.role === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {msg.file && (
                          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-purple-500/30">
                            <Paperclip className="w-4 h-4" />
                            <div className="text-xs">
                              <div className="font-medium">{msg.file.name}</div>
                              <div className="opacity-80">{(msg.file.size / 1024).toFixed(1)} KB</div>
                            </div>
                          </div>
                        )}
                        <p className="text-xs whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-200 pt-4">
                {uploadedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-xs"
                      >
                        <Paperclip className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-900 font-medium">{file.name}</span>
                        <span className="text-purple-600">({(file.size / 1024).toFixed(1)} KB)</span>
                        <button
                          onClick={() => {
                            setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx));
                          }}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="ai-file-upload"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
                      }
                    }}
                    className="hidden"
                    accept=".csv,.xlsx,.xls,.pdf,.txt,.json"
                    multiple
                  />
                  <button
                    onClick={() => document.getElementById('ai-file-upload')?.click()}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Upload files"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && (aiInput.trim() || uploadedFiles.length > 0)) {
                        const userMessage = aiInput.trim() || 'Uploaded files for review';
                        const fileInfo = uploadedFiles.length > 0 ? {
                          name: uploadedFiles[0].name,
                          size: uploadedFiles[0].size,
                          type: uploadedFiles[0].type
                        } : undefined;

                        setAiMessages([...aiMessages, { role: 'user', content: userMessage, file: fileInfo }]);
                        setAiInput('');
                        setUploadedFiles([]);

                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev,
                            {
                              role: 'assistant',
                              content: fileInfo
                                ? `I've analyzed your file "${fileInfo.name}". Based on the data, I can help you:\n\n• Extract key metrics and trends\n• Suggest appropriate driver parameters\n• Identify growth patterns\n• Recommend scenario assumptions\n\nWhat would you like to focus on?`
                                : `I can help you with that. Based on your input, I suggest:\n\n• Consider your historical growth rates\n• Factor in market conditions\n• Account for seasonal variations\n\nWhat specific driver parameters would you like to explore?`
                            }
                          ]);
                        }, 1000);
                      }
                    }}
                    placeholder="Discuss your assumptions with AI..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      if (aiInput.trim() || uploadedFiles.length > 0) {
                        const userMessage = aiInput.trim() || 'Uploaded files for review';
                        const fileInfo = uploadedFiles.length > 0 ? {
                          name: uploadedFiles[0].name,
                          size: uploadedFiles[0].size,
                          type: uploadedFiles[0].type
                        } : undefined;

                        setAiMessages([...aiMessages, { role: 'user', content: userMessage, file: fileInfo }]);
                        setAiInput('');
                        setUploadedFiles([]);

                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev,
                            {
                              role: 'assistant',
                              content: fileInfo
                                ? `I've analyzed your file "${fileInfo.name}". Based on the data, I can help you:\n\n• Extract key metrics and trends\n• Suggest appropriate driver parameters\n• Identify growth patterns\n• Recommend scenario assumptions\n\nWhat would you like to focus on?`
                                : `I can help you with that. Based on your input, I suggest:\n\n• Consider your historical growth rates\n• Factor in market conditions\n• Account for seasonal variations\n\nWhat specific driver parameters would you like to explore?`
                            }
                          ]);
                        }, 1000);
                      }
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900">Base Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(baseRevenue * 12).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Annual baseline</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900">Total Impact</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalImpact.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">From all drivers</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900">Final Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${finalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    +{((finalRevenue / (baseRevenue * 12) - 1) * 100).toFixed(1)}% growth
                  </p>
                </div>
              </div>

              {previewData.length > 0 && (
                <DriverImpactWaterfall impacts={previewData} selectedMonth={startMonth} />
              )}

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-bold text-gray-900">Monthly Breakdown</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700">Month</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Base</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Impact</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Final</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-700">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewData.map(month => (
                        <tr key={month.month} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-xs font-medium text-gray-900">{month.month}</td>
                          <td className="px-4 py-3 text-xs text-right text-gray-600">
                            ${month.baseRevenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs text-right font-medium text-green-600">
                            +${month.totalImpact.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs text-right font-bold text-gray-900">
                            ${month.finalRevenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-xs text-right font-medium text-blue-600">
                            +{((month.finalRevenue / month.baseRevenue - 1) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!scenarioName.trim()}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Save Scenario
          </button>
        </div>
      </div>

      {/* Right Panel - Edit Driver */}
      {editingDriver && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-[60]"
            onClick={() => setEditingDriver(null)}
          />
          <div className="fixed right-0 top-0 bottom-0 z-[70] w-[500px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Driver</h3>
                <p className="text-xs text-gray-600 mt-1">{editingDriver.driverName}</p>
              </div>
              <button
                onClick={() => setEditingDriver(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {renderDriverParameters(editingDriver)}

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Apply From</label>
                  <select
                    value={editingDriver.startMonth}
                    onChange={(e) => {
                      updateDriver(editingDriver.id, { startMonth: e.target.value });
                      setEditingDriver({ ...editingDriver, startMonth: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Apply Until</label>
                  <select
                    value={editingDriver.endMonth}
                    onChange={(e) => {
                      updateDriver(editingDriver.id, { endMonth: e.target.value });
                      setEditingDriver({ ...editingDriver, endMonth: e.target.value });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setEditingDriver(null)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SalesScenarioModal;
