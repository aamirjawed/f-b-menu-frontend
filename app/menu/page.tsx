'use client';

import { Suspense } from 'react';
import FoodStallApp from '../page';

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading menu...</div>}>
      <FoodStallApp />
    </Suspense>
  );
}
