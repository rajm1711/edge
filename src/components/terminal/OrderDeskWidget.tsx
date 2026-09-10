"use client";

import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, ShieldAlert, CheckCircle2, Calculator, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn, formatCurrency } from "@/lib/utils";

interface OrderDeskWidgetProps {
  ticker?: string;
  currentPrice?: number;
}

export function OrderDeskWidget({ ticker = "NVDA", currentPrice = 138.25 }: OrderDeskWidgetProps) {
  const { toast } = useToast();
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [orderType, setOrderType] = useState<"LIMIT" | "MARKET" | "STOP_LOSS">("LIMIT");
  const [shares, setShares] = useState<number>(100);
  const [limitPrice, setLimitPrice] = useState<number>(currentPrice);
  const [stopLoss, setStopLoss] = useState<number>(Number((currentPrice * 0.96).toFixed(2)));
  const [takeProfit, setTakeProfit] = useState<number>(Number((currentPrice * 1.08).toFixed(2)));

  const isBuy = side === "BUY";
  const entry = orderType === "MARKET" ? currentPrice : limitPrice;

  // Calculate position metrics using financial math logic
  const { totalCost, potentialProfit, potentialLoss, riskRewardRatio } = useMemo(() => {
    const cost = entry * shares;
    const profit = Math.abs(takeProfit - entry) * shares;
    const loss = Math.abs(entry - stopLoss) * shares;
    const rr = loss > 0 ? (profit / loss).toFixed(2) : "0.00";

    return {
      totalCost: cost,
      potentialProfit: profit,
      potentialLoss: loss,
      riskRewardRatio: rr
    };
  }, [entry, shares, takeProfit, stopLoss]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast(
      `Simulated ${side} Order Executed: ${shares} shares of ${ticker} @ $${entry.toFixed(2)}`,
      "success"
    );
  };

  return (
    <div className="w-full rounded-[16px] border border-[var(--border)] bg-[var(--card)] overflow-hidden font-mono shadow-sm flex flex-col font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[var(--ai)]" />
          <span className="font-sans text-sm font-semibold tracking-wider uppercase text-[var(--foreground)]">Order & Risk Simulator</span>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[4px] bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border border-[var(--border)]">
          ZERODHA KITE STYLE
        </span>
      </div>

      {/* Buy / Sell Toggle Tabs */}
      <div className="grid grid-cols-2 p-1.5 gap-1.5 border-b border-[var(--border)] bg-[var(--background-secondary)]/50">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={cn(
            "py-2 rounded-[8px] font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5",
            isBuy
              ? "bg-[var(--positive)] text-black shadow-sm"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
          )}
        >
          <ArrowUpRight className="h-4 w-4" /> BUY / LONG
        </button>
        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={cn(
            "py-2 rounded-[8px] font-mono text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5",
            !isBuy
              ? "bg-[var(--negative)] text-white shadow-sm"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
          )}
        >
          <ArrowDownRight className="h-4 w-4" /> SELL / SHORT
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="p-4 space-y-4 text-xs">
        {/* Order Type Tabs */}
        <div className="flex items-center justify-between gap-1 bg-[var(--background-tertiary)] p-1 rounded-[8px] border border-[var(--border)]">
          {(["LIMIT", "MARKET", "STOP_LOSS"] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 py-1.5 rounded-[6px] text-[10px] font-mono font-bold uppercase transition-all text-center",
                orderType === type
                  ? "bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)] shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              {type.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Quantity & Price Input Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--foreground-muted)]">Quantity (Shares)</label>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-sm font-mono font-bold text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--foreground-muted)]">
              {orderType === "MARKET" ? "Market Price" : "Limit Price ($)"}
            </label>
            <input
              type="number"
              step="0.01"
              disabled={orderType === "MARKET"}
              value={orderType === "MARKET" ? currentPrice : limitPrice}
              onChange={e => setLimitPrice(parseFloat(e.target.value) || currentPrice)}
              className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] text-sm font-mono font-bold text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Risk Management inputs: SL & TP */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--negative)] flex items-center gap-1">
              Stop Loss ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={stopLoss}
              onChange={e => setStopLoss(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--negative)]/30 text-sm font-mono font-bold text-[var(--negative)] focus:border-[var(--negative)] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-wider text-[var(--positive)] flex items-center gap-1">
              Take Profit ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={takeProfit}
              onChange={e => setTakeProfit(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--positive)]/30 text-sm font-mono font-bold text-[var(--positive)] focus:border-[var(--positive)] focus:outline-none"
            />
          </div>
        </div>

        {/* Risk & Margin Summary Box */}
        <div className="p-3 rounded-[8px] bg-[var(--background-secondary)] border border-[var(--border)] space-y-2 font-mono tabular-nums">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[var(--foreground-muted)]">Order Value:</span>
            <span className="font-bold text-[var(--foreground)]">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[var(--foreground-muted)]">Potential Risk / Reward:</span>
            <span className="font-bold text-[var(--accent)]">1 : {riskRewardRatio} R</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[var(--positive)]">Target Profit:</span>
            <span className="font-bold text-[var(--positive)]">+{formatCurrency(potentialProfit)}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[var(--negative)]">Max Loss:</span>
            <span className="font-bold text-[var(--negative)]">-{formatCurrency(potentialLoss)}</span>
          </div>
        </div>

        {/* Place Order Action Button */}
        <button
          type="submit"
          className={cn(
            "w-full h-11 rounded-[8px] font-sans font-semibold text-sm tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2",
            isBuy
              ? "bg-[var(--positive)] text-black hover:opacity-90"
              : "bg-[var(--negative)] text-white hover:opacity-90"
          )}
        >
          Execute {side} Order · {ticker}
        </button>

        <p className="text-[10px] text-[var(--foreground-muted)] italic text-center font-mono">
          Simulated order execution for educational and portfolio journal testing only.
        </p>
      </form>
    </div>
  );
}
