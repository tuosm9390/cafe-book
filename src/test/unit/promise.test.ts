import { describe, it, expect, vi } from 'vitest';
import { withTimeout } from '../../utils/promiseUtils';

describe('promiseUtils', () => {
  describe('withTimeout', () => {
    it('Promise가 타임아웃 전에 해결되면 결과를 반환해야 함', async () => {
      const fastPromise = new Promise((resolve) => setTimeout(() => resolve('success'), 100));
      const result = await withTimeout(fastPromise, 500);
      expect(result).toBe('success');
    });

    it('Promise가 지정된 시간보다 오래 걸리면 거부되어야 함', async () => {
      const slowPromise = new Promise((resolve) => setTimeout(() => resolve('too slow'), 1000));
      const timeoutMs = 500;
      const errorMessage = 'Timeout error';

      await expect(withTimeout(slowPromise, timeoutMs, errorMessage)).rejects.toThrow(errorMessage);
    });

    it('타임아웃 발생 시 에러 메시지가 커스텀 가능해야 함', async () => {
      const slowPromise = new Promise((resolve) => setTimeout(() => resolve('too slow'), 1000));
      const customMessage = '커스텀 타임아웃 메시지';

      await expect(withTimeout(slowPromise, 100, customMessage)).rejects.toThrow(customMessage);
    });
  });
});
