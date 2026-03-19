import React, { useState, useEffect, useRef } from 'react';
import { Cafe, KAKAO_MAP_STATUS } from '../types';
import { mapKakaoPlaceToCafeData } from '../utils/searchUtils';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface CafeFormProps {
  initialData?: Cafe | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const CafeForm: React.FC<CafeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });

  const [searchKeyword, setSearchKeyword] = useState('');
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
        longitude: initialData.location.longitude.toString()
      });
    }
  }, [initialData]);

  const executeSearch = () => {
    if (!searchKeyword.trim()) return;

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      setSearchError('카카오맵 라이브러리가 로드되지 않았습니다.');
      return;
    }

    if (!psRef.current) {
      psRef.current = new window.kakao.maps.services.Places();
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    psRef.current.keywordSearch(searchKeyword, (data: any[], status: string) => {
      setIsSearching(false);
      if (status === KAKAO_MAP_STATUS.OK) {
        setSearchResults(data);
      } else if (status === KAKAO_MAP_STATUS.ZERO_RESULT) {
        setSearchError('검색 결과가 없습니다. 다른 키워드로 검색해 주세요.');
      } else {
        setSearchError('검색 중 오류가 발생했습니다.');
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
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
      longitude: mapped.location.longitude.toString()
    });
    setSearchResults([]);
    setSearchKeyword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert('위치 검색을 통해 장소를 먼저 선택해 주세요.');
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({
        name: formData.name,
        address: formData.address,
        location: {
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude)
        }
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white border rounded-xl shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-3">
        {initialData ? '카페 정보 수정' : '새로운 카페 등록'}
      </h3>
      
      {/* 위치 검색 섹션 (form 태그 대신 div 사용) */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700">위치 검색 (카카오맵)</label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="카페 이름이나 주소를 입력하세요 (예: 스타벅스 강남)"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            type="button"
            onClick={executeSearch}
            disabled={isSearching}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center"
          >
            {isSearching ? <Loader2 size={18} className="animate-spin" /> : '검색'}
          </button>
        </div>

        {/* 검색 결과 리스트 */}
        {searchResults.length > 0 && (
          <div className="mt-2 border rounded-lg max-h-60 overflow-y-auto divide-y bg-gray-50 shadow-inner">
            {searchResults.map((result, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPlace(result)}
                className="w-full text-left p-3 hover:bg-blue-50 transition-colors group flex items-start"
              >
                <MapPin className="mt-1 mr-2 text-gray-400 group-hover:text-blue-500 shrink-0" size={16} />
                <div>
                  <div className="font-bold text-gray-800">{result.place_name}</div>
                  <div className="text-sm text-gray-500">{result.road_address_name || result.address_name}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {searchError && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-100">
            {searchError}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-dashed">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">선택된 카페 이름</label>
          <input
            type="text"
            required
            placeholder="위치 검색 후 자동 입력되거나 직접 수정 가능합니다."
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">선택된 주소</label>
          <input
            type="text"
            readOnly
            placeholder="위치 검색 시 자동으로 입력됩니다."
            className="w-full px-3 py-2 border border-gray-200 rounded-md outline-none bg-gray-100 text-gray-600 cursor-not-allowed"
            value={formData.address}
          />
        </div>

        <div className="p-3 bg-blue-50 rounded-lg flex items-center text-sm text-blue-700 border border-blue-100">
          <MapPin size={16} className="mr-2" />
          {formData.latitude ? (
            <span>위치 좌표: {formData.latitude}, {formData.longitude}</span>
          ) : (
            <span className="font-medium">장소 검색을 통해 정확한 위치를 지정해 주세요.</span>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors font-bold shadow-md shadow-blue-200 flex items-center"
          >
            {isSaving && <Loader2 size={18} className="animate-spin mr-2" />}
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CafeForm;
