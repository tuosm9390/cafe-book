import React from "react";

const HomePage: React.FC = () => {
  return (
    <div
      className="flex w-full min-h-screen items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/coff-pedia-thumbnail.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-background mb-2">카페 도감</h1>
          <p className="text-background">나만의 카페 기록 공간</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
