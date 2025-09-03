import React, { useState } from 'react';
import { Brain, MessageSquare, Sparkles, Target, TrendingUp, AlertTriangle, Lightbulb, BarChart3, Zap, Eye, RefreshCw } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

const AIWorkspace: React.FC = () => {
  const [activeInsights, setActiveInsights] = useState(12);
  const [modelsRunning, setModelsRunning] = useState(8);
  const [predictionAccuracy, setPredictionAccuracy] = useState(89.3);

  const aiModules = [
    {
      title: 'AI Chat Assistant',
      description: 'Conversational AI for financial analysis and insights',
      icon: MessageSquare,
      color: '#4ADE80',
      features: ['Natural Language Queries', 'Document Analysis', 'Real-time Insights', 'Context Awareness'],
      status: 'active',
      usage: '2.4K queries this month'
    },
    {
      title: 'Predictive Models',
      description: 'Machine learning models for forecasting and predictions',
      icon: Brain,
      color: '#8B5CF6',
      features: ['Revenue Forecasting', 'Expense Prediction', 'Churn Analysis', 'Anomaly Detection'],
      status: 'training',
      usage: '89.3% average accuracy'
    },
    {
      title: 'Smart Insights',
      description: 'AI-generated insights and recommendations',
      icon: Sparkles,
      color: '#3AB7BF',
      features: ['Variance Analysis', 'Trend Detection', 'Risk Assessment', 'Opportunity ID'],
      status: 'active',
      usage: '47 insights generated'
    },
    {
      title: 'Automated Commentary',
      description: 'AI-written financial narratives and explanations',
      icon: Lightbulb,
      color: '#F59E0B',
      features: ['Executive Summaries', 'Variance Explanations', 'Trend Analysis', 'Risk Factors'],
      status: 'active',
      usage: '15 reports generated'
    }
  ];

  const aiInsights = [
    {
      type: 'opportunity',
      title: 'Revenue Optimization',
      description: 'AI identified 18% revenue increase potential through pricing optimization',
      confidence: 87,
      impact: 'high',
      recommendation: 'Implement dynamic pricing for premium tier customers'
    },
    {
      type: 'risk',
      title: 'Cash Flow Risk',
      description: 'Predictive model indicates potential cash shortage in 45 days',
      confidence: 92,
      impact: 'high',
      recommendation: 'Accelerate collections and review payment terms'
    },
    {
      type: 'efficiency',
      title: 'Cost Optimization',
      description: 'Identified $45K monthly savings through vendor consolidation',
      confidence: 78,
      impact: 'medium',
      recommendation: 'Consolidate software licenses and renegotiate contracts'
    },
    {
      type: 'growth',
      title: 'Market Expansion',
      description: 'Market analysis suggests 25% growth opportunity in enterprise segment',
      confidence: 83,
      impact: 'high',
      recommendation: 'Increase enterprise sales team by 2 members'
    }
  ];

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return '#4ADE80';
      case 'risk': return '#F87171';
      case 'efficiency': return '#3AB7BF';
      case 'growth': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return TrendingUp;
      case 'risk': return AlertTriangle;
      case 'efficiency': return Target;
      case 'growth': return BarChart3;
      default: return Lightbulb;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E2A38] mb-4">AI Copilot Workspace</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          AI-powered financial intelligence with predictive analytics, automated insights, and conversational assistance.
        </p>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <p className="text-2xl font-bold text-[#8B5CF6]">{modelsRunning}</p>
            <p className="text-sm text-gray-600">Active Models</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-[#4ADE80]" />
            </div>
            <p className="text-2xl font-bold text-[#4ADE80]">{predictionAccuracy}%</p>
            <p className="text-sm text-gray-600">Prediction Accuracy</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-[#3AB7BF]" />
            </div>
            <p className="text-2xl font-bold text-[#3AB7BF]">{activeInsights}</p>
            <p className="text-sm text-gray-600">Active Insights</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-bold text-[#F59E0B]">2.4K</p>
            <p className="text-sm text-gray-600">AI Queries</p>
          </div>
        </Card>
      </div>

      {/* AI Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {aiModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-30" style={{ borderColor: `${module.color}20` }}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${module.color}15` }}
                >
                  <module.icon className="w-6 h-6" style={{ color: module.color }} />
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: module.status === 'active' ? '#4ADE8020' : '#F59E0B20',
                      color: module.status === 'active' ? '#4ADE80' : '#F59E0B'
                    }}
                  >
                    {module.status}
                  </span>
                  {module.status === 'training' && (
                    <RefreshCw className="w-4 h-4 text-[#F59E0B] animate-spin" />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-[#1E2A38] mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                <p className="text-xs text-gray-500 mb-4">{module.usage}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-[#1E2A38] text-sm">Capabilities:</h4>
                <div className="flex flex-wrap gap-1">
                  {module.features.map((feature, featureIndex) => (
                    <span 
                      key={featureIndex}
                      className="px-2 py-1 rounded text-xs"
                      style={{ 
                        backgroundColor: `${module.color}10`,
                        color: module.color
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI-Generated Insights */}
      <Card title="AI-Generated Insights">
        <div className="space-y-4">
          {aiInsights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-opacity-50 transition-all" style={{ borderColor: `${getInsightColor(insight.type)}40` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${getInsightColor(insight.type)}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: getInsightColor(insight.type) }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1E2A38]">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.impact === 'high' ? 'bg-[#F87171]/20 text-[#F87171]' :
                      insight.impact === 'medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                      'bg-[#4ADE80]/20 text-[#4ADE80]'
                    }`}>
                      {insight.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${getInsightColor(insight.type)}10` }}>
                  <div className="flex items-start">
                    <Lightbulb className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: getInsightColor(insight.type) }} />
                    <p className="text-sm text-gray-700">{insight.recommendation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* AI Model Status */}
      <Card title="AI Model Performance">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Model Accuracy Trends</h3>
            <div className="relative h-32">
              <svg className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  points="30,100 90,95 150,92 210,89 270,87 330,85 390,87 450,89"
                />
                {[100, 95, 92, 89, 87, 85, 87, 89].map((y, index) => (
                  <circle key={index} cx={30 + index * 60} cy={y} r="4" fill="#8B5CF6" />
                ))}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'].map((week, index) => (
                <span key={index}>{week}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Active Models</h3>
            <div className="space-y-3">
              {[
                { name: 'Revenue Forecasting', accuracy: 87, status: 'active' },
                { name: 'Expense Prediction', accuracy: 92, status: 'active' },
                { name: 'Cash Flow Model', accuracy: 89, status: 'training' },
                { name: 'Churn Analysis', accuracy: 78, status: 'active' }
              ].map((model, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      model.status === 'active' ? 'bg-[#4ADE80]' : 'bg-[#F59E0B]'
                    }`} />
                    <span className="font-medium text-[#1E2A38]">{model.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#8B5CF6]">{model.accuracy}%</span>
                    {model.status === 'training' && (
                      <RefreshCw className="w-3 h-3 text-[#F59E0B] animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* AI Actions */}
      <Card title="AI-Powered Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 rounded-lg transition-all text-left">
            <MessageSquare className="w-6 h-6 text-[#4ADE80] mb-2" />
            <p className="font-medium text-[#1E2A38]">Ask AI</p>
            <p className="text-sm text-gray-600">Query your financial data</p>
          </button>
          
          <button className="p-4 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 rounded-lg transition-all text-left">
            <Brain className="w-6 h-6 text-[#8B5CF6] mb-2" />
            <p className="font-medium text-[#1E2A38]">Generate Forecast</p>
            <p className="text-sm text-gray-600">Create AI predictions</p>
          </button>
          
          <button className="p-4 bg-[#3AB7BF]/10 hover:bg-[#3AB7BF]/20 rounded-lg transition-all text-left">
            <Sparkles className="w-6 h-6 text-[#3AB7BF] mb-2" />
            <p className="font-medium text-[#1E2A38]">Analyze Variance</p>
            <p className="text-sm text-gray-600">Explain differences</p>
          </button>
          
          <button className="p-4 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20 rounded-lg transition-all text-left">
            <Lightbulb className="w-6 h-6 text-[#F59E0B] mb-2" />
            <p className="font-medium text-[#1E2A38]">Get Recommendations</p>
            <p className="text-sm text-gray-600">Strategic suggestions</p>
          </button>
        </div>
      </Card>

      {/* Recent AI Activity */}
      <Card title="Recent AI Activity">
        <div className="space-y-4">
          {[
            { 
              action: 'Generated revenue forecast', 
              model: 'Neural Network', 
              accuracy: '87%', 
              time: '2 hours ago',
              result: 'Q2 revenue projected at $2.85M'
            },
            { 
              action: 'Detected expense anomaly', 
              model: 'Anomaly Detection', 
              accuracy: '94%', 
              time: '4 hours ago',
              result: 'Marketing spend 23% above normal'
            },
            { 
              action: 'Analyzed cash flow risk', 
              model: 'Predictive Analytics', 
              accuracy: '92%', 
              time: '6 hours ago',
              result: 'Potential shortage in 45 days'
            },
            { 
              action: 'Generated executive summary', 
              model: 'Natural Language', 
              accuracy: '89%', 
              time: '1 day ago',
              result: 'Q1 performance narrative created'
            }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center mr-3">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1E2A38]">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.model} • {activity.accuracy} accuracy</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#1E2A38]">{activity.result}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AIWorkspace;