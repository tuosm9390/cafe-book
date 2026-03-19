export const loadKakaoMapSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
    if (!apiKey || apiKey === 'your_kakao_javascript_api_key') {
      console.error('Kakao Map API Key is missing or invalid in .env');
      reject(new Error('Invalid Kakao Map API Key'));
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing&autoload=false`;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Kakao Map SDK:', error);
      reject(error);
    };

    document.head.appendChild(script);
  });
};
