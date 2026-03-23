import React from 'react';
import Layout from '../components/Layout';
import RecipeForm from '../components/recipe/RecipeForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecipeCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/recipe');
  };

  const sidebarContent = (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-5 w-4" />
        </Button>
        <h1 className="text-xl font-bold">새 레시피 작성</h1>
      </div>
      
      <RecipeForm />
    </div>
  );

  return (
    <Layout sidebar={sidebarContent}>
      <div className="flex items-center justify-center h-full bg-muted/30">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">레시피를 작성하여 나만의 커피 도감을 완성해보세요.</p>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeCreatePage;
