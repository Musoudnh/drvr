import React, { useState } from 'react';
import { Target, TrendingUp, BarChart3, Brain, Calendar, Settings, Play, Pause, RefreshCw, Download, Eye, Plus, X, Database } from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface ForecastModel {
  id: string;
  name: string;
  type: 'revenue' | 'expenses' | 'cash_flow' | 'headcount';
  algorithm: 'linear_regression' | 'arima' | 'neural_network' | 'ensemble';
  accuracy: number;
  lastTrained: Date;
  isActive: boolean;
  predictions: ForecastPrediction[];
}

interface ForecastPrediction {
  period: string;
  predicted: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
}

interface SeasonalPattern {
  month: string;
  factor: number;
  confidence: number;
}

const Forecasting: React.FC = () => {
  const [forecastModels, setForecastModels] = useState<ForecastModel[]>([
    {
      id: '1',
      name: 'Revenue Forecast Model',
      type: 'revenue',
      algorithm: 'neural_network',
      accuracy: 87.3,
      lastTrained: new Date(Date.now() - 86400000),
      isActive: true,
      predictions: [
        { period: 'Feb 2025', predicted: 465000, confidence: 87, lowerBound: 420000, upperBound: 510000 },
        { period: 'Mar 2025', predicted: 485000, confidence: 84, lowerBound: 435000, upperBound: 535000 },
        { period: 'Apr 2025', predicted: 505000, confidence: 81, lowerBound: 450000, upperBound: 560000 },
        { period: 'May 2025', predicted: 525000, confidence: 78, lowerBound: 465000, upperBound: 585000 }
      ]
    },
    {
      id: '2',
      name: 'Expense Forecast Model',
      type: 'expenses',
      algorithm: 'arima',
      accuracy: 92.1,
      lastTrained: new Date(Date.now() - 172800000),
      isActive: true,
      predictions: [
        { period: 'Feb 2025', predicted: 295000, confidence: 92, lowerBound: 280000, upperBound: 310000 },
        { period: 'Mar 2025', predicted: 305000, confidence: 90, lowerBound: 290000, upperBound: 320000 },
        { period: 'Apr 2025', predicted: 315000, confidence: 88, lowerBound: 300000, upperBound: 330000 },
        { period: 'May 2025', predicted: 325000, confidence: 86, lowerBound: 310000, upperBound: 340000 }
      ]
    },
    {
      id: '3',
      name: 'Cash Flow Forecast',
      type: 'cash_flow',
      algorithm: 'ensemble',
      accuracy: 89.7,
      lastTrained: new Date(Date.now() - 259200000),
      isActive: false,
      predictions: [
        { period: 'Feb 2025', predicted: 170000, confidence: 89, lowerBound: 150000, upperBound: 190000 },
        { period: 'Mar 2025', predicted: 180000, confidence: 87, lowerBound: 160000, upperBound: 200000 },
        { period: 'Apr 2025', predicted: 190000, confidence: 85, lowerBound: 170000, upperBound: 210000 },
        { period: 'May 2025', predicted: 200000, confidence: 83, lowerBound: 180000, upperBound: 220000 }
      ]
    }
  ]);

  const [seasonalPatterns] = useState<SeasonalPattern[]>([
    { month: 'Jan', factor: 0.95, confidence: 92 },
    { month: 'Feb', factor: 0.98, confidence: 89 },
    { month: 'Mar', factor: 1.05, confidence: 94 },
    { month: 'Apr', factor: 1.08, confidence: 91 },
    { month: 'May', factor: 1.12, confidence: 88 },
    { month: 'Jun', factor: 1.15, confidence: 85 },
    { month: 'Jul', factor: 1.18, confidence: 87 },
    { month: 'Aug', factor: 1.10, confidence: 90 },
    { month: 'Sep', factor: 1.06, confidence: 93 },
    { month: 'Oct', factor: 1.02, confidence: 95 },
    { month: 'Nov', factor: 0.92, confidence: 88 },
    { month: 'Dec', factor: 0.88, confidence: 86 }
  ]);

  const [selectedModel, setSelectedModel] = useState<ForecastModel | null>(forecastModels[0]);
  const [showModelConfig, setShowModelConfig] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);

  const getModelTypeColor = (type: string) => {
    switch (type) {
      case 'revenue': return '#4ADE80';
      case 'expenses': return '#F87171';
      case 'cash_flow': return '#3AB7BF';
      case 'headcount': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getAlgorithmName = (algorithm: string) => {
    switch (algorithm) {
      case 'linear_regression': return 'Linear Regression';
      case 'arima': return 'ARIMA';
      case 'neural_network': return 'Neural Network';
      case 'ensemble': return 'Ensemble';
      default: return algorithm;
    }
  };

  const handleRetrainModel = (modelId: string) => {
    setIsRetraining(true);
    setForecastModels(prev => prev.map(model =>
      model.id === modelId
        ? { ...model, lastTrained: new Date(), accuracy: model.accuracy + Math.random() * 2 - 1 }
        : model
    ));
    
    setTimeout(() => {
      setIsRetraining(false);
    }, 3000);
  };

  const toggleModelStatus = (modelId: string) => {
    setForecastModels(prev => prev.map(model =>
      model.id === modelId
        ? { ...model, isActive: !model.isActive }
        : model
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1E2A38]">AI Forecasting</h2>
          <p className="text-gray-600 mt-1">Advanced predictive modeling and forecasting</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Model Settings
          </Button>
          <Button 
            variant="primary" 
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]"
            onClick={() => setShowModelConfig(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Model
          </Button>
        </div>
      </div>

      {/* Forecast Models */}
      <Card title="Forecast Models">
        <div className="space-y-4">
          {forecastModels.map(model => (
            <div key={model.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#8B5CF6] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${getModelTypeColor(model.type)}20` }}
                  >
                    <Brain className="w-5 h-5" style={{ color: getModelTypeColor(model.type) }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1E2A38]">{model.name}</h3>
                    <p className="text-sm text-gray-600">{getAlgorithmName(model.algorithm)} • {model.accuracy}% accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.isActive ? 'bg-[#4ADE80]/20 text-[#4ADE80]' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {model.isActive ? 'Active' : 'Inactive'}
                  </span>
                  
                  <button
                    onClick={() => toggleModelStatus(model.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={model.isActive ? 'Pause model' : 'Activate model'}
                  >
                    {model.isActive ? (
                      <Pause className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Play className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleRetrainModel(model.id)}
                    disabled={isRetraining}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Retrain model"
                  >
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${isRetraining ? 'animate-spin' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => setSelectedModel(model)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-medium" style={{ color: getModelTypeColor(model.type) }}>
                    {model.type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Algorithm</p>
                  <p className="font-medium text-[#1E2A38]">{getAlgorithmName(model.algorithm)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Trained</p>
                  <p className="font-medium text-[#1E2A38]">{model.lastTrained.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Predictions</p>
                  <p className="font-medium text-[#1E2A38]">{model.predictions.length} periods</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Model Details */}
      {selectedModel && (
        <Card title={`${selectedModel.name} - Predictions`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                  style={{ backgroundColor: `${getModelTypeColor(selectedModel.type)}20` }}
                >
                  <Brain className="w-4 h-4" style={{ color: getModelTypeColor(selectedModel.type) }} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E2A38]">{selectedModel.name}</h3>
                  <p className="text-sm text-gray-600">Accuracy: {selectedModel.accuracy}% • {getAlgorithmName(selectedModel.algorithm)}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Forecast
              </Button>
            </div>

            {/* Prediction Chart */}
            <div className="relative h-64 bg-gray-50 rounded-lg p-4">
              <svg className="w-full h-full">
                {/* Confidence band */}
                <polygon
                  fill={getModelTypeColor(selectedModel.type)}
                  fillOpacity="0.1"
                  points={selectedModel.predictions.map((pred, index) => {
                    const x = 50 + index * 150;
                    const yUpper = 180 - (pred.upperBound - 400000) / 5000;
                    return `${x},${Math.max(20, Math.min(180, yUpper))}`;
                  }).concat(
                    selectedModel.predictions.slice().reverse().map((pred, index) => {
                      const x = 50 + (selectedModel.predictions.length - 1 - index) * 150;
                      const yLower = 180 - (pred.lowerBound - 400000) / 5000;
                      return `${x},${Math.max(20, Math.min(180, yLower))}`;
                    })
                  ).join(' ')}
                />
                
                {/* Prediction line */}
                <polyline
                  fill="none"
                  stroke={getModelTypeColor(selectedModel.type)}
                  strokeWidth="3"
                  points={selectedModel.predictions.map((pred, index) => {
                    const x = 50 + index * 150;
                    const y = 180 - (pred.predicted - 400000) / 5000;
                    return `${x},${Math.max(20, Math.min(180, y))}`;
                  }).join(' ')}
                />
                
                {/* Data points */}
                {selectedModel.predictions.map((pred, index) => {
                  const x = 50 + index * 150;
                  const y = 180 - (pred.predicted - 400000) / 5000;
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={Math.max(20, Math.min(180, y))}
                      r="5"
                      fill={getModelTypeColor(selectedModel.type)}
                    />
                  );
                })}
              </svg>
              
              {/* Period labels */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {selectedModel.predictions.map((pred, index) => (
                  <span key={index} className="flex-1 text-center">{pred.period}</span>
                ))}
              </div>
            </div>

            {/* Prediction Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Prediction</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Confidence</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Lower Bound</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Upper Bound</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedModel.predictions.map((prediction, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-[#1E2A38]">{prediction.period}</td>
                      <td className="py-3 px-4 text-right font-bold" style={{ color: getModelTypeColor(selectedModel.type) }}>
                        ${prediction.predicted.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[#1E2A38]">{prediction.confidence}%</td>
                      <td className="py-3 px-4 text-right text-gray-600">${prediction.lowerBound.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-gray-600">${prediction.upperBound.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Seasonal Analysis */}
      <Card title="Seasonal Pattern Analysis">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Monthly Seasonal Factors</span>
            <span className="text-sm text-[#8B5CF6] font-medium">Based on 3-year historical data</span>
          </div>
          
          <div className="grid grid-cols-12 gap-2">
            {seasonalPatterns.map((pattern, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-full rounded-lg mb-2 flex items-end justify-center text-white text-xs font-medium"
                  style={{ 
                    height: `${40 + pattern.factor * 60}px`,
                    backgroundColor: pattern.factor > 1 ? '#4ADE80' : '#F87171'
                  }}
                >
                  {(pattern.factor * 100).toFixed(0)}%
                </div>
                <span className="text-xs text-gray-600">{pattern.month}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#4ADE80] rounded mr-2"></div>
              <span className="text-sm text-gray-600">Above Average</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#F87171] rounded mr-2"></div>
              <span className="text-sm text-gray-600">Below Average</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Model Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Model Performance">
          <div className="space-y-4">
            {forecastModels.map(model => (
              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${getModelTypeColor(model.type)}20` }}
                  >
                    <Brain className="w-4 h-4" style={{ color: getModelTypeColor(model.type) }} />
                  </div>
                  <div>
                    <p className="font-medium text-[#1E2A38]">{model.name}</p>
                    <p className="text-sm text-gray-600">{getAlgorithmName(model.algorithm)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#8B5CF6]">{model.accuracy}%</p>
                  <p className="text-xs text-gray-500">accuracy</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Forecast Accuracy Trends">
          <div className="space-y-4">
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
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <p className="font-bold text-[#8B5CF6]">87.3%</p>
                <p className="text-gray-600">Current</p>
              </div>
              <div>
                <p className="font-bold text-[#4ADE80]">+2.1%</p>
                <p className="text-gray-600">vs Last Month</p>
              </div>
              <div>
                <p className="font-bold text-[#3AB7BF]">89.1%</p>
                <p className="text-gray-600">Target</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Model Configuration Modal */}
      {showModelConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1E2A38]">Create Forecast Model</h3>
              <button
                onClick={() => setShowModelConfig(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Model Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  placeholder="e.g., Q2 Revenue Forecast"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent">
                    <option value="revenue">Revenue</option>
                    <option value="expenses">Expenses</option>
                    <option value="cash_flow">Cash Flow</option>
                    <option value="headcount">Headcount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Algorithm</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent">
                    <option value="neural_network">Neural Network</option>
                    <option value="arima">ARIMA</option>
                    <option value="linear_regression">Linear Regression</option>
                    <option value="ensemble">Ensemble</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Training Period</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent">
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Horizon</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent">
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModelConfig(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModelConfig(false)}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
              >
                Create Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecasting;