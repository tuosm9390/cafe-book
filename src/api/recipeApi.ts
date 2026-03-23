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
import { Recipe, ExtractionStep } from '../types/recipe';

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
 * 기존 데이터에 startTime이 없는 경우 소요 시간을 누적하여 계산해줍니다.
 */
export const getRecipesByUserId = async (userId: string): Promise<Recipe[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let currentStartTime = 0;
      
      // Lazy Migration: startTime이 없는 경우 계산
      const steps = (data.steps || []).map((step: ExtractionStep) => {
        if (step.startTime === undefined) {
          const newStep = { ...step, startTime: currentStartTime };
          currentStartTime += step.time || 0;
          return newStep;
        }
        return step;
      });

      return {
        id: doc.id,
        ...data,
        steps,
        totalTimeComment: data.totalTimeComment || '', // 기본값 처리
      } as Recipe;
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};
