import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteField,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Cafe } from '../types';
import { withTimeout } from '../utils/promiseUtils';

const COLLECTION_NAME = 'cafes';

export const getCafes = async (): Promise<Cafe[]> => {
  // 인덱스 문제로 지연될 수 있는 orderBy를 제거하고 클라이언트에서 정렬 시도
  const q = query(collection(db, COLLECTION_NAME));
  const querySnapshot = await getDocs(q);
  
  const cafes = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Cafe));

  // 최신순으로 클라이언트 측 정렬
  return cafes.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

export const addCafe = async (cafe: Omit<Cafe, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await withTimeout(
    addDoc(collection(db, COLLECTION_NAME), {
      ...cafe,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
    10000,
    '카페 정보를 저장하는 중 시간이 초과되었습니다. 다시 시도해 주세요.'
  );
};

export const updateCafe = async (id: string, cafe: Partial<Cafe>) => {
  const cafeDoc = doc(db, COLLECTION_NAME, id);
  return await withTimeout(
    updateDoc(cafeDoc, {
      ...cafe,
      updatedAt: serverTimestamp(),
    }),
    10000,
    '카페 정보를 수정하는 중 시간이 초과되었습니다. 다시 시도해 주세요.'
  );
};

export const deleteCafe = async (id: string) => {
  const cafeDoc = doc(db, COLLECTION_NAME, id);
  return await withTimeout(
    deleteDoc(cafeDoc),
    10000,
    '카페 정보를 삭제하는 중 시간이 초과되었습니다. 다시 시도해 주세요.'
  );
};

export const updateCafeImageUrl = async (id: string, imageUrl: string) => {
  const cafeDoc = doc(db, COLLECTION_NAME, id);
  return await withTimeout(
    updateDoc(cafeDoc, {
      imageUrl,
      updatedAt: serverTimestamp(),
    }),
    10000,
    '카페 이미지 URL을 업데이트하는 중 시간이 초과되었습니다.'
  );
};

export const resetDefaultImageUrls = async (): Promise<number> => {
  const q = query(collection(db, COLLECTION_NAME), where('imageUrl', '==', 'DEFAULT'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return 0;

  const batch = writeBatch(db);
  snapshot.docs.forEach((docSnap) => {
    batch.update(doc(db, COLLECTION_NAME, docSnap.id), {
      imageUrl: deleteField(),
      updatedAt: serverTimestamp(),
    });
  });
  await batch.commit();
  return snapshot.size;
};

export const searchCafeImages = async (cafeName: string): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_KAKAO_REST_API_KEY || import.meta.env.VITE_KAKAO_MAP_API_KEY;
  if (!apiKey || apiKey === 'your_kakao_javascript_api_key') return [];

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/search/image?query=${encodeURIComponent(cafeName)}&size=5`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch images from Kakao');
    }

    const data = await response.json();
    return data.documents.map((doc: any) => doc.image_url);
  } catch (error) {
    console.error('Error fetching cafe images:', error);
    return [];
  }
};
