import { supabase } from '../lib/supabase';
import type { ForecastVersion, ForecastLineItem, SaveForecastRequest } from '../types/forecast';

export const forecastService = {
  async saveForecast(request: SaveForecastRequest): Promise<ForecastVersion> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data: existingVersions } = await supabase
      .from('forecast_versions')
      .select('version_number')
      .eq('year', request.year)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersionNumber = existingVersions && existingVersions.length > 0
      ? existingVersions[0].version_number + 1
      : 1;

    const totalForecasted = request.lineItems.reduce(
      (sum, item) => sum + item.forecasted_amount,
      0
    );

    const { data: version, error: versionError } = await supabase
      .from('forecast_versions')
      .insert({
        version_number: nextVersionNumber,
        year: request.year,
        name: request.name,
        description: request.description,
        created_by: user.id,
        is_active: true,
        total_forecasted_amount: totalForecasted,
      })
      .select()
      .single();

    if (versionError) throw versionError;

    await supabase
      .from('forecast_versions')
      .update({ is_active: false })
      .eq('year', request.year)
      .neq('id', version.id);

    const lineItemsWithVersion = request.lineItems.map(item => ({
      ...item,
      version_id: version.id,
    }));

    const { error: lineItemsError } = await supabase
      .from('forecast_line_items')
      .insert(lineItemsWithVersion);

    if (lineItemsError) throw lineItemsError;

    return version;
  },

  async getVersionHistory(year: number): Promise<ForecastVersion[]> {
    const { data, error } = await supabase
      .from('forecast_versions')
      .select('*')
      .eq('year', year)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getVersionDetails(versionId: string): Promise<ForecastLineItem[]> {
    const { data, error } = await supabase
      .from('forecast_line_items')
      .select('*')
      .eq('version_id', versionId)
      .order('gl_code');

    if (error) throw error;
    return data || [];
  },

  async getActiveVersion(year: number): Promise<ForecastVersion | null> {
    const { data, error } = await supabase
      .from('forecast_versions')
      .select('*')
      .eq('year', year)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async setActiveVersion(versionId: string, year: number): Promise<void> {
    await supabase
      .from('forecast_versions')
      .update({ is_active: false })
      .eq('year', year);

    const { error } = await supabase
      .from('forecast_versions')
      .update({ is_active: true })
      .eq('id', versionId);

    if (error) throw error;
  },

  async compareVersions(versionId1: string, versionId2: string): Promise<{
    version1: ForecastLineItem[];
    version2: ForecastLineItem[];
  }> {
    const [items1, items2] = await Promise.all([
      this.getVersionDetails(versionId1),
      this.getVersionDetails(versionId2),
    ]);

    return {
      version1: items1,
      version2: items2,
    };
  },

  async deleteVersion(versionId: string): Promise<void> {
    const { error } = await supabase
      .from('forecast_versions')
      .delete()
      .eq('id', versionId);

    if (error) throw error;
  },
};
