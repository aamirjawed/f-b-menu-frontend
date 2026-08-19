'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BartenderSession,
  BartenderOrder,
  getBartenderToken,
  getBartenderSession,
  getBartenderProfile,
  getBartenderOrders,
  updateBartenderOrderStatus,
  clearBartenderSession,
} from '@/services/bartenderApi';

export default function BartenderDashboardPage() {
  const router = useRouter();
  const [bartender, setBartender] = useState<BartenderSession | null>(null);
  const [orders, setOrders] = useState<BartenderOrder[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [scannedOrder, setScannedOrder] = useState<BartenderOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Direct QR payload data (displayed instantly from QR scan, no backend lookup)
  const [qrOrderData, setQrOrderData] = useState<{
    orderId: string;
    token: string;
    items: { name: string; qty: number; price: number }[];
    total: number;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auth check & profile fetch
  useEffect(() => {
    const token = getBartenderToken();
    if (!token) {
      router.replace('/bartender/login');
      return;
    }

    // Pre-populate with local session to prevent flickering or premature logout
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

  // Fetch orders queue
  const fetchOrders = useCallback(async () => {
    const res = await getBartenderOrders();
    if (res.success && Array.isArray(res.data)) {
      setOrders(res.data);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Enable Camera Stream + Real-Time QR Scanning via BarcodeDetector
  useEffect(() => {
    let scanInterval: ReturnType<typeof setInterval> | null = null;
    let lastScannedValue = '';

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
                  if (!rawValue || rawValue === lastScannedValue) return;
                  lastScannedValue = rawValue;

                  // Haptic vibration feedback on scan
                  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

                  // Try to parse QR JSON payload from OrderSuccessModal
                  try {
                    const parsed = JSON.parse(rawValue);
                    if (parsed.orderId && parsed.items) {
                      // Full order QR payload — display directly
                      setQrOrderData({
                        orderId: parsed.orderId,
                        token: parsed.token || '',
                        items: Array.isArray(parsed.items) ? parsed.items : [],
                        total: parsed.total || 0,
                      });
                      setSearchInput(parsed.orderId);
                      setScannedOrder(null);
                    } else {
                      const searchTerm = parsed.orderId || parsed.token || parsed.id || rawValue;
                      setSearchInput(String(searchTerm).replace(/^#/, ''));
                    }
                  } catch {
                    // Not JSON — use raw text as search (e.g. plain Order ID or Token #)
                    setQrOrderData(null);
                    setSearchInput(rawValue.replace(/^#/, ''));
                  }
                }
              } catch {
                // BarcodeDetector.detect() can throw on some frames, ignore
              }
            }, 350);
          } else {
            console.warn('[QR Scanner] BarcodeDetector API not supported in this browser. Use manual token entry.');
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

  // Filter scanned order when typing or scanning
  useEffect(() => {
    if (!searchInput.trim()) {
      setScannedOrder(null);
      return;
    }

    const term = searchInput.trim().toLowerCase();
    const match = orders.find((o) => {
      const idMatch = o.id.toLowerCase().includes(term);
      const tokenMatch = (o.tokenNumber || '').toLowerCase().includes(term);
      const nameMatch = (o.customerName || '').toLowerCase().includes(term);
      return idMatch || tokenMatch || nameMatch;
    });

    setScannedOrder(match || null);
  }, [searchInput, orders]);

  const handleMarkCompleted = async (orderId: string) => {
    setIsProcessing(true);
    setStatusMessage(null);

    const res = await updateBartenderOrderStatus(orderId, 'completed');
    setIsProcessing(false);

    if (res.success) {
      setStatusMessage('✓ ORDER COMPLETED');
      setSearchInput('');
      setScannedOrder(null);
      setQrOrderData(null);
      fetchOrders();
      setTimeout(() => setStatusMessage(null), 2000);
    } else {
      setStatusMessage('⚠️ Failed to complete order');
    }
  };

  const handleLogout = () => {
    clearBartenderSession();
    router.replace('/bartender/login');
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-sans">
      {/* Black & White Header */}
      <header className="bg-black text-white px-4 py-3 border-b-2 border-black flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍸</span>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider">
              {bartender?.stall?.name || 'BAR STATION'}
            </h1>
            <p className="text-[11px] text-neutral-400 font-mono">
              Staff: <span className="text-white font-bold">{bartender?.name || 'Bartender'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 bg-white text-black font-bold text-xs uppercase rounded-md border border-black hover:bg-neutral-200 shrink-0 whitespace-nowrap flex items-center gap-1"
        >
          <span>🚪</span> LOGOUT
        </button>
      </header>

      {/* Main Full-Screen Camera & Order View */}
      <main className="flex-1 max-w-lg w-full mx-auto p-4 flex flex-col items-center justify-start space-y-4">
        {/* Full-Screen Camera Viewfinder */}
        <div className="w-full relative aspect-square bg-black border-4 border-black rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Target Scanning Reticle Overlay */}
          <div className="absolute inset-8 border-2 border-dashed border-white rounded-xl pointer-events-none flex items-center justify-center">
            <span className="text-white/60 text-xs font-mono font-bold uppercase bg-black/60 px-3 py-1 rounded">
              ALIGN CUSTOMER QR CODE
            </span>
          </div>
        </div>

        {/* Scan Input / Order ID Search */}
        <div className="w-full">
          <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
            Scan Result / Enter Order ID or Token #
          </label>
          <input
            type="text"
            placeholder="Scan QR or type Token / Order ID..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-sm font-mono font-bold text-black focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="w-full py-3 bg-black text-white text-center font-mono font-bold text-sm rounded-xl uppercase">
            {statusMessage}
          </div>
        )}

        {/* Order Details Card — from QR scan or backend search */}
        {qrOrderData ? (
          <div className="w-full bg-white border-2 border-black rounded-xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 font-mono">
                  TOKEN NUMBER
                </span>
                <div className="text-2xl font-black font-mono text-black">
                  {qrOrderData.token || '#' + qrOrderData.orderId.slice(-4)}
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold font-mono rounded-md uppercase">
                QR SCANNED
              </span>
            </div>

            <div className="space-y-1 my-2">
              {qrOrderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-semibold">
                  <span>
                    {item.qty}× {item.name}
                  </span>
                  <span className="font-mono font-bold">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-black flex justify-between font-mono text-xs font-bold">
              <span>TOTAL AMOUNT:</span>
              <span>₹{qrOrderData.total}</span>
            </div>

            <div className="text-[10px] font-mono text-neutral-500 text-center">
              Order ID: {qrOrderData.orderId}
            </div>

            <button
              type="button"
              onClick={() => handleMarkCompleted(qrOrderData.orderId)}
              disabled={isProcessing}
              className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'COMPLETING...' : '✓ MARK COMPLETED & SERVED'}
            </button>
          </div>
        ) : scannedOrder ? (
          <div className="w-full bg-white border-2 border-black rounded-xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-500 font-mono">
                  TOKEN NUMBER
                </span>
                <div className="text-2xl font-black font-mono text-black">
                  #{scannedOrder.tokenNumber || scannedOrder.id.slice(-4)}
                </div>
              </div>

              <span className="px-3 py-1 bg-black text-white text-xs font-bold font-mono rounded-md uppercase">
                {scannedOrder.orderStatus}
              </span>
            </div>

            {/* Customer & Items */}
            <div>
              <p className="text-xs font-bold uppercase text-black mb-1">
                Customer: {scannedOrder.customerName || 'Walk-in Guest'}
              </p>

              <div className="space-y-1 my-2">
                {scannedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-semibold">
                    <span>
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-mono font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-black flex justify-between font-mono text-xs font-bold">
              <span>TOTAL AMOUNT:</span>
              <span>₹{scannedOrder.totalAmount}</span>
            </div>

            {scannedOrder.orderStatus !== 'completed' ? (
              <button
                type="button"
                onClick={() => handleMarkCompleted(scannedOrder.id)}
                disabled={isProcessing}
                className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? 'COMPLETING...' : '✓ COMPLETED'}
              </button>
            ) : (
              <div className="w-full py-3 bg-neutral-200 border-2 border-black text-black font-bold text-xs uppercase text-center rounded-xl font-mono">
                ✓ ORDER ALREADY COMPLETED
              </div>
            )}
          </div>
        ) : searchInput.trim() ? (
          <div className="w-full p-4 border-2 border-dashed border-black rounded-xl text-center text-xs font-mono text-neutral-600">
            No matching order found for &quot;{searchInput}&quot;
          </div>
        ) : (
          /* Live Recent Pending Orders Quick Select List */
          orders.filter((o) => o.orderStatus !== 'completed').length > 0 && (
            <div className="w-full border-2 border-black rounded-xl p-3 bg-white">
              <span className="text-[10px] font-bold uppercase text-black font-mono block mb-2">
                Picks from Live Queue ({orders.filter((o) => o.orderStatus !== 'completed').length} active):
              </span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto">
                {orders
                  .filter((o) => o.orderStatus !== 'completed')
                  .slice(0, 5)
                  .map((o) => (
                    <div
                      key={o.id}
                      onClick={() => setSearchInput(o.tokenNumber || o.id)}
                      className="p-2 border border-black rounded-lg hover:bg-neutral-100 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <span className="font-mono font-bold">#{o.tokenNumber || o.id.slice(-4)}</span>
                      <span className="truncate max-w-[160px] font-semibold">{o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkCompleted(o.id);
                        }}
                        className="px-2.5 py-1 bg-black text-white text-[10px] font-bold uppercase rounded"
                      >
                        ✓ COMPLETED
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

