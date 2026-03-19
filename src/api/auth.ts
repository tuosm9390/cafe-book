import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken
} from 'firebase/auth';
import { app } from './firebase';
import { User } from '../types';
import { getAuthErrorMessage } from '../utils/authErrors';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Google 팝업 설정 최적화
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      provider: 'google',
      createdAt: firebaseUser.metadata.creationTime,
      lastLoginAt: firebaseUser.metadata.lastSignInTime,
    };
  } catch (error: any) {
    const message = getAuthErrorMessage(error);
    throw new Error(message);
  }
};

/**
 * Kakao Access Token을 받아 Firebase Custom Token으로 교환하고 로그인합니다.
 * @param kakaoAccessToken Kakao SDK를 통해 획득한 토큰
 */
export const signInWithKakaoAuth = async (kakaoAccessToken: string): Promise<User> => {
  try {
    // 1. 백엔드 API (Firebase Cloud Functions 등) 호출하여 Custom Token 획득
    // const response = await fetch('/api/auth/kakao', { 
    //   method: 'POST', 
    //   body: JSON.stringify({ token: kakaoAccessToken }) 
    // });
    // const { customToken } = await response.json();
    
    // 임시: 현재 백엔드가 없으므로 에러 처리 또는 가이드 출력
    // throw new Error('백엔드 인증 서버가 설정되지 않았습니다. Cloud Functions 구현이 필요합니다.');

    // 2. Firebase Custom Token으로 로그인
    // const result = await signInWithCustomToken(auth, customToken);
    
    // 인터페이스 유지를 위해 에러 throw
    throw new Error('Kakao 로그인을 위해서는 Firebase Cloud Functions를 통한 토큰 교환 로직이 필요합니다. (Research.md 참조)');

  } catch (error: any) {
    const message = getAuthErrorMessage(error);
    throw new Error(message);
  }
};

export const logout = async () => {
  await signOut(auth);
};

export const subscribeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        provider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'kakao',
        createdAt: firebaseUser.metadata.creationTime,
        lastLoginAt: firebaseUser.metadata.lastSignInTime,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};
