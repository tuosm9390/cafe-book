export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    const apiKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (apiKey) {
      window.Kakao.init(apiKey);
    } else {
      console.error('Kakao Javascript API Key is missing in .env');
    }
  }
};

export const loginWithKakao = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) {
      reject(new Error('Kakao SDK not loaded'));
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj: any) => {
        resolve(authObj.access_token);
      },
      fail: (err: any) => {
        console.error('Kakao login failed:', err);
        reject(err);
      },
    });
  });
};
