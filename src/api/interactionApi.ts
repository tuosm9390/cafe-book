import { 
  collection, 
  setDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';
import { Interaction, Cafe } from '../types';
import { withTimeout } from '../utils/promiseUtils';

const COLLECTION_NAME = 'interactions';
const CAFE_COLLECTION = 'cafes';
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

/**
 * 별점 및 즐겨찾기 상태를 저장하고 카페 통계(평균 별점, 즐겨찾기 수 등)를 트랜잭션으로 업데이트합니다.
 */
export const saveInteraction = async (cafeId: string, userId: string, data: Partial<Interaction>) => {
  const interactionId = `${userId}_${cafeId}`;
  const interactionRef = doc(db, COLLECTION_NAME, interactionId);
  const cafeRef = doc(db, CAFE_COLLECTION, cafeId);
  
  return await withTimeout(
    runTransaction(db, async (transaction) => {
      // 1. 현재 데이터 읽기
      const interactionDoc = await transaction.get(interactionRef);
      const cafeDoc = await transaction.get(cafeRef);

      if (!cafeDoc.exists()) {
        throw new Error('카페 정보를 찾을 수 없습니다.');
      }

      const prevInteraction = interactionDoc.exists() ? interactionDoc.data() as Interaction : null;
      const cafeData = cafeDoc.data() as Cafe;

      // 초기 통계 값 보정 (기존 데이터에 필드가 없을 경우 대비)
      let currentTotalRatings = cafeData.totalRatings ?? 0;
      let currentAverageRating = cafeData.averageRating ?? 0;
      let currentFavoriteCount = cafeData.favoriteCount ?? 0;

      // 2. 상호작용 데이터 준비
      const newInteraction = {
        cafeId,
        userId,
        ...data,
        updatedAt: serverTimestamp(),
      };

      // 3. 카페 집계 정보 업데이트 계산
      
      // 즐겨찾기 수 업데이트
      if (data.isFavorite !== undefined) {
        const prevIsFavorite = prevInteraction?.isFavorite ?? false;
        if (prevIsFavorite !== data.isFavorite) {
          currentFavoriteCount += data.isFavorite ? 1 : -1;
        }
      }

      // 평점 업데이트
      if (data.rating !== undefined) {
        const prevRating = prevInteraction?.rating ?? 0;
        const newRating = data.rating;

        if (prevRating !== newRating) {
          const oldSum = currentAverageRating * currentTotalRatings;
          
          if (prevRating === 0 && newRating > 0) {
            // 새로 평점을 매긴 경우
            currentTotalRatings += 1;
            currentAverageRating = (oldSum + newRating) / currentTotalRatings;
          } else if (prevRating > 0 && newRating === 0) {
            // 평점을 취소한 경우 (0으로 설정)
            currentTotalRatings = Math.max(0, currentTotalRatings - 1);
            currentAverageRating = currentTotalRatings > 0 ? (oldSum - prevRating) / currentTotalRatings : 0;
          } else if (prevRating > 0 && newRating > 0) {
            // 평점을 수정한 경우
            currentAverageRating = (oldSum - prevRating + newRating) / currentTotalRatings;
          }
        }
      }

      // 4. 쓰기 작업 실행
      transaction.set(interactionRef, newInteraction, { merge: true });
      transaction.update(cafeRef, {
        averageRating: parseFloat(currentAverageRating.toFixed(2)),
        totalRatings: currentTotalRatings,
        favoriteCount: Math.max(0, currentFavoriteCount),
        updatedAt: serverTimestamp(),
      });
    }),
    15000,
    '상호작용 정보를 저장하는 중 오류가 발생했습니다.'
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
