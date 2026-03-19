import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, terminate, clearIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 1. 앱 초기화 (중복 방지)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Firestore 초기화 설정 (롱 폴링 강제 - 네트워크 차단 환경 대응 핵심)
const databaseId = import.meta.env.VITE_FIRESTORE_DATABASE_ID || '(default)';
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);

const auth = getAuth(app);

// 3. 기존 오프라인 데이터 및 캐시 강제 삭제 (연결 꼬임 및 오프라인 고착 방지)
const resetFirestore = async () => {
  try {
    await terminate(db);
    await clearIndexedDbPersistence(db);
    console.log('[Firebase] Firestore 캐시 및 연결 초기화 완료. 페이지를 새로고침하세요.');
    window.location.reload();
  } catch (err) {
    console.warn('[Firebase] 초기화 과정 중 경고:', err);
  }
};

// 400 CONFIGURATION_NOT_FOUND 에러 해결 가이드
export const logFirebaseSetupGuide = () => {
  console.warn(`[Firebase Setup Guide]
  If you see 'CONFIGURATION_NOT_FOUND' (400) error:
  1. Go to Google Cloud Console -> APIs & Services -> Credentials.
  2. Edit your API Key and ensure 'Identity Toolkit API' is NOT restricted.
  3. Or add 'Identity Toolkit API' to the allowed API list.
  4. Verify VITE_FIREBASE_AUTH_DOMAIN matches your Firebase Console -> Authentication -> Settings -> Authorized domains list.`);
};

// 진단용 로그
if (import.meta.env.DEV) {
  console.log(`[Firebase] 초기화 완료. Project: ${firebaseConfig.projectId}, Database: ${databaseId}`);
}

export { app, db, auth, resetFirestore };
export default app;
