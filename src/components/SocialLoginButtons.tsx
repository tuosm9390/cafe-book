import React, { useState, useEffect } from "react";
import { signInWithGoogle, signInWithKakaoAuth } from "../api/auth";
import { initKakao, loginWithKakao } from "../utils/kakaoLoader";

interface SocialLoginButtonsProps {
  isSignupMode: boolean;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export const SocialLoginButtons = ({
  isSignupMode,
  onSuccess,
  onError,
}: SocialLoginButtonsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initKakao();
  }, []);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    const startTime = performance.now();
    setIsLoading(true);
    try {
      await signInWithGoogle();
      const endTime = performance.now();
      console.log(`Google Login Success: ${(endTime - startTime).toFixed(2)}ms`);
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    if (isLoading) return;

    const startTime = performance.now();
    setIsLoading(true);
    try {
      const accessToken = await loginWithKakao();
      await signInWithKakaoAuth(accessToken);
      const endTime = performance.now();
      console.log(`Kakao Login Success: ${(endTime - startTime).toFixed(2)}ms`);
      onSuccess?.();
    } catch (error: any) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200 shadow-sm ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
          alt="Google"
          className="w-5 h-5"
        />
        {isLoading ? "처리 중..." : isSignupMode ? "구글로 시작하기" : "구글로 로그인"}
      </button>

      <button
        onClick={handleKakaoLogin}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#FEE500] text-[#191919] font-bold hover:bg-[#FADA0A] transition-all duration-200 shadow-sm ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
          alt="Kakao"
          className="w-5 h-5"
        />
        {isLoading ? "처리 중..." : isSignupMode ? "카카오로 시작하기" : "카카오로 로그인"}
      </button>
    </div>
  );
};
