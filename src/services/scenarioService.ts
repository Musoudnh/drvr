import { supabase } from './supabaseClient';
import type {
  Scenario,
  ScenarioTemplate,
  ScenarioVersion,
  ScenarioComparison,
  MonteCarloSimulation
} from '../types/financial';

export class ScenarioService {
  static async getScenarioTemplates(category?: string): Promise<ScenarioTemplate[]> {
    let query = supabase
      .from('scenario_templates')
      .select('*')
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getScenarios(organizationId: string, status?: string): Promise<Scenario[]> {
    let query = supabase
      .from('scenarios')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getScenarioById(id: string): Promise<Scenario | null> {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async createScenario(
    scenario: Omit<Scenario, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Scenario> {
    const { data, error } = await supabase
      .from('scenarios')
      .insert(scenario)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateScenario(
    id: string,
    updates: Partial<Scenario>
  ): Promise<Scenario> {
    const { data, error } = await supabase
      .from('scenarios')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteScenario(id: string): Promise<void> {
    const { error } = await supabase
      .from('scenarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getScenarioVersions(scenarioId: string): Promise<ScenarioVersion[]> {
    const { data, error } = await supabase
      .from('scenario_versions')
      .select('*')
      .eq('scenario_id', scenarioId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createScenarioVersion(
    version: Omit<ScenarioVersion, 'id' | 'created_at'>
  ): Promise<ScenarioVersion> {
    const { data, error } = await supabase
      .from('scenario_versions')
      .insert(version)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async compareScenarios(
    organizationId: string,
    scenarioIds: string[],
    metrics: string[]
  ): Promise<ScenarioComparison> {
    const scenarios = await Promise.all(
      scenarioIds.map(id => this.getScenarioById(id))
    );

    const comparisonResults = metrics.map(metric => {
      const scenarioValues: Record<string, number> = {};
      const varianceAnalysis: Record<string, number> = {};

      scenarios.forEach((scenario) => {
        if (scenario && scenario.results) {
          scenarioValues[scenario.id] = scenario.results[metric as keyof typeof scenario.results] || 0;
        }
      });

      const baseline = Object.values(scenarioValues)[0] || 0;
      Object.keys(scenarioValues).forEach((scenarioId) => {
        varianceAnalysis[scenarioId] = baseline !== 0
          ? ((scenarioValues[scenarioId] - baseline) / baseline) * 100
          : 0;
      });

      return {
        metric_name: metric,
        scenario_values: scenarioValues,
        variance_analysis: varianceAnalysis
      };
    });

    const comparison: Omit<ScenarioComparison, 'id' | 'created_at'> = {
      organization_id: organizationId,
      comparison_name: `Scenario Comparison - ${new Date().toLocaleDateString()}`,
      scenario_ids: scenarioIds,
      metrics_compared: metrics,
      comparison_results: comparisonResults,
      created_by: undefined
    };

    const { data, error } = await supabase
      .from('scenario_comparisons')
      .insert(comparison)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getScenarioComparisons(organizationId: string): Promise<ScenarioComparison[]> {
    const { data, error } = await supabase
      .from('scenario_comparisons')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async runMonteCarloSimulation(
    scenarioId: string,
    iterations: number,
    variables: any[]
  ): Promise<MonteCarloSimulation> {
    const results: number[] = [];

    for (let i = 0; i < iterations; i++) {
      let value = 0;
      variables.forEach((variable) => {
        if (variable.distribution === 'normal') {
          value += this.generateNormalRandom(
            variable.parameters.mean,
            variable.parameters.std_dev
          );
        } else if (variable.distribution === 'uniform') {
          value += this.generateUniformRandom(
            variable.parameters.min,
            variable.parameters.max
          );
        }
      });
      results.push(value);
    }

    results.sort((a, b) => a - b);

    const mean = results.reduce((sum, val) => sum + val, 0) / results.length;
    const median = results[Math.floor(results.length / 2)];
    const stdDev = Math.sqrt(
      results.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / results.length
    );

    const percentileResults = {
      p10: results[Math.floor(results.length * 0.1)],
      p25: results[Math.floor(results.length * 0.25)],
      p50: median,
      p75: results[Math.floor(results.length * 0.75)],
      p90: results[Math.floor(results.length * 0.9)],
      p95: results[Math.floor(results.length * 0.95)],
      p99: results[Math.floor(results.length * 0.99)]
    };

    const simulation: Omit<MonteCarloSimulation, 'id' | 'created_at'> = {
      scenario_id: scenarioId,
      simulation_date: new Date().toISOString(),
      iterations,
      variables,
      results: {
        mean,
        median,
        std_dev: stdDev,
        min: results[0],
        max: results[results.length - 1],
        distribution_data: results
      },
      percentile_results: percentileResults,
      risk_metrics: {
        probability_of_loss: results.filter(r => r < 0).length / results.length,
        value_at_risk: percentileResults.p5 || 0,
        expected_shortfall: results
          .filter(r => r < percentileResults.p5)
          .reduce((sum, val) => sum + val, 0) / results.filter(r => r < percentileResults.p5).length || 0
      }
    };

    const { data, error } = await supabase
      .from('monte_carlo_simulations')
      .insert(simulation)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private static generateNormalRandom(mean: number, stdDev: number): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }

  private static generateUniformRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
