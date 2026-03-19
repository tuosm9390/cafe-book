import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Cafe } from '../types';

const COLLECTION_NAME = 'cafes';

export const getCafes = async (): Promise<Cafe[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Cafe));
};

export const addCafe = async (cafe: Omit<Cafe, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await addDoc(collection(db, COLLECTION_NAME), {
    ...cafe,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateCafe = async (id: string, cafe: Partial<Cafe>) => {
  const cafeDoc = doc(db, COLLECTION_NAME, id);
  return await updateDoc(cafeDoc, {
    ...cafe,
    updatedAt: serverTimestamp(),
  });
};

export const deleteCafe = async (id: string) => {
  const cafeDoc = doc(db, COLLECTION_NAME, id);
  return await deleteDoc(cafeDoc);
};
