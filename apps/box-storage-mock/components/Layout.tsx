
import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Home, 
  LogOut, 
  Bell, 
  Settings,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { AppView } from '../types';
import { MOCK_USER } from '../constants';
import { Button } from './ui/Button';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange, onLogout }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppView.INVENTORY, label: 'Inventar', icon: Package },
    { id: AppView.HOUSE, label: 'Haus-Ansicht', icon: Home },
  ];

  const manageItems = [
    { id: AppView.MANAGE_ITEMS, label: 'Neuer Gegenstand', icon: PlusCircle },
    { id: AppView.MANAGE_STRUCTURE, label: 'Struktur', icon: Settings },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Top Header Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200">
            <Package className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 text-lg hidden md:block">BoxStorage</span>
        </div>

        {/* Central Navigation */}
        <nav className="flex items-center gap-1 mx-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${currentView === item.id 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={18} className={currentView === item.id ? 'text-blue-600' : ''} />
                <span className="text-sm hidden lg:block">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="h-6 w-px bg-slate-200 mx-3 hidden md:block"></div>
          
          <div className="flex items-center gap-1">
            {manageItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                  ${currentView === item.id 
                    ? 'bg-blue-50 text-blue-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <item.icon size={18} className={currentView === item.id ? 'text-blue-600' : ''} />
                <span className="text-sm hidden lg:block">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="relative text-slate-500">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          
          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-3 pl-1 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-none">{MOCK_USER.name}</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Admin</p>
            </div>
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105">
              {MOCK_USER.initials}
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Abmelden"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1600px] mx-auto p-6 lg:p-10 animate-in fade-in duration-700">
          {children}
        </div>
      </main>
      
      {/* Mobile Nav Helper (Optional Footer for very small screens) */}
      <div className="md:hidden h-14 bg-white border-t border-slate-200 flex items-center justify-around px-4 sticky bottom-0 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 ${currentView === item.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
