import React, { useState } from 'react';
import { StockItem, InboundPlan } from '../types';
import { STATE_CONFIG, ALL_FCS, STATE_END_FCS, STATUS_COLORS, ALL_RC_CODES } from '../constants';
import { ImageModal } from './ImageModal';

interface StockTableProps {
  data: StockItem[];
  startIndex: number;
}

export const StockTable: React.FC<StockTableProps> = ({ data, startIndex }) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [modalImage, setModalImage] = useState<string | null>(null);

  const toggleRow = (index: number) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedRows(newSet);
  };

  if (data.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-12">
        <i className="fas fa-inbox text-5xl mb-4 text-blue-200"></i>
        <h3 className="text-lg font-semibold text-slate-600">No Data Found</h3>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-auto w-full relative bg-white">
        <table className="w-full border-collapse text-sm min-w-max">
          <thead className="sticky top-0 z-30">
            {/* Header Row 1: Grouping */}
            <tr>
              <th className="sticky left-0 z-40 bg-slate-600 text-white w-10 p-0 border-b border-r border-slate-500" rowSpan={2}></th>
              <th className="sticky left-10 z-40 bg-slate-600 text-blue-200 text-left px-3 font-semibold border-b border-r-2 border-slate-500 w-[180px]" rowSpan={2}>
                MSKU
              </th>
              <th className="bg-slate-600 text-white border-r border-b border-slate-500 font-semibold px-2 py-2" rowSpan={2}>ASIN</th>
              <th className="bg-slate-600 text-white border-r-2 border-b border-slate-500 font-semibold px-2 py-2" rowSpan={2}>Date</th>
              
              {/* Dynamic State Headers */}
              {Object.entries(STATE_CONFIG).map(([key, config]) => (
                <th 
                  key={key} 
                  colSpan={config.fcs.length} 
                  className={`${config.colorClass} text-white font-semibold py-2 px-2 text-sm uppercase tracking-wider border-b border-white/20`}
                >
                  {config.label}
                </th>
              ))}
              
              <th className="bg-blue-600 text-white font-bold border-l-2 border-r-2 border-b border-blue-700 px-3" rowSpan={2}>Total</th>
              <th className="bg-slate-600 text-white border-r border-b border-slate-500 font-semibold px-2" rowSpan={2}>Image</th>
              <th className="bg-slate-600 text-white border-r border-b border-slate-500 font-semibold px-2" rowSpan={2}>Rating</th>
              <th className="bg-slate-600 text-white border-b border-slate-500 font-semibold px-2" rowSpan={2}>Reviews</th>
            </tr>

            {/* Header Row 2: FC Codes */}
            <tr>
              {Object.entries(STATE_CONFIG).map(([key, config]) => (
                config.fcs.map(fc => (
                  <th 
                    key={fc} 
                    className={`${config.colorClass} text-white font-medium py-2 px-2 text-sm border-r border-white/20 border-b-2 border-slate-200`}
                  >
                    {fc}
                  </th>
                ))
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-200">
            {data.map((item, index) => {
              const globalIndex = startIndex + index;
              const hasInbound = item.InboundPlans && item.InboundPlans.length > 0;
              const isExpanded = expandedRows.has(globalIndex);
              const total = parseInt(String(item.Total)) || 0;

              // Calculate inbound quantity destined for any RC
              const inboundToRcTotal = item.InboundPlans
                ? item.InboundPlans
                    .filter(p => ALL_RC_CODES.includes(p.Destination) && p.Status !== 'CLOSED' && p.Status !== 'DELETED')
                    .reduce((sum, p) => sum + (parseInt(String(p.ItemQuantity)) || 0), 0)
                : 0;

              const inboundToRcTooltip = item.InboundPlans
                ? item.InboundPlans
                    .filter(p => ALL_RC_CODES.includes(p.Destination) && p.Status !== 'CLOSED' && p.Status !== 'DELETED')
                    .map(p => `${p.Destination}: ${p.ItemQuantity}`)
                    .join('\n')
                : '';


              return (
                <React.Fragment key={item.MSKU + index}>
                  <tr className="hover:bg-slate-50 group transition-colors">
                    {/* Toggle Button */}
                    <td className="sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-200 p-1 text-center z-10 w-10 align-middle">
                      {hasInbound && (
                        <button 
                          onClick={() => toggleRow(globalIndex)}
                          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${isExpanded ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                        >
                          <i className={`fas ${isExpanded ? 'fa-minus' : 'fa-plus'} text-sm`}></i>
                        </button>
                      )}
                    </td>

                    {/* MSKU (Sticky) */}
                    <td className="sticky left-10 bg-white group-hover:bg-slate-50 border-r-2 border-slate-300 px-3 py-3 text-left font-semibold text-blue-600 text-sm truncate max-w-[180px] z-10 sticky-col-shadow align-middle" title={item.MSKU}>
                      {item.MSKU}
                    </td>

                    {/* ASIN */}
                    <td className="border-r border-slate-200 px-2 py-3 text-center align-middle">
                      {item.ASIN ? (
                        <a 
                          href={`https://www.amazon.in/dp/${item.ASIN}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-medium text-sm whitespace-nowrap"
                        >
                          {item.ASIN}
                        </a>
                      ) : '-'}
                    </td>

                    {/* Date */}
                    <td className="border-r-2 border-slate-300 px-2 py-3 text-center text-slate-500 text-sm whitespace-nowrap align-middle">
                      {item.Date ? new Date(item.Date).toLocaleDateString('en-IN', {day:'2-digit', month:'short'}) : '-'}
                    </td>

                    {/* FC Columns */}
                    {ALL_FCS.map(fc => {
                      const stock = parseInt(String(item[fc])) || 0;
                      const isStateEnd = STATE_END_FCS.has(fc);
                      
                      // Calculate inbound specific to this FC
                      const inboundQty = item.InboundPlans
                        ? item.InboundPlans
                            .filter(p => p.Destination === fc && p.Status !== 'CLOSED' && p.Status !== 'DELETED')
                            .reduce((sum, p) => sum + (parseInt(String(p.ItemQuantity)) || 0), 0)
                        : 0;
                        
                      const isLow = stock > 0 && stock < 10;
                      
                      return (
                        <td 
                          key={fc} 
                          className={`
                            px-2 py-3 text-center text-sm border-slate-200 align-middle
                            ${isStateEnd ? 'border-r-2 border-r-slate-300' : 'border-r'}
                            ${isLow ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700'}
                            group-hover:bg-opacity-80
                          `}
                        >
                          {stock > 0 && <div className="font-semibold text-base">{stock}</div>}
                          {inboundQty > 0 && <div className="text-sm font-bold text-emerald-600">+{inboundQty}</div>}
                        </td>
                      );
                    })}

                    {/* Total */}
                    <td className={`border-r-2 border-l-2 border-slate-300 px-3 py-3 text-center align-middle ${total > 0 ? 'bg-blue-50 text-blue-800' : 'text-slate-400'}`}>
                       <div className="font-extrabold text-base">{total}</div>
                        {inboundToRcTotal > 0 && (
                          <div
                            className="text-xs font-bold text-amber-600 mt-1 cursor-pointer whitespace-nowrap"
                            title={`Inbound to RC:\n${inboundToRcTooltip}`}
                          >
                            +{inboundToRcTotal} <i className="fas fa-arrow-right text-[10px]"></i> RC
                          </div>
                        )}
                    </td>

                    {/* Image */}
                    <td className="border-r border-slate-200 px-2 py-2 text-center align-middle">
                      {item.Image && (
                        <img 
                          src={item.Image} 
                          alt="Product" 
                          className="w-16 h-16 object-cover rounded-md border border-slate-200 mx-auto cursor-pointer hover:scale-125 transition-transform bg-white shadow-md"
                          onClick={() => setModalImage(item.Image!)}
                        />
                      )}
                    </td>

                    {/* Rating */}
                    <td className="border-r border-slate-200 px-2 py-3 text-center whitespace-nowrap align-middle">
                      {item.Rating && (
                        <div className={`flex items-center justify-center gap-1.5 font-semibold text-sm ${
                          Number(item.Rating) >= 4 ? 'text-emerald-600' : Number(item.Rating) >= 3 ? 'text-amber-500' : 'text-red-500'
                        }`}>
                          <i className="fas fa-star text-xs"></i>
                          {Number(item.Rating).toFixed(1)}
                        </div>
                      )}
                    </td>

                    {/* Reviews */}
                    <td className="px-2 py-3 text-center text-sm text-slate-600 align-middle">
                      {item.ReviewsCount || item.Reviews || 0}
                    </td>
                  </tr>

                  {/* Expanded Detail Row */}
                  {isExpanded && item.InboundPlans && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={100} className="p-0 border-b border-slate-200">
                        <div className="p-4 pl-14 bg-slate-50 shadow-inner">
                          <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                            <i className="fas fa-shipping-fast"></i> Inbound Shipments for {item.MSKU}
                          </h4>
                          <div className="overflow-x-auto border rounded-lg bg-white">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-100 text-slate-600 font-semibold uppercase">
                                <tr>
                                  <th className="px-3 py-2 border-b">Plan ID</th>
                                  <th className="px-3 py-2 border-b">Shipment ID</th>
                                  <th className="px-3 py-2 border-b">Created</th>
                                  <th className="px-3 py-2 border-b">Status</th>
                                  <th className="px-3 py-2 border-b">Destination</th>
                                  <th className="px-3 py-2 border-b text-right">Quantity</th>
                                  <th className="px-3 py-2 border-b text-right">Received</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {item.InboundPlans.map((plan, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-3 py-2 font-mono text-slate-500">{plan.PlanId || '-'}</td>
                                    <td className="px-3 py-2 font-mono">{plan.ShipmentId || '-'}</td>
                                    <td className="px-3 py-2">{plan.CreatedDate ? new Date(plan.CreatedDate).toLocaleDateString() : '-'}</td>
                                    <td className="px-3 py-2">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${STATUS_COLORS[plan.Status] || 'bg-gray-100 text-gray-600'}`}>
                                        {plan.Status}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 font-bold">{plan.Destination || '-'}</td>
                                    <td className="px-3 py-2 text-right font-bold text-slate-700">{plan.ItemQuantity}</td>
                                    <td className="px-3 py-2 text-right text-slate-500">{plan.ItemReceived}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
    </>
  );
};