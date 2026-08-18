'use client';

import { Suspense } from 'react';
import FoodStallApp from '@/components/FoodStallApp';

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading menu...</div>}>
      <FoodStallApp />
    </Suspense>
  );
}
