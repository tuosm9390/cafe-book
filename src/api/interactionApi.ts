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

const COLLECTION_NAME = 'interactions';

export const getInteraction = async (cafeId: string, userId: string): Promise<Interaction | null> => {
  const interactionId = `${userId}_${cafeId}`;
  const docRef = doc(db, COLLECTION_NAME, interactionId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Interaction;
  }
  return null;
};

export const saveInteraction = async (cafeId: string, userId: string, data: Partial<Interaction>) => {
  const interactionId = `${userId}_${cafeId}`;
  const docRef = doc(db, COLLECTION_NAME, interactionId);
  
  return await setDoc(docRef, {
    cafeId,
    userId,
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getAllInteractionsForCafe = async (cafeId: string): Promise<Interaction[]> => {
  const q = query(collection(db, COLLECTION_NAME), where('cafeId', '==', cafeId));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Interaction));
};
