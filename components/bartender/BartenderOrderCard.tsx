'use client';

import React, { useState } from 'react';
import { BartenderOrder } from '@/services/bartenderApi';

interface BartenderOrderCardProps {
  order: BartenderOrder;
  onUpdateStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed' | 'cancelled') => Promise<void>;
}

export const BartenderOrderCard: React.FC<BartenderOrderCardProps> = ({ order, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const formatElapsed = (dateStr: string) => {
    const diff = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000));
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const handleAction = async (newStatus: 'pending' | 'preparing' | 'completed' | 'cancelled') => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const isCompleted = order.orderStatus === 'completed';
  const isPreparing = order.orderStatus === 'preparing';

  return (
    <div
      className={`rounded-xl border-2 p-4 flex flex-col justify-between transition-all duration-200 ${
        isCompleted
          ? 'bg-neutral-100 border-neutral-300 text-neutral-500'
          : 'bg-white border-black text-black shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Details & Token */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3 border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black font-mono tracking-tight text-black bg-neutral-100 px-2.5 py-1 rounded-md border border-black">
              #{order.tokenNumber || order.id.slice(-4)}
            </span>
            <div>
              <h3 className="text-xs font-bold text-black uppercase">
                {order.customerName || 'Walk-in Guest'}
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                {formatElapsed(order.createdAt)}
              </p>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono border ${
              isCompleted
                ? 'bg-neutral-200 text-neutral-700 border-neutral-400'
                : isPreparing
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-black'
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* Order Items List */}
        <div className="space-y-2 py-2 mb-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-black text-white font-mono font-bold flex items-center justify-center text-[11px]">
                  {item.quantity}×
                </span>
                <span className="font-bold text-black">{item.name}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-black">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Order Meta / Total */}
        <div className="flex items-center justify-between text-[11px] font-mono border-t border-neutral-200 pt-2 text-black">
          <span>TOTAL: ₹{order.totalAmount}</span>
          <span className="uppercase font-bold">
            [{order.paymentStatus}]
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t-2 border-black flex items-center gap-2">
        {order.orderStatus !== 'completed' ? (
          <button
            onClick={() => handleAction('completed')}
            disabled={isUpdating}
            className="w-full py-2.5 rounded-lg bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-50"
          >
            <span>✓</span> Mark Completed & Served
          </button>
        ) : (
          <div className="w-full py-2 text-center text-xs font-bold uppercase text-black bg-neutral-200 rounded-lg border border-black">
            ✓ Order Completed
          </div>
        )}
      </div>
    </div>
  );
};

