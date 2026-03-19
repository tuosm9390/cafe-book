import { useState, useEffect } from 'react';
import { GeolocationState } from '../types';

/**
 * 사용자의 현재 위치를 추적하는 커스텀 훅
 */
export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    latitude: 37.4979, // 기본값: 강남역
    longitude: 127.0276,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        isLoading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
      }
    );
  }, []);

  return state;
};
