import { collection, addDoc, serverTimestamp, doc, setDoc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from './firebase';

const SAMPLE_CAFES = [
  {
    name: '스타벅스 강남역점',
    address: '서울특별시 강남구 강남대로 390',
    latitude: 37.497942,
    longitude: 127.027621,
    description: '역세권에 위치한 넓은 매장입니다.',
    tags: ['프랜차이즈', '노트북하기좋은'],
    createdBy: 'system'
  },
  {
    name: '블루보틀 성수 카페',
    address: '서울특별시 성동구 아차산로 7',
    latitude: 37.547716,
    longitude: 127.044652,
    description: '스페셜티 커피를 즐길 수 있는 곳입니다.',
    tags: ['핸드드립', '인스타감성'],
    createdBy: 'system'
  },
  {
    name: '앤트러사이트 한남점',
    address: '서울특별시 용산구 이태원로 240',
    latitude: 37.536831,
    longitude: 127.000342,
    description: '공장 개조 스타일의 독특한 분위기입니다.',
    tags: ['디저트맛집', '분위기'],
    createdBy: 'system'
  }
];

/**
 * 테스트용 카페 데이터를 Firestore에 시딩합니다.
 */
export const seedCafes = async () => {
  console.log('[Seeding] 카페 데이터 시딩 시작...');
  try {
    for (const cafe of SAMPLE_CAFES) {
      await addDoc(collection(db, 'cafes'), {
        ...cafe,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        averageRating: 0,
        totalRatings: 0,
        favoriteCount: 0,
      });
    }
    console.log('[Seeding] 카페 데이터 시딩 완료!');
  } catch (error) {
    console.error('[Seeding] 카페 데이터 시딩 실패:', error);
    throw error;
  }
};

/**
 * 기존 카페 데이터에 집계 필드를 초기화합니다.
 */
export const migrateCafeAggregateFields = async () => {
  console.log('[Migration] 카페 집계 필드 초기화 시작...');
  try {
    const querySnapshot = await getDocs(collection(db, 'cafes'));
    const batch = writeBatch(db);
    let count = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.averageRating === undefined || data.totalRatings === undefined || data.favoriteCount === undefined) {
        batch.update(doc.ref, {
          averageRating: data.averageRating ?? 0,
          totalRatings: data.totalRatings ?? 0,
          favoriteCount: data.favoriteCount ?? 0,
          updatedAt: serverTimestamp(),
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }
    console.log(`[Migration] ${count}개의 카페 데이터 초기화 완료!`);
  } catch (error) {
    console.error('[Migration] 카페 데이터 초기화 실패:', error);
    throw error;
  }
};

/**
 * 현재 로그인한 사용자를 어드민으로 승격시킵니다.
 */
export const makeMeAdmin = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('로그인이 필요합니다.');
  }

  console.log(`[Seeding] 사용자 ${user.email} 어드민 설정 중...`);
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'admin',
      lastLoginAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    console.log('[Seeding] 어드민 설정 완료!');
  } catch (error) {
    console.error('[Seeding] 어드민 설정 실패:', error);
    throw error;
  }
};
