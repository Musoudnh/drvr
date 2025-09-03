// Centralized API service layer for external integrations
import { User, FinancialData } from '../types';

interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

interface IntegrationConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

class APIService {
  private integrations: Map<string, IntegrationConfig> = new Map();

  // Integration management
  addIntegration(name: string, config: IntegrationConfig) {
    this.integrations.set(name, config);
  }

  removeIntegration(name: string) {
    this.integrations.delete(name);
  }

  // Generic API call wrapper
  private async makeRequest<T>(
    integration: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const config = this.integrations.get(integration);
    if (!config) {
      throw new Error(`Integration ${integration} not configured`);
    }

    try {
      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: AbortSignal.timeout(config.timeout),
      });

      const data = await response.json();
      
      return {
        data,
        success: response.ok,
        message: data.message,
        errors: data.errors
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // QuickBooks integration
  async syncQuickBooksData(): Promise<APIResponse<FinancialData[]>> {
    return this.makeRequest<FinancialData[]>('quickbooks', '/v3/company/financials');
  }

  async getQuickBooksTransactions(startDate: string, endDate: string): Promise<APIResponse<any[]>> {
    return this.makeRequest<any[]>('quickbooks', `/v3/company/transactions?start=${startDate}&end=${endDate}`);
  }

  // Stripe integration
  async syncStripeData(): Promise<APIResponse<any>> {
    return this.makeRequest<any>('stripe', '/v1/charges');
  }

  async getStripeRevenue(period: string): Promise<APIResponse<any>> {
    return this.makeRequest<any>('stripe', `/v1/revenue?period=${period}`);
  }

  // Slack integration
  async sendSlackNotification(channel: string, message: string): Promise<APIResponse<any>> {
    return this.makeRequest<any>('slack', '/api/chat.postMessage', {
      method: 'POST',
      body: JSON.stringify({ channel, text: message })
    });
  }

  // HubSpot integration
  async syncHubSpotContacts(): Promise<APIResponse<any[]>> {
    return this.makeRequest<any[]>('hubspot', '/crm/v3/objects/contacts');
  }

  async getHubSpotDeals(): Promise<APIResponse<any[]>> {
    return this.makeRequest<any[]>('hubspot', '/crm/v3/objects/deals');
  }

  // Generic data sync
  async syncAllIntegrations(): Promise<{ [key: string]: APIResponse<any> }> {
    const results: { [key: string]: APIResponse<any> } = {};
    
    for (const [name] of this.integrations) {
      try {
        switch (name) {
          case 'quickbooks':
            results[name] = await this.syncQuickBooksData();
            break;
          case 'stripe':
            results[name] = await this.syncStripeData();
            break;
          case 'hubspot':
            results[name] = await this.syncHubSpotContacts();
            break;
          default:
            results[name] = { data: null, success: false, message: 'Sync not implemented' };
        }
      } catch (error) {
        results[name] = { 
          data: null, 
          success: false, 
          message: error instanceof Error ? error.message : 'Sync failed' 
        };
      }
    }
    
    return results;
  }

  // Health check for integrations
  async checkIntegrationHealth(integration: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<any>(integration, '/health');
      return response.success;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Initialize common integrations (would be configured from environment variables)
apiService.addIntegration('quickbooks', {
  baseUrl: process.env.REACT_APP_QUICKBOOKS_API_URL || 'https://api.quickbooks.com',
  apiKey: process.env.REACT_APP_QUICKBOOKS_API_KEY || '',
  timeout: 30000
});

apiService.addIntegration('stripe', {
  baseUrl: process.env.REACT_APP_STRIPE_API_URL || 'https://api.stripe.com',
  apiKey: process.env.REACT_APP_STRIPE_API_KEY || '',
  timeout: 30000
});

apiService.addIntegration('slack', {
  baseUrl: process.env.REACT_APP_SLACK_API_URL || 'https://slack.com',
  apiKey: process.env.REACT_APP_SLACK_API_KEY || '',
  timeout: 15000
});

apiService.addIntegration('hubspot', {
  baseUrl: process.env.REACT_APP_HUBSPOT_API_URL || 'https://api.hubapi.com',
  apiKey: process.env.REACT_APP_HUBSPOT_API_KEY || '',
  timeout: 30000
});

export default APIService;