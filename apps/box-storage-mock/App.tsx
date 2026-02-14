
import React from 'react';
import { AppView } from './types';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { HouseHierarchy } from './components/HouseHierarchy';
import { StructureManager } from './components/Management/StructureManager';
import { ItemWizard } from './components/Management/ItemWizard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<AppView>(AppView.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView(AppView.LOGIN);
  };

  if (!isAuthenticated || currentView === AppView.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.INVENTORY:
        return <Inventory />;
      case AppView.HOUSE:
        return <HouseHierarchy />;
      case AppView.MANAGE_STRUCTURE:
        return <StructureManager />;
      case AppView.MANAGE_ITEMS:
        return <ItemWizard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onViewChange={setCurrentView} 
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
