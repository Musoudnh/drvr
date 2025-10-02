import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Save, 
  Download, 
  RefreshCw, 
  Brain, 
  Calculator, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info,
  Database,
  FileText,
  Clock,
  Plus,
  X,
  Settings,
  History,
  Sparkles,
  ArrowRight,
  Copy,
  Share2,
  Maximize2,
  Minimize2
} from 'lucide-react';

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

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  result?: CalculationResult;
}

const Sandbox: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Financial Analyst. I can help you with calculations, scenario modeling, and financial analysis. Try asking me something like 'What if revenue increases 15% next quarter?' or 'Calculate loan amortization for $200,000 over 30 years at 6%'.",
      timestamp: new Date()
    }
  ]);
  const [activeResult, setActiveResult] = useState<CalculationResult | null>(null);
  const [isRightPanelExpanded, setIsRightPanelExpanded] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const processQuery = async (inputQuery: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputQuery,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockResult = generateMockResult(inputQuery);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: mockResult.results.summary,
        timestamp: new Date(),
        result: mockResult
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setActiveResult(mockResult);
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
        saved: false
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
        saved: false
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
      saved: false
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      processQuery(query);
      setQuery('');
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

  const getImpactColor = (significance: string) => {
    switch (significance) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Main Content - Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Chat Interface */}
        <div className={`${isRightPanelExpanded ? 'w-1/3' : 'w-1/2'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#4F46E5]/10 rounded-full flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-[#4F46E5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Financial Assistant</h3>
                  <p className="text-xs text-gray-600">Ask questions in natural language</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Online</span>
              </div>
            </div>
          </div>

          {/* Financial Context Bar */}
          <div className="px-6 py-3 bg-[#4F46E5]/10 border-b border-[#4F46E5]/20">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Database className="w-3 h-3 text-[#4F46E5] mr-2" />
                <span className="font-medium text-[#4F46E5]">Live Financial Data</span>
              </div>
              <button className="text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-2">
              <div className="text-center">
                <div className="text-xs text-gray-600">Revenue</div>
                <div className="font-semibold text-gray-900">{formatCurrency(financialContext.revenue)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600">Profit</div>
                <div className="font-semibold text-gray-900">{formatCurrency(financialContext.profit)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600">Margin</div>
                <div className="font-semibold text-gray-900">{formatPercent(financialContext.margin)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600">Runway</div>
                <div className="font-semibold text-gray-900">{financialContext.runway}mo</div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-[#4F46E5]' 
                        : 'bg-gray-100'
                    }`}>
                      {message.type === 'user' ? (
                        <span className="text-white text-sm font-medium">U</span>
                      ) : (
                        <Brain className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-[#4F46E5]/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Show result button for AI messages with results */}
                  {message.result && (
                    <div className="mt-2 ml-11">
                      <button
                        onClick={() => setActiveResult(message.result!)}
                        className="px-3 py-2 text-sm font-medium text-[#4F46E5] bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-lg hover:bg-[#4F46E5]/20 transition-colors flex items-center"
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Detailed Results
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-gray-600">Analyzing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Example Queries */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center mb-2">
              <Sparkles className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-xs font-medium text-gray-700">Try these examples:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.slice(0, 3).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1 text-xs text-[#4F46E5] bg-[#4F46E5]/10 border border-[#4F46E5]/20 rounded-full hover:bg-[#4F46E5]/20 transition-colors"
                >
                  {example.length > 40 ? example.substring(0, 40) + '...' : example}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a financial question or describe a scenario..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none text-sm"
                  rows={1}
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                  disabled={isProcessing}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isProcessing}
                  className="absolute right-3 bottom-3 p-2 text-[#4F46E5] hover:text-[#4338CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Send query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Press Enter to send, Shift+Enter for new line
              </p>
            </form>
          </div>
        </div>

        {/* Right Panel - Results Display */}
        <div className={`${isRightPanelExpanded ? 'w-2/3' : 'w-1/2'} bg-gray-50 flex flex-col transition-all duration-300`}>
          {/* Results Header */}
          <div className="px-6 py-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Analysis Results</h3>
                  <p className="text-xs text-gray-600">Live calculations and scenario modeling</p>
                </div>
              </div>
              {activeResult && (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeResult ? (
              <div className="space-y-6">
                {/* Query Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Query Analysis</h4>
                      <p className="text-sm text-gray-600 mb-3">"{activeResult.query}"</p>
                      <p className="text-gray-800 leading-relaxed">{activeResult.results.summary}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {activeResult.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Calculations */}
                {activeResult.results.calculations.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Calculator className="w-4 h-4 mr-2 text-[#4F46E5]" />
                      Step-by-Step Calculation
                    </h4>
                    <div className="space-y-4">
                      {activeResult.results.calculations.map((step, index) => (
                        <div key={index} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-[#4F46E5] rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">{step.step}</span>
                              </div>
                              <h5 className="font-medium text-gray-900">{step.description}</h5>
                            </div>
                            <span className="font-bold text-[#4F46E5] text-lg">
                              {typeof step.result === 'number' && step.result > 1000 
                                ? formatCurrency(step.result)
                                : step.result.toLocaleString()
                              }
                            </span>
                          </div>
                          <div className="ml-9">
                            <p className="text-sm text-gray-700 mb-2">{step.explanation}</p>
                            <div className="bg-white rounded-lg p-3 border border-gray-200">
                              <code className="text-xs text-[#4F46E5] font-mono">
                                {step.formula}
                              </code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scenario Comparison */}
                {activeResult.results.scenarios.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      Scenario Comparison
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Scenario</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Value</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Variance</th>
                            <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">% Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeResult.results.scenarios.map((scenario, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-3 px-4 font-medium text-gray-900">{scenario.name}</td>
                              <td className="py-3 px-4 text-right font-medium text-gray-900">
                                {formatCurrency(scenario.scenario)}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className={`font-medium ${
                                  scenario.variance > 0 ? 'text-green-600' : 
                                  scenario.variance < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {scenario.variance > 0 ? '+' : ''}{formatCurrency(scenario.variance)}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className={`font-medium ${
                                  scenario.variancePercent > 0 ? 'text-green-600' : 
                                  scenario.variancePercent < 0 ? 'text-red-600' : 'text-gray-600'
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

                {/* Financial Impact Analysis */}
                {activeResult.results.impacts.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                      Financial Impact Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeResult.results.impacts.map((impact, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{impact.metric}</h5>
                            <span 
                              className="px-2 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: getImpactColor(impact.significance) }}
                            >
                              {impact.significance} impact
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Current:</span>
                              <span className="font-medium text-gray-900">
                                {impact.metric.includes('%') || impact.metric.includes('Margin') 
                                  ? formatPercent(impact.currentValue)
                                  : formatCurrency(impact.currentValue)
                                }
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Projected:</span>
                              <span className="font-medium text-gray-900">
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
                                  color: impact.impact > 0 ? '#10B981' : 
                                         impact.impact < 0 ? '#EF4444' : '#6B7280'
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

                {/* AI Recommendations */}
                {activeResult.results.recommendations.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                      AI Recommendations
                    </h4>
                    <div className="space-y-3">
                      {activeResult.results.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Data Lineage */}
                {activeResult.dataLineage.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Database className="w-4 h-4 mr-2 text-gray-600" />
                      Data Sources
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeResult.dataLineage.map((source, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{source.field}</span>
                            <p className="text-xs text-gray-600">{source.source}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(source.value)}
                            </span>
                            <p className="text-xs text-gray-500">
                              {source.lastUpdated.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Financial Sandbox</h3>
                  <p className="text-gray-600 mb-6">
                    Ask financial questions in natural language and get AI-powered calculations and insights.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Connected to live financial data
                    </p>
                    <p className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      AI-powered scenario modeling
                    </p>
                    <p className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Step-by-step explanations
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sandbox;