
import { API_URL } from '../constants';
import { StockItem } from '../types';

interface ApiResponse {
  items: StockItem[];
  count: number;
  lastKey?: string;
  hasMore?: boolean;
}

export const fetchStockData = async (onProgress?: (count: number) => void): Promise<StockItem[]> => {
  let allItems: StockItem[] = [];
  let lastKey: string | null = null;
  let hasMore = true;
  let pageCount = 0;

  try {
    while (hasMore) {
      const url = new URL(API_URL);
      if (lastKey) {
        url.searchParams.append('lastKey', lastKey);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.items && Array.isArray(data.items)) {
        allItems = [...allItems, ...data.items];
      }

      if (onProgress) {
        onProgress(allItems.length);
      }

      // Check for pagination
      if (data.hasMore && data.lastKey) {
        lastKey = data.lastKey;
      } else {
        hasMore = false;
      }
      
      pageCount++;
      // Safety break to prevent infinite loops if API misbehaves, though 100 pages is a generous limit
      if (pageCount > 100) break;
    }
    
    return allItems;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};
