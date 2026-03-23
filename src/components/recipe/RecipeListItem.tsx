import React from 'react';
import { Recipe } from '../../types/recipe';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecipeListItemProps {
  recipe: Recipe;
}

const RecipeListItem: React.FC<RecipeListItemProps> = ({ recipe }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors border-border/50"
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold truncate">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Thermometer className="h-3 w-3 mr-1 text-orange-500" />
            {recipe.waterTemp}°C
          </div>
          <div className="flex items-center">
            <Coffee className="h-3 w-3 mr-1 text-brown-500" />
            {recipe.coffeeAmount}g
          </div>
          <div className="flex items-center">
            <Droplets className="h-3 w-3 mr-1 text-blue-500" />
            {recipe.waterAmount}g
          </div>
        </div>
        <div className="mt-2 text-xs font-medium text-primary bg-primary/10 inline-block px-2 py-0.5 rounded">
          {recipe.ratio}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeListItem;
