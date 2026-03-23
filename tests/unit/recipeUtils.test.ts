import { describe, it, expect } from 'vitest';
import { 
  getStepName, 
  calculateStepDuration, 
  formatSecondsToTime,
  calculateRatio
} from '../../src/utils/recipeUtils';

describe('recipeUtils', () => {
  describe('getStepName', () => {
    it('첫 번째 단계는 "뜸들이기"여야 함', () => {
      expect(getStepName(0)).toBe('뜸들이기');
    });

    it('두 번째 단계부터는 "N차 추출" 형식이어야 함', () => {
      expect(getStepName(1)).toBe('1차 추출');
      expect(getStepName(2)).toBe('2차 추출');
    });
  });

  describe('calculateStepDuration', () => {
    it('다음 단계 시작 시간과의 차이를 정확히 계산함', () => {
      expect(calculateStepDuration(0, 30)).toBe(30);
      expect(calculateStepDuration(30, 100)).toBe(70);
    });

    it('다음 단계가 없으면 0을 반환함', () => {
      expect(calculateStepDuration(30)).toBe(0);
    });
  });

  describe('formatSecondsToTime', () => {
    it('60초 미만은 "s초" 형식으로 표시함', () => {
      expect(formatSecondsToTime(45)).toBe('45초');
    });

    it('60초 이상은 "m분 s초" 형식으로 표시함', () => {
      expect(formatSecondsToTime(75)).toBe('1분 15초');
      expect(formatSecondsToTime(120)).toBe('2분 0초');
    });
  });

  describe('calculateRatio', () => {
    it('원두와 물의 비율을 "1:N.N" 형식으로 계산함', () => {
      expect(calculateRatio(20, 300)).toBe('1:15.0');
      expect(calculateRatio(18, 270)).toBe('1:15.0');
      expect(calculateRatio(20, 320)).toBe('1:16.0');
    });
  });
});
