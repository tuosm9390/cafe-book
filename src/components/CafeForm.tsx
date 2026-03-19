import React, { useState, useEffect, useRef } from "react";
import { Cafe, KAKAO_MAP_STATUS } from "../types";
import { mapKakaoPlaceToCafeData } from "../utils/searchUtils";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface CafeFormProps {
  initialData?: Cafe | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

const CafeForm: React.FC<CafeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const psRef = useRef<any>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        address: initialData.address,
        latitude: initialData.location.latitude.toString(),
        longitude: initialData.location.longitude.toString(),
      });
    } else {
      // 초기화
      setFormData({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
      });
    }
  }, [initialData]);

  const executeSearch = () => {
    if (!searchKeyword.trim()) return;

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      setSearchError("카카오맵 라이브러리가 로드되지 않았습니다.");
      return;
    }

    if (!psRef.current) {
      psRef.current = new window.kakao.maps.services.Places();
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    psRef.current.keywordSearch(
      searchKeyword,
      (data: any[], status: string) => {
        setIsSearching(false);
        if (status === KAKAO_MAP_STATUS.OK) {
          setSearchResults(data);
        } else if (status === KAKAO_MAP_STATUS.ZERO_RESULT) {
          setSearchError("검색 결과가 없습니다.");
        } else {
          setSearchError("검색 중 오류가 발생했습니다.");
        }
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeSearch();
    }
  };

  const handleSelectPlace = (place: any) => {
    const mapped = mapKakaoPlaceToCafeData(place);
    setFormData({
      name: mapped.name,
      address: mapped.address,
      latitude: mapped.location.latitude.toString(),
      longitude: mapped.location.longitude.toString(),
    });
    setSearchResults([]);
    setSearchKeyword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert("위치 검색을 통해 장소를 먼저 선택해 주세요.");
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        name: formData.name,
        address: formData.address,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 위치 검색 섹션 */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground">
          위치 검색 (카카오맵)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="카페 이름이나 주소 검색"
              className="pl-9"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search
              className="absolute left-3 top-2.5 text-muted-foreground"
              size={16}
            />
          </div>
          <Button type="button" onClick={executeSearch} disabled={isSearching}>
            {isSearching ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "검색"
            )}
          </Button>
        </div>

        {/* 검색 결과 */}
        {searchResults.length > 0 && (
          <Card className="mt-2 border-primary/10 shadow-sm max-h-48 overflow-y-auto">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {searchResults.map((result, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPlace(result)}
                    className="w-full text-left p-3 hover:bg-muted transition-colors flex items-start gap-2"
                  >
                    <MapPin className="mt-1 text-primary shrink-0" size={14} />
                    <div className="overflow-hidden">
                      <div className="font-medium text-sm truncate">
                        {result.place_name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {result.road_address_name || result.address_name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {searchError && (
          <p className="text-xs text-destructive bg-destructive/10 p-2 rounded">
            {searchError}
          </p>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 pt-4 border-t border-border border-dashed"
      >
        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            카페 이름
          </label>
          <Input
            type="text"
            required
            placeholder="이름 입력"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-muted-foreground">
            주소
          </label>
          <Input
            type="text"
            readOnly
            placeholder="주소 (검색 시 자동 입력)"
            className="bg-muted/50"
            value={formData.address}
          />
        </div>

        <div
          className={cn(
            "p-3 rounded-lg flex items-center text-xs border transition-colors",
            formData.latitude
              ? "bg-primary/5 border-primary/20 text-primary"
              : "bg-muted border-border text-muted-foreground",
          )}
        >
          <MapPin size={14} className="mr-2" />
          {formData.latitude ? (
            <span className="font-medium">
              좌표: {formData.latitude}, {formData.longitude}
            </span>
          ) : (
            <span>검색을 통해 위치를 지정해 주세요.</span>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-muted-foreground"
            >
              취소
            </Button>
          )}
          <Button type="submit" disabled={isSaving} className="min-w-[100px]">
            {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
            {initialData ? "수정 완료" : "카페 등록"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CafeForm;
