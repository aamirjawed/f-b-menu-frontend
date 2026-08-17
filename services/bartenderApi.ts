import { API_BASE_URL } from '@/services/config';

const TOKEN_KEY = 'bartender_auth_token';
const SESSION_KEY = 'bartender_session_data';

export interface BartenderSession {
  id: string;
  vendorId: string;
  name: string;
  station: string;
  role: string;
  avatar?: string;
  stall?: {
    id: string;
    name: string;
    stallNumber?: string;
    location?: string;
  };
}

export interface BartenderOrder {
  id: string;
  vendorId: string;
  tokenNumber: string;
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    subCategory?: string;
  }>;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cash_on_delivery';
  orderStatus: 'pending' | 'preparing' | 'completed' | 'cancelled';
  completedByBartenderId?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Token and Session helpers
export function getBartenderToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setBartenderToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeBartenderToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getBartenderSession(): BartenderSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setBartenderSession(data: BartenderSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearBartenderSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

// 1. QR Auto-Login using pairingToken
export async function loginWithQr(pairingToken: string): Promise<{ success: boolean; token?: string; bartender?: BartenderSession; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/bartenders/auth/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pairingToken }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.message || 'QR Pairing failed or expired' };
    }

    setBartenderToken(data.token);
    setBartenderSession(data.bartender);
    return { success: true, token: data.token, bartender: data.bartender };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during QR login' };
  }
}

// 2. Fast 4-Digit PIN Login
export async function loginWithPin(staffId: string, pinCode: string): Promise<{ success: boolean; token?: string; bartender?: BartenderSession; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/bartenders/auth/pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffId, pinCode }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.message || 'Invalid Staff ID or PIN' };
    }

    setBartenderToken(data.token);
    setBartenderSession(data.bartender);
    return { success: true, token: data.token, bartender: data.bartender };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during PIN login' };
  }
}

// 3. Username / Password Login
export async function loginWithPassword(username: string, password: string): Promise<{ success: boolean; token?: string; bartender?: BartenderSession; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/bartenders/auth/password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.message || 'Invalid username or password' };
    }

    setBartenderToken(data.token);
    setBartenderSession(data.bartender);
    return { success: true, token: data.token, bartender: data.bartender };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error during login' };
  }
}

// 4. Fetch Bartender Profile
export async function getBartenderProfile(): Promise<{ success: boolean; bartender?: BartenderSession; error?: string }> {
  try {
    const token = getBartenderToken();
    if (!token) return { success: false, error: 'No active session token' };

    const res = await fetch(`${API_BASE_URL}/bartenders/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      // If server returned error, check local session before failing
      const localSession = getBartenderSession();
      if (localSession) {
        return { success: true, bartender: localSession };
      }
      return { success: false, error: data.message || 'Session expired' };
    }

    const bartenderData = data.bartender || data.data?.bartender || data.data;
    if (bartenderData && typeof bartenderData === 'object') {
      setBartenderSession(bartenderData);
      return { success: true, bartender: bartenderData };
    }

    const localSession = getBartenderSession();
    if (localSession) {
      return { success: true, bartender: localSession };
    }

    return { success: false, error: 'Bartender data not found' };
  } catch (err: any) {
    const localSession = getBartenderSession();
    if (localSession) {
      return { success: true, bartender: localSession };
    }
    return { success: false, error: err.message || 'Failed to fetch bartender profile' };
  }
}

// 5. Fetch Orders for this Bartender's Stall
export async function getBartenderOrders(status?: string): Promise<{ success: boolean; count?: number; data?: BartenderOrder[]; error?: string }> {
  try {
    const token = getBartenderToken();
    if (!token) return { success: false, error: 'No active session token' };

    const url = status
      ? `${API_BASE_URL}/bartenders/orders?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/bartenders/orders`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.message || 'Failed to fetch orders' };
    }

    const ordersList = Array.isArray(data.data) ? data.data : (Array.isArray(data.orders) ? data.orders : []);

    return {
      success: true,
      count: data.count || ordersList.length,
      data: ordersList,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error fetching orders' };
  }
}

// 6. Update Order Status (e.g. preparing, completed)
export async function updateBartenderOrderStatus(orderId: string, orderStatus: 'pending' | 'preparing' | 'completed' | 'cancelled'): Promise<{ success: boolean; data?: BartenderOrder; error?: string }> {
  try {
    const token = getBartenderToken();
    if (!token) return { success: false, error: 'No active session token' };

    const res = await fetch(`${API_BASE_URL}/bartenders/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.message || 'Failed to update order status' };
    }

    return { success: true, data: data.data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error updating order' };
  }
}
