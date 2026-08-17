'use client';

import React from 'react';
import { OrderDetails } from '@/types/menu';

interface OrderSuccessModalProps {
  order: OrderDetails | null;
  onNewOrder: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onNewOrder,
}) => {
  if (!order) return null;

  const formattedDate = new Date(order.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const qrPayload = JSON.stringify({
    orderId: order.orderId,
    token: order.tableOrTokenNo,
    items: order.items.map(({ item, quantity }) => ({
      name: item.name,
      qty: quantity,
      price: item.price,
    })),
    total: order.total,
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-sm bg-white border border-gray-300 rounded-2xl shadow-xl overflow-hidden p-5 text-center my-auto">
        <h2 className="text-lg font-bold text-black">Order Confirmed!</h2>
        <p className="text-xs text-gray-500 mt-0.5">Order processed successfully</p>

        {/* Token Box */}
        <div className="my-3 p-3 rounded-md bg-gray-50 border border-gray-200">
          <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            TOKEN NUMBER
          </span>
          <div className="text-2xl font-black font-mono text-black mt-0.5">
            {order.tableOrTokenNo}
          </div>
        </div>

        {/* Order QR Code Box */}
        <div className="my-3 p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-2">
            Order QR Code
          </span>
          {/* eslint-disable-next-next/no-img-element */}
          <img
            src={qrImageUrl}
            alt="Order QR Code"
            className="w-40 h-40 border border-gray-300 rounded-lg p-1.5 bg-white object-contain shadow-xs"
          />
          <p className="text-[10px] text-gray-500 font-mono mt-1.5">
            Show QR at counter to verify order
          </p>
        </div>

        {/* Receipt Details */}
        <div className="bg-gray-50 rounded-md p-3 border border-gray-200 text-left space-y-2 font-mono text-xs mb-4">
          <div className="flex justify-between items-center text-gray-500 border-b border-gray-200 pb-1.5">
            <span>#{order.orderId}</span>
            <span>{formattedDate}</span>
          </div>

          <div className="space-y-1 py-1 max-h-32 overflow-y-auto">
            {order.items.map(({ item, quantity }) => (
              <div key={item.id} className="flex justify-between text-gray-800">
                <span className="truncate pr-2">
                  {quantity}x {item.name}
                </span>
                <span>₹{(item.price * quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-1.5 font-bold text-black text-xs flex justify-between">
            <span>Paid ({order.paymentMethod.toUpperCase()}):</span>
            <span>₹{order.total.toFixed(0)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 py-2 rounded-md bg-gray-100 text-black font-bold text-xs uppercase border border-gray-300 hover:bg-gray-200"
          >
            Print
          </button>

          <button
            type="button"
            onClick={onNewOrder}
            className="flex-1 py-2 rounded-md bg-black text-white font-bold text-xs uppercase hover:bg-gray-800"
          >
            New Order
          </button>
        </div>
      </div>
    </div>
  );
};

