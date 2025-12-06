
import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ControlsBar } from './components/ControlsBar';
import { StockTable } from './components/StockTable';
import { InboundView } from './components/InboundView';
import { QualityView } from './components/QualityView';
import { AnalyticsView } from './components/AnalyticsView';
import { fetchStockData } from './services/stockService';
import { StockItem, FilterState, StateKey, ViewType } from './types';
import { STATE_CONFIG, ALL_FCS } from './constants';

const App: React.FC = () => {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [currentView, setCurrentView] = useState<ViewType>('inventory');
  
  const [filter, setFilter] = useState<FilterState>({
    search: '',
    tab: 'all',
    onlyLowStock: false,
    page: 1,
    rowsPerPage: 50,
  });

  const loadData = async () => {
    setLoading(true);
    setLoadProgress(0);
    try {
      // Pass a progress callback to receive updates on count
      const items = await fetchStockData((count) => setLoadProgress(count));
      setData(items);
    } catch (err) {
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic (Mainly for Inventory View)
  const filteredInventoryData = useMemo(() => {
    return data.filter(item => {
      // Search
      const searchLower = filter.search.toLowerCase();
      const matchesSearch = !filter.search || 
        (item.MSKU?.toLowerCase().includes(searchLower)) ||
        (item.ASIN?.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Low Stock
      const total = parseInt(String(item.Total)) || 0;
      if (filter.onlyLowStock && total >= 50) return false;

      // Tab (State Filter)
      if (filter.tab !== 'all') {
        const targetFCs = STATE_CONFIG[filter.tab].fcs;
        // Check if any of the target FCs have stock > 0
        const hasStockInState = targetFCs.some(fc => (parseInt(String(item[fc])) || 0) > 0);
        if (!hasStockInState) return false;
      }

      return true;
    });
  }, [data, filter.search, filter.onlyLowStock, filter.tab]);

  // Pagination Logic for Inventory
  const paginatedData = useMemo(() => {
    const start = (filter.page - 1) * filter.rowsPerPage;
    const end = start + filter.rowsPerPage;
    return filteredInventoryData.slice(start, end);
  }, [filteredInventoryData, filter.page, filter.rowsPerPage]);

  const totalPages = Math.ceil(filteredInventoryData.length / filter.rowsPerPage);

  // Handlers
  const handleExport = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    const headers = ['MSKU', 'ASIN', 'Date', ...ALL_FCS, 'Total', 'Rating', 'Reviews'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        return [
          item.MSKU || '', 
          item.ASIN || '', 
          item.Date || '',
          ...ALL_FCS.map(fc => item[fc] || 0),
          item.Total || 0, 
          item.Rating || 0, 
          item.ReviewsCount || item.Reviews || 0
        ].join(',')
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fba-stock-full-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSearchChange = (val: string) => {
    setFilter(prev => ({ ...prev, search: val, page: 1 }));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'inventory':
        return (
          <StockTable 
            data={paginatedData} 
            startIndex={(filter.page - 1) * filter.rowsPerPage}
          />
        );
      case 'inbound':
        return <InboundView data={data} searchQuery={filter.search} />;
      case 'quality':
        return <QualityView data={data} searchQuery={filter.search} />;
      case 'analytics':
        return <AnalyticsView data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header 
        onRefresh={loadData} 
        onExport={handleExport} 
        isLoading={loading} 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          setFilter(prev => ({ ...prev, search: '', page: 1 })); // Reset search on view change
        }}
      />
      
      <StatsBar data={data} />
      
      <ControlsBar 
        currentView={currentView}
        searchQuery={filter.search}
        onSearchChange={handleSearchChange}
        activeTab={filter.tab}
        onTabChange={(val) => setFilter(prev => ({ ...prev, tab: val as StateKey, page: 1 }))}
        onlyLowStock={filter.onlyLowStock}
        onLowStockChange={(val) => setFilter(prev => ({ ...prev, onlyLowStock: val, page: 1 }))}
        rowsPerPage={filter.rowsPerPage}
        onRowsPerPageChange={(val) => setFilter(prev => ({ ...prev, rowsPerPage: val, page: 1 }))}
      />

      {/* Main Content Area with Border */}
      <main className="flex-1 p-5 overflow-hidden">
        <div className="h-full bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {renderContent()}

          {/* Pagination Footer - Only for Inventory as other views have their own scrolling/sorting */}
          {currentView === 'inventory' && (
            <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
              <span className="text-sm text-slate-500 font-medium">
                Showing {filteredInventoryData.length > 0 ? ((filter.page - 1) * filter.rowsPerPage) + 1 : 0} 
                {' - '} 
                {Math.min(filter.page * filter.rowsPerPage, filteredInventoryData.length)} 
                {' of '} 
                {filteredInventoryData.length} items
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={filter.page === 1}
                  className="px-3 py-1.5 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 transition-colors"
                >
                  <i className="fas fa-chevron-left mr-1"></i> Prev
                </button>
                <button 
                  onClick={() => setFilter(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                  disabled={filter.page >= totalPages}
                  className="px-3 py-1.5 border border-slate-300 rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 transition-colors"
                >
                  Next <i className="fas fa-chevron-right ml-1"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4 shadow-lg"></div>
          <div className="text-xl text-slate-700 font-bold mb-1">Fetching Inventory Data</div>
          <div className="text-slate-500 font-medium animate-pulse">
             Loaded {loadProgress.toLocaleString()} records...
          </div>
        </div>
      )}
    </div>
  );
};

export default App;