import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc,
  deleteDoc,
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
 * 기존 레시피를 수정합니다.
 */
export const updateRecipe = async (id: string, recipe: Partial<Recipe>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    // userId, createdAt 등 민감한 필드는 수정 대상에서 제외되도록 안전하게 업데이트
    const { id: _, userId: __, createdAt: ___, ...updateData } = recipe as any;
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

/**
 * 레시피를 삭제합니다.
 */
export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting recipe:', error);
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
