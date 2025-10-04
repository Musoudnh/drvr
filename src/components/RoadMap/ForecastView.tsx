import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Filter } from 'lucide-react';
import type { RoadmapProject, ProjectScenario } from '../../types/roadmap';

interface ForecastViewProps {
  projects: RoadmapProject[];
}

const ForecastView: React.FC<ForecastViewProps> = ({ projects }) => {
  const [scenarioFilter, setScenarioFilter] = useState<ProjectScenario | 'All'>('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('All Time');

  const filteredProjects = projects.filter(project => {
    const matchesScenario = scenarioFilter === 'All' || project.scenario === scenarioFilter;
    const matchesDepartment = departmentFilter === 'All' || project.department === departmentFilter;
    return matchesScenario && matchesDepartment;
  });

  const departments = ['All', ...Array.from(new Set(projects.map(p => p.department).filter(Boolean)))];

  const totalBudget = filteredProjects.reduce((sum, p) => sum + p.budget_total, 0);
  const totalActual = filteredProjects.reduce((sum, p) => sum + p.actual_total, 0);
  const variance = totalBudget - totalActual;
  const variancePercent = totalBudget > 0 ? (variance / totalBudget) * 100 : 0;

  const projectsByDepartment = filteredProjects.reduce((acc, project) => {
    const dept = project.department || 'Unassigned';
    if (!acc[dept]) {
      acc[dept] = { budget: 0, actual: 0, count: 0 };
    }
    acc[dept].budget += project.budget_total;
    acc[dept].actual += project.actual_total;
    acc[dept].count += 1;
    return acc;
  }, {} as Record<string, { budget: number; actual: number; count: number }>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <select
          value={scenarioFilter}
          onChange={(e) => setScenarioFilter(e.target.value as ProjectScenario | 'All')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
        >
          <option value="All">All Scenarios</option>
          <option value="Base Case">Base Case</option>
          <option value="Best Case">Best Case</option>
          <option value="Downside Case">Downside Case</option>
        </select>
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
        >
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7B68EE] focus:border-transparent"
        >
          <option value="All Time">All Time</option>
          <option value="This Quarter">This Quarter</option>
          <option value="This Year">This Year</option>
          <option value="Next Quarter">Next Quarter</option>
          <option value="Next Year">Next Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Budget</p>
          <p className="text-2xl font-bold text-[#101010]">${totalBudget.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredProjects.length} projects</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Actual</p>
          <p className="text-2xl font-bold text-[#101010]">${totalActual.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Spent to date</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Variance</p>
          <p className={`text-2xl font-bold ${variance >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
            ${Math.abs(variance).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {variance >= 0 ? 'Under budget' : 'Over budget'}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Variance %</p>
          <p className={`text-2xl font-bold ${variancePercent >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
            {Math.abs(variancePercent).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Of total budget</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#101010] mb-4">Budget by Department</h3>
        <div className="space-y-4">
          {Object.entries(projectsByDepartment).map(([dept, data]) => {
            const deptVariance = data.budget - data.actual;
            const deptVariancePercent = data.budget > 0 ? (deptVariance / data.budget) * 100 : 0;
            const progressPercent = data.budget > 0 ? (data.actual / data.budget) * 100 : 0;

            return (
              <div key={dept} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#101010]">{dept}</p>
                    <p className="text-sm text-gray-600">{data.count} projects</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#101010]">
                      ${data.actual.toLocaleString()} / ${data.budget.toLocaleString()}
                    </p>
                    <p className={`text-sm ${deptVariancePercent >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                      {deptVariancePercent >= 0 ? '+' : ''}{deptVariancePercent.toFixed(1)}% variance
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      progressPercent > 100 ? 'bg-[#F87171]' : 'bg-[#7B68EE]'
                    }`}
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#101010] mb-4">Project Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Project</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Scenario</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Budget</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actual</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => {
                const variance = project.budget_total - project.actual_total;
                return (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-[#101010]">{project.header}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{project.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{project.scenario}</td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      ${project.budget_total.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-right text-gray-600">
                      ${project.actual_total.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-medium ${
                      variance >= 0 ? 'text-[#4ADE80]' : 'text-[#F87171]'
                    }`}>
                      {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ForecastView;
