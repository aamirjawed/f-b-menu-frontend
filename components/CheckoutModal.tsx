'use client';

import React, { useState, useId, useMemo } from 'react';
import { CartItem, PaymentMethod, OrderDetails } from '@/types/menu';
import { ItemCounter } from './ItemCounter';
import { UpiQrPaymentView } from './payment/UpiQrPaymentView';
import { openRazorpayCheckout } from './payment/RazorpayCheckout';
import { placeOrder } from '@/services/orderApi';
import { verifyPaymentStatus } from '@/services/paymentApi';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId?: string;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onClearCart: () => void;
  onOrderComplete: (orderDetails: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  vendorId,
  cartItems,
  total,
  onUpdateQuantity,
  onOrderComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate unique order ID for this checkout session
  const activeOrderId = useMemo(() => {
    return 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  }, [isOpen]);

  if (!isOpen) return null;

  const finishOrder = async (paidPaymentMethod: PaymentMethod, paymentId?: string) => {
    // Send order to backend MySQL database so bartender gets notified
    const orderPayload = {
      vendorId: vendorId || undefined,
      customerName: customerName.trim() || 'Guest Customer',
      customerPhone: customerPhone.trim() || undefined,
      items: cartItems.map((ci) => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
      })),
      totalAmount: total,
      paymentMethod: paidPaymentMethod,
      paymentId: paymentId || activeOrderId,
    };

    const result = await placeOrder(orderPayload);
    const tokenNumber = result.success && result.data?.tokenNumber 
      ? `Token #${result.data.tokenNumber}` 
      : 'Token #' + Math.floor(10 + Math.random() * 90);

    const orderDetails: OrderDetails = {
      orderId: result.success && result.data?.id ? result.data.id : activeOrderId,
      vendorId,
      items: cartItems,
      subtotal: total,
      tax: 0,
      total,
      paymentMethod: paidPaymentMethod,
      customerName: customerName.trim() || undefined,
      tableOrTokenNo: tokenNumber,
      timestamp: new Date(),
    };

    setIsProcessing(false);
    onOrderComplete(orderDetails);
  };

  const handlePayAndOrder = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    if (paymentMethod === 'card') {
      await openRazorpayCheckout({
        amount: total,
        vendorId,
        orderId: activeOrderId,
        onSuccess: () => {
          finishOrder('card');
        },
        onFailure: (err) => {
          setIsProcessing(false);
          setErrorMessage(err || 'Payment failed');
        },
      });
    } else if (paymentMethod === 'upi') {
      // Verify payment with backend controller first
      const verification = await verifyPaymentStatus(activeOrderId);
      if (verification.success && !verification.verified && verification.message) {
        setIsProcessing(false);
        setErrorMessage(`⚠️ ${verification.message}`);
        return;
      }
      // If payment is verified or user confirms payment, finish order & generate Order QR
      await finishOrder('upi', activeOrderId);
    } else {
      // Cash
      await finishOrder(paymentMethod);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="relative w-full max-w-md bg-white border border-gray-300 rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-base font-bold text-black">Checkout</h2>
            <p className="text-xs text-gray-500">Order Summary & Payment</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-gray-200 text-black hover:bg-gray-300 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* Selected Items */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Items ({cartItems.length})
            </h3>

            <div className="space-y-2">
              {cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-md bg-gray-50 border border-gray-200 gap-2"
                >
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="text-xs font-bold text-black truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-mono text-gray-600">
                      ₹{item.price} × {quantity} = <strong className="text-black">₹{(item.price * quantity).toFixed(0)}</strong>
                    </p>
                  </div>

                  <ItemCounter
                    quantity={quantity}
                    onIncrement={() => onUpdateQuantity(item.id, 1)}
                    onDecrement={() => onUpdateQuantity(item.id, -1)}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Payment Method
            </h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('upi');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-md border text-xs font-bold transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                UPI QR
              </button>

              {/* Hidden for now as requested */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('cash');
                  setErrorMessage(null);
                }}
                className={`hidden py-2 rounded-md border text-xs font-bold transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                Cash
              </button>

              {/* Hidden for now as requested */}
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('card');
                  setErrorMessage(null);
                }}
                className={`hidden py-2 rounded-md border text-xs font-bold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-black text-white border-black'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                Card / NetBanking
              </button>
            </div>

            {/* Modular Instant Dynamic UPI QR View */}
            {paymentMethod === 'upi' && (
              <div className="mt-3">
                <UpiQrPaymentView
                  amount={total}
                  vendorId={vendorId}
                  orderId={activeOrderId}
                  onPaymentConfirmed={() => finishOrder('upi', activeOrderId)}
                  onPaymentFailed={(msg) => {
                    setIsProcessing(false);
                    setErrorMessage(msg || 'Payment failed or incomplete');
                  }}
                />
              </div>
            )}
          </div>


          {/* Real Price Display */}
          <div className="p-3 rounded-md bg-gray-50 border border-gray-200 font-mono text-xs flex justify-between items-center">
            <span className="font-bold text-gray-700">TOTAL PAYABLE:</span>
            <span className="text-base font-bold text-black">₹{total.toFixed(0)}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-3 px-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-black"
          >
            Cancel
          </button>

          {paymentMethod === 'upi' ? (
            <div className="flex-1 flex items-center justify-between gap-2 p-2.5 bg-gray-100 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 font-mono">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>Awaiting payment...</span>
              </div>
              <button
                type="button"
                onClick={handlePayAndOrder}
                disabled={isProcessing}
                className="px-2.5 py-1 bg-black text-white rounded text-[11px] font-bold uppercase hover:bg-gray-800 transition-colors"
              >
                {isProcessing ? 'Verifying...' : 'Paid? Confirm'}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handlePayAndOrder}
              disabled={cartItems.length === 0 || isProcessing}
              className="flex-1 py-2.5 rounded-md bg-black text-white font-bold text-xs uppercase hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-50"
            >
              {isProcessing
                ? 'Processing Order...'
                : paymentMethod === 'card'
                ? `Pay ₹${total.toFixed(0)} via Razorpay`
                : `Confirm Cash Order (₹${total.toFixed(0)})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
