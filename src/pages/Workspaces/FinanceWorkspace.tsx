import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Target, Award, FileText, PieChart, LineChart, Calculator } from 'lucide-react';
import Card from '../../components/UI/Card';

const FinanceWorkspace: React.FC = () => {
  const financeModules = [
    {
      title: 'Financial Reports',
      description: 'P&L, Balance Sheet, Cash Flow statements with AI insights',
      icon: FileText,
      path: '/reports/financial',
      color: '#4ADE80',
      features: ['Interactive P&L', 'Balance Sheet', 'Cash Flow', 'AI Commentary']
    },
    {
      title: 'Forecasting',
      description: 'AI-powered predictive modeling and forecasting',
      icon: Target,
      path: '/forecasting',
      color: '#3AB7BF',
      features: ['Neural Networks', 'ARIMA Models', 'Seasonal Analysis', 'External Data']
    },
    {
      title: 'Scenario Planning',
      description: 'Create and compare multiple financial scenarios',
      icon: LineChart,
      path: '/scenario-planning',
      color: '#8B5CF6',
      features: ['What-if Analysis', 'Risk Assessment', 'Sensitivity Analysis', 'Monte Carlo']
    },
    {
      title: 'Runway Planning',
      description: 'Revenue, OpEx, and hiring runway optimization',
      icon: TrendingUp,
      path: '/runway',
      color: '#F59E0B',
      features: ['Revenue Drivers', 'OpEx Planning', 'Hiring Timeline', 'Burn Rate']
    },
    {
      title: 'Benchmarks',
      description: 'Industry benchmarks and competitive intelligence',
      icon: Award,
      path: '/benchmarks',
      color: '#EC4899',
      features: ['Peer Comparison', 'Industry Metrics', 'AI Insights', 'Competitive Intel']
    },
    {
      title: 'Analytics',
      description: 'Advanced analytics with correlation and cohort analysis',
      icon: BarChart3,
      path: '/analytics',
      color: '#10B981',
      features: ['Correlation Analysis', 'Cohort Analysis', 'Root Cause', 'Prescriptive AI']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E2A38] mb-4">Finance Workspace</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive financial management with AI-powered insights, forecasting, and strategic planning tools.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Calculator className="w-6 h-6 text-[#4ADE80]" />
            </div>
            <p className="text-2xl font-bold text-[#4ADE80]">$2.4M</p>
            <p className="text-sm text-gray-600">Monthly Revenue</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#3AB7BF]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-[#3AB7BF]" />
            </div>
            <p className="text-2xl font-bold text-[#3AB7BF]">15.4%</p>
            <p className="text-sm text-gray-600">Growth Rate</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-bold text-[#F59E0B]">18.5</p>
            <p className="text-sm text-gray-600">Months Runway</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <p className="text-2xl font-bold text-[#8B5CF6]">Top 25%</p>
            <p className="text-sm text-gray-600">Industry Rank</p>
          </div>
        </Card>
      </div>

      {/* Finance Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financeModules.map((module, index) => (
          <Link key={index} to={module.path}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-opacity-30 cursor-pointer" style={{ borderColor: `${module.color}20` }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${module.color}15` }}
                  >
                    <module.icon className="w-6 h-6" style={{ color: module.color }} />
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${module.color}20`,
                      color: module.color
                    }}
                  >
                    Active
                  </span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-[#1E2A38] mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{module.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-[#1E2A38] text-sm">Key Features:</h4>
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
          </Link>
        ))}
      </div>

      {/* AI Insights Panel */}
      <Card title="AI Finance Insights">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-[#4ADE80]/10 rounded-lg border border-[#4ADE80]/20">
              <h4 className="font-semibold text-[#1E2A38] mb-2">Revenue Opportunity</h4>
              <p className="text-sm text-gray-700">AI analysis suggests Q2 revenue could increase by 18% with optimized pricing strategy.</p>
            </div>
            
            <div className="p-4 bg-[#F59E0B]/10 rounded-lg border border-[#F59E0B]/20">
              <h4 className="font-semibold text-[#1E2A38] mb-2">Cost Optimization</h4>
              <p className="text-sm text-gray-700">Identified $45K monthly savings through vendor consolidation and automation.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#3AB7BF]/10 rounded-lg border border-[#3AB7BF]/20">
              <h4 className="font-semibold text-[#1E2A38] mb-2">Cash Flow Alert</h4>
              <p className="text-sm text-gray-700">Predictive model indicates potential cash shortage in 45 days with 87% confidence.</p>
            </div>
            
            <div className="p-4 bg-[#8B5CF6]/10 rounded-lg border border-[#8B5CF6]/20">
              <h4 className="font-semibold text-[#1E2A38] mb-2">Hiring Impact</h4>
              <p className="text-sm text-gray-700">Delaying 2 hires by 1 month would extend runway to 21.3 months.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinanceWorkspace;