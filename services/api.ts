import { Category, MenuItem } from '@/types/menu';
import { API_BASE_URL } from '@/services/config';

export interface MenuResponse {
  categories: Category[];
  items: MenuItem[];
  stall?: {
    id: string;
    name: string;
    stallNumber?: string;
    location?: string;
    isActive?: boolean;
  } | null;
}

// Fetch Categories & Menu Items together for a specific Vendor / Stall
export async function getMenuData(vendorId?: string): Promise<MenuResponse> {
  try {
    const url = vendorId
      ? `${API_BASE_URL}/menu?vendorId=${encodeURIComponent(vendorId)}`
      : `${API_BASE_URL}/menu`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.warn(`[Menu API] Backend returned status ${res.status} for ${url}`);
      return {
        categories: [],
        items: [],
        stall: null,
      };
    }

    const data = await res.json();

    if (data && data.success) {
      return {
        categories: Array.isArray(data.categories) ? data.categories : [],
        items: Array.isArray(data.data) ? data.data : [],
        stall: data.stall || null,
      };
    }
  } catch (error) {
    console.warn('[Menu API] Failed to fetch menu data from backend:', error);
  }

  return {
    categories: [],
    items: [],
    stall: null,
  };
}

export async function getCategories(vendorId?: string): Promise<Category[]> {
  const { categories } = await getMenuData(vendorId);
  return categories;
}

export async function getMenuItems(vendorId?: string): Promise<MenuItem[]> {
  const { items } = await getMenuData(vendorId);
  return items;
}


