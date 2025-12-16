import React from 'react';
import { AppProvider } from './context/AppContext'; // We will keep AppProvider as a wrapper
import { ToastProvider } from './context/ToastContext';
import { CustomerHome } from './views/CustomerHome';
import { ManagerDashboard } from './views/ManagerDashboard';
import { LandingPage } from './views/LandingPage';
import { AboutUsPage } from './views/AboutUsPage';
import { useNavigation } from './context/NavigationContext';

const MainApp = () => {
  const { currentView } = useNavigation();

  if (currentView === 'MANAGER_DASHBOARD') {
    return <ManagerDashboard />;
  }

  if (currentView === 'CUSTOMER_HOME') {
    return <CustomerHome />;
  }

  if (currentView === 'ABOUT_US') {
    return <AboutUsPage />;
  }

  return <LandingPage />;
};

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AppProvider>
  );
}