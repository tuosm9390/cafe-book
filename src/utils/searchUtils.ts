import { Cafe } from '../types';

export const filterCafes = (cafes: Cafe[], searchTerm: string): Cafe[] => {
  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  
  if (!cleanSearchTerm) {
    return cafes;
  }

  return cafes.filter(cafe => 
    cafe.name.toLowerCase().includes(cleanSearchTerm)
  );
};
