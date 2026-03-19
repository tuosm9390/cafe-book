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

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signInWithKakao = async (customToken: string) => {
  try {
    const result = await signInWithCustomToken(auth, customToken);
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
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
