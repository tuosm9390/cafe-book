import { describe, it, expect } from 'vitest';
import { filterCafes } from '../../src/utils/searchUtils';
import { Cafe } from '../../src/types';

describe('Search Performance Benchmark', () => {
  it('10,000개의 카페 데이터 필터링이 0.5초 이내여야 함', () => {
    // 10,000개의 더미 데이터 생성
    const largeMockCafes: Cafe[] = Array.from({ length: 10000 }, (_, i) => ({
      id: `${i}`,
      name: `카페 ${i}`,
      address: `주소 ${i}`,
      location: { latitude: 37, longitude: 127 },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin'
    }));

    const start = performance.now();
    const result = filterCafes(largeMockCafes, '카페 9999');
    const end = performance.now();
    
    const duration = end - start;
    console.log(`Search Duration for 10k items: ${duration}ms`);
    
    expect(duration).toBeLessThan(500); // 0.5초(500ms) 기준
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
