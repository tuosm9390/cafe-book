import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types/recipe';
import { 
  getRecipesByUserId, 
  createRecipe as apiCreateRecipe, 
  updateRecipe as apiUpdateRecipe,
  deleteRecipe as apiDeleteRecipe
} from '../api/recipeApi';
import { useAuth } from './useAuth';

export const useRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRecipesByUserId(user.uid);
      setRecipes(data);
    } catch (err) {
      setError('레시피를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addRecipe = async (recipe: Omit<Recipe, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    try {
      const id = await apiCreateRecipe({
        ...recipe,
        userId: user.uid,
      });
      await fetchRecipes();
      return id;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    try {
      await apiUpdateRecipe(id, recipe);
      await fetchRecipes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!user) throw new Error('로그인이 필요합니다.');
    try {
      await apiDeleteRecipe(id);
      await fetchRecipes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
