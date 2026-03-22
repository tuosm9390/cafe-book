import React from "react";
import { Cafe } from "../types";
import CafeListItem from "./CafeListItem";
import { Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface SidebarProps {
  cafes: Cafe[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCafeId?: string;
  onCafeClick: (cafe: Cafe) => void;
  userId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  cafes,
  loading = false,
  searchTerm,
  onSearchChange,
  selectedCafeId,
  onCafeClick,
  userId,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">카페 도감</h1>
        <div className="relative">
          <Input
            type="text"
            placeholder="카페 검색..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search
            className="absolute left-3 top-2.5 text-muted-foreground"
            size={18}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : cafes.length > 0 ? (
          cafes.map((cafe) => (
            <CafeListItem
              key={cafe.id}
              cafe={cafe}
              isSelected={cafe.id === selectedCafeId}
              onClick={() => onCafeClick(cafe)}
              userId={userId}
            />
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin")}
          className="w-full flex items-center justify-center"
        >
          <Settings size={14} className="mr-2" />
          관리페이지
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
