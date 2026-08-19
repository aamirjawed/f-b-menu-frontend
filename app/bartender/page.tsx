'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  BartenderSession,
  BartenderOrder,
  getBartenderToken,
  getBartenderSession,
  getBartenderProfile,
  getBartenderOrderById,
  updateBartenderOrderStatus,
  clearBartenderSession,
} from '@/services/bartenderApi';

export default function BartenderDashboardPage() {
  const router = useRouter();
  const [bartender, setBartender] = useState<BartenderSession | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<BartenderOrder | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScannedIdRef = useRef<string>('');

  // Auth check & profile fetch
  useEffect(() => {
    const token = getBartenderToken();
    if (!token) {
      router.replace('/bartender/login');
      return;
    }

    const localSession = getBartenderSession();
    if (localSession) {
      setBartender(localSession);
    }

    getBartenderProfile().then((res) => {
      if (res.success && res.bartender) {
        setBartender(res.bartender);
      } else if (!localSession) {
        clearBartenderSession();
        router.replace('/bartender/login');
      }
    });
  }, [router]);

  // Live query order from backend whenever searchInput or scan changes
  const fetchOrderLive = async (targetId: string) => {
    if (!targetId || !targetId.trim()) {
      setScannedOrder(null);
      return;
    }
    setIsLoadingOrder(true);
    const cleanId = targetId.trim();
    const res = await getBartenderOrderById(cleanId);
    setIsLoadingOrder(false);

    if (res.success && res.data) {
      setScannedOrder(res.data);
    } else {
      setScannedOrder(null);
    }
  };

  // Enable Camera Stream + Real-Time QR Scanning via BarcodeDetector
  useEffect(() => {
    let scanInterval: ReturnType<typeof setInterval> | null = null;

    if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
          }

          // Start QR scanning loop using BarcodeDetector API
          if ('BarcodeDetector' in window) {
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });

            scanInterval = setInterval(async () => {
              if (!videoRef.current || videoRef.current.readyState < 2) return;

              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const rawValue = barcodes[0].rawValue;
                  if (!rawValue || rawValue === lastScannedIdRef.current) return;
                  lastScannedIdRef.current = rawValue;

                  // Haptic vibration feedback on scan
                  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                  let targetOrderId = rawValue;
                  try {
                    const parsed = JSON.parse(rawValue);
                    targetOrderId = parsed.orderId || parsed.id || parsed.token || rawValue;
                  } catch {
                    targetOrderId = rawValue;
                  }

                  const cleanId = String(targetOrderId).replace(/^#/, '').trim();
                  setSearchInput(cleanId);
                  fetchOrderLive(cleanId);
                }
              } catch {
                // Ignore transient frame detection errors
              }
            }, 300);
          }
        })
        .catch((err) => {
          console.warn('[Camera] Unable to access camera stream:', err);
        });
    }

    return () => {
      if (scanInterval) clearInterval(scanInterval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleMarkCompleted = async (orderId: string) => {
    setIsProcessing(true);
    setStatusMessage(null);

    const res = await updateBartenderOrderStatus(orderId, 'completed');
    setIsProcessing(false);

    if (res.success) {
      setStatusMessage('✓ ORDER MARKED AS COMPLETED');
      // Update local state to reflect completed status immediately
      setScannedOrder((prev) => (prev ? { ...prev, orderStatus: 'completed', completedAt: new Date().toISOString() } : null));

      // After 2.5 seconds, reset view back to camera for the next customer
      setTimeout(() => {
        setStatusMessage(null);
        setSearchInput('');
        setScannedOrder(null);
        lastScannedIdRef.current = '';
      }, 2500);
    } else {
      setStatusMessage('⚠️ Failed to complete order');
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      lastScannedIdRef.current = searchInput.trim();
      fetchOrderLive(searchInput.trim());
    }
  };

  const handleLogout = () => {
    clearBartenderSession();
    router.replace('/bartender/login');
  };

  const handleResetScanner = () => {
    setSearchInput('');
    setScannedOrder(null);
    lastScannedIdRef.current = '';
    setStatusMessage(null);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Header */}
      <header className="bg-black text-white px-4 py-3 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍸</span>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider">
              {bartender?.stall?.name || 'BAR COUNTER'}
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Staff: <span className="text-white font-bold">{bartender?.name || 'Bartender'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {scannedOrder && (
            <button
              onClick={handleResetScanner}
              className="px-2.5 py-1.5 bg-neutral-800 text-white font-bold text-xs uppercase rounded-md border border-neutral-700 hover:bg-neutral-700"
            >
              🔄 SCAN NEXT
            </button>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-white text-black font-bold text-xs uppercase rounded-md border border-black hover:bg-neutral-200 shrink-0"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Main Scanner Body */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 flex flex-col items-center justify-start space-y-4">
        {/* Camera Viewfinder */}
        <div className="w-full relative aspect-square bg-black border-4 border-black rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          <div className="absolute inset-8 border-2 border-dashed border-white rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-white/75 text-xs font-mono font-bold uppercase bg-black/60 px-3 py-1 rounded">
              ALIGN CUSTOMER QR CODE
            </span>
          </div>
        </div>

        {/* Search / Scan Input Form */}
        <form onSubmit={handleManualSearch} className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
            Order ID or Token Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Scan QR or type Token / Order ID..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value.trim()) {
                  fetchOrderLive(e.target.value.trim());
                } else {
                  setScannedOrder(null);
                }
              }}
              className="flex-1 px-4 py-3 bg-white border-2 border-black rounded-xl text-sm font-mono font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-black text-white text-xs font-bold uppercase rounded-xl hover:bg-neutral-800"
            >
              FIND
            </button>
          </div>
        </form>

        {/* Status Notification Toast */}
        {statusMessage && (
          <div className="w-full py-3 bg-black text-white text-center font-mono font-bold text-sm rounded-xl uppercase shadow-md">
            {statusMessage}
          </div>
        )}

        {/* Live Loading Indicator */}
        {isLoadingOrder && !scannedOrder && (
          <div className="w-full py-4 text-center font-mono text-xs text-neutral-600 bg-neutral-50 rounded-xl border border-neutral-200">
            Checking live order status from database...
          </div>
        )}

        {/* Scanned Order Details Card with Live Database Status */}
        {scannedOrder && (
          <div className="w-full bg-white border-2 border-black rounded-xl p-4 space-y-3 shadow-md">
            {/* Header: Token & Live Status Badge */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 font-mono">
                  TOKEN NUMBER
                </span>
                <div className="text-2xl font-black font-mono text-black">
                  #{scannedOrder.tokenNumber ? scannedOrder.tokenNumber.replace(/^Token\s*#?/, '') : scannedOrder.id.slice(-4)}
                </div>
              </div>

              {scannedOrder.orderStatus === 'completed' ? (
                <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold font-mono rounded-md uppercase">
                  ALREADY COMPLETED
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold font-mono rounded-md uppercase">
                  READY TO SERVE
                </span>
              )}
            </div>

            {/* Customer & Items List */}
            <div>
              <p className="text-xs font-bold uppercase text-black mb-1.5">
                Customer: {scannedOrder.customerName || 'Walk-in Guest'}
              </p>

              <div className="space-y-1.5 my-2 max-h-48 overflow-y-auto">
                {scannedOrder.items && scannedOrder.items.length > 0 ? (
                  scannedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold p-1.5 bg-neutral-50 rounded border border-neutral-200">
                      <span className="font-bold">
                        {item.quantity} × {item.name}
                      </span>
                      <span className="font-mono font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-neutral-500 font-mono">No items listed</p>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="pt-2 border-t border-black flex justify-between font-mono text-xs font-bold">
              <span>TOTAL PAID:</span>
              <span>₹{scannedOrder.totalAmount}</span>
            </div>

            <div className="text-[10px] font-mono text-neutral-500 text-center">
              Order ID: #{scannedOrder.id}
            </div>

            {/* Actions / Status Box */}
            {scannedOrder.orderStatus === 'completed' ? (
              <div className="w-full p-4 bg-amber-50 border-2 border-amber-500 text-amber-950 rounded-xl text-center space-y-1">
                <p className="text-xs font-black uppercase font-mono tracking-wide">
                  ⚠️ THIS ORDER WAS ALREADY COMPLETED & SERVED
                </p>
                <p className="text-[11px] font-mono text-amber-800">
                  {scannedOrder.completedAt
                    ? 'Served at ' + new Date(scannedOrder.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : 'Order already fulfilled and closed'}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleMarkCompleted(scannedOrder.id)}
                disabled={isProcessing}
                className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? 'COMPLETING...' : '✓ MARK COMPLETED & SERVED'}
              </button>
            )}
          </div>
        )}

        {/* Not Found State */}
        {!isLoadingOrder && !scannedOrder && searchInput.trim() && (
          <div className="w-full p-4 border-2 border-dashed border-neutral-300 rounded-xl text-center text-xs font-mono text-neutral-500">
            No order found matching &quot;{searchInput}&quot;
          </div>
        )}
      </main>
    </div>
  );
}
