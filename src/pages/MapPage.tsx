import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import MapContainer from '../components/MapContainer';
import { useCafes } from '../hooks/useCafes';
import { subscribeToAuthChanges } from '../api/auth';
import { User } from 'firebase/auth';

const MapPage: React.FC = () => {
  const { 
    cafes, 
    searchTerm, 
    setSearchTerm, 
    selectedCafe, 
    setSelectedCafe 
  } = useCafes();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <Layout
      sidebar={
        <Sidebar
          cafes={cafes}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm} 
          selectedCafeId={selectedCafe?.id}
          onCafeClick={setSelectedCafe}
          userId={user?.uid}
        />
      }
    >
      <MapContainer
        cafes={cafes}
        selectedCafe={selectedCafe}
        onMarkerClick={setSelectedCafe}
      />
    </Layout>
  );
};

export default MapPage;
