
import React, { useMemo } from 'react';
import { StockItem } from '../types';
import { ALL_FCS, STATE_CONFIG } from '../constants';

interface AnalyticsViewProps {
  data: StockItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  const stats = useMemo(() => {
    const fcStats: Record<string, number> = {};
    const stateStats: Record<string, number> = {};

    ALL_FCS.forEach(fc => { fcStats[fc] = 0; });
    Object.keys(STATE_CONFIG).forEach(key => { stateStats[key] = 0; });

    data.forEach(item => {
      ALL_FCS.forEach(fc => {
        const val = parseInt(String(item[fc])) || 0;
        if (val > 0) {
          fcStats[fc] += val;
          
          // Find state for this FC
          const stateEntry = Object.entries(STATE_CONFIG).find(([_, conf]) => conf.fcs.includes(fc));
          if (stateEntry) {
            stateStats[stateEntry[0]] += val;
          }
        }
      });
    });

    return { fcStats, stateStats };
  }, [data]);

  // FIX: Using Object.keys().map() to correctly infer number[] type for Math.max,
  // resolving issues where Object.values() might be inferred as unknown[].
  const maxStateVal = Math.max(...Object.keys(stats.stateStats).map(key => stats.stateStats[key]), 1);
  const maxFCVal = Math.max(...Object.keys(stats.fcStats).map(key => stats.fcStats[key]), 1);

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fas fa-map-marked-alt text-blue-500"></i> Region Wise Stock
          </h3>
          <div className="space-y-4">
            {Object.entries(STATE_CONFIG).map(([key, config]) => {
              const val = stats.stateStats[key] || 0;
              const percent = (val / maxStateVal) * 100;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{config.label}</span>
                    <span className="font-bold text-slate-900">{val.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full ${config.colorClass.replace('text', 'bg')}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FC Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <i className="fas fa-warehouse text-purple-500"></i> FC Wise Stock
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
             {ALL_FCS.map(fc => {
               const val = stats.fcStats[fc] || 0;
               const percent = (val / maxFCVal) * 100;
               const stateConfig = Object.values(STATE_CONFIG).find(c => c.fcs.includes(fc));
               const colorClass = stateConfig?.colorClass || 'bg-slate-500';

               return (
                 <div key={fc} className="flex items-center gap-3">
                    <div className="w-12 text-xs font-bold text-slate-500">{fc}</div>
                    <div className="flex-1">
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                    <div className="w-10 text-right text-xs font-bold text-slate-700">{val}</div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>
    </div>
  );
};
