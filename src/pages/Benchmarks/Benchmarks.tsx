import React from 'react';
import { BarChart3, TrendingUp, Award, Target, Users, DollarSign } from 'lucide-react';
import Card from '../../components/UI/Card';

const Benchmarks: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1E2A38]">Industry Benchmarks</h2>
        <p className="text-gray-600 mt-1">Compare your performance against industry standards</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Score</p>
              <p className="text-2xl font-bold text-[#4ADE80] mt-1">8.7/10</p>
              <p className="text-sm text-[#4ADE80] mt-1">Above average</p>
            </div>
            <Award className="w-8 h-8 text-[#4ADE80]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Industry Rank</p>
              <p className="text-2xl font-bold text-[#3AB7BF] mt-1">#12</p>
              <p className="text-sm text-gray-600 mt-1">Out of 500</p>
            </div>
            <Target className="w-8 h-8 text-[#3AB7BF]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peer Group</p>
              <p className="text-2xl font-bold text-[#F59E0B] mt-1">Top 25%</p>
              <p className="text-sm text-gray-600 mt-1">Similar companies</p>
            </div>
            <Users className="w-8 h-8 text-[#F59E0B]" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-[#8B5CF6] mt-1">15.4%</p>
              <p className="text-sm text-gray-600 mt-1">vs 12.1% avg</p>
            </div>
            <TrendingUp className="w-8 h-8 text-[#8B5CF6]" />
          </div>
        </Card>
      </div>

      {/* Benchmark Comparisons */}
      <Card title="Revenue Distribution Analysis">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-[#1E2A38] mb-2">Industry Revenue Distribution</h3>
            <p className="text-sm text-gray-600">See where your business stands in the revenue distribution curve</p>
          </div>
          
          {/* Bell Curve Visualization */}
          <div>
            <p className="text-xs text-gray-500 mt-1">Well above industry norm</p>
          </div>
          
          {/* Key Insights */}
          <div className="bg-gradient-to-r from-[#3AB7BF]/10 to-[#4ADE80]/10 rounded-lg p-4 border border-[#3AB7BF]/20">
            <h4 className="font-semibold text-[#1E2A38] mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-[#3AB7BF]" />
              Performance Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#4ADE80] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Your revenue significantly outperforms the industry median by $2M annually</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#3AB7BF] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Positioned in the top quartile with strong competitive advantage</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#F59E0B] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Growth trajectory suggests potential to reach 85th percentile</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                <span className="text-gray-700">Revenue stability indicates sustainable business model</span>
              </div>
            </div>
          </div>
        </div>
      </Card>


      {/* Industry Insights */}
      <Card title="Industry Insights">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-[#4ADE80]/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-[#4ADE80] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Growth Opportunity</h3>
            <p className="text-sm text-gray-600">Your growth rate exceeds industry average by 3.3%</p>
          </div>
          <div className="text-center p-4 bg-[#3AB7BF]/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-[#3AB7BF] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Profit Excellence</h3>
            <p className="text-sm text-gray-600">Profit margins 4.2% above industry benchmark</p>
          </div>
          <div className="text-center p-4 bg-[#F59E0B]/10 rounded-lg">
            <Target className="w-8 h-8 text-[#F59E0B] mx-auto mb-3" />
            <h3 className="font-semibold text-[#1E2A38] mb-2">Market Position</h3>
            <p className="text-sm text-gray-600">Strong competitive position in top quartile</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Benchmarks;