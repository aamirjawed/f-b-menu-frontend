'use client';

import React, { useState, useEffect } from 'react';
import { createPaymentQRCode, verifyPaymentStatus, PaymentQrResponse } from '@/services/paymentApi';

interface UpiQrPaymentViewProps {
  amount: number;
  vendorId?: string;
  orderId?: string;
  onPaymentConfirmed?: () => void;
  onPaymentFailed?: (msg: string) => void;
}

export const UpiQrPaymentView: React.FC<UpiQrPaymentViewProps> = ({
  amount,
  vendorId,
  orderId,
  onPaymentConfirmed,
  onPaymentFailed,
}) => {
  const [loading, setLoading] = useState(true);
  const [qrResponse, setQrResponse] = useState<PaymentQrResponse | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Awaiting UPI payment confirmation...');

  useEffect(() => {
    let isMounted = true;

    async function loadQrCode() {
      setLoading(true);
      const data = await createPaymentQRCode({
        amount,
        vendorId,
        orderId,
      });

      if (isMounted) {
        setQrResponse(data);
        setLoading(false);
      }
    }

    if (amount > 0) {
      loadQrCode();
    }

    return () => {
      isMounted = false;
    };
  }, [amount, vendorId, orderId]);

  // Automatic Background Verification Polling
  useEffect(() => {
    const activeId = orderId || qrResponse?.qrData?.orderId;
    if (!activeId) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      const result = await verifyPaymentStatus(activeId);
      if (!isMounted) return;

      if (result.verified) {
        setStatusMessage('✓ Payment Verified Successfully!');
        if (onPaymentConfirmed) {
          onPaymentConfirmed();
        }
      } else if (result.message && result.message.includes('failed')) {
        setStatusMessage('❌ Payment Failed');
        if (onPaymentFailed) {
          onPaymentFailed(result.message);
        }
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId, qrResponse, onPaymentConfirmed, onPaymentFailed]);

  if (loading) {
    return (
      <div className="p-6 text-center bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-gray-600">Generating instant UPI QR Code...</p>
      </div>
    );
  }

  const qrData = qrResponse?.qrData;

  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Instant UPI Payment
          </span>
          <p className="text-[11px] text-gray-500 font-mono">
            Order #{qrData?.orderId || orderId}
          </p>
        </div>
        <span className="text-sm font-bold text-black font-mono">
          ₹{amount.toFixed(0)}
        </span>
      </div>

      {/* QR Code Image Container */}
      <div className="flex flex-col items-center justify-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
        {qrData?.imageUrl ? (
          // eslint-disable-next-next/no-img-element
          <img
            src={qrData.imageUrl}
            alt="Scan to Pay UPI QR Code"
            className="w-44 h-44 object-contain"
          />
        ) : (
          <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
            QR unavailable
          </div>
        )}
        <p className="text-xs font-bold text-black mt-2">Scan with any UPI App</p>
        <p className="text-[11px] text-gray-500 font-medium">GPay • PhonePe • Paytm • BHIM</p>
      </div>

      {/* Live Polling Status Indicator */}
      <div className="flex items-center justify-center gap-2 py-1 px-2 rounded-md bg-white border border-gray-200 text-xs font-semibold text-gray-700">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span>{statusMessage}</span>
      </div>

      {/* Direct Mobile UPI Intent Button (Opens UPI App directly on Mobile) */}
      {qrData?.upiString && (
        <a
          href={qrData.upiString}
          className="block w-full py-2 px-3 bg-black text-white text-center font-bold text-xs rounded-md hover:bg-gray-800 transition-colors"
        >
          📱 Open in UPI App to Pay ₹{amount.toFixed(0)}
        </a>
      )}
    </div>
  );
};

