// import { logFirebaseSetupGuide } from '../api/firebase';

export const getAuthErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error && !error.hasOwnProperty('code')) return error.message;

  const errorCode = error?.code;
  
  // if (errorCode === 'auth/configuration-not-found') {
  //   logFirebaseSetupGuide();
  //   return '인증 서버 설정이 잘못되었습니다. 관리자에게 문의하세요.';
  // }

  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return '로그인 팝업이 닫혔습니다. 다시 시도해 주세요.';
    case 'auth/cancelled-popup-request':
      return '로그인 프로세스가 취소되었습니다.';
    case 'auth/internal-error':
      return '인증 서버 내부 오류가 발생했습니다.';
    case 'auth/invalid-custom-token':
      return '유효하지 않은 토큰입니다. 카카오 로그인을 다시 시도해 주세요.';
    default:
      console.error('Unknown Auth Error:', error);
      return '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  }
};
