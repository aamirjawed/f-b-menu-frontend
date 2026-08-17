import { API_BASE_URL } from '@/services/config';

export interface CreatePaymentQrParams {
  amount: number;
  vendorId?: string;
  orderId?: string;
  notes?: Record<string, any>;
}

export interface PaymentQrResponse {
  success: boolean;
  message?: string;
  qrData?: {
    qrCodeId?: string;
    imageUrl: string;
    upiString?: string;
    amount: number;
    orderId: string;
    isFallback?: boolean;
  };
}

export interface CreateRazorpayOrderParams {
  amount: number;
  currency?: string;
  vendorId?: string;
  orderId?: string;
  customerDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  notes?: Record<string, any>;
}

export interface RazorpayOrderResponse {
  success: boolean;
  message?: string;
  keyId?: string;
  razorpayOrder?: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
  payment?: any;
}

export interface VerifyPaymentSignatureParams {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Generate instant dynamic UPI QR Code / Intent Link via Backend Payment API
 */
export async function createPaymentQRCode(params: CreatePaymentQrParams): Promise<PaymentQrResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/create-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate UPI QR code. Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    console.warn('[Payment API] Backend payment server unavailable, generating local UPI QR code fallback:', error);
    // Dynamic Fallback UPI QR string generator if server offline
    const upiId = 'foodstall@upi';
    const fallbackOrderId = params.orderId || `ord_${Date.now()}`;
    const upiString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=FoodStall&am=${params.amount}&cu=INR&tr=${fallbackOrderId}`;
    const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`;

    return {
      success: true,
      qrData: {
        imageUrl,
        upiString,
        amount: params.amount,
        orderId: fallbackOrderId,
        isFallback: true,
      },
    };
  }
}

/**
 * Create Razorpay payment order for standard checkout popup
 */
export async function createRazorpayOrder(params: CreateRazorpayOrderParams): Promise<RazorpayOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      throw new Error(`Failed to create Razorpay order. Status: ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn('[Payment API] Could not connect to Razorpay order endpoint:', error);
    return {
      success: false,
      message: error.message || 'Failed to create payment order',
    };
  }
}

/**
 * Verify Razorpay HMAC payment signature after successful checkout
 */
export async function verifyPaymentSignature(params: VerifyPaymentSignatureParams): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/verify-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    return await res.json();
  } catch (error: any) {
    console.warn('[Payment API] Payment signature verification endpoint error:', error);
    return {
      success: false,
      message: error.message || 'Signature verification failed',
    };
  }
}

/**
 * Fetch payment status by paymentId or orderId
 */
export async function fetchPaymentStatus(paymentId: string): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/payment/${encodeURIComponent(paymentId)}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.payment : null;
  } catch (error) {
    console.warn('[Payment API] Error fetching payment status:', error);
    return null;
  }
}

export interface VerifyPaymentResult {
  success: boolean;
  verified: boolean;
  message?: string;
  payment?: any;
}

/**
 * Verify payment status with Backend API
 */
export async function verifyPaymentStatus(paymentIdOrOrderId: string): Promise<VerifyPaymentResult> {
  try {
    // 1. Query /api/payment/:id endpoint
    const res = await fetch(`${API_BASE_URL}/payment/${encodeURIComponent(paymentIdOrOrderId)}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.payment) {
        const status = (data.payment.status || '').toLowerCase();
        if (status === 'captured' || status === 'completed' || status === 'paid' || status === 'success') {
          return { success: true, verified: true, payment: data.payment };
        }
        if (status === 'failed' || status === 'cancelled') {
          return { success: true, verified: false, message: 'Payment failed or was cancelled.' };
        }
      }
    }

    // 2. Query /api/orders/:id endpoint
    const orderRes = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(paymentIdOrOrderId)}`, {
      cache: 'no-store',
    });

    if (orderRes.ok) {
      const orderData = await orderRes.json();
      if (orderData.success && orderData.data) {
        const pStatus = (orderData.data.paymentStatus || '').toLowerCase();
        if (pStatus === 'completed' || pStatus === 'paid' || pStatus === 'success') {
          return { success: true, verified: true, payment: orderData.data };
        }
      }
    }
  } catch (error: any) {
    console.warn('[Payment API] Payment verification check error:', error);
  }

  return { success: false, verified: false, message: 'Payment verification pending' };
}

