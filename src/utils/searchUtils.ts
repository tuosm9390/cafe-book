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

export const mapKakaoPlaceToCafeData = (place: any) => {
  return {
    name: place.place_name,
    address: place.road_address_name || place.address_name,
    location: {
      latitude: parseFloat(place.y),
      longitude: parseFloat(place.x)
    }
  };
};
