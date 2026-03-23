import React from 'react';
import Layout from '../components/Layout';
import { useRecipes } from '../hooks/useRecipes';
import RecipeListItem from '../components/recipe/RecipeListItem';
import { Button } from '@/components/ui/button';
import { Plus, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const RecipePage: React.FC = () => {
  const { recipes, isLoading } = useRecipes();
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/recipe/create');
  };

  const sidebarContent = (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">커피 레시피</h1>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-1" /> 작성
        </Button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))
        ) : recipes.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Coffee className="h-10 w-10 mx-auto text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">저장된 레시피가 없습니다.<br/>새 레시피를 작성해보세요.</p>
          </div>
        ) : (
          recipes.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <Layout sidebar={sidebarContent}>
      <div className="flex items-center justify-center h-full bg-muted/30">
        <div className="text-center space-y-2">
          <Coffee className="h-12 w-12 mx-auto text-primary/20" />
          <p className="text-muted-foreground">목록에서 레시피를 선택하여 상세 내용을 확인하세요.</p>
        </div>
      </div>
    </Layout>
  );
};

export default RecipePage;
