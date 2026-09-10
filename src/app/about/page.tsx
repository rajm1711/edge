"use client";

import { PageShell } from "@/components/layout/PageShell";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, ShieldAlert, Code2, Database, Layers, Sparkles, 
  ExternalLink, Github, Terminal, CheckCircle2, AlertTriangle, ArrowRight 
} from "lucide-react";

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "EdgeIQ — Next-Gen AI Market Intelligence & Smart Trading Journal",
    "description": "AI-powered financial market intelligence and trading journal by Raj Puthawala",
    "author": {
      "@type": "Person",
      "name": "Raj Puthawala",
      "url": "https://github.com/rajm1711"
    },
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "programmingLanguage": ["TypeScript", "React", "Next.js"],
    "url": "https://edge-rose.vercel.app"
  };

  return (
    <PageShell>
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-[1200px] mx-auto space-y-8 font-sans min-w-0 pb-12">
        {/* Header Hero */}
        <div className="rounded-[12px] border border-border bg-bg-card p-8 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 opacity-5">
            <Brain className="w-96 h-96 text-positive" />
          </div>
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <Badge variant="ai">PORTFOLIO DEMONSTRATION PROJECT</Badge>
              <span className="font-mono text-[11px] text-text-muted">v2.4.0</span>
            </div>
            <h1 className="font-bebas text-[48px] tracking-tight uppercase leading-none text-text-primary">
              EdgeIQ — Next-Gen AI Market Intelligence &amp; Smart Trading Journal
            </h1>
            <p className="font-mono text-[14px] text-positive">
              Designed &amp; Built by Raj Puthawala
            </p>
            <p className="text-[14px] text-text-secondary leading-relaxed font-sans">
              EdgeIQ is a personal AI-powered financial market intelligence and trading-journal application. 
              It combines near-real-time market data from Finnhub, financial-news sentiment classification using HuggingFace FinBERT, 
              and AI-assisted qualitative research powered by Groq-hosted Llama 3.3 70B.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="https://github.com/rajm1711/edge"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-bg-secondary border border-border font-mono text-[12px] text-text-primary hover:border-border-emphasis transition-colors"
              >
                <Github className="h-4 w-4" /> GitHub Repository
              </a>
              <a
                href="https://edge-rose.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[8px] bg-positive text-black font-medium font-mono text-[12px] hover:bg-positive/90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" /> Live Demo
              </a>
            </div>
          </div>
        </div>

        {/* Section 2 — Why it exists */}
        <Card variant="terminal">
          <CardHeader className="py-4 border-b border-border flex items-center gap-2">
            <Code2 className="h-4 w-4 text-positive" />
            <h2 className="font-bebas text-[22px] tracking-wide uppercase text-text-primary">
              Engineering Purpose &amp; Competency Demonstration
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-[13px] text-text-secondary leading-relaxed">
            <p>
              EdgeIQ was built by <strong className="text-text-primary font-medium">Raj Puthawala</strong> to demonstrate full-stack engineering proficiency across modern enterprise application domains:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[12px] pt-2">
              <div className="p-3 bg-bg-secondary rounded-[8px] border border-border space-y-1">
                <span className="text-positive font-bold block">01. NEXT.JS 14 APP ROUTER</span>
                <span className="text-text-muted text-[11px]">Serverless Route Handlers, SSR/Client boundaries, state hydration</span>
              </div>
              <div className="p-3 bg-bg-secondary rounded-[8px] border border-border space-y-1">
                <span className="text-ai-purple font-bold block">02. LLM &amp; FINANCIAL NLP</span>
                <span className="text-text-muted text-[11px]">Structured Groq/Llama JSON schemas, HuggingFace FinBERT sentiment pipeline</span>
              </div>
              <div className="p-3 bg-bg-secondary rounded-[8px] border border-border space-y-1">
                <span className="text-info font-bold block">03. ARCHITECTURE &amp; SECURITY</span>
                <span className="text-text-muted text-[11px]">Upstash Redis rate limiting, Zod schema validation, untrusted data isolation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3 — Technology Stack */}
        <Card variant="terminal">
          <CardHeader className="py-4 border-b border-border flex items-center gap-2">
            <Layers className="h-4 w-4 text-ai-purple" />
            <h2 className="font-bebas text-[22px] tracking-wide uppercase text-text-primary">Technology Stack</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-[12px]">
              <div className="p-4 bg-bg-secondary rounded-[8px] border border-border space-y-2">
                <span className="text-text-muted uppercase text-[10px] block">Frontend</span>
                <p className="font-bold text-text-primary text-[13px]">Next.js 14 App Router</p>
                <p className="text-text-muted text-[11px]">React, TypeScript, Tailwind CSS, Recharts, Framer Motion</p>
              </div>
              <div className="p-4 bg-bg-secondary rounded-[8px] border border-border space-y-2">
                <span className="text-text-muted uppercase text-[10px] block">Backend &amp; API Layer</span>
                <p className="font-bold text-text-primary text-[13px]">24 Serverless Routes</p>
                <p className="text-text-muted text-[11px]">Zod Validation, Upstash Redis Rate Limiting</p>
              </div>
              <div className="p-4 bg-bg-secondary rounded-[8px] border border-border space-y-2">
                <span className="text-text-muted uppercase text-[10px] block">AI &amp; NLP Engines</span>
                <p className="font-bold text-ai-purple text-[13px]">Groq / Llama 3.3 70B</p>
                <p className="text-text-muted text-[11px]">HuggingFace FinBERT NLP (ProsusAI/finbert)</p>
              </div>
              <div className="p-4 bg-bg-secondary rounded-[8px] border border-border space-y-2">
                <span className="text-text-muted uppercase text-[10px] block">Market Data &amp; Hosting</span>
                <p className="font-bold text-positive text-[13px]">Finnhub Market Data</p>
                <p className="text-text-muted text-[11px]">Vercel Edge Deployment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4 — AI Architecture */}
        <Card variant="terminal">
          <CardHeader className="py-4 border-b border-border flex items-center gap-2">
            <Terminal className="h-4 w-4 text-info" />
            <h2 className="font-bebas text-[22px] tracking-wide uppercase text-text-primary">
              AI Security &amp; Data Pipeline Architecture
            </h2>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-bg-secondary p-4 rounded-[8px] border border-border font-mono text-[12px] text-text-primary space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-center text-text-muted">
                <span className="px-2.5 py-1 bg-bg-card rounded border border-border text-text-primary">User Interface</span>
                <ArrowRight className="h-3.5 w-3.5 text-positive" />
                <span className="px-2.5 py-1 bg-bg-card rounded border border-border text-text-primary">Next.js API Handlers</span>
                <ArrowRight className="h-3.5 w-3.5 text-positive" />
                <span className="px-2.5 py-1 bg-bg-card rounded border border-border text-ai-purple">Untrusted Data Boundary</span>
                <ArrowRight className="h-3.5 w-3.5 text-positive" />
                <span className="px-2.5 py-1 bg-bg-card rounded border border-border text-positive">Groq Llama 3.3 + FinBERT</span>
                <ArrowRight className="h-3.5 w-3.5 text-positive" />
                <span className="px-2.5 py-1 bg-bg-card rounded border border-border text-text-primary">Validated Zod JSON</span>
              </div>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed">
              All external news, user trade theses, and unstructured text inputs pass through untrusted-data boundaries (<code>=== EXTERNAL DATA ===</code>) 
              with instruction isolation to protect against prompt injection and unsafe model outputs.
            </p>
          </CardContent>
        </Card>

        {/* Section 5 — Limitations */}
        <Card variant="terminal">
          <CardHeader className="py-4 border-b border-border flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-neutral" />
            <h2 className="font-bebas text-[22px] tracking-wide uppercase text-text-primary">Application Limitations</h2>
          </CardHeader>
          <CardContent className="p-6 space-y-3 font-mono text-[12px] text-text-secondary">
            <div className="flex items-start gap-2.5">
              <span className="text-neutral font-bold">•</span>
              <span><strong>Journal Persistence:</strong> Uses browser localStorage persistence for the trading journal log. There is no cloud database or user login authentication system implemented.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-neutral font-bold">•</span>
              <span><strong>AI Qualitative Context:</strong> AI research analysis is powered by Llama 3.3 70B via Groq and reflects qualitative context based on provided snapshots.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-neutral font-bold">•</span>
              <span><strong>Market Observations:</strong> AI Market Observations are qualitative text patterns generated from financial context, not calculated technical indicators from historical OHLCV data.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="text-neutral font-bold">•</span>
              <span><strong>FinBERT NLP State:</strong> News sentiment classification relies on external NLP microservice calls. Degraded calls display &quot;Sentiment unavailable&quot; rather than false neutral badges.</span>
            </div>
          </CardContent>
        </Card>

        {/* Section 6 — Prominent Disclaimer */}
        <div className="rounded-[12px] border-l-[4px] border-l-negative border-y border-r border-border bg-[rgba(255,77,77,0.05)] p-6 space-y-2">
          <div className="flex items-center gap-2 text-negative font-mono text-[12px] uppercase font-bold">
            <ShieldAlert className="h-4 w-4" /> Full Project Disclaimer
          </div>
          <p className="text-[12px] text-text-primary leading-relaxed font-sans italic">
            EdgeIQ is a personal portfolio project developed by Raj Puthawala for educational and technical demonstration purposes only. 
            All AI-generated content, scores, and market observations are for informational purposes only and do NOT constitute financial advice, 
            investment recommendations, or an offer to buy or sell securities. Past performance is not indicative of future results. 
            Always consult a qualified licensed financial advisor before making investment decisions.
          </p>
        </div>

        {/* Section 7 — Future Roadmap */}
        <Card variant="terminal">
          <CardHeader className="py-4 border-b border-border flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-positive" />
            <h2 className="font-bebas text-[22px] tracking-wide uppercase text-text-primary">Future Roadmap</h2>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-[12px]">
              <div className="p-3 bg-bg-secondary rounded-[6px] border border-border text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-text-muted shrink-0" />
                <span>Cloud persistence with Supabase PostgreSQL</span>
              </div>
              <div className="p-3 bg-bg-secondary rounded-[6px] border border-border text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-text-muted shrink-0" />
                <span>Multi-user authentication (NextAuth / Clerk)</span>
              </div>
              <div className="p-3 bg-bg-secondary rounded-[6px] border border-border text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-text-muted shrink-0" />
                <span>WebSocket real-time price streaming</span>
              </div>
              <div className="p-3 bg-bg-secondary rounded-[6px] border border-border text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-text-muted shrink-0" />
                <span>Deterministic OHLCV Technical Indicators</span>
              </div>
              <div className="p-3 bg-bg-secondary rounded-[6px] border border-border text-text-secondary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-text-muted shrink-0" />
                <span>Multi-user journal sharing &amp; export</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 8 — Author Card */}
        <div className="rounded-[12px] bg-bg-card border border-border p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bebas text-[24px] uppercase tracking-wide text-text-primary">Raj Puthawala</h3>
            <p className="font-mono text-[12px] text-positive">Full-Stack Developer · AI Integration Specialist</p>
            <p className="text-[12px] text-text-muted">Specializing in Next.js, TypeScript, React, Serverless Architectures &amp; LLM Engineering.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://github.com/rajm1711"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-[8px] bg-bg-secondary border border-border font-mono text-[12px] text-text-primary hover:border-positive transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" /> Raj on GitHub
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
