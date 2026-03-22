const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

export async function fetchCafeImage(cafeName: string, address: string): Promise<string | null> {
  if (!KAKAO_REST_API_KEY) {
    console.warn('VITE_KAKAO_REST_API_KEY is not set in environment variables.');
    return null;
  }

  try {
    const query = `${address} ${cafeName}`;
    const url = `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(query)}&size=10`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error(`Kakao Image Search API failed: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    if (data.documents && data.documents.length > 0) {
      return data.documents[0].image_url;
    }

    return null;
  } catch (error) {
    console.error('Error fetching image from Kakao API:', error);
    return null;
  }
}
