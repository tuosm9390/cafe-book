import React, { useState, useEffect, useRef } from 'react';
import StarRating from './StarRating';
import { Heart, Save, CheckCircle } from 'lucide-react';
import { saveInteraction, getInteraction, debouncedSaveInteraction } from '../api/interactionApi';

interface InteractionSectionProps {
  cafeId: string;
  userId: string;
  className?: string;
}

const InteractionSection: React.FC<InteractionSectionProps> = ({ cafeId, userId, className = "" }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const isInitialMount = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      const interaction = await getInteraction(cafeId, userId);
      if (interaction) {
        setRating(interaction.rating);
        setComment(interaction.comment || '');
        setIsFavorite(interaction.isFavorite);
      }
    };
    fetchData();
  }, [cafeId, userId]);

  // 별점이나 즐겨찾기 변경 시 자동 저장 (최초 로드 시 제외)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    debouncedSaveInteraction(cafeId, userId, { rating, isFavorite, comment });
  }, [rating, isFavorite, cafeId, userId]);

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);
    try {
      await saveInteraction(cafeId, userId, { rating, comment, isFavorite });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save interaction:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between items-center bg-white p-2 rounded-md border border-gray-100 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 mb-1 font-medium">나의 평점</span>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        <button 
          onClick={toggleFavorite}
          title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          className={`p-2.5 rounded-full transition-all hover:scale-110 ${
            isFavorite ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-400 border border-gray-100'
          }`}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="relative">
        <textarea
          placeholder="이 카페에 대한 메모나 리뷰를 남겨보세요..."
          className="w-full p-3 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all min-h-[90px] bg-white"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`w-full flex items-center justify-center py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
            isSaving 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
          }`}
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              저장 중...
            </span>
          ) : (
            <>
              <Save size={16} className="mr-2" /> 
              리뷰 전체 저장하기
            </>
          )}
        </button>
        
        {showSuccess && (
          <div className="flex items-center justify-center text-green-600 text-xs font-medium animate-in fade-in slide-in-from-top-1 duration-300">
            <CheckCircle size={14} className="mr-1" />
            성공적으로 저장되었습니다!
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractionSection;
