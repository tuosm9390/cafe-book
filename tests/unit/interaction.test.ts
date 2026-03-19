import { describe, it, expect } from 'vitest';
import { validateRating, formatComment } from '../../src/utils/interactionUtils';

describe('Interaction Utilities', () => {
  describe('validateRating', () => {
    it('1보다 작은 평점은 1로 보정해야 함', () => {
      expect(validateRating(0)).toBe(1);
      expect(validateRating(-5)).toBe(1);
    });

    it('5보다 큰 평점은 5로 보정해야 함', () => {
      expect(validateRating(6)).toBe(5);
      expect(validateRating(10)).toBe(5);
    });

    it('소수점 평점은 반올림해야 함', () => {
      expect(validateRating(3.7)).toBe(4);
      expect(validateRating(2.2)).toBe(2);
    });
  });

  describe('formatComment', () => {
    it('좌우 공백을 제거해야 함', () => {
      expect(formatComment('  좋은 카페입니다  ')).toBe('좋은 카페입니다');
    });

    it('500자를 초과하는 댓글은 자동으로 잘라야 함', () => {
      const longComment = 'a'.repeat(600);
      expect(formatComment(longComment)).toHaveLength(500);
    });
  });
});
