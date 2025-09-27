import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Brain, 
  Send, 
  Save, 
  Download, 
  RefreshCw, 
  Trash2, 
  Eye, 
  Copy, 
  Link as LinkIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Database,
  FileText,
  Clock,
  ArrowRight,
  Plus,
  X,
  Settings,
  History
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface CalculationResult {
  id: string;
  query: string;
  timestamp: Date;
  results: {
    summary: string;
    calculations: CalculationStep[];
    scenarios: ScenarioComparison[];
    impacts: FinancialImpact[];
    recommendations: string[];
  };
  dataLineage: DataSource[];
  saved: boolean;
  linkedReports: string[];
}

interface CalculationStep {
  step: number;
  description: string;
  formula: string;
  inputs: { [key: string]: number };
  result: number;
  explanation: string;
}

interface ScenarioComparison {
  name: string;
  baseCase: number;
  scenario: number;
  variance: number;
  variancePercent: number;
}

interface FinancialImpact {
  metric: string;
  currentValue: number;
  projectedValue: number;
  impact: number;
  impactPercent: number;
  significance: 'high' | 'medium' | 'low';
}

interface DataSource {
  field: string;
  source: string;
  value: number;
  lastUpdated: Date;
}

interface SavedScenario {
  id: string;
  name: string;
  description: string;
  query: string;
  result: CalculationResult;
  createdAt: Date;
  tags: string[];
}

const Sandbox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    {
      id: '1',
      name: 'Q2 Revenue Growth Scenario',
      description: '15% revenue increase impact analysis',
      query: 'What if revenue increases 15% next quarter?',
      result: {
        id: '1',
        query: 'What if revenue increases 15% next quarter?',
        timestamp: new Date(Date.now() - 86400000),
        results: {
          summary: 'A 15% revenue increase would generate an additional $127K in quarterly revenue',
          calculations: [],
          scenarios: [],
          impacts: [],
          recommendations: []
        },
        dataLineage: [],
        saved: true,
        linkedReports: ['Q2 Forecast', 'Revenue Analysis']
      },
      createdAt: new Date(Date.now() - 86400000),
      tags: ['revenue', 'growth', 'q2']
    }
  ]);
  const [showSavedScenarios, setShowSavedScenarios] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<CalculationResult | null>(null);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    tags: ''
  });
  const [customFormulas, setCustomFormulas] = useState([
    { name: 'Customer LTV', formula: 'ARPU * (1 / churn_rate) * gross_margin', description: 'Customer lifetime value calculation' },
    { name: 'Payback Period', formula: 'CAC / (ARPU * gross_margin)', description: 'Customer acquisition payback period' },
    { name: 'Rule of 40', formula: 'revenue_growth_rate + profit_margin', description: 'SaaS efficiency metric' }
  ]);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [newFormula, setNewFormula] = useState({ name: '', formula: '', description: '' });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock financial data context
  const financialContext = {
    revenue: 847500,
    expenses: 623200,
    profit: 224300,
    margin: 26.4,
    cashFlow: 485000,
    customers: 1250,
    arpu: 678,
    cac: 145,
    churnRate: 3.2,
    runway: 8.2
  };

  const exampleQueries = [
    "What if revenue increases 15% next quarter?",
    "Calculate loan amortization for $200,000 over 30 years at 6%",
    "How would a 20% expense reduction affect our runway?",
    "What's our break-even point if we hire 5 more employees?",
    "Compare scenarios: 10% vs 20% revenue growth",
    "Calculate ROI for $50K marketing investment with 3:1 return"
  ];

  const processQuery = async (inputQuery: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockResult: CalculationResult = generateMockResult(inputQuery);
      setResults(prev => [mockResult, ...prev]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateMockResult = (inputQuery: string): CalculationResult => {
    const query = inputQuery.toLowerCase();
    
    if (query.includes('revenue') && query.includes('15%')) {
      return {
        id: Date.now().toString(),
        query: inputQuery,
        timestamp: new Date(),
        results: {
          summary: 'A 15% revenue increase would generate an additional $127,125 in quarterly revenue, improving profit margin to 28.9% and extending runway to 9.8 months.',
          calculations: [
            {
              step: 1,
              description: 'Calculate current quarterly revenue',
              formula: 'monthly_revenue * 3',
              inputs: { monthly_revenue: 847500 },
              result: 2542500,
              explanation: 'Current monthly revenue multiplied by 3 months'
            },
            {
              step: 2,
              description: 'Apply 15% growth rate',
              formula: 'quarterly_revenue * 1.15',
              inputs: { quarterly_revenue: 2542500 },
              result: 2923875,
              explanation: '15% increase applied to quarterly revenue'
            },
            {
              step: 3,
              description: 'Calculate additional revenue',
              formula: 'new_revenue - current_revenue',
              inputs: { new_revenue: 2923875, current_revenue: 2542500 },
              result: 381375,
              explanation: 'Difference between new and current revenue'
            }
          ],
          scenarios: [
            {
              name: 'Current State',
              baseCase: 2542500,
              scenario: 2542500,
              variance: 0,
              variancePercent: 0
            },
            {
              name: '15% Growth Scenario',
              baseCase: 2542500,
              scenario: 2923875,
              variance: 381375,
              variancePercent: 15
            }
          ],
          impacts: [
            {
              metric: 'Quarterly Revenue',
              currentValue: 2542500,
              projectedValue: 2923875,
              impact: 381375,
              impactPercent: 15,
              significance: 'high'
            },
            {
              metric: 'Profit Margin',
              currentValue: 26.4,
              projectedValue: 28.9,
              impact: 2.5,
              impactPercent: 9.5,
              significance: 'medium'
            },
            {
              metric: 'Cash Runway',
              currentValue: 8.2,
              projectedValue: 9.8,
              impact: 1.6,
              impactPercent: 19.5,
              significance: 'medium'
            }
          ],
          recommendations: [
            'Focus on high-margin customer segments to maximize impact',
            'Ensure operational capacity can support 15% growth',
            'Monitor cash flow closely during growth phase',
            'Consider reinvesting additional revenue into growth initiatives'
          ]
        },
        dataLineage: [
          { field: 'monthly_revenue', source: 'P&L Statement', value: 847500, lastUpdated: new Date() },
          { field: 'profit_margin', source: 'Financial Summary', value: 26.4, lastUpdated: new Date() },
          { field: 'cash_balance', source: 'Balance Sheet', value: 485000, lastUpdated: new Date() }
        ],
        saved: false,
        linkedReports: []
      };
    }
    
    if (query.includes('loan') && query.includes('amortization')) {
      return {
        id: Date.now().toString(),
        query: inputQuery,
        timestamp: new Date(),
        results: {
          summary: 'A $200,000 loan at 6% over 30 years results in monthly payments of $1,199.10 with total interest of $231,676.',
          calculations: [
            {
              step: 1,
              description: 'Calculate monthly interest rate',
              formula: 'annual_rate / 12',
              inputs: { annual_rate: 0.06 },
              result: 0.005,
              explanation: '6% annual rate divided by 12 months'
            },
            {
              step: 2,
              description: 'Calculate number of payments',
              formula: 'years * 12',
              inputs: { years: 30 },
              result: 360,
              explanation: '30 years multiplied by 12 months per year'
            },
            {
              step: 3,
              description: 'Calculate monthly payment',
              formula: 'P * [r(1+r)^n] / [(1+r)^n - 1]',
              inputs: { P: 200000, r: 0.005, n: 360 },
              result: 1199.10,
              explanation: 'Standard loan payment formula'
            }
          ],
          scenarios: [
            {
              name: 'Total Payments',
              baseCase: 200000,
              scenario: 431676,
              variance: 231676,
              variancePercent: 115.8
            }
          ],
          impacts: [
            {
              metric: 'Monthly Cash Flow Impact',
              currentValue: financialContext.cashFlow,
              projectedValue: financialContext.cashFlow - 1199.10,
              impact: -1199.10,
              impactPercent: -0.25,
              significance: 'low'
            }
          ],
          recommendations: [
            'Consider shorter loan term to reduce total interest',
            'Evaluate impact on monthly cash flow',
            'Compare with alternative financing options'
          ]
        },
        dataLineage: [
          { field: 'cash_flow', source: 'Cash Flow Statement', value: financialContext.cashFlow, lastUpdated: new Date() }
        ],
        saved: false,
        linkedReports: []
      };
    }

    // Default response for other queries
    return {
      id: Date.now().toString(),
      query: inputQuery,
      timestamp: new Date(),
      results: {
        summary: 'Analysis completed. The calculation shows potential impacts on your financial metrics.',
        calculations: [
          {
            step: 1,
            description: 'Parse financial context',
            formula: 'current_metrics',
            inputs: financialContext,
            result: 1,
            explanation: 'Retrieved current financial data from your platform'
          }
        ],
        scenarios: [],
        impacts: [],
        recommendations: [
          'Review the calculation methodology',
          'Consider additional variables that might affect the outcome',
          'Validate assumptions with historical data'
        ]
      },
      dataLineage: [
        { field: 'revenue', source: 'P&L Statement', value: financialContext.revenue, lastUpdated: new Date() }
      ],
      saved: false,
      linkedReports: []
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      processQuery(query);
      setQuery('');
    }
  };

  const handleSaveScenario = () => {
    if (selectedResult && saveForm.name.trim()) {
      const scenario: SavedScenario = {
        id: Date.now().toString(),
        name: saveForm.name,
        description: saveForm.description,
        query: selectedResult.query,
        result: { ...selectedResult, saved: true },
        createdAt: new Date(),
        tags: saveForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      setSavedScenarios(prev => [scenario, ...prev]);
      setSaveForm({ name: '', description: '', tags: '' });
      setShowSaveModal(false);
      setSelectedResult(null);
    }
  };

  const handleAddFormula = () => {
    if (newFormula.name.trim() && newFormula.formula.trim()) {
      setCustomFormulas(prev => [...prev, newFormula]);
      setNewFormula({ name: '', formula: '', description: '' });
      setShowFormulaModal(false);
    }
  };

  const getImpactColor = (significance: string) => {
    switch (significance) {
      case 'high': return '#F87171';
      case 'medium': return '#F59E0B';
      case 'low': return '#4ADE80';
      default: return '#6B7280';
    }
  };

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [query]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Financial Sandbox</h2>
        <p className="text-gray-600 mt-1">Natural language financial calculations and scenario modeling</p>
      </div>

      {/* Input Section */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask a financial question or describe a scenario
            </label>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What if revenue increases 15% next quarter? or Calculate loan amortization for $200,000 over 30 years at 6%"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent resize-none"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  disabled={isProcessing}
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFormulaModal(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Custom formulas"
                  >
                    <Calculator className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!query.trim() || isProcessing}
                    className="p-1 text-[#8B5CF6] hover:text-[#7C3AED] transition-colors disabled:opacity-50"
                    title="Calculate"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Example Queries */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 mr-2">Try:</span>
                {exampleQueries.slice(0, 3).map((example, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setQuery(example)}
                    className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-xs hover:bg-[#8B5CF6]/20 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </form>
          </div>

          {/* Financial Context */}
          <div className="p-4 bg-[#8B5CF6]/10 rounded-lg">
            <h4 className="font-medium text-[#1E2A38] mb-3 flex items-center">
              <Database className="w-4 h-4 mr-2 text-[#8B5CF6]" />
              Live Financial Context
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Revenue:</span>
                <span className="font-medium text-[#1E2A38] ml-2">{formatCurrency(financialContext.revenue)}</span>
              </div>
              <div>
                <span className="text-gray-600">Profit:</span>
                <span className="font-medium text-[#1E2A38] ml-2">{formatCurrency(financialContext.profit)}</span>
              </div>
              <div>
                <span className="text-gray-600">Margin:</span>
                <span className="font-medium text-[#1E2A38] ml-2">{formatPercent(financialContext.margin)}</span>
              </div>
              <div>
                <span className="text-gray-600">Runway:</span>
                <span className="font-medium text-[#1E2A38] ml-2">{financialContext.runway} months</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Processing Indicator */}
      {isProcessing && (
        <Card>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Brain className="w-12 h-12 text-[#8B5CF6] mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">AI Processing</h3>
              <p className="text-gray-600">Analyzing your query and running calculations...</p>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {results.map((result, index) => (
        <Card key={result.id}>
          <div className="space-y-6">
            {/* Result Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-[#8B5CF6] mr-2" />
                  <h3 className="font-semibold text-[#1E2A38]">Calculation Result</h3>
                  <span className="ml-2 text-xs text-gray-500">{result.timestamp.toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Query: "{result.query}"</p>
                <p className="text-[#1E2A38] font-medium">{result.results.summary}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedResult(result);
                    setShowSaveModal(true);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Save scenario"
                >
                  <Save className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Export results"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Calculation Steps */}
            {result.results.calculations.length > 0 && (
              <div>
                <h4 className="font-medium text-[#1E2A38] mb-3 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-[#3AB7BF]" />
                  Step-by-Step Calculation
                </h4>
                <div className="space-y-3">
                  {result.results.calculations.map((step, stepIndex) => (
                    <div key={stepIndex} className="p-4 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-[#3AB7BF] rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">{step.step}</span>
                          </div>
                          <h5 className="font-medium text-[#1E2A38]">{step.description}</h5>
                        </div>
                        <span className="font-bold text-[#3AB7BF]">
                          {typeof step.result === 'number' && step.result > 1000 
                            ? formatCurrency(step.result)
                            : step.result.toLocaleString()
                          }
                        </span>
                      </div>
                      <div className="ml-9">
                        <p className="text-sm text-gray-700 mb-2">{step.explanation}</p>
                        <code className="text-xs bg-white px-2 py-1 rounded border text-[#8B5CF6]">
                          {step.formula}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario Comparison */}
            {result.results.scenarios.length > 0 && (
              <div>
                <h4 className="font-medium text-[#1E2A38] mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2 text-[#F59E0B]" />
                  Scenario Comparison
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Scenario</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Value</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.scenarios.map((scenario, scenarioIndex) => (
                        <tr key={scenarioIndex} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-[#1E2A38]">{scenario.name}</td>
                          <td className="py-3 px-4 text-right font-medium text-[#1E2A38]">
                            {formatCurrency(scenario.scenario)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${
                              scenario.variance > 0 ? 'text-[#4ADE80]' : 
                              scenario.variance < 0 ? 'text-[#F87171]' : 'text-gray-600'
                            }`}>
                              {scenario.variance > 0 ? '+' : ''}{formatCurrency(scenario.variance)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${
                              scenario.variancePercent > 0 ? 'text-[#4ADE80]' : 
                              scenario.variancePercent < 0 ? 'text-[#F87171]' : 'text-gray-600'
                            }`}>
                              {scenario.variancePercent > 0 ? '+' : ''}{formatPercent(scenario.variancePercent)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Financial Impacts */}
            {result.results.impacts.length > 0 && (
              <div>
                <h4 className="font-medium text-[#1E2A38] mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#4ADE80]" />
                  Financial Impact Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.results.impacts.map((impact, impactIndex) => (
                    <div key={impactIndex} className="p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-[#1E2A38]">{impact.metric}</h5>
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${getImpactColor(impact.significance)}20`,
                            color: getImpactColor(impact.significance)
                          }}
                        >
                          {impact.significance} impact
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current:</span>
                          <span className="font-medium text-[#1E2A38]">
                            {impact.metric.includes('%') || impact.metric.includes('Margin') 
                              ? formatPercent(impact.currentValue)
                              : formatCurrency(impact.currentValue)
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Projected:</span>
                          <span className="font-medium text-[#1E2A38]">
                            {impact.metric.includes('%') || impact.metric.includes('Margin')
                              ? formatPercent(impact.projectedValue)
                              : formatCurrency(impact.projectedValue)
                            }
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                          <span className="text-gray-600">Impact:</span>
                          <span 
                            className="font-bold"
                            style={{ 
                              color: impact.impact > 0 ? '#4ADE80' : 
                                     impact.impact < 0 ? '#F87171' : '#6B7280'
                            }}
                          >
                            {impact.impact > 0 ? '+' : ''}
                            {impact.metric.includes('%') || impact.metric.includes('Margin')
                              ? formatPercent(impact.impact)
                              : formatCurrency(impact.impact)
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.results.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-[#1E2A38] mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2 text-[#F59E0B]" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  {result.results.recommendations.map((rec, recIndex) => (
                    <div key={recIndex} className="flex items-start p-3 bg-[#F59E0B]/10 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#F59E0B] mr-3 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Lineage */}
            {result.dataLineage.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium text-[#1E2A38] mb-3 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                  Data Sources
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.dataLineage.map((source, sourceIndex) => (
                    <div key={sourceIndex} className="px-3 py-1 bg-gray-100 rounded-full text-xs">
                      <span className="text-gray-600">{source.field}:</span>
                      <span className="font-medium text-[#1E2A38] ml-1">{source.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Sidebar Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Saved Scenarios */}
        <Card title="Saved Scenarios">
          <div className="space-y-3">
            {savedScenarios.slice(0, 3).map(scenario => (
              <div key={scenario.id} className="p-3 border border-gray-200 rounded-lg hover:border-[#8B5CF6] transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-[#1E2A38] text-sm">{scenario.name}</h5>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                <div className="flex flex-wrap gap-1">
                  {scenario.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowSavedScenarios(true)}
            >
              <History className="w-4 h-4 mr-2" />
              View All Scenarios
            </Button>
          </div>
        </Card>

        {/* Custom Formulas */}
        <Card title="Custom Formulas">
          <div className="space-y-3">
            {customFormulas.slice(0, 3).map((formula, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-[#1E2A38] text-sm">{formula.name}</h5>
                <p className="text-xs text-gray-600 mb-1">{formula.description}</p>
                <code className="text-xs bg-white px-2 py-1 rounded border text-[#8B5CF6] block">
                  {formula.formula}
                </code>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowFormulaModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Formula
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Financial Data
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Export All Results
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Calculation Settings
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Run Batch Analysis
            </Button>
          </div>
        </Card>
      </div>

      {/* Save Scenario Modal */}
      {showSaveModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Save Scenario</h3>
              <button
                onClick={() => setShowSaveModal(false)}
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
                  value={saveForm.name}
                  onChange={(e) => setSaveForm({...saveForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  placeholder="e.g., Q2 Growth Scenario"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={saveForm.description}
                  onChange={(e) => setSaveForm({...saveForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  rows={3}
                  placeholder="Describe this scenario..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={saveForm.tags}
                  onChange={(e) => setSaveForm({...saveForm, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  placeholder="revenue, growth, q2"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScenario}
                disabled={!saveForm.name.trim()}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Add Custom Formula</h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formula Name</label>
                <input
                  type="text"
                  value={newFormula.name}
                  onChange={(e) => setNewFormula({...newFormula, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  placeholder="e.g., Customer LTV"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formula</label>
                <input
                  type="text"
                  value={newFormula.formula}
                  onChange={(e) => setNewFormula({...newFormula, formula: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent font-mono"
                  placeholder="e.g., ARPU * (1 / churn_rate) * gross_margin"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newFormula.description}
                  onChange={(e) => setNewFormula({...newFormula, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  rows={2}
                  placeholder="Describe what this formula calculates..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFormula}
                disabled={!newFormula.name.trim() || !newFormula.formula.trim()}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Formula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sandbox;