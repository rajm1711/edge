"use client";

import { Newspaper, ArrowUpRight, ArrowDownRight, Minus, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NewsSectionProps {
  news: any[];
  isLoading: boolean;
}

export function NewsSection({ news, isLoading }: NewsSectionProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full animate-shimmer bg-[var(--background-secondary)] rounded-[16px]" />
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <div className="space-y-3">
      {news.slice(0, 10).map((item, i) => {
        const isBullish = item.headline.toLowerCase().includes('beat') || item.headline.toLowerCase().includes('high') || item.headline.toLowerCase().includes('growth');
        const isBearish = item.headline.toLowerCase().includes('miss') || item.headline.toLowerCase().includes('fall') || item.headline.toLowerCase().includes('drop');

        return (
          <Card key={i} variant="default" className="group hover:border-[var(--accent)]/30 transition-all rounded-[16px]">
            <CardContent className="p-3.5 flex gap-3">
              {item.image && (
                <div className="hidden sm:block h-20 w-28 rounded-[8px] bg-[var(--background-secondary)] overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-[var(--accent)] tracking-wider">
                            {item.source}
                        </span>
                        <span className="text-[10px] text-[var(--foreground-muted)] font-mono">
                            {formatDistanceToNow(new Date(item.datetime * 1000))} ago
                        </span>
                    </div>
                    <Badge variant={isBullish ? 'success' : isBearish ? 'danger' : 'outline'} className="scale-75 origin-right">
                        {isBullish ? 'BULLISH' : isBearish ? 'BEARISH' : 'NEUTRAL'}
                    </Badge>
                </div>
                <h4 className="text-xs font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                  {item.headline}
                </h4>
                <p className="text-[11px] text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex justify-end pt-1">
                    <a 
                        href={item.url} 
                        target="_blank" 
                        className="text-[10px] font-mono uppercase text-[var(--foreground-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
                    >
                        Read Article <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
