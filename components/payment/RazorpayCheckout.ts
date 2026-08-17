import { createRazorpayOrder, verifyPaymentSignature } from '@/services/paymentApi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Helper to dynamically load the Razorpay checkout.js script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface TriggerRazorpayParams {
  amount: number;
  vendorId?: string;
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  onSuccess: (paymentDetails: any) => void;
  onFailure: (error: string) => void;
}

/**
 * Trigger modular Razorpay Checkout modal
 */
export async function openRazorpayCheckout({
  amount,
  vendorId,
  orderId,
  customerName,
  customerPhone,
  onSuccess,
  onFailure,
}: TriggerRazorpayParams): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onFailure('Razorpay SDK failed to load. Please check your network connection.');
    return;
  }

  const orderRes = await createRazorpayOrder({
    amount,
    vendorId,
    orderId,
    customerDetails: {
      name: customerName || 'Food Stall Customer',
      phone: customerPhone || '',
    },
  });

  if (!orderRes.success || !orderRes.razorpayOrder) {
    onFailure(orderRes.message || 'Could not initiate payment order.');
    return;
  }

  const options = {
    key: orderRes.keyId,
    amount: orderRes.razorpayOrder.amount,
    currency: orderRes.razorpayOrder.currency,
    name: 'Food Stall POS',
    description: `Payment for Order #${orderId || orderRes.razorpayOrder.id}`,
    order_id: orderRes.razorpayOrder.id,
    handler: async (response: any) => {
      const verification = await verifyPaymentSignature({
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (verification.success) {
        onSuccess(response);
      } else {
        onFailure(verification.message || 'Payment signature verification failed.');
      }
    },
    prefill: {
      name: customerName || '',
      contact: customerPhone || '',
    },
    theme: {
      color: '#000000',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (resp: any) => {
    onFailure(resp.error?.description || 'Payment execution failed.');
  });
  rzp.open();
}
