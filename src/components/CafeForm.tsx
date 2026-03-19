import React, { useState, useEffect } from 'react';
import { Cafe } from '../types';

interface CafeFormProps {
  initialData?: Cafe | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CafeForm: React.FC<CafeFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      address: formData.address,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="text-lg font-bold">{initialData ? '카페 수정' : '새 카페 등록'}</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">카페 이름</label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">주소</label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">위도 (Lat)</label>
          <input
            type="number"
            step="any"
            required
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">경도 (Lng)</label>
          <input
            type="number"
            step="any"
            required
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          저장
        </button>
      </div>
    </form>
  );
};

export default CafeForm;
