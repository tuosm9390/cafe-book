import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCafeImage } from './kakaoApi';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

vi.stubEnv('VITE_KAKAO_REST_API_KEY', 'test-api-key');

describe('fetchCafeImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // T001: size=10 파라미터로 API 호출 검증
  it('calls Kakao image search API with size=10 parameter', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [{ image_url: 'https://example.com/image.jpg' }],
      }),
    });

    await fetchCafeImage('테스트 카페', '서울 강남구');

    expect(mockFetch).toHaveBeenCalledOnce();
    const calledUrl: string = mockFetch.mock.calls[0][0];
    expect(calledUrl).toContain('size=10');
    expect(calledUrl).not.toContain('size=1&');
    expect(calledUrl).not.toMatch(/size=1$/);
  });

  // T002: documents[0].image_url 반환 검증
  it('returns the first image URL from search results (documents[0])', async () => {
    const firstImageUrl = 'https://example.com/first.jpg';
    const secondImageUrl = 'https://example.com/second.jpg';

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [
          { image_url: firstImageUrl },
          { image_url: secondImageUrl },
        ],
      }),
    });

    const result = await fetchCafeImage('테스트 카페', '서울 강남구');

    expect(result).toBe(firstImageUrl);
    expect(result).not.toBe(secondImageUrl);
  });

  // T003: 검색 결과 없을 때 null 반환 검증
  it('returns null when search results are empty', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ documents: [] }),
    });

    const result = await fetchCafeImage('결과없는카페', '없는주소');

    expect(result).toBeNull();
  });

  it('returns null when API call fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    });

    const result = await fetchCafeImage('테스트 카페', '서울 강남구');

    expect(result).toBeNull();
  });
});
