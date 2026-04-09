import type { Tier } from '../types/index'
import { TIER_CONFIG } from '../types/index'

export function useScores() {
  /**
   * Human-readable tier label.
   * e.g. "landmark" → "Heritage Landmark"
   */
  function getTierLabel(tier: Tier): string {
    return TIER_CONFIG[tier].label
  }

  /**
   * Hex color associated with the given tier.
   */
  function getTierColor(tier: Tier): string {
    return TIER_CONFIG[tier].color
  }

  /**
   * Format a raw score (0-100) as a display string with one decimal place.
   * e.g. 87.5 → "87.5"
   */
  function formatScore(score: number): string {
    return score.toFixed(1)
  }

  return {
    getTierLabel,
    getTierColor,
    formatScore,
  }
}
