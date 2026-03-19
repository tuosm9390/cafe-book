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
let db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, databaseId);

const auth = getAuth(app);

// 3. 자가 치유(Self-healing) 로직 및 래퍼 (Constitution IX 준수)
let failureCount = 0;
const FAILURE_THRESHOLD = 3;

const resetFirestore = async () => {
  try {
    console.log('[Firebase] 자가 치유 프로세스 시작: Firestore 캐시 및 연결 초기화 중...');
    await terminate(db);
    await clearIndexedDbPersistence(db);
    console.log('[Firebase] 초기화 완료. 페이지를 새로고침합니다.');
    window.location.reload();
  } catch (err) {
    console.warn('[Firebase] 초기화 과정 중 경고:', err);
  }
};

/**
 * 에러 발생 시 실패 횟수를 기록하고 임계치 도달 시 자동 복구를 시도합니다.
 */
export const handleFirestoreError = (error: any) => {
  if (error.code === 'unavailable' || error.code === 'failed-precondition') {
    failureCount++;
    console.warn(`[Firebase] Firestore 연결 오류 감지 (${failureCount}/${FAILURE_THRESHOLD}):`, error.message);
    
    if (failureCount >= FAILURE_THRESHOLD) {
      resetFirestore();
    }
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
