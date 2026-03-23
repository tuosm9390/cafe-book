import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Recipe } from '../types/recipe';

const COLLECTION_NAME = 'recipes';

/**
 * 새로운 레시피를 Firestore에 저장합니다.
 */
export const createRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...recipe,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

/**
 * 특정 사용자의 레시피 목록을 최신순으로 가져옵니다.
 */
export const getRecipesByUserId = async (userId: string): Promise<Recipe[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Recipe[];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
