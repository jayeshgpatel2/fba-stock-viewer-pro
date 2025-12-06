import React, { useMemo } from 'react';
import { StockItem } from '../types';

interface StatsBarProps {
  data: StockItem[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ data }) => {
  const stats = useMemo(() => {
    const totalProducts = data.length;
    const totalStock = data.reduce((sum, item) => sum + (parseInt(String(item.Total)) || 0), 0);
    
    let totalIncoming = 0;
    let lowStockCount = 0;

    data.forEach(item => {
      // Incoming
      if (item.InboundPlans) {
        item.InboundPlans.forEach(plan => {
          if (plan.Status !== 'CLOSED' && plan.Status !== 'DELETED') {
            totalIncoming += parseInt(String(plan.ItemQuantity)) || 0;
          }
        });
      }
      // Low Stock (< 50)
      if ((parseInt(String(item.Total)) || 0) < 50) {
        lowStockCount++;
      }
    });

    return { totalProducts, totalStock, totalIncoming, lowStockCount };
  }, [data]);

  return (
    <div className="flex gap-4 px-5 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-slate-200 overflow-x-auto flex-shrink-0">
      <StatCard 
        label="Products" 
        value={stats.totalProducts} 
        icon="fa-box" 
        iconColor="text-blue-600" 
        bgColor="bg-blue-100" 
      />
      <StatCard 
        label="Total Stock" 
        value={stats.totalStock} 
        icon="fa-cubes" 
        iconColor="text-emerald-600" 
        bgColor="bg-emerald-100" 
      />
      <StatCard 
        label="Incoming" 
        value={stats.totalIncoming} 
        icon="fa-truck" 
        iconColor="text-amber-600" 
        bgColor="bg-amber-100" 
      />
      <StatCard 
        label="Low Stock" 
        value={stats.lowStockCount} 
        icon="fa-exclamation-triangle" 
        iconColor="text-red-600" 
        bgColor="bg-red-100" 
      />
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; icon: string; iconColor: string; bgColor: string }> = ({ 
  label, value, icon, iconColor, bgColor 
}) => (
  <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-slate-200 min-w-[160px]">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base ${bgColor} ${iconColor}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</div>
      <div className="text-lg font-bold text-slate-800">{value.toLocaleString()}</div>
    </div>
  </div>
);
