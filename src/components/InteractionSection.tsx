import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { Heart, Save } from 'lucide-react';
import { saveInteraction, getInteraction } from '../api/interactionApi';

interface InteractionSectionProps {
  cafeId: string;
  userId: string;
}

const InteractionSection: React.FC<InteractionSectionProps> = ({ cafeId, userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveInteraction(cafeId, userId, { rating, comment, isFavorite });
      alert('상호작용이 저장되었습니다.');
    } catch (error) {
      console.error('Failed to save interaction:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4 border border-gray-200">
      <div className="flex justify-between items-center">
        <StarRating rating={rating} onRatingChange={setRating} />
        <button 
          onClick={toggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div>
        <textarea
          placeholder="카페에 대한 코멘트를 남겨주세요..."
          className="w-full p-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center bg-blue-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        <Save size={16} className="mr-2" /> 
        {isSaving ? '저장 중...' : '리뷰 저장하기'}
      </button>
    </div>
  );
};

export default InteractionSection;
