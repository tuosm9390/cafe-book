import React from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { Cafe } from '../types';

interface MapContainerProps {
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  onMarkerClick: (cafe: Cafe) => void;
  center: { lat: number; lng: number };
}

const MapContainer: React.FC<MapContainerProps> = ({ cafes, selectedCafe, onMarkerClick, center: initialCenter }) => {
  // 선택된 카페가 있으면 해당 위치를 중심으루, 없으면 초기 중심값(사용자 위치 또는 기본값)
  const center = selectedCafe 
    ? { lat: selectedCafe.location.latitude, lng: selectedCafe.location.longitude }
    : initialCenter;

  return (
    <Map
      center={center}
      isPanto={true}
      style={{ width: '100%', height: '100%' }}
      level={5}
    >
      {cafes.map((cafe) => (
        <MapMarker
          key={cafe.id}
          position={{ lat: cafe.location.latitude, lng: cafe.location.longitude }}
          onClick={() => onMarkerClick(cafe)}
          title={cafe.name}
        />
      ))}
    </Map>
  );
};

export default MapContainer;
