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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 w-full animate-shimmer bg-bg-secondary rounded-xl" />
        ))}
      </div>
    );
  }

  if (!news || news.length === 0) return null;

  return (
    <div className="space-y-4">
      {news.slice(0, 10).map((item, i) => {
        // Sentiment would normally come from AI, but for now we color by source or headline keywords as fallback
        const isBullish = item.headline.toLowerCase().includes('beat') || item.headline.toLowerCase().includes('high') || item.headline.toLowerCase().includes('growth');
        const isBearish = item.headline.toLowerCase().includes('miss') || item.headline.toLowerCase().includes('fall') || item.headline.toLowerCase().includes('drop');

        return (
          <Card key={i} variant="default" className="group hover:border-accent/30 transition-all border-border/50">
            <CardContent className="p-4 flex gap-4">
              {item.image && (
                <div className="hidden sm:block h-20 w-32 rounded-lg bg-bg-secondary overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase text-accent tracking-tighter">
                            {item.source}
                        </span>
                        <span className="text-[10px] text-text-muted">
                            {formatDistanceToNow(new Date(item.datetime * 1000))} ago
                        </span>
                    </div>
                    <Badge variant={isBullish ? 'success' : isBearish ? 'danger' : 'outline'} className="scale-75 origin-right">
                        {isBullish ? 'BULLISH' : isBearish ? 'BEARISH' : 'NEUTRAL'}
                    </Badge>
                </div>
                <h4 className="text-sm font-bold text-text-primary leading-tight group-hover:text-accent transition-colors">
                  {item.headline}
                </h4>
                <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
                <div className="flex justify-end">
                    <a 
                        href={item.url} 
                        target="_blank" 
                        className="text-[10px] font-bold font-mono uppercase text-text-muted hover:text-accent flex items-center gap-1 transition-colors"
                    >
                        Read Full <ExternalLink className="h-2.5 w-2.5" />
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
