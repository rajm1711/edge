import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "EdgeIQ — Next-Gen AI Market Intelligence & Smart Trading Journal",
  description: "EdgeIQ is an AI-powered financial market intelligence dashboard and smart trading journal built with Next.js 16, Groq Llama 3.3 70B, HuggingFace FinBERT, and Finnhub real-time market data.",
  keywords: [
    "AI stock research dashboard",
    "FinBERT financial sentiment analysis",
    "AI trading journal and autopsy",
    "Pre-trade risk evaluator",
    "Next.js 16 financial dashboard",
    "Groq Llama 3.3 financial co-pilot"
  ],
  authors: [{ name: "Raj Puthawala" }],
  openGraph: {
    title: "EdgeIQ — Next-Gen AI Market Intelligence & Smart Trading Journal",
    description: "AI-driven stock sentiment analysis, pre-trade risk evaluation, and automated trade autopsies.",
    type: "website",
    siteName: "EdgeIQ",
  },
  twitter: {
    card: "summary_large_image",
    title: "EdgeIQ — AI Financial Market Intelligence",
    description: "Smart trading journal, FinBERT news sentiment, and Groq Llama 3.3 trade autopsies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "EdgeIQ",
    "alternateName": "EdgeIQ — Next-Gen AI Market Intelligence & Smart Trading Journal",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "author": {
      "@type": "Person",
      "name": "Raj Puthawala"
    },
    "description": "An AI-powered financial decision-support tool combining FinBERT NLP sentiment classification, Groq Llama 3.3 trade autopsies, and Finnhub financial market data.",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${bebas.variable} ${jetbrains.variable} ${dmSans.variable} font-sans`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

