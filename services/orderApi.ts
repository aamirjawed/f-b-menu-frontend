import { API_BASE_URL } from '@/services/config';

export interface CreateOrderPayload {
  vendorId?: string;
  customerName?: string;
  customerPhone?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentMethod?: string;
  paymentId?: string;
  tableOrTokenNo?: string;
}

export interface CreatedOrderResponse {
  id: string;
  tokenNumber: string;
  vendorId?: string;
  customerName?: string;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export async function placeOrder(payload: CreateOrderPayload): Promise<{ success: boolean; data?: CreatedOrderResponse; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        error: result.message || 'Failed to place order',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error('[Order API] Error submitting order:', error);
    return {
      success: false,
      error: error.message || 'Network error while placing order',
    };
  }
}
