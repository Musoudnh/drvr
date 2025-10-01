import React, { useState } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Percent,
  Users,
  Calendar,
  Award,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Info
} from 'lucide-react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface HealthMetric {
  id: string;
  category: string;
  name: string;
  score: number;
  weight: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  actionItems: string[];
  estimatedImprovement: number;
}

const FinancialHealth: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [healthMetrics] = useState<HealthMetric[]>([
    {
      id: '1',
      category: 'Liquidity',
      name: 'Current Ratio',
      score: 85,
      weight: 15,
      status: 'good',
      trend: 'up',
      recommendation: 'Strong liquidity position. Maintain current working capital management.'
    },
    {
      id: '2',
      category: 'Liquidity',
      name: 'Cash Runway',
      score: 92,
      weight: 20,
      status: 'excellent',
      trend: 'up',
      recommendation: '18+ months runway. Excellent position for growth investments.'
    },
    {
      id: '3',
      category: 'Profitability',
      name: 'Gross Margin',
      score: 78,
      weight: 15,
      status: 'good',
      trend: 'stable',
      recommendation: 'Healthy margins. Consider premium pricing strategies.'
    },
    {
      id: '4',
      category: 'Profitability',
      name: 'Operating Margin',
      score: 65,
      weight: 15,
      status: 'warning',
      trend: 'down',
      recommendation: 'Operating costs rising. Review expense efficiency.'
    },
    {
      id: '5',
      category: 'Growth',
      name: 'Revenue Growth',
      score: 88,
      weight: 20,
      status: 'excellent',
      trend: 'up',
      recommendation: 'Strong growth trajectory. Scale sales operations.'
    },
    {
      id: '6',
      category: 'Efficiency',
      name: 'Burn Multiple',
      score: 72,
      weight: 15,
      status: 'good',
      trend: 'stable',
      recommendation: 'Efficient capital deployment. Continue monitoring.'
    }
  ]);

  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      priority: 'high',
      category: 'Cost Optimization',
      title: 'Reduce Operating Expenses',
      description: 'Operating margin declining due to increased overhead costs. Immediate action needed.',
      impact: 'Improve operating margin by 8-12%',
      effort: '2-3 months',
      actionItems: [
        'Audit all recurring subscriptions and services',
        'Negotiate better rates with key vendors',
        'Implement cost approval workflow for expenses over $5K',
        'Review headcount planning and hiring freeze non-essential roles'
      ],
      estimatedImprovement: 10
    },
    {
      id: '2',
      priority: 'high',
      category: 'Revenue Growth',
      title: 'Accelerate Enterprise Sales',
      description: 'Strong momentum in enterprise segment. Double down on what\'s working.',
      impact: 'Increase annual recurring revenue by 25-30%',
      effort: '3-6 months',
      actionItems: [
        'Hire 2 additional enterprise sales reps',
        'Create dedicated customer success team for enterprise accounts',
        'Develop enterprise-specific feature roadmap',
        'Launch enterprise partner program'
      ],
      estimatedImprovement: 15
    },
    {
      id: '3',
      priority: 'medium',
      category: 'Cash Management',
      title: 'Optimize Working Capital',
      description: 'Improve cash conversion cycle and reduce days sales outstanding.',
      impact: 'Free up $150K-$200K in working capital',
      effort: '1-2 months',
      actionItems: [
        'Implement automated AR collections',
        'Offer early payment discounts (2/10 net 30)',
        'Review and optimize payment terms with customers',
        'Negotiate extended payment terms with vendors'
      ],
      estimatedImprovement: 8
    },
    {
      id: '4',
      priority: 'medium',
      category: 'Profitability',
      title: 'Improve Gross Margins',
      description: 'Opportunities to increase pricing and reduce cost of goods sold.',
      impact: 'Increase gross margin by 5-7 percentage points',
      effort: '2-4 months',
      actionItems: [
        'Implement 8% price increase for new customers',
        'Introduce premium tier with advanced features',
        'Optimize infrastructure costs through reserved instances',
        'Renegotiate with high-cost vendors'
      ],
      estimatedImprovement: 12
    }
  ]);

  const overallScore = Math.round(
    healthMetrics.reduce((sum, metric) => sum + (metric.score * metric.weight) / 100, 0)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4ADE80';
    if (score >= 60) return '#F59E0B';
    return '#F87171';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4ADE80';
      case 'good': return '#3AB7BF';
      case 'warning': return '#F59E0B';
      case 'critical': return '#F87171';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#F87171';
      case 'medium': return '#F59E0B';
      case 'low': return '#4ADE80';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#1E2A38]">Financial Health Score</h2>
          <p className="text-gray-600 mt-2">AI-powered analysis with actionable recommendations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#1E2A38]">Overall Health Score</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="current">Current Month</option>
              <option value="last">Last Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="#E5E7EB"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke={getScoreColor(overallScore)}
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${(overallScore / 100) * 628.318} 628.318`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-6xl font-bold" style={{ color: getScoreColor(overallScore) }}>
                  {overallScore}
                </p>
                <p className="text-gray-600 font-medium">out of 100</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-[#4ADE80] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#4ADE80]">
                {healthMetrics.filter(m => m.status === 'excellent' || m.status === 'good').length}
              </p>
              <p className="text-sm text-gray-600">Strong Metrics</p>
            </div>
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg text-center">
              <AlertTriangle className="w-8 h-8 text-[#F59E0B] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#F59E0B]">
                {healthMetrics.filter(m => m.status === 'warning' || m.status === 'critical').length}
              </p>
              <p className="text-sm text-gray-600">Needs Attention</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold text-[#1E2A38] mb-6">Score Breakdown</h3>
          <div className="space-y-4">
            {['Liquidity', 'Profitability', 'Growth', 'Efficiency'].map(category => {
              const categoryMetrics = healthMetrics.filter(m => m.category === category);
              const avgScore = Math.round(
                categoryMetrics.reduce((sum, m) => sum + m.score, 0) / categoryMetrics.length
              );
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#1E2A38]">{category}</span>
                    <span className="font-bold" style={{ color: getScoreColor(avgScore) }}>
                      {avgScore}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${avgScore}%`,
                        backgroundColor: getScoreColor(avgScore)
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title="Detailed Metrics">
        <div className="space-y-4">
          {healthMetrics.map(metric => {
            const TrendIcon = getTrendIcon(metric.trend);
            return (
              <div key={metric.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-[#1E2A38]">{metric.name}</h4>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {metric.category}
                      </span>
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${getStatusColor(metric.status)}20`,
                          color: getStatusColor(metric.status)
                        }}
                      >
                        {metric.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{metric.recommendation}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${metric.score}%`,
                          backgroundColor: getScoreColor(metric.score)
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendIcon
                        className="w-4 h-4"
                        style={{ color: metric.trend === 'up' ? '#4ADE80' : metric.trend === 'down' ? '#F87171' : '#6B7280' }}
                      />
                      <p className="text-3xl font-bold" style={{ color: getScoreColor(metric.score) }}>
                        {metric.score}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">Weight: {metric.weight}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="AI-Powered Recommendations">
        <div className="space-y-6">
          <div className="flex items-center gap-2 p-4 bg-[#8B5CF6]/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-[#8B5CF6]" />
            <p className="text-sm text-gray-700">
              Based on your financial data, we've identified {recommendations.length} opportunities to improve your health score by up to{' '}
              <span className="font-bold text-[#8B5CF6]">
                {Math.max(...recommendations.map(r => r.estimatedImprovement))} points
              </span>
            </p>
          </div>

          {recommendations.map(rec => (
            <div key={rec.id} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{
                          backgroundColor: `${getPriorityColor(rec.priority)}20`,
                          color: getPriorityColor(rec.priority)
                        }}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {rec.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-[#1E2A38] mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-700 mb-4">{rec.description}</p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-5 h-5 text-[#4ADE80]" />
                      <p className="text-2xl font-bold text-[#4ADE80]">+{rec.estimatedImprovement}</p>
                    </div>
                    <p className="text-xs text-gray-500">Score Improvement</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Expected Impact</p>
                    <p className="font-medium text-[#1E2A38]">{rec.impact}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Implementation Time</p>
                    <p className="font-medium text-[#1E2A38]">{rec.effort}</p>
                  </div>
                </div>

                <div>
                  <h5 className="font-bold text-[#1E2A38] mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-[#3AB7BF]" />
                    Action Plan
                  </h5>
                  <ul className="space-y-2">
                    {rec.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <ArrowRight className="w-4 h-4 text-[#3AB7BF] mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" size="sm">
                  <Info className="w-4 h-4 mr-2" />
                  Learn More
                </Button>
                <Button size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Start Implementation
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Historical Trend">
        <div className="h-64 flex items-center justify-center">
          <svg className="w-full h-full px-6">
            <polyline
              fill="none"
              stroke="#3AB7BF"
              strokeWidth="3"
              points="40,200 120,180 200,160 280,140 360,120 440,100 520,85 600,75"
            />
            {[200, 180, 160, 140, 120, 100, 85, 75].map((y, index) => (
              <circle key={index} cx={40 + index * 80} cy={y} r="4" fill="#3AB7BF" />
            ))}
            <line x1="40" y1="220" x2="600" y2="220" stroke="#E5E7EB" strokeWidth="2" />
          </svg>
        </div>
        <div className="flex justify-center gap-8 mt-4 text-sm text-gray-600">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, index) => (
            <span key={index}>{month}</span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FinancialHealth;
