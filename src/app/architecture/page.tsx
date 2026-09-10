"use client";

import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network, Server, Cpu, Database, Shield, Zap, Code2, 
  ExternalLink, Github, CheckCircle2 
} from "lucide-react";

export default function ArchitecturePage() {
  return (
    <PageShell>
      <div className="w-full max-w-[1200px] mx-auto space-y-8 font-sans min-w-0 pb-12">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="ai">SYSTEM SPECIFICATION</Badge>
              <span className="font-mono text-[11px] text-[var(--foreground-muted)]">EdgeIQ Serverless Stack</span>
            </div>
            <h1 className="font-bebas text-[36px] tracking-wide uppercase text-[var(--foreground)] mt-1">
              Technical Architecture &amp; System Flow
            </h1>
            <p className="font-mono text-[12px] text-[var(--foreground-muted)]">
              Designed &amp; Engineered by Raj Puthawala
            </p>
          </div>
          <a
            href="https://github.com/rajm1711/edge"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[var(--card)] border border-[var(--border)] font-mono text-[12px] text-[var(--foreground)] hover:border-[var(--positive)] transition-colors"
          >
            <Github className="h-4 w-4" /> View Source Code
          </a>
        </div>

        {/* Visual Architecture Diagram Card */}
        <Card variant="default">
          <CardHeader className="py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-[var(--positive)]" />
              <h2 className="font-bebas text-[22px] tracking-wide uppercase text-[var(--foreground)]">
                End-to-End System Topology
              </h2>
            </div>
            <span className="font-mono text-[11px] text-[var(--foreground-muted)]">Interactive Diagram</span>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full overflow-x-auto py-6">
              <div className="min-w-[700px] bg-[var(--card-secondary)] p-8 rounded-[16px] border border-[var(--border)] font-mono text-[12px] text-[var(--foreground)] space-y-8">
                {/* SVG Visual Flow */}
                <div className="relative flex justify-between items-center gap-4">
                  {/* Layer 1: Client UI */}
                  <div className="flex flex-col items-center p-4 bg-[var(--card)] rounded-[12px] border border-[var(--border)] w-48 text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[var(--positive)] mb-1">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-[13px] text-[var(--foreground)]">Client UI Layer</span>
                    <span className="text-[10px] text-[var(--foreground-muted)]">Next.js 14 React UI<br />Framer Motion &amp; Recharts</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-[10px] text-[var(--foreground-muted)] mb-1">JSON / HTTPS</span>
                    <div className="h-0.5 w-full bg-[var(--border)] relative flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-[var(--positive)] animate-ping" />
                    </div>
                  </div>

                  {/* Layer 2: API Route Handlers */}
                  <div className="flex flex-col items-center p-4 bg-[var(--card)] rounded-[12px] border border-[var(--border)] w-52 text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center text-[var(--ai)] mb-1">
                      <Server className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-[13px] text-[var(--foreground)]">Serverless API Router</span>
                    <span className="text-[10px] text-[var(--foreground-muted)]">24 Specialized Endpoints<br />Upstash Redis Rate Limit</span>
                  </div>

                  <div className="flex-1 flex flex-col items-center">
                    <span className="text-[10px] text-[var(--foreground-muted)] mb-1">Strict Zod Schema</span>
                    <div className="h-0.5 w-full bg-[var(--border)] relative flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-[var(--ai)] animate-ping" />
                    </div>
                  </div>

                  {/* Layer 3: External Services */}
                  <div className="flex flex-col items-center p-4 bg-[var(--card)] rounded-[12px] border border-[var(--border)] w-56 text-center space-y-2">
                    <div className="h-10 w-10 rounded-full bg-[rgba(59,130,246,0.1)] flex items-center justify-center text-[var(--accent)] mb-1">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-[13px] text-[var(--foreground)]">Data &amp; AI Providers</span>
                    <span className="text-[10px] text-[var(--foreground-muted)]">Finnhub Quotes &amp; News<br />Groq / Llama 3.3 70B<br />FinBERT Sentiment NLP</span>
                  </div>
                </div>

                {/* Flow Diagram Code Representation */}
                <div className="bg-[var(--card)] p-4 rounded-[12px] border border-[var(--border)] text-[11px] text-[var(--foreground-muted)] font-mono leading-relaxed space-y-1">
                  <p className="text-[var(--positive)] font-bold">EDGEIQ MICROSERVICE ROUTING MATRIX:</p>
                  <p>├── Finnhub API ───────&gt; Quotes, News, Fundamentals, Insiders, Earnings, Options, Calendar</p>
                  <p>├── HuggingFace FinBERT ──&gt; News Sentiment Classification (Bullish / Bearish / Neutral / Unavailable)</p>
                  <p>├── Groq / Llama 3.3 70B ─&gt; Qualitative Research, Market Bias, Autopsy, Pre-Trade, Observations</p>
                  <p>└── Next.js Route Layer ─&gt; Upstash Sliding Window Limit + Zod Input &amp; Output Validation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Layer Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Layer 1: Market Data Pipeline */}
          <Card variant="default">
            <CardHeader className="py-3 border-b border-[var(--border)] flex items-center gap-2">
              <Database className="h-4 w-4 text-[var(--positive)]" />
              <h3 className="font-bebas text-[18px] tracking-wide uppercase text-[var(--foreground)]">
                1. Financial Data Pipeline
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-[12px] text-[var(--foreground-muted)]">
              <p className="leading-relaxed">
                Connects to Finnhub APIs via serverless proxy handlers to fetch real quotes, company profiles, balance sheet metrics, 
                insider Form 4 transactions, earnings surprise histories, and option chain snapshot distributions.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--positive)]" />
                  <span>12 Dedicated Market Endpoint Handlers</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--positive)]" />
                  <span>Deterministic calculation module for P&amp;L and R:R ratios</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layer 2: Sentiment NLP Pipeline */}
          <Card variant="default">
            <CardHeader className="py-3 border-b border-[var(--border)] flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--accent)]" />
              <h3 className="font-bebas text-[18px] tracking-wide uppercase text-[var(--foreground)]">
                2. FinBERT Financial NLP Engine
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-[12px] text-[var(--foreground-muted)]">
              <p className="leading-relaxed">
                Processes raw financial news headlines through HuggingFace&apos;s <code>ProsusAI/finbert</code> sentiment model. 
                Returns probability distributions across Bullish, Bearish, and Neutral classifications with explicit fallback protection.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Strict &quot;Unavailable&quot; status state on NLP timeouts</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Never silently converts failed calls to neutral</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layer 3: Groq LLM Qualitative Intelligence */}
          <Card variant="default">
            <CardHeader className="py-3 border-b border-[var(--border)] flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[var(--ai)]" />
              <h3 className="font-bebas text-[18px] tracking-wide uppercase text-[var(--foreground)]">
                3. Groq Llama 3.3 70B AI Engine
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-[12px] text-[var(--foreground-muted)]">
              <p className="leading-relaxed">
                Powers AI Stock Research Briefs, Trade Autopsies, Pre-Trade Risk Scorecards, Market Bias Summaries, and Market Observations. 
                Operates with strict neutral research assistant persona prompts and untrusted data boundary delimiters.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ai)]" />
                  <span>Zod schema validation on model outputs</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ai)]" />
                  <span>Exponential backoff retries &amp; 15s abort timeout</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layer 4: Rate Limiting & Security */}
          <Card variant="default">
            <CardHeader className="py-3 border-b border-[var(--border)] flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--foreground-muted)]" />
              <h3 className="font-bebas text-[18px] tracking-wide uppercase text-[var(--foreground)]">
                4. Rate Limiting &amp; Security Layer
              </h3>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-[12px] text-[var(--foreground-muted)]">
              <p className="leading-relaxed">
                Implements Upstash Redis sliding-window rate limiting (10 requests / 1 min per IP) with local in-memory fallback. 
                Ensures API keys are strictly server-side and never exposed to the client bundle.
              </p>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
                  <span>Status 429 Rate Limiting on all 12 AI endpoints</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
                  <span>Status 400 Zod request validation enforcement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
