import React, { useEffect, useState } from 'react';
import { Cafe } from '../types';
import { searchCafeImages } from '../api/cafeApi';
import InteractionSection from './InteractionSection';
import { MapPin, X, ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CafeInfoPanelProps {
  cafe: Cafe;
  userId?: string;
  onClose?: () => void;
  className?: string;
}

const CafeInfoPanel: React.FC<CafeInfoPanelProps> = ({ cafe, userId, onClose, className }) => {
  const [images, setImages] = useState<string[]>(cafe.images || []);
  const [isLoadingImages, setIsLoadingImages] = useState(!cafe.images || cafe.images.length === 0);

  useEffect(() => {
    let isMounted = true;

    const fetchImages = async () => {
      // 이미지가 없고 아직 로딩 중일 때 검색 실행
      if ((!cafe.images || cafe.images.length === 0) && isLoadingImages) {
        try {
          const fetchedImages = await searchCafeImages(cafe.name);
          if (isMounted) {
            setImages(fetchedImages);
          }
        } catch (error) {
          console.error('이미지 로딩 중 오류:', error);
        } finally {
          if (isMounted) {
            setIsLoadingImages(false);
          }
        }
      } else {
        setImages(cafe.images || []);
        setIsLoadingImages(false);
      }
    };

    fetchImages();

    return () => {
      isMounted = false;
    };
  }, [cafe.id, cafe.name, cafe.images]); // cafe.id가 변경될 때마다 다시 실행

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col max-w-[320px] sm:max-w-[400px] w-full", className)}>
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-100">
        <div className="pr-4">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">{cafe.name}</h3>
          <div className="flex items-start text-sm text-gray-500 mt-1">
            <MapPin size={14} className="mr-1 mt-0.5 shrink-0" />
            <span className="break-keep">{cafe.address || '주소 정보 없음'}</span>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors shrink-0"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Image Gallery */}
      <div className="bg-gray-50 border-b border-gray-100 h-[140px] relative">
        {isLoadingImages ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs font-medium">이미지 불러오는 중...</span>
          </div>
        ) : images.length > 0 ? (
          <div className="flex overflow-x-auto h-full snap-x snap-mandatory hide-scrollbar">
            {images.map((url, idx) => (
              <img 
                key={idx}
                src={url} 
                alt={`${cafe.name} 이미지 ${idx + 1}`}
                className="h-full w-auto object-cover snap-center shrink-0 border-r border-white/20 last:border-r-0"
                loading="lazy"
                onError={(e) => {
                  // 이미지 로드 실패 시 숨김 처리
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <ImageIcon size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">등록된 이미지가 없습니다</span>
          </div>
        )}
      </div>

      {/* Interaction Section */}
      <div className="p-4 bg-white">
        {userId ? (
          <InteractionSection cafeId={cafe.id} userId={userId} className="!mt-0 !space-y-3" />
        ) : (
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-500 font-medium">로그인하고 리뷰와 별점을 남겨보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeInfoPanel;
