'use client';

import React from 'react';
import { BartenderOrder } from '@/services/bartenderApi';
import { BartenderOrderCard } from './BartenderOrderCard';

interface BartenderOrdersListProps {
  orders: BartenderOrder[];
  activeFilter: 'active' | 'completed' | 'all';
  onUpdateStatus: (orderId: string, status: 'pending' | 'preparing' | 'completed' | 'cancelled') => Promise<void>;
}

export const BartenderOrdersList: React.FC<BartenderOrdersListProps> = ({
  orders,
  activeFilter,
  onUpdateStatus,
}) => {
  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'active') return o.orderStatus === 'pending' || o.orderStatus === 'preparing';
    if (activeFilter === 'completed') return o.orderStatus === 'completed';
    return true;
  });

  if (filteredOrders.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-black flex items-center justify-center text-3xl mb-4 shadow-sm">
          {activeFilter === 'completed' ? '✓' : '🍸'}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-black">
          {activeFilter === 'completed' ? 'No completed orders yet' : 'No active orders in queue'}
        </h3>
        <p className="text-xs text-neutral-600 max-w-sm mt-1 font-mono">
          {activeFilter === 'completed'
            ? 'Orders will appear here as soon as you mark them completed.'
            : 'New drink orders placed by customers at your counter will appear here automatically.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {filteredOrders.map((order) => (
        <BartenderOrderCard
          key={order.id}
          order={order}
          onUpdateStatus={onUpdateStatus}
        />
      ))}
    </div>
  );
};

