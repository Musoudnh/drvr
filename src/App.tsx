import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { router } from './utils/router';

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;