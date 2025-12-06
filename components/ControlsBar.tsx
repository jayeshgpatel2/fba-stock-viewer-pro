
import React from 'react';
import { StateKey, ViewType } from '../types';
import { STATE_TABS } from '../constants';

interface ControlsBarProps {
  currentView: ViewType;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeTab: StateKey;
  onTabChange: (val: StateKey) => void;
  onlyLowStock: boolean;
  onLowStockChange: (val: boolean) => void;
  rowsPerPage: number;
  onRowsPerPageChange: (val: number) => void;
}

export const ControlsBar: React.FC<ControlsBarProps> = ({
  currentView,
  searchQuery, onSearchChange,
  activeTab, onTabChange,
  onlyLowStock, onLowStockChange,
  rowsPerPage, onRowsPerPageChange
}) => {
  return (
    <div className="flex flex-wrap gap-4 px-5 py-3 bg-white border-b border-slate-200 items-center flex-shrink-0 z-10 shadow-sm">
      {/* Search - Available in Inventory, Inbound, Quality */}
      {currentView !== 'analytics' && (
        <div className="relative w-[300px]">
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={currentView === 'inbound' ? "Search Shipment ID, Plan ID, SKU..." : "Search MSKU, ASIN..."} 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-slate-50 focus:bg-white"
          />
        </div>
      )}

      {/* State Tabs - Only for Inventory View */}
      {currentView === 'inventory' && (
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto max-w-full">
          {STATE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                  : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Filters - Context Aware */}
      {currentView === 'inventory' && (
        <div className="flex items-center gap-2 cursor-pointer select-none border-l border-slate-200 pl-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                checked={onlyLowStock}
                onChange={(e) => onLowStockChange(e.target.checked)}
                className="peer w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
              />
            </div>
            <span className="text-sm font-medium text-slate-700">Low Stock Only</span>
          </label>
        </div>
      )}

      {/* Pagination Controls - Hide on Analytics */}
      {currentView !== 'analytics' && (
        <div className="ml-auto flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Rows:</label>
          <select 
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="pl-2 pr-6 py-1.5 border border-slate-300 rounded-md text-sm bg-slate-50 focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
      )}
    </div>
  );
};
