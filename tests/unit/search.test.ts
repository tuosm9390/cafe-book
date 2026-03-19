import { describe, it, expect } from 'vitest';
import { filterCafes } from '../../src/utils/searchUtils';
import { Cafe } from '../../src/types';

describe('filterCafes', () => {
  const mockCafes: Partial<Cafe>[] = [
    { name: '스타벅스 강남점' },
    { name: '투썸플레이스 신촌점' },
    { name: '이디야 역삼점' },
  ];

  it('검색어와 일치하는 카페를 필터링해야 함', () => {
    const result = filterCafes(mockCafes as Cafe[], '스타벅스');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('스타벅스 강남점');
  });

  it('검색어가 비어있으면 모든 카페를 반환해야 함', () => {
    const result = filterCafes(mockCafes as Cafe[], '');
    expect(result).toHaveLength(3);
  });

  it('대소문자 및 공백을 무시하고 필터링해야 함', () => {
    const result = filterCafes(mockCafes as Cafe[], ' 스타벅스 ');
    expect(result).toHaveLength(1);
  });
});
