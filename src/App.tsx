import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ForecastingProvider } from './context/ForecastingContext';
import { router } from './utils/router';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ForecastingProvider>
          <RouterProvider router={router} />
        </ForecastingProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;