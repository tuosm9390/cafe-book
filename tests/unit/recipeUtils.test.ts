import { describe, it, expect } from 'vitest';
import { 
  calculateRatio, 
  formatSecondsToTime, 
  formatTimeToSeconds, 
  calculateCumulativeWater, 
  calculateTotalTime 
} from '../../src/utils/recipeUtils';

describe('recipeUtils', () => {
  describe('calculateRatio', () => {
    it('정확한 추출 비율을 계산해야 함 (20g, 300g -> 1:15.0)', () => {
      expect(calculateRatio(20, 300)).toBe('1:15.0');
    });

    it('반올림 처리가 올바르게 되어야 함 (12g, 200g -> 1:16.7)', () => {
      expect(calculateRatio(12, 200)).toBe('1:16.7');
    });

    it('원두나 물 양이 0 이하일 경우 1:0.0을 반환해야 함', () => {
      expect(calculateRatio(0, 300)).toBe('1:0.0');
      expect(calculateRatio(20, -10)).toBe('1:0.0');
    });
  });

  describe('formatSecondsToTime', () => {
    it('초를 mm:ss 형식으로 변환해야 함', () => {
      expect(formatSecondsToTime(90)).toBe('01:30');
      expect(formatSecondsToTime(3600)).toBe('60:00');
      expect(formatSecondsToTime(45)).toBe('00:45');
    });
  });

  describe('formatTimeToSeconds', () => {
    it('mm:ss 형식을 초로 변환해야 함', () => {
      expect(formatTimeToSeconds('01:30')).toBe(90);
      expect(formatTimeToSeconds('00:45')).toBe(45);
    });
  });

  describe('calculateCumulativeWater', () => {
    it('각 단계의 누적 물 양을 정확히 계산해야 함', () => {
      const steps = [
        { waterUsed: 40 },
        { waterUsed: 130 },
        { waterUsed: 130 }
      ];
      expect(calculateCumulativeWater(steps)).toEqual([40, 170, 300]);
    });
  });

  describe('calculateTotalTime', () => {
    it('모든 단계의 시간을 합산해야 함', () => {
      const steps = [
        { time: 30 },
        { time: 60 },
        { time: 60 }
      ];
      expect(calculateTotalTime(steps)).toBe(150);
    });
  });
});
