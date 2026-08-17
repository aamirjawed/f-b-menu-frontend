'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Category, MenuItem, CartItem, OrderDetails } from '@/types/menu';
import { getMenuData } from '@/services/api';
import { Header } from '@/components/Header';
import { CategoryAccordion } from '@/components/CategoryAccordion';
import { CheckoutFooter } from '@/components/CheckoutFooter';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';

function MainMenuContent() {
  const searchParams = useSearchParams();
  const rawVendor = searchParams.get('vendorId') || searchParams.get('vendor') || searchParams.get('code');
  const vendorId = rawVendor || process.env.NEXT_PUBLIC_DEFAULT_VENDOR_ID || undefined;

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [stallInfo, setStallInfo] = useState<{ id: string; name: string; stallNumber?: string; location?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getMenuData(vendorId);
      setCategories(data.categories || []);
      setMenuItems(data.items || []);
      setStallInfo(data.stall || null);
      setLoading(false);
    }
    loadData();
  }, [vendorId]);


  // Derive unique categories dynamically matching both category name and ID
  const displayCategories = useMemo(() => {
    const categoryMap = new Map<string, Category>();

    // 1. Add categories returned from backend
    categories.forEach((cat) => {
      categoryMap.set(cat.id.toLowerCase(), cat);
      categoryMap.set(cat.name.toLowerCase(), cat);
    });

    // 2. Ensure all categories referenced by menu items exist
    menuItems.forEach((item) => {
      if (item.category) {
        const catKey = item.category.toLowerCase();
        if (!categoryMap.has(catKey)) {
          const fallbackCat: Category = {
            id: item.category,
            name: item.category,
            icon: '',
            subCategories: ['All'],
          };
          categoryMap.set(catKey, fallbackCat);
        }
      }
    });

    // Return unique category objects
    return Array.from(new Set(categoryMap.values()));
  }, [categories, menuItems]);

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartQuantities((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQty };
    });
  };

  const cartItems: CartItem[] = useMemo(() => {
    return Object.entries(cartQuantities)
      .map(([id, quantity]) => {
        const item = menuItems.find((m) => m.id === id);
        if (!item || quantity <= 0) return null;
        return { item, quantity };
      })
      .filter((ci): ci is CartItem => ci !== null);
  }, [cartQuantities, menuItems]);

  const totalItemsCount = useMemo(() => {
    return Object.values(cartQuantities).reduce((acc, q) => acc + q, 0);
  }, [cartQuantities]);

  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, { item, quantity }) => sum + item.price * quantity,
      0
    );
  }, [cartItems]);

  const handleOrderComplete = (orderDetails: OrderDetails) => {
    setIsCheckoutOpen(false);
    setCompletedOrder(orderDetails);
    setCartQuantities({});
  };

  const handleStartNewOrder = () => {
    setCompletedOrder(null);
    setCartQuantities({});
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex justify-center">
      {/* Mobile Screen Container */}
      <div className="w-full max-w-md min-h-screen bg-white border-x border-gray-200 flex flex-col pb-28">
        {/* Header */}
        <Header
          eventName="Grand Food Fest '26"
          stallLocation={
            stallInfo
              ? `${stallInfo.name}${stallInfo.stallNumber ? ` • ${stallInfo.stallNumber}` : ''}`
              : vendorId
              ? `Stall: ${vendorId}`
              : "Food Stall Counter"
          }
          cartItemCount={totalItemsCount}
          totalAmount={total}
          onOpenCart={() => setIsCheckoutOpen(true)}
        />

        {/* Main Categories Accordion List */}
        <main className="p-4 flex-1">
          {loading ? (
            <div className="py-12 text-center text-gray-500 font-medium">Loading vendor menu...</div>
          ) : menuItems.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <div className="text-4xl mb-3">🍽️</div>
              <p className="font-semibold text-gray-700">No menu items available for this stall.</p>
              <p className="text-sm text-gray-400 mt-1">Please check back later or add items in the Admin panel.</p>
            </div>
          ) : (
            displayCategories.map((category) => {
              const items = menuItems.filter((item) => {
                if (!item.category) return false;
                const catLower = item.category.toLowerCase();
                return (
                  catLower === category.id.toLowerCase() ||
                  catLower === category.name.toLowerCase()
                );
              });

              if (items.length === 0) return null;

              return (
                <CategoryAccordion
                  key={category.id}
                  category={category}
                  items={items}
                  cartQuantities={cartQuantities}
                  onIncrement={(itemId) => handleUpdateQuantity(itemId, 1)}
                  onDecrement={(itemId) => handleUpdateQuantity(itemId, -1)}
                />
              );
            })
          )}
        </main>

        {/* Sticky Checkout Footer */}
        <CheckoutFooter
          totalItems={totalItemsCount}
          total={total}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          vendorId={vendorId}
          cartItems={cartItems}
          subtotal={total}
          tax={0}
          total={total}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={() => setCartQuantities({})}
          onOrderComplete={handleOrderComplete}
        />

        {/* Receipt Modal */}
        <OrderSuccessModal
          order={completedOrder}
          onNewOrder={handleStartNewOrder}
        />
      </div>
    </div>
  );
}

export default function FoodStallApp() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <MainMenuContent />
    </Suspense>
  );
}
