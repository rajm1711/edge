/**
 * EdgeIQ Financial Mathematics Module
 * Pure, deterministic mathematical functions for trade metrics calculation.
 */

export type TradeDirection = 'LONG' | 'SHORT' | 'buy' | 'sell';

export interface TradeCalculationInput {
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
}

/**
 * Calculates raw monetary Profit & Loss (P&L).
 * Long:  (exitPrice - entryPrice) * quantity
 * Short: (entryPrice - exitPrice) * quantity
 */
export function calculatePnL(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || !Number.isFinite(quantity)) {
    return 0;
  }
  if (entryPrice <= 0 || quantity <= 0) {
    return 0;
  }

  const isShort = direction.toUpperCase() === 'SHORT' || direction.toLowerCase() === 'sell';
  const priceDiff = isShort ? entryPrice - exitPrice : exitPrice - entryPrice;
  return Number((priceDiff * quantity).toFixed(2));
}

/**
 * Calculates percentage return on entry investment.
 * Long:  ((exitPrice - entryPrice) / entryPrice) * 100
 * Short: ((entryPrice - exitPrice) / entryPrice) * 100
 */
export function calculatePnLPercentage(
  direction: TradeDirection,
  entryPrice: number,
  exitPrice: number
): number {
  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || entryPrice <= 0) {
    return 0;
  }

  const isShort = direction.toUpperCase() === 'SHORT' || direction.toLowerCase() === 'sell';
  const pct = isShort
    ? ((entryPrice - exitPrice) / entryPrice) * 100
    : ((exitPrice - entryPrice) / entryPrice) * 100;
  return Number(pct.toFixed(2));
}

/**
 * Calculates overall Win Rate percentage across logged trades.
 */
export function calculateWinRate(trades: Array<{ pnl?: number; entryPrice?: number; exitPrice?: number }>): number {
  if (!Array.isArray(trades) || trades.length === 0) {
    return 0;
  }

  const winningTrades = trades.filter((t) => {
    if (typeof t.pnl === 'number') return t.pnl > 0;
    if (typeof t.entryPrice === 'number' && typeof t.exitPrice === 'number') {
      return t.exitPrice > t.entryPrice;
    }
    return false;
  });

  return Number(((winningTrades.length / trades.length) * 100).toFixed(1));
}

/**
 * Calculates Risk-to-Reward Ratio (R:R).
 * Long:  (targetPrice - entryPrice) / (entryPrice - stopLossPrice)
 * Short: (entryPrice - targetPrice) / (stopLossPrice - entryPrice)
 */
export function calculateRiskRewardRatio(
  direction: TradeDirection,
  entryPrice: number,
  stopLossPrice: number,
  targetPrice: number
): number {
  if (
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(stopLossPrice) ||
    !Number.isFinite(targetPrice) ||
    entryPrice <= 0
  ) {
    return 0;
  }

  const isShort = direction.toUpperCase() === 'SHORT' || direction.toLowerCase() === 'sell';
  const risk = isShort ? stopLossPrice - entryPrice : entryPrice - stopLossPrice;
  const reward = isShort ? entryPrice - targetPrice : targetPrice - entryPrice;

  if (risk <= 0 || reward <= 0) {
    return 0;
  }

  return Number((reward / risk).toFixed(2));
}
