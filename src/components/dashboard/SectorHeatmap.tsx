"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { formatPercent } from "@/lib/utils";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

// Static mapping of known tickers to their respective GICS sectors
const SECTOR_MAP: Record<string, string> = {
  AAPL: "Technology", NVDA: "Technology", MSFT: "Technology", AMD: "Technology", INTC: "Technology", PLTR: "Technology", IBM: "Technology", CRM: "Technology",
  TSLA: "Consumer Cyclical", AMZN: "Consumer Cyclical", HD: "Consumer Cyclical", NKE: "Consumer Cyclical", SBUX: "Consumer Cyclical",
  META: "Communication Services", GOOGL: "Communication Services", NFLX: "Communication Services", DIS: "Communication Services", T: "Communication Services", VZ: "Communication Services",
  JPM: "Financial Services", V: "Financial Services", MA: "Financial Services", COIN: "Financial Services", BAC: "Financial Services", GS: "Financial Services",
  WMT: "Consumer Defensive", TGT: "Consumer Defensive", KO: "Consumer Defensive", PEP: "Consumer Defensive", PG: "Consumer Defensive",
  XOM: "Energy", CVX: "Energy", COP: "Energy",
  UNH: "Healthcare", JNJ: "Healthcare", LLY: "Healthcare", PFE: "Healthcare", ABBV: "Healthcare",
  BA: "Industrials", CAT: "Industrials", GE: "Industrials", MMM: "Industrials"
};

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const getHeatmapColor = (changePercent: number) => {
  if (changePercent === undefined || changePercent === null) return "#334155";
  if (changePercent > 2) return "#10b981";
  if (changePercent > 0.5) return "#059669";
  if (changePercent > 0) return "#047857";
  if (changePercent < -2) return "#ef4444";
  if (changePercent < -0.5) return "#dc2626";
  if (changePercent < 0) return "#b91c1c";
  return "#334155";
};

const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, changePercent } = props;

  // We are using a flat list now, so every node is a leaf (stock)
  const color = getHeatmapColor(changePercent);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: "#0f172a", // Dark border between cells
          strokeWidth: 2,
        }}
        className="transition-all duration-300 hover:opacity-80 cursor-crosshair"
      />
      {width > 40 && height > 30 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 4}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={15}
            fontWeight={600}
            className="tracking-wide pointer-events-none drop-shadow-md"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={11}
            fontWeight={500}
            className="font-mono pointer-events-none opacity-90 drop-shadow-md"
          >
            {formatPercent(changePercent)}
          </text>
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data.changePercent >= 0;

    return (
      <div className="bg-bg-card/95 border border-border/50 backdrop-blur-md p-3 rounded-lg shadow-xl">
        <p className="font-bebas text-lg tracking-wider mb-1">{data.name}</p>
        <p className="text-xs font-mono text-text-muted mb-2 uppercase">{data.sector}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold text-text-primary uppercase">Change:</span>
          <span className={`text-sm font-mono font-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {formatPercent(data.changePercent)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function SectorHeatmap({ data }: { data: StockData[] }) {
  const treeData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Sort to group sectors together visually in the treemap
    const sorted = [...data].sort((a, b) => {
      const sA = SECTOR_MAP[a.symbol] || "Other";
      const sB = SECTOR_MAP[b.symbol] || "Other";
      if (sA === sB) {
        return b.changePercent - a.changePercent;
      }
      return sA.localeCompare(sB);
    });

    return sorted.map((s) => ({
      name: s.symbol,
      size: 100, // Uniform weight for now
      changePercent: s.changePercent,
      sector: SECTOR_MAP[s.symbol] || "Other"
    }));
  }, [data]);

  const sectorCount = new Set(data?.map(s => SECTOR_MAP[s.symbol] || "Other")).size;

  return (
    <Card variant="premium" className="h-[400px] flex flex-col border-blue/10 overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center py-3 bg-blue/5 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-blue" />
          <h3 className="font-bebas text-lg tracking-wide uppercase">Market Treemap</h3>
        </div>
        <Badge variant="outline" className="font-mono bg-bg-card">{sectorCount} Sectors</Badge>
      </CardHeader>
      <CardContent className="p-2 flex-1 relative">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs font-mono uppercase text-text-muted animate-pulse">Mapping Market Data...</p>
          </div>
        ) : (
          <div className="absolute inset-0 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treeData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                content={<CustomizedContent />}
              >
                <Tooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
