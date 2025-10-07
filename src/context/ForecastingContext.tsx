import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MonthlyForecast {
  glCode: string;
  month: string;
  forecastedAmount: number;
  actualAmount?: number;
  variance?: number;
  changeVsPrior?: number;
  cumulativeYTD: number;
  isEditable: boolean;
}

interface ForecastingContextType {
  forecastData: MonthlyForecast[];
  setForecastData: (data: MonthlyForecast[]) => void;
  getMonthlyTotals: (month: string) => {
    budget: number;
    actual: number;
    py: number;
    hasActual: boolean;
  };
}

const ForecastingContext = createContext<ForecastingContextType | undefined>(undefined);

export const useForecastingData = () => {
  const context = useContext(ForecastingContext);
  if (!context) {
    throw new Error('useForecastingData must be used within ForecastingProvider');
  }
  return context;
};

interface ForecastingProviderProps {
  children: ReactNode;
}

export const ForecastingProvider: React.FC<ForecastingProviderProps> = ({ children }) => {
  const [forecastData, setForecastData] = useState<MonthlyForecast[]>([]);

  const getMonthlyTotals = (month: string) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const [monthName, yearStr] = month.split(' ');
    const year = parseInt(yearStr);
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(monthName);

    const isHistorical = year < currentYear || (year === currentYear && monthIndex <= currentMonth);

    const monthData = forecastData.filter(item => item.month === month);

    const budget = monthData.reduce((sum, item) => {
      if (item.glCode.startsWith('4')) {
        return sum + item.forecastedAmount;
      }
      return sum;
    }, 0);

    const actual = isHistorical ? monthData.reduce((sum, item) => {
      if (item.glCode.startsWith('4')) {
        return sum + (item.actualAmount || item.forecastedAmount);
      }
      return sum;
    }, 0) : monthData.reduce((sum, item) => {
      if (item.glCode.startsWith('4')) {
        return sum + item.forecastedAmount;
      }
      return sum;
    }, 0);

    const pyYear = year - 1;
    const pyMonth = `${monthName} ${pyYear}`;
    const pyData = forecastData.filter(item => item.month === pyMonth);
    const py = pyData.reduce((sum, item) => {
      if (item.glCode.startsWith('4')) {
        return sum + (item.actualAmount || item.forecastedAmount);
      }
      return sum;
    }, 0);

    return {
      budget,
      actual,
      py,
      hasActual: isHistorical
    };
  };

  return (
    <ForecastingContext.Provider value={{ forecastData, setForecastData, getMonthlyTotals }}>
      {children}
    </ForecastingContext.Provider>
  );
};
