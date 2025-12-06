
import React, { useMemo, useState } from 'react';
import { StockItem } from '../types';

interface QualityViewProps {
  data: StockItem[];
  searchQuery: string;
}

type SortableKeys = 'MSKU' | 'ASIN' | 'Rating' | 'ReviewsCount' | 'Total';

export const QualityView: React.FC<QualityViewProps> = ({ data, searchQuery }) => {
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'Rating', direction: 'asc' });

  const problemItems = useMemo(() => {
    return data
      .filter(item => {
        const rating = parseFloat(String(item.Rating)) || 0;
        const reviews = parseInt(String(item.ReviewsCount || item.Reviews)) || 0;
        return (rating > 0 && rating < 4) || (reviews < 5);
      })
      .filter(item => {
        if (!searchQuery) return true;
        const lowerSearch = searchQuery.toLowerCase();
        return (
          item.MSKU.toLowerCase().includes(lowerSearch) ||
          item.ASIN.toLowerCase().includes(lowerSearch)
        );
      });
  }, [data, searchQuery]);

  const sortedItems = useMemo(() => {
    if (!sortConfig) return problemItems;
    return [...problemItems].sort((a, b) => {
      let aVal: string | number = a[sortConfig.key] || 0;
      let bVal: string | number = b[sortConfig.key] || 0;

      // Ensure numeric comparison for numeric fields
      if (sortConfig.key === 'Rating' || sortConfig.key === 'ReviewsCount' || sortConfig.key === 'Total') {
        aVal = parseFloat(String(aVal));
        bVal = parseFloat(String(bVal));
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [problemItems, sortConfig]);

  const handleSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) return <i className="fas fa-sort text-slate-300"></i>;
    if (sortConfig.direction === 'asc') return <i className="fas fa-sort-up text-blue-500"></i>;
    return <i className="fas fa-sort-down text-blue-500"></i>;
  };

  if (problemItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
        <i className="fas fa-check-circle text-5xl mb-4 text-emerald-200"></i>
        <h3 className="text-lg font-semibold text-slate-600">No Quality Issues Found</h3>
        <p>Great job! All your products have good ratings.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4">
       <div className="mb-4 flex-shrink-0 items-center gap-2 text-slate-600 text-sm p-3 rounded-lg bg-slate-50 border border-slate-200">
        <i className="fas fa-info-circle text-blue-500"></i>
        <span>Showing items with <strong>Rating &lt; 4.0</strong> or <strong>Reviews &lt; 5</strong></span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-xs sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('MSKU')}>
                <div className="flex justify-between items-center">MSKU {getSortIcon('MSKU')}</div>
              </th>
              <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('ASIN')}>
                <div className="flex justify-between items-center">ASIN {getSortIcon('ASIN')}</div>
              </th>
              <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('Rating')}>
                <div className="flex justify-between items-center">Rating {getSortIcon('Rating')}</div>
              </th>
              <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('ReviewsCount')}>
                <div className="flex justify-between items-center">Reviews {getSortIcon('ReviewsCount')}</div>
              </th>
              <th className="px-4 py-3 border-b cursor-pointer hover:bg-slate-200" onClick={() => handleSort('Total')}>
                <div className="flex justify-between items-center">Total Stock {getSortIcon('Total')}</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedItems.map((item) => {
                const rating = parseFloat(String(item.Rating)) || 0;
                return (
                    <tr key={item.MSKU} className="hover:bg-amber-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-blue-700 flex items-center gap-3">
                            {item.Image && <img src={item.Image} alt={item.MSKU} className="w-16 h-16 object-cover rounded-md border border-slate-200 bg-white shadow-md" />}
                            <div className="flex flex-col">
                               <span>{item.MSKU}</span>
                                <a href={`https://www.amazon.in/dp/${item.ASIN}`} target="_blank" rel="noreferrer" className="text-xs font-normal text-blue-500 hover:underline">
                                    View on Amazon <i className="fas fa-external-link-alt text-[9px]"></i>
                                </a>
                            </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">{item.ASIN}</td>
                        <td className="px-4 py-3">
                            <div className={`font-bold text-base ${rating < 3.5 ? 'text-red-600' : 'text-amber-600'}`}>
                                {rating.toFixed(1)}
                            </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-700">
                           {item.ReviewsCount || item.Reviews || 0}
                        </td>
                        <td className="px-4 py-3 font-bold text-lg text-slate-800">
                           {item.Total}
                        </td>
                    </tr>
                );
            })}
             {sortedItems.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-slate-500 italic">No items match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
