import { describe, it, expect } from 'vitest';
import { mapKakaoPlaceToCafeData } from '../../utils/searchUtils';

describe('searchUtils', () => {
  describe('mapKakaoPlaceToCafeData', () => {
    it('카카오맵 장소 객체를 Cafe 데이터 형식으로 올바르게 변환해야 함', () => {
      const mockPlace = {
        place_name: '스타벅스 강남역점',
        address_name: '서울 강남구 역삼동 821-1',
        road_address_name: '서울 강남구 강남대로 390',
        y: '37.497942',
        x: '127.027621'
      };

      const result = mapKakaoPlaceToCafeData(mockPlace);

      expect(result).toEqual({
        name: '스타벅스 강남역점',
        address: '서울 강남구 강남대로 390',
        location: {
          latitude: 37.497942,
          longitude: 127.027621
        }
      });
    });

    it('도로명 주소가 없을 경우 지번 주소를 사용해야 함', () => {
      const mockPlace = {
        place_name: '동네 카페',
        address_name: '서울 어딘가',
        road_address_name: '',
        y: '37.123',
        x: '127.456'
      };

      const result = mapKakaoPlaceToCafeData(mockPlace);

      expect(result.address).toBe('서울 어딘가');
    });
  });
});
