import { 
  collection, 
  setDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';
import { Interaction } from '../types';
import { withTimeout } from '../utils/promiseUtils';

const COLLECTION_NAME = 'interactions';

export const getInteraction = async (cafeId: string, userId: string): Promise<Interaction | null> => {
  const interactionId = `${userId}_${cafeId}`;
  const docRef = doc(db, COLLECTION_NAME, interactionId);
  
  const docSnap = await withTimeout(
    getDoc(docRef),
    10000,
    '사용자 정보를 불러오는 중 시간이 초과되었습니다.'
  );

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Interaction;
  }
  return null;
};

export const saveInteraction = async (cafeId: string, userId: string, data: Partial<Interaction>) => {
  const interactionId = `${userId}_${cafeId}`;
  const docRef = doc(db, COLLECTION_NAME, interactionId);
  
  return await withTimeout(
    setDoc(docRef, {
      cafeId,
      userId,
      ...data,
      updatedAt: serverTimestamp(),
    }, { merge: true }),
    10000,
    '별점 및 리뷰를 저장하는 중 시간이 초과되었습니다.'
  );
};

export const getAllInteractionsForCafe = async (cafeId: string): Promise<Interaction[]> => {
  const q = query(collection(db, COLLECTION_NAME), where('cafeId', '==', cafeId));
  
  const querySnapshot = await withTimeout(
    getDocs(q),
    10000,
    '리뷰 목록을 불러오는 중 시간이 초과되었습니다.'
  );
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Interaction));
};
