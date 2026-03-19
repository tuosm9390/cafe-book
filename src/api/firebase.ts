import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 필수 환경 변수 확인
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  const errorMsg = `Firebase configuration error: Missing [${missingKeys.join(', ')}] in .env file. 
  Check your .env and ensure VITE_ prefix is used.`;
  console.error(errorMsg);
}

// 400 CONFIGURATION_NOT_FOUND 에러 해결 가이드 (개발자 참고용)
export const logFirebaseSetupGuide = () => {
  console.warn(`[Firebase Setup Guide]
  If you see 'CONFIGURATION_NOT_FOUND' (400) error:
  1. Go to Google Cloud Console -> APIs & Services -> Credentials.
  2. Edit your API Key and ensure 'Identity Toolkit API' is NOT restricted.
  3. Or add 'Identity Toolkit API' to the allowed API list.
  4. Verify VITE_FIREBASE_AUTH_DOMAIN matches your Firebase Console -> Authentication -> Settings -> Authorized domains list.`);
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
