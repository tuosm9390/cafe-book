import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import MapContainer from "../components/MapContainer";
import { useCafes } from "../hooks/useCafes";
import { useGeolocation } from "../hooks/useGeolocation";
import { subscribeAuth } from "../api/auth";
import { User } from "../types";
import { loadKakaoMapSDK } from "../utils/mapLoader";

const MapPage: React.FC = () => {
  const { cafes, searchTerm, setSearchTerm, selectedCafe, setSelectedCafe } =
    useCafes();
  const { latitude, longitude, isLoading: isLocating } = useGeolocation();

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
        <>
          {isLocating && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">현재 위치를 찾는 중입니다...</p>
              </div>
            </div>
          )}
          <MapContainer
            cafes={cafes}
            selectedCafe={selectedCafe}
            onMarkerClick={setSelectedCafe}
            center={{ lat: latitude, lng: longitude }}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">지도를 불러오는 중입니다...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MapPage;
