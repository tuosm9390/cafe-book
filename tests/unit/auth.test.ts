import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithGoogle, signInWithKakaoAuth } from '../../src/api/auth';
import { signInWithPopup, signInWithCustomToken } from 'firebase/auth';

// Firebase Auth 모킹
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    setCustomParameters: vi.fn(),
  })),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithCustomToken: vi.fn(),
}));

vi.mock('../../src/api/firebase', () => ({
  app: {},
  auth: {},
  logFirebaseSetupGuide: vi.fn(),
}));

describe('Auth Service - Sign In', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Google Sign In', () => {
    it('성공 시 올바른 User 객체를 반환해야 함', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'http://example.com/photo.png',
        metadata: {
          creationTime: '2026-03-19T00:00:00Z',
          lastSignInTime: '2026-03-19T00:00:00Z',
        },
      };

      (signInWithPopup as any).mockResolvedValueOnce({ user: mockUser });

      const result = await signInWithGoogle();

      expect(result.uid).toBe('test-uid');
      expect(result.provider).toBe('google');
      expect(signInWithPopup).toHaveBeenCalledTimes(1);
    });

    it('에러 발생 시 사용자 정의 메시지를 throw해야 함', async () => {
      (signInWithPopup as any).mockRejectedValueOnce({ code: 'auth/configuration-not-found' });

      await expect(signInWithGoogle()).rejects.toThrow('인증 서버 설정이 잘못되었습니다. 관리자에게 문의하세요.');
    });
  });

  describe('Kakao Sign In (Custom Token)', () => {
    it('현재 백엔드 부재로 인해 에러가 발생해야 함 (기대된 동작)', async () => {
      await expect(signInWithKakaoAuth('fake-token')).rejects.toThrow('Kakao 로그인을 위해서는 Firebase Cloud Functions를 통한 토큰 교환 로직이 필요합니다.');
    });
  });
});
