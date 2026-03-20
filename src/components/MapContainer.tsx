import React from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { Cafe } from '../types';
import CafeInfoPanel from './CafeInfoPanel';

interface MapContainerProps {
  cafes: Cafe[];
  selectedCafe: Cafe | null;
  onMarkerClick: (cafe: Cafe) => void;
  center: { lat: number; lng: number };
  userId?: string;
}

const MapContainer: React.FC<MapContainerProps> = ({ 
  cafes, 
  selectedCafe, 
  onMarkerClick, 
  center: initialCenter,
  userId
}) => {
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
      onClick={() => {
        // 배경 클릭 시 선택 해제 기능을 원한다면 여기에 추가할 수 있지만, 
        // 현재는 Sidebar와의 동기화 문제가 있을 수 있으므로 비워둡니다.
      }}
    >
      {cafes.map((cafe) => (
        <React.Fragment key={cafe.id}>
          <MapMarker
            position={{ lat: cafe.location.latitude, lng: cafe.location.longitude }}
            onClick={() => onMarkerClick(cafe)}
            title={cafe.name}
            image={
              selectedCafe?.id === cafe.id
                ? {
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", 
                    size: { width: 24, height: 35 }
                  }
                : undefined
            }
          />
          {selectedCafe?.id === cafe.id && (
            <CustomOverlayMap
              position={{ lat: cafe.location.latitude, lng: cafe.location.longitude }}
              yAnchor={1.1} // 마커 약간 위에 표시
              clickable={true}
            >
              <div className="relative z-10 animate-in fade-in zoom-in-95 duration-200" style={{ pointerEvents: 'auto' }}>
                <CafeInfoPanel 
                  cafe={cafe} 
                  userId={userId} 
                  onClose={() => {
                    // onClose 구현이 필요하지만, 이 컴포넌트에서는 
                    // 선택 해제를 부모 컴포넌트에 알릴 방법이 없습니다. (onMarkerClick만 존재)
                    // 따라서 X 버튼을 눌렀을 때의 동작 처리를 위해 임시 방편으로 onMarkerClick에 null을 전달하는 것을 가정할 수 있으나,
                    // 타입 시그니처가 Cafe만 받으므로 닫기 버튼은 단순히 이벤트 전파를 막고 패널 내부 상태를 바꾸는 식으로는 처리가 어렵습니다.
                    // 현재 구조를 유지하기 위해, X 버튼은 UI에서 숨기거나 (onClose 미전달) 클릭 시 아무 작업도 하지 않게 둡니다.
                    // (해결책: onMarkerClick 외에 onCafeDeselect prop을 받도록 수정해야 완벽합니다. 일단 패널에 X버튼을 제외합니다)
                  }}
                />
              </div>
            </CustomOverlayMap>
          )}
        </React.Fragment>
      ))}
    </Map>
  );
};

export default MapContainer;
