import { renderHook, waitFor } from '@testing-library/react';
import { useCafeImage } from './useCafeImage';
import { fetchCafeImage } from '../api/kakaoApi';
import { updateCafeImageUrl } from '../api/cafeApi';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../api/kakaoApi', () => ({
  fetchCafeImage: vi.fn(),
}));

vi.mock('../api/cafeApi', () => ({
  updateCafeImageUrl: vi.fn(),
}));

describe('useCafeImage', () => {
  const mockCafe: any = {
    id: 'cafe-1',
    name: 'Test Cafe',
    address: 'Test Address',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns cached image if it exists', async () => {
    const cafeWithImage = { ...mockCafe, imageUrl: 'https://example.com/cached.jpg' };
    
    const { result } = renderHook(() => useCafeImage(cafeWithImage));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.imageUrl).toBe('https://example.com/cached.jpg');
    expect(fetchCafeImage).not.toHaveBeenCalled();
    expect(updateCafeImageUrl).not.toHaveBeenCalled();
  });

  it('fetches image from Kakao API if not cached', async () => {
    (fetchCafeImage as any).mockResolvedValue('https://example.com/fetched.jpg');

    const { result } = renderHook(() => useCafeImage(mockCafe));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.imageUrl).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.imageUrl).toBe('https://example.com/fetched.jpg');
    expect(fetchCafeImage).toHaveBeenCalledWith('Test Cafe', 'Test Address');
    expect(updateCafeImageUrl).toHaveBeenCalledWith('cafe-1', 'https://example.com/fetched.jpg');
  });

  // T004: 기존 'DEFAULT' 캐싱 테스트 → null 반환 + updateCafeImageUrl 미호출로 수정
  it('handles fetch failure gracefully without caching DEFAULT', async () => {
    (fetchCafeImage as any).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useCafeImage(mockCafe));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.imageUrl).toBeNull();
    expect(result.current.error).toBe('Failed to load image');
    expect(updateCafeImageUrl).not.toHaveBeenCalled();
  });

  // T003: fetchCafeImage가 null 반환 시 updateCafeImageUrl 미호출 테스트
  it('does not cache when fetch returns null', async () => {
    (fetchCafeImage as any).mockResolvedValue(null);

    const { result } = renderHook(() => useCafeImage(mockCafe));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.imageUrl).toBeNull();
    expect(updateCafeImageUrl).not.toHaveBeenCalled();
  });

  // T002: cafe.imageUrl === 'DEFAULT'인 경우 재시도해야 함
  it('retries fetch when imageUrl is DEFAULT (stale cache)', async () => {
    const cafeWithDefault = { ...mockCafe, imageUrl: 'DEFAULT' };
    (fetchCafeImage as any).mockResolvedValue('https://example.com/fresh.jpg');

    const { result } = renderHook(() => useCafeImage(cafeWithDefault));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(fetchCafeImage).toHaveBeenCalledWith('Test Cafe', 'Test Address');
    expect(result.current.imageUrl).toBe('https://example.com/fresh.jpg');
    expect(updateCafeImageUrl).toHaveBeenCalledWith('cafe-1', 'https://example.com/fresh.jpg');
  });
});
