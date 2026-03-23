import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import RecipeForm from '../components/recipe/RecipeForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '../hooks/useAuth';

const RecipeEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id || isAuthLoading) return;
      
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as Recipe;
          
          // 인증 정보가 로드된 후 본인 여부 확인
          if (!user || data.userId !== user.uid) {
            alert('수정 권한이 없습니다.');
            navigate('/recipe');
            return;
          }
          
          setRecipe({ id: docSnap.id, ...data });
        } else {
          navigate('/recipe');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        navigate('/recipe');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecipe();
  }, [id, user, isAuthLoading, navigate]);

  const handleBack = () => {
    navigate(`/recipe/${id}`);
  };

  const sidebarContent = (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-5 w-4" />
        </Button>
        <h1 className="text-xl font-bold">레시피 수정</h1>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : recipe ? (
        <RecipeForm 
          initialData={recipe} 
          onSuccess={() => navigate(`/recipe/${id}`)}
        />
      ) : null}
    </div>
  );

  return (
    <Layout sidebar={sidebarContent} sidebarClassName="md:w-[450px]">
      <div className="flex items-center justify-center h-full bg-muted/30">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">레시피의 내용을 자유롭게 수정해보세요.</p>
        </div>
      </div>
    </Layout>
  );
};

export default RecipeEditPage;
