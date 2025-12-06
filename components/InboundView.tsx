
import React, { useMemo, useState } from 'react';
import { StockItem, InboundPlan } from '../types';
import { STATUS_COLORS } from '../constants';

interface InboundViewProps {
  data: StockItem[];
  searchQuery: string;
}

interface FlatPlan extends InboundPlan {
  MSKU: string;
  Image?: string;
  OriginalItem: StockItem;
}

export const InboundView: React.FC<InboundViewProps> = ({ data, searchQuery }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof FlatPlan; direction: 'asc' | 'desc' } | null>(null);

  const flatPlans = useMemo(() => {
    const plans: FlatPlan[] = [];
    data.forEach(item => {
      if (item.InboundPlans) {
        item.InboundPlans.forEach(plan => {
          plans.push({
            ...plan,
            MSKU: item.MSKU,
            Image: item.Image,
            OriginalItem: item
          });
        });
      }
    });
    return plans;
  }, [data]);

  const filteredPlans = useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();
    return flatPlans.filter(p => {
      if (!searchQuery) return true;
      return (
        p.MSKU.toLowerCase().includes(lowerSearch) ||
        p.ShipmentId?.toLowerCase().includes(lowerSearch) ||
        p.PlanId?.toLowerCase().includes(lowerSearch) ||
        p.Destination?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [flatPlans, searchQuery]);

  const sortedPlans = useMemo(() => {
    if (!sortConfig) return filteredPlans;
    return [...filteredPlans].sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPlans, sortConfig]);

  const handleSort = (key: keyof FlatPlan) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (flatPlans.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
        <i className="fas fa-truck text-5xl mb-4 text-slate-200"></i>
        <h3 className="text-lg font-semibold text-slate-600">No Inbound Shipments</h3>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('MSKU')}>MSKU</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('PlanId')}>Plan ID</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('ShipmentId')}>Shipment ID</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('CreatedDate')}>Created</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('Destination')}>FC</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200 text-right" onClick={() => handleSort('ItemQuantity')}>Qty</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200 text-right" onClick={() => handleSort('ItemReceived')}>Recv</th>
            <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('Status')}>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sortedPlans.map((plan, idx) => (
            <tr key={`${plan.ShipmentId}-${idx}`} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 font-medium text-blue-700 flex items-center gap-3">
                 {plan.Image && <img src={plan.Image} alt={plan.MSKU} className="w-16 h-16 object-cover rounded-md border border-slate-200 bg-white shadow-md" />}
                 <span>{plan.MSKU}</span>
              </td>
              <td className="px-4 py-3 font-mono text-slate-500 text-xs">{plan.PlanId}</td>
              <td className="px-4 py-3 font-mono text-slate-700 font-medium">{plan.ShipmentId}</td>
              <td className="px-4 py-3 text-slate-500">{plan.CreatedDate ? new Date(plan.CreatedDate).toLocaleDateString() : '-'}</td>
              <td className="px-4 py-3 font-bold text-slate-800">{plan.Destination}</td>
              <td className="px-4 py-3 text-right font-bold text-slate-700">{plan.ItemQuantity}</td>
              <td className="px-4 py-3 text-right text-slate-500">{plan.ItemReceived}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[plan.Status] || 'bg-gray-100 text-gray-600'}`}>
                  {plan.Status}
                </span>
              </td>
            </tr>
          ))}
          {filteredPlans.length === 0 && (
            <tr><td colSpan={8} className="p-8 text-center text-slate-500 italic">No shipments match your search.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
