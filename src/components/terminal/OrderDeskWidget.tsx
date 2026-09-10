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
    <div className="w-full rounded-2xl border border-[#1a2540] bg-[#0d1421]/95 backdrop-blur-md overflow-hidden font-mono shadow-xl flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 border-b border-[#1a2540] bg-[#090f19]">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-[#a78bfa]" />
          <span className="font-bebas text-lg tracking-wide uppercase text-text-primary">Order & Risk Simulator</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-bg-secondary text-text-muted border border-border">
          ZERODHA KITE STYLE
        </span>
      </div>

      {/* Buy / Sell Toggle Tabs */}
      <div className="grid grid-cols-2 p-1.5 gap-1.5 border-b border-[#1a2540] bg-[#060a10]">
        <button
          type="button"
          onClick={() => setSide("BUY")}
          className={cn(
            "py-2.5 rounded-xl font-bebas text-base tracking-wider uppercase transition-all flex items-center justify-center gap-1.5",
            isBuy
              ? "bg-[#00d084] text-black shadow-lg font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
          )}
        >
          <ArrowUpRight className="h-4 w-4" /> BUY / LONG
        </button>
        <button
          type="button"
          onClick={() => setSide("SELL")}
          className={cn(
            "py-2.5 rounded-xl font-bebas text-base tracking-wider uppercase transition-all flex items-center justify-center gap-1.5",
            !isBuy
              ? "bg-[#ff4d4d] text-white shadow-lg font-bold"
              : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
          )}
        >
          <ArrowDownRight className="h-4 w-4" /> SELL / SHORT
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="p-4 space-y-4 text-xs">
        {/* Order Type Tabs */}
        <div className="flex items-center justify-between gap-1 bg-bg-primary p-1 rounded-xl border border-border">
          {(["LIMIT", "MARKET", "STOP_LOSS"] as const).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setOrderType(type)}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all text-center",
                orderType === type
                  ? "bg-bg-card text-text-primary border border-border shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {type.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Quantity & Price Input Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-muted">Quantity (Shares)</label>
            <input
              type="number"
              min="1"
              value={shares}
              onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border text-sm font-bold text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-text-muted">
              {orderType === "MARKET" ? "Market Price" : "Limit Price ($)"}
            </label>
            <input
              type="number"
              step="0.01"
              disabled={orderType === "MARKET"}
              value={orderType === "MARKET" ? currentPrice : limitPrice}
              onChange={e => setLimitPrice(parseFloat(e.target.value) || currentPrice)}
              className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-border text-sm font-bold text-text-primary focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Risk Management inputs: SL & TP */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1a2540]">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#ff4d4d] flex items-center gap-1">
              Stop Loss ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={stopLoss}
              onChange={e => setStopLoss(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-[#ff4d4d]/30 text-sm font-bold text-[#ff4d4d] focus:border-[#ff4d4d] focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#00d084] flex items-center gap-1">
              Take Profit ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={takeProfit}
              onChange={e => setTakeProfit(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-xl bg-bg-secondary border border-[#00d084]/30 text-sm font-bold text-[#00d084] focus:border-[#00d084] focus:outline-none"
            />
          </div>
        </div>

        {/* Risk & Margin Summary Box */}
        <div className="p-3 rounded-xl bg-[#070b12] border border-[#1a2540] space-y-2 tabular-nums">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-text-muted">Order Value:</span>
            <span className="font-bold text-text-primary">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-text-muted">Potential Risk / Reward:</span>
            <span className="font-bold text-accent">1 : {riskRewardRatio} R</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#00d084]">Target Profit:</span>
            <span className="font-bold text-[#00d084]">+{formatCurrency(potentialProfit)}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#ff4d4d]">Max Loss:</span>
            <span className="font-bold text-[#ff4d4d]">-{formatCurrency(potentialLoss)}</span>
          </div>
        </div>

        {/* Place Order Action Button */}
        <button
          type="submit"
          className={cn(
            "w-full h-12 rounded-xl font-bebas text-xl tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2",
            isBuy
              ? "bg-[#00d084] text-black hover:bg-[#00d084]/90"
              : "bg-[#ff4d4d] text-white hover:bg-[#ff4d4d]/90"
          )}
        >
          Execute {side} Order · {ticker}
        </button>

        <p className="text-[10px] text-[#4a5568] italic text-center">
          Simulated order execution for educational and portfolio journal testing only.
        </p>
      </form>
    </div>
  );
}
