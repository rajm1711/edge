"use client";

import { useMemo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers } from "lucide-react";
import { formatPercent } from "@/lib/utils";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

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
  if (changePercent === undefined || changePercent === null) return "#1a2540";
  if (changePercent > 2) return "#00d084";
  if (changePercent > 0) return "#009961";
  if (changePercent < -2) return "#ff4d4d";
  if (changePercent < 0) return "#cc3d3d";
  return "#1a2540";
};

const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, changePercent } = props;
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
          stroke: "#0d1421",
          strokeWidth: 2,
        }}
        className="transition-opacity duration-100 hover:opacity-85 cursor-pointer"
      />
      {width > 36 && height > 24 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 3}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={13}
            fontWeight={600}
            fontFamily="var(--font-jetbrains)"
            className="pointer-events-none uppercase"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 11}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={10}
            fontWeight={500}
            fontFamily="var(--font-jetbrains)"
            className="pointer-events-none opacity-90"
          >
            {changePercent >= 0 ? "+" : ""}{formatPercent(changePercent)}
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
      <div className="bg-[#0d1421] border border-[#243358] p-3 rounded-[8px] shadow-xl font-sans">
        <p className="font-mono font-medium text-[14px] text-white uppercase mb-0.5">{data.name}</p>
        <p className="text-[11px] font-sans text-[#718096] uppercase mb-2">{data.sector}</p>
        <div className="flex items-center gap-2 font-mono text-[12px]">
          <span className="text-[#4a5568]">Change:</span>
          <span className={isPositive ? "text-[#00d084]" : "text-[#ff4d4d]"}>
            {isPositive ? "+" : ""}{formatPercent(data.changePercent)}
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
      size: 100,
      changePercent: s.changePercent,
      sector: SECTOR_MAP[s.symbol] || "Other"
    }));
  }, [data]);

  const sectorCount = new Set(data?.map(s => SECTOR_MAP[s.symbol] || "Other")).size;

  return (
    <Card variant="terminal" className="h-[380px] flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-center py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-info" />
          <h3 className="font-bebas text-[18px] tracking-wide uppercase text-text-primary">Market Treemap</h3>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">{sectorCount} Sectors</Badge>
      </CardHeader>
      <CardContent className="p-2 flex-1 relative">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[11px] font-mono uppercase text-text-muted">Mapping Market Treemap...</p>
          </div>
        ) : (
          <div className="absolute inset-0 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treeData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#0d1421"
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

