import React from 'react';
import { Cafe } from '../types';
import { MapPin, Star } from 'lucide-react';
import InteractionSection from './InteractionSection';

interface CafeListItemProps {
  cafe: Cafe;
  isSelected: boolean;
  onClick: () => void;
  userId?: string;
}

const CafeListItem: React.FC<CafeListItemProps> = ({ cafe, isSelected, onClick, userId }) => {
  return (
    <div 
      className={`p-4 border-b border-gray-100 transition-colors hover:bg-blue-50 ${isSelected ? 'bg-white' : ''}`}
    >
      <div className="cursor-pointer" onClick={onClick}>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800">{cafe.name}</h3>
          <Star size={18} className={`${isSelected ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{cafe.address}</span>
        </div>
      </div>

      {isSelected && userId && (
        <InteractionSection cafeId={cafe.id} userId={userId} />
      )}
    </div>
  );
};

export default CafeListItem;
