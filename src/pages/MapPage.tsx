import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import MapContainer from "../components/MapContainer";
import { useCafes } from "../hooks/useCafes";
import { subscribeAuth } from "../api/auth";
import { User } from "firebase/auth";
import { loadKakaoMapSDK } from "../utils/mapLoader";

const MapPage: React.FC = () => {
  const { cafes, searchTerm, setSearchTerm, selectedCafe, setSelectedCafe } =
    useCafes();

  const [user, setUser] = useState<User | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuth((u) => setUser(u));

    loadKakaoMapSDK()
      .then(() => setIsMapLoaded(true))
      .catch((err) => console.error("Kakao SDK 로딩 에러:", err));

    return () => unsubscribe();
  }, []);

  return (
    <Layout
      sidebar={
        <Sidebar
          cafes={cafes}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCafeId={selectedCafe?.id}
          onCafeClick={setSelectedCafe}
          userId={user?.uid}
        />
      }
    >
      {isMapLoaded ? (
        <MapContainer
          cafes={cafes}
          selectedCafe={selectedCafe}
          onMarkerClick={setSelectedCafe}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          지도를 불러오는 중입니다...
        </div>
      )}
    </Layout>
  );
};

export default MapPage;
