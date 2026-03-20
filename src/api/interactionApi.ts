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
const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

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

/**
 * 별점 및 즐겨찾기 토글을 위한 디바운스 저장 함수
 * 카페별로 1초간 대기 후 마지막 변경 사항만 저장함
 */
export const debouncedSaveInteraction = (cafeId: string, userId: string, data: Partial<Interaction>) => {
  const interactionId = `${userId}_${cafeId}`;
  
  if (debounceTimers.has(interactionId)) {
    clearTimeout(debounceTimers.get(interactionId));
  }

  const timer = setTimeout(() => {
    saveInteraction(cafeId, userId, data);
    debounceTimers.delete(interactionId);
  }, 1000);

  debounceTimers.set(interactionId, timer);
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
