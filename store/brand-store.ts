import { create } from 'zustand'
import type { BrandProfile } from '@/types'

interface BrandState {
  activeBrand: BrandProfile | null
  brands: BrandProfile[]
  isLoading: boolean
  setActiveBrand: (brand: BrandProfile | null) => void
  setBrands: (brands: BrandProfile[]) => void
  addBrand: (brand: BrandProfile) => void
  updateBrand: (id: string, updates: Partial<BrandProfile>) => void
  removeBrand: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useBrandStore = create<BrandState>((set) => ({
  activeBrand: null,
  brands: [],
  isLoading: false,
  setActiveBrand: (brand) => set({ activeBrand: brand }),
  setBrands: (brands) => set({ brands }),
  addBrand: (brand) =>
    set((state) => ({
      brands: [...state.brands, brand]
    })),
  updateBrand: (id, updates) =>
    set((state) => ({
      brands: state.brands.map((brand) =>
        brand.id === id ? { ...brand, ...updates } : brand
      ),
      activeBrand:
        state.activeBrand?.id === id
          ? { ...state.activeBrand, ...updates }
          : state.activeBrand
    })),
  removeBrand: (id) =>
    set((state) => ({
      brands: state.brands.filter((brand) => brand.id !== id),
      activeBrand: state.activeBrand?.id === id ? null : state.activeBrand
    })),
  setLoading: (loading) => set({ isLoading: loading })
}))