import { StateKey } from './types';

export const API_URL = 'https://g6l77ibfqe.execute-api.ap-south-1.amazonaws.com/stock';

// CORRECTED State and FC Mappings based on the user's provided screenshot.
export const STATE_CONFIG: Record<string, { label: string; fcs: string[]; colorClass: string; short: string }> = {
  karnataka: { label: 'Karnataka', short: 'KA', fcs: ['BLR7', 'BLR8'], colorClass: 'bg-violet-500' },
  maharashtra: { label: 'Maharashtra', short: 'MH', fcs: ['BOM4', 'BOM5', 'BOM7', 'PNQ3', 'NAX1', 'SBOB'], colorClass: 'bg-pink-500' },
  tamilnadu: { label: 'Tamil Nadu', short: 'TN', fcs: ['MAA4', 'CJBT'], colorClass: 'bg-teal-500' },
  telangana: { label: 'Telangana', short: 'TS', fcs: ['HYD8', 'HYD3'], colorClass: 'bg-amber-500' },
  uttarpradesh: { label: 'UP', short: 'UP', fcs: ['LKO1', 'UP1'], colorClass: 'bg-indigo-500' },
  westbengal: { label: 'West Bengal', short: 'WB', fcs: ['CCX1', 'CCX2'], colorClass: 'bg-cyan-600' },
};

// NEW: Define Receive Centers and their states for detailed tooltips
export const RC_CENTERS_CONFIG: Record<string, string> = {
  'DED3': 'Haryana',
  'DED5': 'Haryana',
  'ISK3': 'Maharashtra',
  'BLR4': 'Karnataka',
};

// Helper array of all RC codes
export const ALL_RC_CODES = Object.keys(RC_CENTERS_CONFIG);

export const ALL_FCS = Object.values(STATE_CONFIG).flatMap(s => s.fcs);

export const STATE_TABS: { key: StateKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'karnataka', label: 'KA' },
  { key: 'maharashtra', label: 'MH' },
  { key: 'tamilnadu', label: 'TN' },
  { key: 'telangana', label: 'TS' },
  { key: 'uttarpradesh', label: 'UP' },
  { key: 'westbengal', label: 'WB' },
];

export const STATUS_COLORS: Record<string, string> = {
  'IN_TRANSIT': 'bg-blue-100 text-blue-800',
  'RECEIVING': 'bg-green-100 text-green-800',
  'CLOSED': 'bg-slate-100 text-slate-500',
  'WORKING': 'bg-yellow-100 text-yellow-800',
  'DELIVERED': 'bg-emerald-100 text-emerald-800',
  'DELETED': 'bg-red-50 text-red-300',
};

// Define which FC ends a state group to draw a thicker border based on the new corrected order
export const STATE_END_FCS = new Set(Object.values(STATE_CONFIG).map(s => s.fcs[s.fcs.length - 1]));