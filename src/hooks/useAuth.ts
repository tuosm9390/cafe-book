import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { subscribeAuth } from '../api/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = subscribeAuth((user) => {
      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  return authState;
};
