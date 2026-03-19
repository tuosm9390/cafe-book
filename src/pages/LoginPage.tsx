import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { SocialLoginButtons } from "../components/SocialLoginButtons";

const LoginPage: React.FC = () => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 배경 영역 (2/3) */}
      <div className="hidden md:flex md:w-2/3 bg-blue-600 items-center justify-center p-12 text-white">
        <div className="max-w-lg text-center">
          <h1 className="text-5xl font-bold mb-6">나만의 카페 도감</h1>
          <p className="text-xl opacity-90">
            당신의 특별한 카페 경험을 기록하고 관리하세요. <br />
            지도를 통해 한눈에 확인하는 나만의 카페 리스트.
          </p>
        </div>
      </div>

      {/* 로그인 사이드바 (1/3) */}
      <div className="w-full md:w-1/3 flex flex-col justify-center bg-white shadow-2xl p-8 md:p-12">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              {isSignupMode ? "회원가입" : "로그인"}
            </h2>
            <p className="text-gray-600">
              {isSignupMode
                ? "소셜 계정으로 간편하게 시작하세요."
                : "서비스를 이용하려면 로그인이 필요합니다."}
            </p>
          </div>

          <div className="space-y-4">
            <SocialLoginButtons isSignupMode={isSignupMode} />

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">
                  또는
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsSignupMode(!isSignupMode)}
              className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all duration-200"
            >
              {isSignupMode ? "기존 계정으로 로그인" : "회원가입"}
            </button>
          </div>

          <p className="mt-8 text-xs text-center text-gray-400">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로
            간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
