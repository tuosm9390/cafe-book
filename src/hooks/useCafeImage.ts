import { useState, useEffect } from 'react';
import { Cafe } from '../types';
import { fetchCafeImage } from '../api/kakaoApi';
import { updateCafeImageUrl } from '../api/cafeApi';

export const useCafeImage = (cafe: Cafe | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    cafe?.imageUrl && cafe.imageUrl !== 'DEFAULT' ? cafe.imageUrl : null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!cafe) {
        setImageUrl(null);
        return;
      }

      // T005: 실제 URL이 캐싱된 경우에만 early return ('DEFAULT'는 재시도)
      if (cafe.imageUrl && cafe.imageUrl !== 'DEFAULT') {
        setImageUrl(cafe.imageUrl);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedUrl = await fetchCafeImage(cafe.name, cafe.address);

        if (isMounted) {
          setImageUrl(fetchedUrl);
        }

        // T006: 성공한 URL만 Firestore에 캐싱 (null/실패 시 저장 안 함)
        if (fetchedUrl) {
          await updateCafeImageUrl(cafe.id, fetchedUrl);
        }
      } catch (err) {
        console.error('Failed to fetch or update cafe image:', err);
        if (isMounted) {
          setError('Failed to load image');
          setImageUrl(null); // T007: 'DEFAULT' 대신 null 반환 (재시도 가능 상태 유지)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [cafe?.id, cafe?.name, cafe?.address, cafe?.imageUrl]);

  return { imageUrl, isLoading, error };
};
