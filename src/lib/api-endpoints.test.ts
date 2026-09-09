import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';

// Import Market Routes using relative paths for Vitest compatibility
import { GET as getQuote } from '../app/api/market/quote/route';
import { GET as getNews } from '../app/api/market/news/route';

// Import AI Routes
import { POST as preTradeAI } from '../app/api/ai/pre-trade/route';
import { POST as tradeAutopsyAI } from '../app/api/ai/trade-autopsy/route';
import { POST as researchAI } from '../app/api/ai/research/route';
import { POST as signalsAI } from '../app/api/ai/signals/route';
import { POST as sentimentAI } from '../app/api/ai/sentiment/route';

describe('Serverless API Route Handlers Suite', () => {
  describe('Market Data Route Handlers', () => {
    it('GET /api/market/quote should validate missing ticker parameter', async () => {
      const req = new NextRequest('http://localhost:3000/api/market/quote');
      const res = await getQuote(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('GET /api/market/news should validate missing ticker parameter', async () => {
      const req = new NextRequest('http://localhost:3000/api/market/news');
      const res = await getNews(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });
  });

  describe('AI Microservice Route Handlers', () => {
    it('POST /api/ai/pre-trade should validate missing required parameters', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/pre-trade', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const res = await preTradeAI(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe('Invalid input parameters');
    });

    it('POST /api/ai/trade-autopsy should validate missing trade ticker', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/trade-autopsy', {
        method: 'POST',
        body: JSON.stringify({ trade: {} }),
      });
      const res = await tradeAutopsyAI(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe('Invalid trade autopsy parameters');
    });

    it('POST /api/ai/research should validate missing stock parameters', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/research', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const res = await researchAI(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe('Invalid stock research request parameters');
    });

    it('POST /api/ai/signals should validate missing ticker input', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/signals', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const res = await signalsAI(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe('Invalid request parameters');
    });

    it('POST /api/ai/sentiment should handle empty news array gracefully', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/sentiment', {
        method: 'POST',
        body: JSON.stringify({ ticker: 'NVDA', news: [] }),
      });
      const res = await sentimentAI(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
    });
  });
});
