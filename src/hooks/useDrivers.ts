import { useState, useCallback } from 'react';

export interface Driver {
  id: string;
  name: string;
  type: 'revenue' | 'opex' | 'hiring';
  impact: number;
  startMonth: string;
  endMonth: string;
  category: string;
  active: boolean;
  confidence?: number;
  description?: string;
  assumptions?: string[];
}

interface DriversState {
  revenue: Driver[];
  opex: Driver[];
  hiring: Driver[];
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<DriversState>({
    revenue: [
      {
        id: 'rev1',
        name: 'New Product Launch',
        type: 'revenue',
        impact: 45000,
        startMonth: 'Mar 2025',
        endMonth: 'Dec 2025',
        category: 'Product',
        active: true,
        confidence: 85,
        description: 'Enterprise tier product launch',
        assumptions: ['Market adoption rate: 15%', 'Pricing: $299/month', 'Target: 150 customers']
      },
      {
        id: 'rev2',
        name: 'Price Optimization',
        type: 'revenue',
        impact: 25000,
        startMonth: 'Feb 2025',
        endMonth: 'Dec 2025',
        category: 'Pricing',
        active: true,
        confidence: 78,
        description: 'Dynamic pricing implementation',
        assumptions: ['5-8% price increase', 'Minimal churn impact', 'Premium tier focus']
      }
    ],
    opex: [
      {
        id: 'opex1',
        name: 'Office Lease Renewal',
        type: 'opex',
        impact: 8000,
        startMonth: 'Mar 2025',
        endMonth: 'Dec 2025',
        category: 'Facilities',
        active: true,
        confidence: 95,
        description: 'Annual lease renewal with 8% increase'
      },
      {
        id: 'opex2',
        name: 'Software License Optimization',
        type: 'opex',
        impact: -12000,
        startMonth: 'Feb 2025',
        endMonth: 'Dec 2025',
        category: 'Technology',
        active: true,
        confidence: 82,
        description: 'Consolidation of redundant software licenses'
      }
    ],
    hiring: [
      {
        id: 'hire1',
        name: 'Engineering Team Expansion',
        type: 'hiring',
        impact: 95000,
        startMonth: 'Feb 2025',
        endMonth: 'Dec 2025',
        category: 'Engineering',
        active: true,
        confidence: 90,
        description: '3 senior engineers for product development'
      },
      {
        id: 'hire2',
        name: 'Sales Team Growth',
        type: 'hiring',
        impact: 75000,
        startMonth: 'Mar 2025',
        endMonth: 'Dec 2025',
        category: 'Sales',
        active: true,
        confidence: 85,
        description: '2 sales representatives for market expansion'
      }
    ]
  });

  const addDriver = useCallback((type: 'revenue' | 'opex' | 'hiring', driver: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driver,
      id: `${type}_${Date.now()}`,
      type
    };

    setDrivers(prev => ({
      ...prev,
      [type]: [...prev[type], newDriver]
    }));

    return newDriver.id;
  }, []);

  const updateDriver = useCallback((type: 'revenue' | 'opex' | 'hiring', driverId: string, updates: Partial<Driver>) => {
    setDrivers(prev => ({
      ...prev,
      [type]: prev[type].map(driver =>
        driver.id === driverId ? { ...driver, ...updates } : driver
      )
    }));
  }, []);

  const removeDriver = useCallback((type: 'revenue' | 'opex' | 'hiring', driverId: string) => {
    setDrivers(prev => ({
      ...prev,
      [type]: prev[type].filter(driver => driver.id !== driverId)
    }));
  }, []);

  const toggleDriver = useCallback((type: 'revenue' | 'opex' | 'hiring', driverId: string) => {
    setDrivers(prev => ({
      ...prev,
      [type]: prev[type].map(driver =>
        driver.id === driverId ? { ...driver, active: !driver.active } : driver
      )
    }));
  }, []);

  const getActiveDrivers = useCallback((type: 'revenue' | 'opex' | 'hiring') => {
    return drivers[type].filter(driver => driver.active);
  }, [drivers]);

  const calculateTotalImpact = useCallback((type: 'revenue' | 'opex' | 'hiring', month: string) => {
    return drivers[type]
      .filter(driver => driver.active)
      .filter(driver => {
        // Simple month comparison - in production, use proper date parsing
        const startIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          .indexOf(driver.startMonth.split(' ')[0]);
        const endIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          .indexOf(driver.endMonth.split(' ')[0]);
        const currentIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          .indexOf(month.split(' ')[0]);
        
        return currentIndex >= startIndex && currentIndex <= endIndex;
      })
      .reduce((total, driver) => total + driver.impact, 0);
  }, [drivers]);

  const getDriversByCategory = useCallback((type: 'revenue' | 'opex' | 'hiring', category: string) => {
    return drivers[type].filter(driver => driver.category === category);
  }, [drivers]);

  const duplicateDriver = useCallback((type: 'revenue' | 'opex' | 'hiring', driverId: string) => {
    const originalDriver = drivers[type].find(d => d.id === driverId);
    if (originalDriver) {
      const duplicatedDriver = {
        ...originalDriver,
        name: `${originalDriver.name} (Copy)`,
        active: false
      };
      return addDriver(type, duplicatedDriver);
    }
    return null;
  }, [drivers, addDriver]);

  return {
    drivers,
    addDriver,
    updateDriver,
    removeDriver,
    toggleDriver,
    getActiveDrivers,
    calculateTotalImpact,
    getDriversByCategory,
    duplicateDriver
  };
};

export default useDrivers;