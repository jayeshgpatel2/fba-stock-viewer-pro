
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onRefresh, 
  onExport, 
  isLoading, 
  currentView, 
  onViewChange 
}) => {
  
  const navItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'inventory', label: 'Inventory', icon: 'fa-boxes' },
    { id: 'inbound', label: 'Inbound Plans', icon: 'fa-truck-fast' },
    { id: 'quality', label: 'Quality Alerts', icon: 'fa-star-half-stroke' },
    { id: 'analytics', label: 'FC Analytics', icon: 'fa-chart-pie' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 flex-shrink-0 z-20 shadow-lg">
      {/* Top Bar */}
      <div className="h-14 px-5 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold flex items-center gap-2.5 tracking-tight">
          <i className="fas fa-warehouse text-blue-300"></i>
          FBA Stock Viewer <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-blue-100 font-normal border border-blue-500">Pro</span>
        </h1>
        <div className="flex gap-2.5">
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="px-4 py-1.5 border border-white/20 rounded-lg cursor-pointer text-sm font-medium flex items-center gap-2 transition-all bg-white/10 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`}></i>
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            onClick={onExport}
            className="px-4 py-1.5 border-none rounded-lg cursor-pointer text-sm font-semibold flex items-center gap-2 transition-all bg-white text-blue-800 hover:bg-blue-50 shadow-sm"
          >
            <i className="fas fa-download"></i>
            Export CSV
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-5 flex gap-1 pt-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all
              ${currentView === item.id 
                ? 'bg-slate-50 text-blue-800 shadow-[0_-2px_5px_rgba(0,0,0,0.1)] translate-y-[1px]' 
                : 'text-blue-100 hover:bg-white/10 hover:text-white'}
            `}
          >
            <i className={`fas ${item.icon} ${currentView === item.id ? 'text-blue-600' : 'opacity-70'}`}></i>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
