import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { calculateRatio, formatSecondsToTime } from '../../utils/recipeUtils';
import { useRecipes } from '../../hooks/useRecipes';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/toast';
import RecipeStepList from './RecipeStepList';
import { ExtractionStep, Recipe } from '../../types/recipe';

import { Textarea } from '@/components/ui/textarea';

interface RecipeFormProps {
  initialData?: Recipe;
  onSuccess?: () => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ initialData, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [waterTemp, setWaterTemp] = useState<number>(92);
  const [coffeeAmount, setCoffeeAmount] = useState<number>(20);
  const [waterAmount, setWaterAmount] = useState<number>(300);
  const [ratio, setRatio] = useState('1:15.0');
  const [steps, setSteps] = useState<ExtractionStep[]>([]);
  const [totalTime, setTotalTime] = useState(0); // 시스템용 계산 값
  const [totalTimeComment, setTotalTimeComment] = useState(''); // 사용자 코멘트
  const [comment, setComment] = useState('');
  
  const { addRecipe, updateRecipe, isLoading } = useRecipes();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 초기 데이터 설정 (수정 모드)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setWaterTemp(initialData.waterTemp || 92);
      setCoffeeAmount(initialData.coffeeAmount || 20);
      setWaterAmount(initialData.waterAmount || 300);
      setSteps(initialData.steps || []);
      setTotalTime(initialData.totalTime || 0);
      setTotalTimeComment(initialData.totalTimeComment || '');
      setComment(initialData.comment || '');
    }
  }, [initialData]);

  // 비율 실시간 계산
  useEffect(() => {
    setRatio(calculateRatio(coffeeAmount, waterAmount));
  }, [coffeeAmount, waterAmount]);

  // 시스템용 총 추출 시간 계산
  useEffect(() => {
    const lastStep = steps[steps.length - 1];
    if (lastStep) {
      setTotalTime((lastStep.startTime ?? 0) + 30);
    } else {
      setTotalTime(0);
    }
  }, [steps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({ title: '제목을 입력해주세요.', variant: 'destructive' });
      return;
    }

    const recipeData = {
      title,
      waterTemp,
      coffeeAmount,
      waterAmount,
      ratio,
      steps,
      totalTime,
      totalTimeComment,
      comment,
    };

    try {
      if (initialData?.id) {
        await updateRecipe(initialData.id, recipeData);
        toast({ title: '레시피가 수정되었습니다.' });
      } else {
        await addRecipe(recipeData);
        toast({ title: '레시피가 저장되었습니다.' });
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/recipe');
      }
    } catch (error) {
      toast({ title: '저장 중 오류가 발생했습니다.', variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-10">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">레시피 제목</label>
          <Input 
            placeholder="예: 에티오피아 예가체프 드립" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">물 온도 (°C)</label>
            <Input 
              type="number" 
              value={waterTemp}
              onChange={(e) => setWaterTemp(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">원두 양 (g)</label>
            <Input 
              type="number" 
              value={coffeeAmount}
              onChange={(e) => setCoffeeAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">총 사용 물 양 (g)</label>
          <Input 
            type="number" 
            value={waterAmount}
            onChange={(e) => setWaterAmount(Number(e.target.value))}
          />
        </div>

        <Card className="bg-muted/50 border-none">
          <CardContent className="p-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">추출 비율 (원두:물)</span>
            <span className="text-lg font-bold text-primary">약 {ratio}</span>
          </CardContent>
        </Card>
      </div>

      <RecipeStepList steps={steps} onChange={setSteps} />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">총 추출 시간</label>
          <span className="text-[10px] text-muted-foreground">시스템 예상: {formatSecondsToTime(totalTime)}</span>
        </div>
        <Input 
          placeholder="예: 2분 30초" 
          value={totalTimeComment}
          onChange={(e) => setTotalTimeComment(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">레시피 메모</label>
        <Textarea 
          placeholder="맛 평가나 특이사항을 기록하세요." 
          className="min-h-[100px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? '저장 중...' : initialData ? '레시피 수정' : '레시피 저장'}
      </Button>
    </form>
  );
};

export default RecipeForm;
