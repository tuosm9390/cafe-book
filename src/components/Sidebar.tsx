import React from 'react';
import { Cafe } from '../types';
import CafeListItem from './CafeListItem';
import { Search } from 'lucide-react';

interface SidebarProps {
  cafes: Cafe[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCafeId?: string;
  onCafeClick: (cafe: Cafe) => void;
  userId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  cafes, 
  searchTerm, 
  onSearchChange, 
  selectedCafeId,
  onCafeClick,
  userId
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 mb-4">카페 도감</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="카페 검색..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {cafes.length > 0 ? (
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
          <div className="p-8 text-center text-gray-500">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
