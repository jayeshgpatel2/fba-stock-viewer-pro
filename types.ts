
export interface InboundPlan {
  PlanId: string;
  ShipmentId: string;
  CreatedDate: string;
  Status: string;
  Destination: string;
  ItemQuantity: string | number;
  ItemReceived: string | number;
}

export interface StockItem {
  MSKU: string;
  ASIN: string;
  Date?: string;
  Total: string | number;
  Image?: string;
  Rating?: string | number;
  Reviews?: string | number;
  ReviewsCount?: string | number;
  InboundPlans?: InboundPlan[];
  [key: string]: any; // Allow dynamic FC keys (e.g., item['BLR7'])
}

export type StateKey = 'all' | 'karnataka' | 'maharashtra' | 'tamilnadu' | 'telangana' | 'uttarpradesh' | 'westbengal';
export type ViewType = 'inventory' | 'inbound' | 'quality' | 'analytics';

export interface FilterState {
  search: string;
  tab: StateKey;
  onlyLowStock: boolean;
  page: number;
  rowsPerPage: number;
}
