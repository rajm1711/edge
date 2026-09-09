import { describe, it, expect } from 'vitest';
import {
  calculatePnL,
  calculatePnLPercentage,
  calculateWinRate,
  calculateRiskRewardRatio
} from './financial-math';

describe('Financial Math Module', () => {
  describe('calculatePnL', () => {
    it('should correctly calculate LONG trade profit', () => {
      expect(calculatePnL('LONG', 100, 120, 10)).toBe(200);
    });

    it('should correctly calculate LONG trade loss', () => {
      expect(calculatePnL('LONG', 100, 90, 10)).toBe(-100);
    });

    it('should correctly calculate SHORT trade profit', () => {
      expect(calculatePnL('SHORT', 100, 80, 10)).toBe(200);
    });

    it('should correctly calculate SHORT trade loss', () => {
      expect(calculatePnL('SHORT', 100, 110, 10)).toBe(-100);
    });

    it('should handle zero or invalid inputs safely', () => {
      expect(calculatePnL('LONG', 0, 100, 10)).toBe(0);
      expect(calculatePnL('LONG', 100, 120, -5)).toBe(0);
    });
  });

  describe('calculatePnLPercentage', () => {
    it('should calculate correct percentage for LONG trades', () => {
      expect(calculatePnLPercentage('LONG', 100, 115)).toBe(15);
      expect(calculatePnLPercentage('LONG', 100, 85)).toBe(-15);
    });

    it('should calculate correct percentage for SHORT trades', () => {
      expect(calculatePnLPercentage('SHORT', 100, 85)).toBe(15);
      expect(calculatePnLPercentage('SHORT', 100, 115)).toBe(-15);
    });
  });

  describe('calculateWinRate', () => {
    it('should return correct win rate percentage', () => {
      const trades = [{ pnl: 100 }, { pnl: 50 }, { pnl: -30 }, { pnl: -20 }];
      expect(calculateWinRate(trades)).toBe(50);
    });

    it('should return 0 for empty trade arrays', () => {
      expect(calculateWinRate([])).toBe(0);
    });
  });

  describe('calculateRiskRewardRatio', () => {
    it('should calculate correct R:R for LONG setup', () => {
      // Entry: $100, Stop: $95 (Risk: $5), Target: $115 (Reward: $15) -> 1:3
      expect(calculateRiskRewardRatio('LONG', 100, 95, 115)).toBe(3);
    });

    it('should calculate correct R:R for SHORT setup', () => {
      // Entry: $100, Stop: $105 (Risk: $5), Target: $85 (Reward: $15) -> 1:3
      expect(calculateRiskRewardRatio('SHORT', 100, 105, 85)).toBe(3);
    });

    it('should return 0 if stop loss or target is invalid', () => {
      expect(calculateRiskRewardRatio('LONG', 100, 105, 115)).toBe(0);
    });
  });
});
