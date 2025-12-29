/**
 * Price Calculation Engine
 * Formula: price = base_price × land_type × location × area × depth × feng_shui
 */
import type { Segment, PriceCalculationResult } from '@/lib/supabase/database.types'

export interface CalculationInput {
  segment: Segment
  area: number
  coefficients: {
    landType: number
    location: number
    area: number
    depth: number
    fengShui: number
  }
}

/**
 * Calculate land price based on segment and coefficients
 * Returns min, max, and average prices
 */
export function calculatePrice(input: CalculationInput): PriceCalculationResult {
  const { segment, area, coefficients } = input

  // Calculate total coefficient multiplier
  const totalCoefficient =
    coefficients.landType *
    coefficients.location *
    coefficients.area *
    coefficients.depth *
    coefficients.fengShui

  // Calculate price per m² (after all adjustments)
  const pricePerM2Min = segment.base_price_min * totalCoefficient
  const pricePerM2Max = segment.base_price_max * totalCoefficient
  const pricePerM2Avg = (pricePerM2Min + pricePerM2Max) / 2

  // Calculate total price (price per m² × area)
  const totalPriceMin = pricePerM2Min * area
  const totalPriceMax = pricePerM2Max * area
  const totalPriceAvg = pricePerM2Avg * area

  return {
    basePrice: (segment.base_price_min + segment.base_price_max) / 2,
    basePriceMin: segment.base_price_min,
    basePriceMax: segment.base_price_max,
    governmentPrice: segment.government_price,
    coefficients: {
      landType: coefficients.landType,
      location: coefficients.location,
      area: coefficients.area,
      depth: coefficients.depth,
      fengShui: coefficients.fengShui,
      total: totalCoefficient,
    },
    pricePerM2: {
      min: Math.round(pricePerM2Min),
      max: Math.round(pricePerM2Max),
      avg: Math.round(pricePerM2Avg),
    },
    totalPrice: {
      min: Math.round(totalPriceMin),
      max: Math.round(totalPriceMax),
      avg: Math.round(totalPriceAvg),
    },
  }
}

/**
 * Format price in Vietnamese currency format (VND)
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(2)} tỷ`
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} triệu`
  }
  if (price >= 1_000) {
    return `${(price / 1_000).toFixed(0)} nghìn`
  }
  return price.toLocaleString('vi-VN')
}

/**
 * Format price per m² display
 */
export function formatPricePerM2(price: number): string {
  return `${(price / 1_000_000).toFixed(2)} triệu/m²`
}
