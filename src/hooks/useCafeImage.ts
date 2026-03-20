import { useState, useEffect } from 'react';
import { Cafe } from '../types';
import { fetchCafeImage } from '../api/kakaoApi';
import { updateCafeImageUrl } from '../api/cafeApi';

export const useCafeImage = (cafe: Cafe | null) => {
  const [imageUrl, setImageUrl] = useState<string | null>(cafe?.imageUrl || null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!cafe) {
        setImageUrl(null);
        return;
      }

      // If already cached, use it directly.
      if (cafe.imageUrl) {
        setImageUrl(cafe.imageUrl);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const fetchedUrl = await fetchCafeImage(cafe.name, cafe.address);
        const finalUrl = fetchedUrl || 'DEFAULT';
        
        if (isMounted) {
          setImageUrl(finalUrl);
        }

        // Cache the URL globally in Firestore
        await updateCafeImageUrl(cafe.id, finalUrl);
      } catch (err) {
        console.error('Failed to fetch or update cafe image:', err);
        if (isMounted) {
          setError('Failed to load image');
          setImageUrl('DEFAULT'); // fallback
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
