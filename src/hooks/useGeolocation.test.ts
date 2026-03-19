import { renderHook, act } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
  };

  beforeEach(() => {
    (global.navigator as any).geolocation = mockGeolocation;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('초기 상태는 로딩 중이어야 한다', () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.isLoading).toBe(true);
  });

  it('위치 정보 획득 성공 시 좌표를 업데이트해야 한다', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.5,
        longitude: 127.0,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success(mockPosition)
    );

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.latitude).toBe(37.5);
    expect(result.current.longitude).toBe(127.0);
    expect(result.current.isLoading).toBe(false);
  });

  it('위치 권한 거부 시 기본값(강남역)을 유지하고 에러를 설정해야 한다', () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      message: 'User denied Geolocation',
    };

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success, error) =>
      error(mockError)
    );

    const { result } = renderHook(() => useGeolocation());

    expect(result.current.latitude).toBe(37.4979); // 강남역 위도
    expect(result.current.longitude).toBe(127.0276); // 강남역 경도
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeDefined();
  });
});
