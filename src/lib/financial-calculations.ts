export function calculatePnL(
  direction: "long" | "short",
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || !Number.isFinite(quantity)) {
    return 0;
  }
  if (entryPrice <= 0 || quantity <= 0) return 0;
  if (direction === "long") return Number(((exitPrice - entryPrice) * quantity).toFixed(2));
  return Number(((entryPrice - exitPrice) * quantity).toFixed(2));
}

export function calculatePnLPercentage(
  direction: "long" | "short",
  entryPrice: number,
  exitPrice: number
): number {
  if (!Number.isFinite(entryPrice) || !Number.isFinite(exitPrice) || entryPrice <= 0) return 0;
  if (direction === "long") return Number((((exitPrice - entryPrice) / entryPrice) * 100).toFixed(2));
  return Number((((entryPrice - exitPrice) / entryPrice) * 100).toFixed(2));
}

export function calculateRiskReward(
  direction: "long" | "short",
  entry: number,
  stopLoss: number,
  target: number
): number {
  if (!Number.isFinite(entry) || !Number.isFinite(stopLoss) || !Number.isFinite(target)) return 0;
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(target - entry);
  if (risk === 0) return 0;
  return Number((reward / risk).toFixed(2));
}

export function calculatePositionSize(
  portfolioSize: number,
  riskPercent: number,
  entry: number,
  stopLoss: number
): number {
  if (!Number.isFinite(portfolioSize) || !Number.isFinite(riskPercent) || portfolioSize <= 0) return 0;
  const riskAmount = portfolioSize * (riskPercent / 100);
  const riskPerShare = Math.abs(entry - stopLoss);
  if (riskPerShare === 0) return 0;
  return Math.floor(riskAmount / riskPerShare);
}

export function calculateWinRate(trades: { outcome: "won" | "lost" | "breakeven" }[]): number {
  if (!Array.isArray(trades) || trades.length === 0) return 0;
  const wins = trades.filter(t => t.outcome === "won").length;
  return Number(((wins / trades.length) * 100).toFixed(1));
}

export function calculateProfitFactor(trades: { pnl: number }[]): number {
  if (!Array.isArray(trades) || trades.length === 0) return 0;
  const grossProfit = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const grossLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  if (grossLoss === 0) return grossProfit > 0 ? 99.9 : 0;
  return Number((grossProfit / grossLoss).toFixed(2));
}
