import React from 'react';
import { Cafe } from '../types';
import { MapPin, Star } from 'lucide-react';
import InteractionSection from './InteractionSection';
import { cn } from '@/lib/utils';

interface CafeListItemProps {
  cafe: Cafe;
  isSelected: boolean;
  onClick: () => void;
  userId?: string;
}

const CafeListItem: React.FC<CafeListItemProps> = ({ cafe, isSelected, onClick, userId }) => {
  return (
    <div 
      className={cn(
        "p-4 border-b border-border transition-colors hover:bg-accent/50 cursor-pointer",
        isSelected ? "bg-accent border-l-4 border-l-primary" : "bg-card"
      )}
      onClick={onClick}
    >
      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>{cafe.name}</h3>
          <Star 
            size={18} 
            className={cn(
              isSelected ? "text-primary fill-primary" : "text-muted-foreground"
            )} 
          />
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{cafe.address}</span>
        </div>
      </div>

      {isSelected && userId && (
        <div className="mt-4 pt-4 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
          <InteractionSection cafeId={cafe.id} userId={userId} />
        </div>
      )}
    </div>
  );
};

export default CafeListItem;
