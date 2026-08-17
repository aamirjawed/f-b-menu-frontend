'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BartenderOrder } from '@/services/bartenderApi';

interface BartenderQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: BartenderOrder[];
  onCompleteOrder: (orderId: string) => Promise<void>;
}

export const BartenderQrScannerModal: React.FC<BartenderQrScannerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onCompleteOrder,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<BartenderOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Search logic for Order ID, Token Number, or Customer Name
  useEffect(() => {
    if (!searchInput.trim()) {
      setMatchedOrder(null);
      return;
    }

    const term = searchInput.trim().toLowerCase();
    const found = orders.find((o) => {
      const idMatch = o.id.toLowerCase().includes(term);
      const tokenMatch = (o.tokenNumber || '').toLowerCase().includes(term);
      const nameMatch = (o.customerName || '').toLowerCase().includes(term);
      return idMatch || tokenMatch || nameMatch;
    });

    setMatchedOrder(found || null);
  }, [searchInput, orders]);

  // Camera stream activation
  useEffect(() => {
    if (isOpen && isCameraActive) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('[QR Scanner] Camera access not allowed or unavailable:', err);
          setIsCameraActive(false);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, isCameraActive]);

  if (!isOpen) return null;

  const handleComplete = async (orderId: string) => {
    setIsProcessing(true);
    setSuccessMsg(null);
    try {
      await onCompleteOrder(orderId);
      setSuccessMsg('✓ Order Completed Successfully!');
      setTimeout(() => {
        setSuccessMsg(null);
        setSearchInput('');
        setMatchedOrder(null);
      }, 1500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📷</span>
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Scan Customer QR / Token
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 text-white font-bold text-xs flex items-center justify-center transition-all"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 bg-white text-black">
          {/* Camera Scanner View */}
          <div className="border-2 border-black rounded-xl p-3 bg-neutral-50 text-center">
            {isCameraActive ? (
              <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" />
                <div className="absolute inset-4 border-2 border-dashed border-white pointer-events-none rounded-md" />
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-xs font-bold uppercase tracking-wider text-black">
                  Camera QR Scanner
                </p>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Point camera at customer receipt QR code
                </p>
                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  className="mt-3 px-4 py-2 bg-black text-white text-xs font-bold uppercase rounded-md hover:bg-neutral-800 transition-all"
                >
                  Start Camera Scan
                </button>
              </div>
            )}
          </div>

          {/* Manual Input / Scan Backup */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
              Enter Token # or Order ID
            </label>
            <input
              type="text"
              placeholder="e.g. ORD-123456 or Token #42"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border-2 border-black rounded-lg text-sm font-mono font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 bg-black text-white font-bold text-xs rounded-lg text-center font-mono">
              {successMsg}
            </div>
          )}

          {/* Scanned Order Result */}
          {matchedOrder ? (
            <div className="border-2 border-black rounded-xl p-4 bg-neutral-50 space-y-3">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    TOKEN NUMBER
                  </span>
                  <div className="text-xl font-mono font-black text-black">
                    #{matchedOrder.tokenNumber || matchedOrder.id.slice(-4)}
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-black text-white text-xs font-bold font-mono rounded-md uppercase">
                  {matchedOrder.orderStatus}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase text-neutral-600">
                  Customer Items:
                </span>
                {matchedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-semibold">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-mono">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-2 border-t border-black flex justify-between font-mono text-xs font-bold">
                <span>TOTAL:</span>
                <span>₹{matchedOrder.totalAmount}</span>
              </div>

              {/* Complete Action Button */}
              {matchedOrder.orderStatus !== 'completed' ? (
                <button
                  type="button"
                  onClick={() => handleComplete(matchedOrder.id)}
                  disabled={isProcessing}
                  className="w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? 'Updating...' : '✓ Mark Order Completed & Served'}
                </button>
              ) : (
                <div className="w-full py-2 bg-neutral-200 border border-black text-black text-xs font-bold text-center uppercase rounded-lg">
                  ✓ Order Already Completed
                </div>
              )}
            </div>
          ) : searchInput.trim() ? (
            <div className="p-4 border-2 border-dashed border-neutral-300 rounded-xl text-center text-xs text-neutral-500">
              No matching order found for &quot;{searchInput}&quot;
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 border-t border-neutral-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-black text-black text-xs font-bold uppercase rounded-md hover:bg-neutral-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
