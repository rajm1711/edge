"use client";

import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Bar, ComposedChart, Line } from "recharts";
import { BarChart3, TrendingUp, Activity, Layers, Maximize2, RefreshCw } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface TradingViewTerminalChartProps {
  ticker: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high24h?: number;
  low24h?: number;
  volume24h?: string;
  historicalData?: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    ema20?: number;
    sma50?: number;
    rsi?: number;
  }>;
}

export function TradingViewTerminalChart({
  ticker = "NVDA",
  currentPrice = 138.25,
  change = 3.45,
  changePercent = 2.56,
  high24h = 140.50,
  low24h = 134.10,
  volume24h = "45.2M",
  historicalData
}: TradingViewTerminalChartProps) {
  const [timeframe, setTimeframe] = useState<"1D" | "1W" | "1M" | "1Y" | "ALL">("1M");
  const [chartType, setChartType] = useState<"area" | "candlestick" | "bar">("area");
  const [showEMA, setShowEMA] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

  // Generate realistic mock data if none provided
  const chartData = useMemo(() => {
    if (historicalData && historicalData.length > 0) return historicalData;

    const points = timeframe === "1D" ? 24 : timeframe === "1W" ? 30 : timeframe === "1M" ? 45 : 90;
    const basePrice = currentPrice * 0.9;
    const data = [];

    let runningPrice = basePrice;
    let ema20Acc = basePrice;
    let sma50Acc = basePrice;

    for (let i = 0; i < points; i++) {
      const randomDelta = (Math.random() - 0.48) * (currentPrice * 0.025);
      runningPrice = Math.max(1, runningPrice + randomDelta);
      
      const open = runningPrice - randomDelta * 0.5;
      const high = Math.max(runningPrice, open) + Math.random() * (currentPrice * 0.01);
      const low = Math.min(runningPrice, open) - Math.random() * (currentPrice * 0.01);
      const close = runningPrice;
      const vol = Math.floor(Math.random() * 5000000) + 1000000;

      ema20Acc = ema20Acc * 0.9 + close * 0.1;
      sma50Acc = sma50Acc * 0.95 + close * 0.05;
      const rsiVal = 40 + (Math.sin(i / 3) * 25) + (Math.random() * 10);

      data.push({
        date: timeframe === "1D" ? `${i}:00` : `Day ${i + 1}`,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: vol,
        ema20: Number(ema20Acc.toFixed(2)),
        sma50: Number(sma50Acc.toFixed(2)),
        rsi: Number(Math.min(100, Math.max(0, rsiVal)).toFixed(1))
      });
    }

    // Force last point to match currentPrice
    if (data.length > 0) {
      data[data.length - 1].close = currentPrice;
    }

    return data;
  }, [currentPrice, timeframe, historicalData]);

  const isPositive = change >= 0;

  return (
    <div className="w-full rounded-[16px] border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm flex flex-col font-sans">
      {/* Header Bar: Symbol Info & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xl text-[var(--foreground)] tracking-tight uppercase">{ticker}</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[var(--background-tertiary)] text-[var(--foreground-muted)] border border-[var(--border)]">
              US EQUITIES
            </span>
          </div>

          <div className="flex items-baseline gap-2 font-mono tabular-nums">
            <span className="text-2xl font-bold text-[var(--foreground)]">{formatCurrency(currentPrice)}</span>
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-[4px]", isPositive ? "bg-[var(--positive)]/10 text-[var(--positive)]" : "bg-[var(--negative)]/10 text-[var(--negative)]")}>
              {isPositive ? "+" : ""}{formatCurrency(change)} ({isPositive ? "+" : ""}{formatPercent(changePercent)})
            </span>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="flex items-center gap-6 text-[11px] font-mono tabular-nums text-[var(--foreground-muted)]">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--foreground-muted)] block">24h High</span>
            <span className="text-[var(--foreground)] font-bold">{formatCurrency(high24h)}</span>
          </div>
          <div className="w-px h-6 bg-[var(--border)]" />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--foreground-muted)] block">24h Low</span>
            <span className="text-[var(--foreground)] font-bold">{formatCurrency(low24h)}</span>
          </div>
          <div className="w-px h-6 bg-[var(--border)]" />
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--foreground-muted)] block">24h Volume</span>
            <span className="text-[var(--foreground)] font-bold">{volume24h}</span>
          </div>
        </div>
      </div>

      {/* Control Toolbar: Timeframes & Technical Overlays */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-[var(--background-secondary)]/50 border-b border-[var(--border)] text-xs">
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-[var(--background-tertiary)] p-1 rounded-[8px] border border-[var(--border)]">
          {(["1D", "1W", "1M", "1Y", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-3 py-1 rounded-[6px] text-[11px] font-mono font-bold transition-all",
                timeframe === tf
                  ? "bg-[var(--accent)] text-black shadow-sm"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Type Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[var(--background-tertiary)] p-1 rounded-[8px] border border-[var(--border)]">
            <button
              onClick={() => setChartType("area")}
              className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-mono font-bold transition-all", chartType === "area" ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "text-[var(--foreground-muted)]")}
            >
              Area
            </button>
            <button
              onClick={() => setChartType("candlestick")}
              className={cn("px-2.5 py-1 rounded-[6px] text-[11px] font-mono font-bold transition-all", chartType === "candlestick" ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "text-[var(--foreground-muted)]")}
            >
              Bar
            </button>
          </div>

          {/* Indicator Toggles */}
          <div className="flex items-center gap-1 bg-[var(--background-tertiary)] p-1 rounded-[8px] border border-[var(--border)]">
            <button
              onClick={() => setShowEMA(!showEMA)}
              className={cn("px-2 py-1 rounded-[6px] text-[10px] font-mono font-bold transition-all", showEMA ? "bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40" : "text-[var(--foreground-muted)]")}
            >
              20 EMA
            </button>
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={cn("px-2 py-1 rounded-[6px] text-[10px] font-mono font-bold transition-all", showSMA ? "bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40" : "text-[var(--foreground-muted)]")}
            >
              50 SMA
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={cn("px-2 py-1 rounded-[6px] text-[10px] font-mono font-bold transition-all", showRSI ? "bg-[var(--ai)]/20 text-[var(--ai)] border border-[var(--ai)]/40" : "text-[var(--foreground-muted)]")}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={cn("px-2 py-1 rounded-[6px] text-[10px] font-mono font-bold transition-all", showVolume ? "bg-[var(--foreground)]/10 text-[var(--foreground)] border border-[var(--foreground)]/20" : "text-[var(--foreground-muted)]")}
            >
              VOL
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="relative p-4 h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d084" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#00d084" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="chartGradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4d4d" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ff4d4d" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1a2540" opacity={0.6} />

            <XAxis dataKey="date" stroke="#4a5568" fontSize={10} tickLine={false} axisLine={{ stroke: '#1a2540' }} />
            <YAxis domain={['auto', 'auto']} stroke="#4a5568" fontSize={10} tickLine={false} axisLine={{ stroke: '#1a2540' }} orientation="right" />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-xl border border-[#263860] bg-[#090f19]/95 backdrop-blur-md p-3 shadow-xl font-mono text-xs space-y-1.5 tabular-nums">
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{d.date}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <span className="text-text-muted">Close:</span>
                      <span className="font-bold text-text-primary text-right">{formatCurrency(d.close)}</span>
                      <span className="text-text-muted">High:</span>
                      <span className="font-bold text-[#00d084] text-right">{formatCurrency(d.high)}</span>
                      <span className="text-text-muted">Low:</span>
                      <span className="font-bold text-[#ff4d4d] text-right">{formatCurrency(d.low)}</span>
                      {showEMA && d.ema20 && (
                        <>
                          <span className="text-[#3b82f6]">EMA 20:</span>
                          <span className="font-bold text-[#3b82f6] text-right">{formatCurrency(d.ema20)}</span>
                        </>
                      )}
                      {showSMA && d.sma50 && (
                        <>
                          <span className="text-[#f59e0b]">SMA 50:</span>
                          <span className="font-bold text-[#f59e0b] text-right">{formatCurrency(d.sma50)}</span>
                        </>
                      )}
                      {showRSI && d.rsi && (
                        <>
                          <span className="text-[#a78bfa]">RSI:</span>
                          <span className="font-bold text-[#a78bfa] text-right">{d.rsi}</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              }}
            />

            {showVolume && <Bar dataKey="volume" yAxisId={1} fill="#1a2540" opacity={0.5} radius={[2, 2, 0, 0]} />}

            {chartType === "area" && (
              <Area
                type="monotone"
                dataKey="close"
                stroke={isPositive ? "#00d084" : "#ff4d4d"}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#${isPositive ? "chartGradientGreen" : "chartGradientRed"})`}
              />
            )}

            {chartType === "candlestick" && (
              <Bar dataKey="close" fill={isPositive ? "#00d084" : "#ff4d4d"} radius={[2, 2, 0, 0]} />
            )}

            {showEMA && <Line type="monotone" dataKey="ema20" stroke="#3b82f6" strokeWidth={1.5} dot={false} />}
            {showSMA && <Line type="monotone" dataKey="sma50" stroke="#f59e0b" strokeWidth={1.5} dot={false} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Sub-Chart if active */}
      {showRSI && (
        <div className="h-[90px] border-t border-[#1a2540] p-2 bg-[#060a12]">
          <div className="flex justify-between items-center px-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-[#a78bfa] uppercase">RSI (14) Relative Strength Index</span>
            <span className="text-[10px] font-mono text-text-muted">Overbought: 70 | Oversold: 30</span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <YAxis domain={[0, 100]} ticks={[30, 70]} stroke="#4a5568" fontSize={8} orientation="right" />
              <Area type="monotone" dataKey="rsi" stroke="#a78bfa" strokeWidth={1.5} fill="#a78bfa" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
