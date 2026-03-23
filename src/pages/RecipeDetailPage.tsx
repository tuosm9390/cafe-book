import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../api/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Recipe } from '../types/recipe';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Thermometer, Coffee, Droplets, Clock } from 'lucide-react';
import { formatSecondsToTime } from '../utils/recipeUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'recipes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() } as Recipe);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleBack = () => {
    navigate('/recipe');
  };

  const sidebarContent = (
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-5 w-4" />
        </Button>
        <h1 className="text-xl font-bold">레시피 상세</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
      ) : recipe ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{recipe.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {recipe.createdAt instanceof Date 
                ? recipe.createdAt.toLocaleDateString() 
                : (recipe.createdAt as any)?.toDate?.().toLocaleDateString() || ''} 작성
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
              <Thermometer className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">물 온도</span>
              <span className="text-sm font-bold">{recipe.waterTemp}°C</span>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
              <Coffee className="h-4 w-4 text-brown-500" />
              <span className="text-xs text-muted-foreground">원두 양</span>
              <span className="text-sm font-bold">{recipe.coffeeAmount}g</span>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">총 물 양</span>
              <span className="text-sm font-bold">{recipe.waterAmount}g</span>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center space-y-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">총 시간</span>
              <span className="text-sm font-bold">{formatSecondsToTime(recipe.totalTime)}</span>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">추출 비율 (원두:물)</span>
              <span className="text-lg font-bold text-primary">약 {recipe.ratio}</span>
            </div>
          </div>

          {recipe.comment && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">코멘트</h3>
              <div className="bg-muted/30 p-4 rounded-lg text-sm whitespace-pre-wrap leading-relaxed italic text-muted-foreground">
                "{recipe.comment}"
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">레시피를 찾을 수 없습니다.</p>
        </div>
      )}
    </div>
  );

  return (
    <Layout sidebar={sidebarContent}>
      <div className="h-full p-6 bg-muted/30 overflow-y-auto">
        {recipe && recipe.steps.length > 0 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-lg font-bold">추출 단계 상세</h3>
            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-32">단계</TableHead>
                    <TableHead>시간</TableHead>
                    <TableHead>물 사용량</TableHead>
                    <TableHead className="text-right">누적 물 양</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.steps.map((step, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-semibold">{step.name}</TableCell>
                      <TableCell>{step.time}초</TableCell>
                      <TableCell>{step.waterUsed}g</TableCell>
                      <TableCell className="text-right font-mono font-medium text-primary">
                        {step.waterCumulative}g
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RecipeDetailPage;
