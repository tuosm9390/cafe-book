import React from "react";
import { Cafe } from "../types";
import { MapPin, Star, Coffee } from "lucide-react";
import InteractionSection from "./InteractionSection";
import { Skeleton } from "./ui/skeleton";
import { useCafeImage } from "../hooks/useCafeImage";
import { cn } from "@/lib/utils";

interface CafeListItemProps {
  cafe: Cafe;
  isSelected: boolean;
  onClick: () => void;
  userId?: string;
}

const CafeListItem: React.FC<CafeListItemProps> = ({
  cafe,
  isSelected,
  onClick,
  userId,
}) => {
  const { imageUrl, isLoading } = useCafeImage(cafe);

  return (
    <div
      className={cn(
        "border-b border-border transition-colors hover:bg-accent/50 cursor-pointer",
        isSelected ? "bg-accent border-l-4 border-l-primary" : "bg-card",
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3 p-3">
        {/* 이미지 썸네일 */}
        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={cafe.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Coffee size={24} className="text-muted-foreground" />
            </div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3
              className={cn(
                "font-bold truncate",
                isSelected ? "text-primary" : "text-foreground",
              )}
            >
              {cafe.name}
            </h3>
            <Star
              size={18}
              className={cn(
                "flex-shrink-0 ml-1",
                isSelected
                  ? "text-primary fill-primary"
                  : "text-muted-foreground",
              )}
            />
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">{cafe.address}</span>
          </div>
        </div>
      </div>

      {isSelected && userId && (
        <div
          className="mx-3 mb-3 pt-3 border-t border-border/50"
          onClick={(e) => e.stopPropagation()}
        >
          <InteractionSection cafeId={cafe.id} userId={userId} />
        </div>
      )}
    </div>
  );
};

export default CafeListItem;
