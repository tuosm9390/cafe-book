export interface Cafe {
  id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: any; // firebase.firestore.Timestamp
  updatedAt: any;
  createdBy: string;
}

export interface Interaction {
  id: string;
  cafeId: string;
  userId: string;
  comment?: string;
  rating: number; // 1-5
  isFavorite: boolean;
  updatedAt: any;
}

export type AuthProvider = 'google' | 'kakao' | 'email';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  provider: AuthProvider;
  createdAt: any;
  lastLoginAt: any;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface GeolocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  isLoading: boolean;
}

export const KAKAO_MAP_STATUS = {
  OK: 'OK',
  ZERO_RESULT: 'ZERO_RESULT',
  ERROR: 'ERROR',
} as const;
