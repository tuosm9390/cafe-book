import React from "react";
import { signInWithGoogle } from "../api/auth";

interface SocialLoginButtonsProps {
  isSignupMode: boolean;
}

export const SocialLoginButtons = ({
  isSignupMode,
}: SocialLoginButtonsProps) => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      alert(`구글 로그인 실패: ${error.message}`);
    }
  };

  const handleKakaoLogin = () => {
    // TODO: Phase 5에서 구현 예정 (Kakao SDK 연동)
    alert("카카오 로그인은 현재 준비 중입니다.");
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200 shadow-sm"
      >
        <img
          src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
          alt="Google"
          className="w-5 h-5"
        />
        {isSignupMode ? "구글로 시작하기" : "구글로 로그인"}
      </button>

      <button
        onClick={handleKakaoLogin}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#FEE500] text-[#191919] font-bold hover:bg-[#FADA0A] transition-all duration-200 shadow-sm"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/KakaoTalk_logo.svg"
          alt="Kakao"
          className="w-5 h-5"
        />
        {isSignupMode ? "카카오로 시작하기" : "카카오로 로그인"}
      </button>
    </div>
  );
};
