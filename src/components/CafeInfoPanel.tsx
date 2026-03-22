import React from 'react';
import { Cafe } from '../types';
import InteractionSection from './InteractionSection';
import { MapPin, X, ImageIcon, Loader2, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCafeImage } from '../hooks/useCafeImage';

interface CafeInfoPanelProps {
  cafe: Cafe;
  userId?: string;
  onClose?: () => void;
  className?: string;
}

const CafeInfoPanel: React.FC<CafeInfoPanelProps> = ({ cafe, userId, onClose, className }) => {
  const { imageUrl, isLoading, error } = useCafeImage(cafe);

  return (
    <div className={cn("bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col max-w-[320px] sm:max-w-[400px] w-full", className)}>
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b border-gray-100">
        <div className="pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-gray-900 leading-tight">{cafe.name}</h3>
            {cafe.averageRating !== undefined && cafe.averageRating > 0 && (
              <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded text-xs font-bold border border-yellow-100">
                <Star size={12} fill="currentColor" />
                {cafe.averageRating}
              </div>
            )}
          </div>
          <div className="flex items-start text-sm text-gray-500">
            <MapPin size={14} className="mr-1 mt-0.5 shrink-0" />
            <span className="break-keep">{cafe.address || '주소 정보 없음'}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            {cafe.totalRatings !== undefined && cafe.totalRatings > 0 && (
              <span className="text-xs text-gray-400">리뷰 {cafe.totalRatings}개</span>
            )}
            {cafe.favoriteCount !== undefined && cafe.favoriteCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Heart size={12} className="text-red-400" fill="currentColor" />
                <span>{cafe.favoriteCount}</span>
              </div>
            )}
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
      <div className="bg-gray-50 border-b border-gray-100 h-[220px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-2" size={24} />
            <span className="text-xs font-medium">이미지 불러오는 중...</span>
          </div>
        ) : imageUrl && imageUrl !== 'DEFAULT' ? (
          <div className="flex overflow-x-auto h-full snap-x snap-mandatory hide-scrollbar">
            <img
              src={imageUrl}
              alt={`${cafe.name} 메인 이미지`}
              className="h-full w-full object-cover snap-center shrink-0 border-r border-white/20 last:border-r-0"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
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
