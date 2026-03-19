import { useState, useMemo, useEffect } from 'react';
import { Cafe } from '../types';
import { filterCafes } from '../utils/searchUtils';
import { getCafes } from '../api/cafeApi';

export const useCafes = () => {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

  const fetchCafes = async () => {
    try {
      setLoading(true);
      const data = await getCafes();
      setCafes(data);
    } catch (error) {
      console.error('Failed to fetch cafes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  const filteredCafes = useMemo(() => {
    return filterCafes(cafes, searchTerm);
  }, [cafes, searchTerm]);

  return {
    cafes: filteredCafes,
    searchTerm,
    setSearchTerm,
    selectedCafe,
    setSelectedCafe,
    loading,
    refresh: fetchCafes
  };
};
