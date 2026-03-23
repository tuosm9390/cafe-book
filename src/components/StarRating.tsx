import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, interactive = true }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRatingChange(star)}
          className={cn(
            "transition-transform",
            interactive && "hover:scale-110 cursor-pointer",
            star <= rating ? "text-primary fill-primary" : "text-muted border-none"
          )}
        >
          <Star size={20} fill={star <= rating ? "currentColor" : "none"} className={cn(star > rating && "text-muted-foreground")} />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
