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
  Send
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
  DiscountingParameters
} from '../../types/salesDriver';
import { SalesDriverService } from '../../services/salesDriverService';

interface SalesScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scenario: SalesScenario) => void;
  initialScenario?: SalesScenario;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalesScenarioModal: React.FC<SalesScenarioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialScenario
}) => {
  const [scenarioName, setScenarioName] = useState(initialScenario?.name || '');
  const [scenarioDescription, setScenarioDescription] = useState(initialScenario?.description || '');
  const [baseRevenue, setBaseRevenue] = useState(initialScenario?.baseRevenue || 100000);
  const [startMonth, setStartMonth] = useState(initialScenario?.startMonth || 'Jan');
  const [endMonth, setEndMonth] = useState(initialScenario?.endMonth || 'Dec');
  const [startYear, setStartYear] = useState(initialScenario?.startYear || 2025);

  const [activeDrivers, setActiveDrivers] = useState<SalesDriver[]>(initialScenario?.drivers || []);
  const [showDriverLibrary, setShowDriverLibrary] = useState(false);
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'preview' | 'ai'>('overview');
  const [aiMessages, setAiMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [aiInput, setAiInput] = useState('');

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
    setExpandedDriver(newDriver.id);
  };

  const removeDriver = (driverId: string) => {
    setActiveDrivers(activeDrivers.filter(d => d.id !== driverId));
  };

  const updateDriver = (driverId: string, updates: Partial<SalesDriver>) => {
    setActiveDrivers(activeDrivers.map(d =>
      d.id === driverId ? { ...d, ...updates } : d
    ));
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume Growth %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Growth %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Units</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Price</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Marketing Spend (Monthly)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Customers Acquired</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Avg Revenue Per Customer</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">CAC Payback (Months)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Churn Rate %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Churn Rate %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Current MRR</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Avg Customer Count</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Leads Per Month</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Avg Deal Size</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Stages</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Baseline Revenue</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Multipliers</label>
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
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Avg Contract Length (Months)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Renewal Rate %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Expansion Revenue %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">New ARR</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Reps</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Quota Per Rep (Monthly)</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Attainment %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">New Hires</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume Lift %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Affected Revenue %</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Margin Impact %</label>
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

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[1200px] max-w-[95vw] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sales Scenario Builder</h2>
            <p className="text-sm text-gray-600 mt-1">Build advanced revenue scenarios with multiple drivers</p>
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
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            <Info className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'drivers'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Drivers ({activeDrivers.length})
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'ai'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-purple-600'
            }`}
          >
            <Bot className="w-4 h-4 inline mr-2" />
            AI Driver
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scenario Name</label>
                  <input
                    type="text"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Aggressive Q2 Growth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base Revenue (Monthly)</label>
                  <input
                    type="number"
                    value={baseRevenue}
                    onChange={(e) => setBaseRevenue(parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Month</label>
                  <select
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Month</label>
                  <select
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="number"
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drivers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Active Drivers</h3>
                <button
                  onClick={() => setShowDriverLibrary(!showDriverLibrary)}
                  className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Driver
                </button>
              </div>

              {showDriverLibrary && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Driver Library</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {DRIVER_TEMPLATES.map(template => {
                      return (
                        <button
                          key={template.driverType}
                          onClick={() => addDriver(template.driverType)}
                          className="flex items-start p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                        >
                          <div>
                            <h5 className="font-medium text-gray-900 text-sm">{template.name}</h5>
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
                    <p className="text-sm text-gray-500 mt-1">Click "Add Driver" to start building your scenario</p>
                  </div>
                ) : (
                  activeDrivers.map(driver => {
                    const template = DRIVER_TEMPLATES.find(t => t.driverType === driver.driverType);
                    const Icon = template ? getIconComponent(template.icon) : TrendingUp;
                    const isExpanded = expandedDriver === driver.id;

                    return (
                      <div key={driver.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50">
                          <div className="flex items-center flex-1">
                            <button
                              onClick={() => setExpandedDriver(isExpanded ? null : driver.id)}
                              className="mr-2"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                              )}
                            </button>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <Icon className="w-4 h-4 text-blue-600" />
                            </div>
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
                              <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                            <button
                              onClick={() => removeDriver(driver.id)}
                              className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-4 border-t border-gray-200 bg-white">
                            {renderDriverParameters(driver)}

                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apply From</label>
                                <select
                                  value={driver.startMonth}
                                  onChange={(e) => updateDriver(driver.id, { startMonth: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                  {MONTHS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Until</label>
                                <select
                                  value={driver.endMonth}
                                  onChange={(e) => updateDriver(driver.id, { endMonth: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                  {MONTHS.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
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
                      Discuss your assumptions with AI to help build your sales drivers.
                      The AI can suggest parameters and help you think through your scenarios.
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
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && aiInput.trim()) {
                        const userMessage = aiInput.trim();
                        setAiMessages([...aiMessages, { role: 'user', content: userMessage }]);
                        setAiInput('');

                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev,
                            {
                              role: 'assistant',
                              content: `I can help you with that. Based on your input, I suggest:\n\n• Consider your historical growth rates\n• Factor in market conditions\n• Account for seasonal variations\n\nWhat specific driver parameters would you like to explore?`
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
                      if (aiInput.trim()) {
                        const userMessage = aiInput.trim();
                        setAiMessages([...aiMessages, { role: 'user', content: userMessage }]);
                        setAiInput('');

                        setTimeout(() => {
                          setAiMessages(prev => [
                            ...prev,
                            {
                              role: 'assistant',
                              content: `I can help you with that. Based on your input, I suggest:\n\n• Consider your historical growth rates\n• Factor in market conditions\n• Account for seasonal variations\n\nWhat specific driver parameters would you like to explore?`
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
                    <span className="text-sm font-medium text-gray-900">Base Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(baseRevenue * 12).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Annual baseline</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Total Impact</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalImpact.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">From all drivers</p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Final Revenue</span>
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Month</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Base</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Impact</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Final</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewData.map(month => (
                        <tr key={month.month} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-600">
                            ${month.baseRevenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                            +${month.totalImpact.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                            ${month.finalRevenue.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-blue-600">
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
    </div>
  );
};

export default SalesScenarioModal;
