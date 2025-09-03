import React, { useState } from 'react';
import { Brain, TrendingUp, Target, AlertTriangle, Lightbulb, BarChart3, LineChart, PieChart, Zap, Eye, Settings, RefreshCw } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface Prediction {
  id: string;
  type: 'revenue' | 'expenses' | 'cash_flow' | 'customer_churn';
  title: string;
  confidence: number;
  prediction: number;
  timeframe: string;
  factors: string[];
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

interface Anomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  severity: 'critical' | 'warning' | 'info';
  detectedAt: Date;
  description: string;
}

const PredictiveAnalytics: React.FC = () => {
  const [predictions] = useState<Prediction[]>([
    {
      id: '1',
      type: 'revenue',
      title: 'Q2 Revenue Forecast',
      confidence: 87,
      prediction: 2850000,
      timeframe: 'Next 3 months',
      factors: ['Seasonal trends', 'Product launch impact', 'Market conditions'],
      recommendation: 'Consider increasing marketing spend by 15% to capture additional growth opportunity',
      impact: 'high'
    },
    {
      id: '2',
      type: 'cash_flow',
      title: 'Cash Flow Projection',
      confidence: 92,
      prediction: 485000,
      timeframe: 'Next month',
      factors: ['Payment cycles', 'Expense timing', 'Revenue collection'],
      recommendation: 'Optimize payment terms with key suppliers to improve cash position',
      impact: 'medium'
    },
    {
      id: '3',
      type: 'customer_churn',
      title: 'Customer Retention Risk',
      confidence: 78,
      prediction: 3.2,
      timeframe: 'Next quarter',
      factors: ['Usage patterns', 'Support tickets', 'Payment delays'],
      recommendation: 'Implement proactive customer success program for at-risk accounts',
      impact: 'high'
    }
  ]);

  const [anomalies] = useState<Anomaly[]>([
    {
      id: '1',
      metric: 'Daily Revenue',
      value: 28500,
      expected: 32000,
      deviation: -10.9,
      severity: 'warning',
      detectedAt: new Date(Date.now() - 3600000),
      description: 'Revenue 10.9% below expected range for this time period'
    },
    {
      id: '2',
      metric: 'Marketing Spend',
      value: 45000,
      expected: 35000,
      deviation: 28.6,
      severity: 'critical',
      detectedAt: new Date(Date.now() - 7200000),
      description: 'Marketing expenses significantly above budget allocation'
    },
    {
      id: '3',
      metric: 'Customer Acquisition',
      value: 125,
      expected: 100,
      deviation: 25.0,
      severity: 'info',
      detectedAt: new Date(Date.now() - 1800000),
      description: 'Customer acquisition rate exceeding targets'
    }
  ]);

  const [selectedModel, setSelectedModel] = useState('revenue_forecast');
  const [isTraining, setIsTraining] = useState(false);

  const models = [
    { id: 'revenue_forecast', name: 'Revenue Forecasting', accuracy: 87, lastTrained: '2 days ago' },
    { id: 'expense_prediction', name: 'Expense Prediction', accuracy: 92, lastTrained: '1 day ago' },
    { id: 'churn_analysis', name: 'Customer Churn Analysis', accuracy: 78, lastTrained: '3 days ago' },
    { id: 'cash_flow_model', name: 'Cash Flow Modeling', accuracy: 89, lastTrained: '1 day ago' }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-[#F87171] bg-[#F87171]/10';
      case 'medium': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'low': return 'text-[#4ADE80] bg-[#4ADE80]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-[#F87171] bg-[#F87171]/10';
      case 'warning': return 'text-[#F59E0B] bg-[#F59E0B]/10';
      case 'info': return 'text-[#3AB7BF] bg-[#3AB7BF]/10';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRetrainModel = () => {
    setIsTraining(true);
    setTimeout(() => {
      setIsTraining(false);
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">Predictive Analytics</h2>
          <p className="text-gray-600 mt-1">AI-powered forecasting and anomaly detection</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleRetrainModel}
          disabled={isTraining}
          className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
        >
          {isTraining ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Training...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Retrain Models
            </>
          )}
        </Button>
      </div>

      {/* Model Performance */}
      <Card title="AI Model Performance">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {models.map(model => (
            <div 
              key={model.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedModel === model.id ? 'border-[#8B5CF6] bg-[#8B5CF6]/5' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <Brain className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-lg font-bold text-[#8B5CF6]">{model.accuracy}%</span>
              </div>
              <h3 className="font-semibold text-[#1E2A38] mb-1">{model.name}</h3>
              <p className="text-xs text-gray-500">Last trained: {model.lastTrained}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Predictions */}
      <Card title="AI Predictions">
        <div className="space-y-4">
          {predictions.map(prediction => (
            <div key={prediction.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#8B5CF6] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1E2A38]">{prediction.title}</h3>
                    <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(prediction.impact)}`}>
                      {prediction.impact} impact
                    </span>
                    <span className="text-sm font-medium text-gray-600">{prediction.confidence}% confidence</span>
                  </div>
                  <p className="text-lg font-bold text-[#8B5CF6]">
                    {prediction.type === 'customer_churn' 
                      ? `${prediction.prediction}%`
                      : `$${(prediction.prediction / 1000000).toFixed(1)}M`
                    }
                  </p>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="font-medium text-[#1E2A38] mb-2">Key Factors</h4>
                <div className="flex flex-wrap gap-2">
                  {prediction.factors.map((factor, index) => (
                    <span key={index} className="px-2 py-1 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-full text-xs">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-[#4ADE80]/10 rounded-lg">
                <div className="flex items-start">
                  <Lightbulb className="w-4 h-4 text-[#4ADE80] mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{prediction.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Anomaly Detection */}
      <Card title="Anomaly Detection">
        <div className="space-y-4">
          {anomalies.map(anomaly => (
            <div key={anomaly.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <AlertTriangle className={`w-5 h-5 mr-3 ${
                    anomaly.severity === 'critical' ? 'text-[#F87171]' :
                    anomaly.severity === 'warning' ? 'text-[#F59E0B]' : 'text-[#3AB7BF]'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-[#1E2A38]">{anomaly.metric}</h3>
                    <p className="text-sm text-gray-600">Detected {anomaly.detectedAt.toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity}
                  </span>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Actual</p>
                  <p className="font-bold text-[#1E2A38]">{anomaly.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Expected</p>
                  <p className="font-bold text-gray-600">{anomaly.expected.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Deviation</p>
                  <p className={`font-bold ${anomaly.deviation > 0 ? 'text-[#F87171]' : 'text-[#4ADE80]'}`}>
                    {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 mt-3">{anomaly.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      <Card title="AI-Generated Insights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg border border-[#4ADE80]/20">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-[#4ADE80] mr-2" />
                <h3 className="font-semibold text-[#1E2A38]">Growth Opportunity</h3>
              </div>
              <p className="text-sm text-gray-700">
                AI analysis suggests Q2 revenue could increase by 18% with optimized pricing strategy. 
                Historical data shows similar patterns in previous years.
              </p>
            </div>
            
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] mr-2" />
                <h3 className="font-semibold text-[#1E2A38]">Risk Alert</h3>
              </div>
              <p className="text-sm text-gray-700">
                Customer acquisition cost trending upward. Model predicts 25% increase if current 
                marketing efficiency trends continue.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
              <div className="flex items-center mb-2">
                <Target className="w-5 h-5 text-[#3AB7BF] mr-2" />
                <h3 className="font-semibold text-[#1E2A38]">Optimization</h3>
              </div>
              <p className="text-sm text-gray-700">
                Expense optimization model identifies $45K monthly savings opportunity through 
                vendor consolidation and process automation.
              </p>
            </div>
            
            <div className="p-4 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
              <div className="flex items-center mb-2">
                <Lightbulb className="w-5 h-5 text-[#8B5CF6] mr-2" />
                <h3 className="font-semibold text-[#1E2A38]">Strategic Insight</h3>
              </div>
              <p className="text-sm text-gray-700">
                Seasonal analysis reveals untapped revenue potential in Q3. Consider launching 
                targeted campaigns 6 weeks before peak season.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Model Configuration */}
      <Card title="Model Configuration">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Training Data</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Historical Period</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>24 months</option>
                  <option>36 months</option>
                  <option>48 months</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Data Sources</span>
                <span className="text-sm font-medium text-[#3AB7BF]">4 connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Update Frequency</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Prediction Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Forecast Horizon</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Confidence Threshold</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>70%</option>
                  <option>80%</option>
                  <option>90%</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#1E2A38] mb-4">Anomaly Detection</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sensitivity</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Alert Threshold</span>
                <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                  <option>±10%</option>
                  <option>±15%</option>
                  <option>±20%</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real-time monitoring</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B5CF6]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B5CF6]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Prediction Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Revenue Forecast Model">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Model Accuracy</span>
              <span className="text-lg font-bold text-[#4ADE80]">87%</span>
            </div>
            
            <div className="relative h-48">
              <svg className="w-full h-full">
                {/* Actual data line */}
                <polyline
                  fill="none"
                  stroke="#3AB7BF"
                  strokeWidth="3"
                  points="30,140 90,130 150,120 210,110 270,100 330,90"
                />
                {/* Predicted data line */}
                <polyline
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  points="330,90 390,80 450,70 510,60 570,50"
                />
                {/* Confidence band */}
                <polygon
                  fill="#8B5CF6"
                  fillOpacity="0.1"
                  points="390,70 450,60 510,50 570,40 570,60 510,70 450,80 390,90"
                />
              </svg>
            </div>
            
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#3AB7BF] rounded mr-2"></div>
                <span className="text-gray-600">Historical</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-0.5 bg-[#8B5CF6] mr-2" style={{ borderTop: '3px dashed #8B5CF6' }}></div>
                <span className="text-gray-600">Predicted</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#8B5CF6] opacity-20 rounded mr-2"></div>
                <span className="text-gray-600">Confidence Band</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Feature Importance">
          <div className="space-y-3">
            {[
              { feature: 'Historical Revenue Trends', importance: 92 },
              { feature: 'Seasonal Patterns', importance: 78 },
              { feature: 'Market Conditions', importance: 65 },
              { feature: 'Customer Acquisition Rate', importance: 58 },
              { feature: 'Product Launch Timeline', importance: 45 },
              { feature: 'Competitive Activity', importance: 32 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.feature}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#8B5CF6] h-2 rounded-full" 
                      style={{ width: `${item.importance}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8">{item.importance}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;