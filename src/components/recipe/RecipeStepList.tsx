import React from 'react';
import { ExtractionStep } from '../../types/recipe';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface RecipeStepListProps {
  steps: ExtractionStep[];
  onChange: (steps: ExtractionStep[]) => void;
}

const RecipeStepList: React.FC<RecipeStepListProps> = ({ steps, onChange }) => {
  const addStep = () => {
    const nextIndex = steps.length;
    const name = nextIndex === 0 ? '뜸들이기' : `${nextIndex}차 추출`;
    const newStep: ExtractionStep = {
      name,
      time: 0,
      waterUsed: 0,
      waterCumulative: 0,
    };
    onChange([...steps, newStep]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    updateCumulativeWater(newSteps);
  };

  const handleStepChange = (index: number, field: keyof ExtractionStep, value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    
    if (field === 'waterUsed') {
      updateCumulativeWater(newSteps);
    } else {
      onChange(newSteps);
    }
  };

  const updateCumulativeWater = (currentSteps: ExtractionStep[]) => {
    let cumulative = 0;
    const updatedSteps = currentSteps.map((step) => {
      cumulative += Number(step.waterUsed) || 0;
      return { ...step, waterCumulative: cumulative };
    });
    onChange(updatedSteps);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">추출 단계</h3>
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="h-4 w-4 mr-1" /> 단계 추가
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">순서</TableHead>
              <TableHead>시간(s)</TableHead>
              <TableHead>물(g)</TableHead>
              <TableHead className="text-right">누적</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-xs">{step.name}</TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    className="h-8 px-2"
                    value={step.time || ''} 
                    onChange={(e) => handleStepChange(index, 'time', Number(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    className="h-8 px-2"
                    value={step.waterUsed || ''} 
                    onChange={(e) => handleStepChange(index, 'waterUsed', Number(e.target.value))}
                  />
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {step.waterCumulative}g
                </TableCell>
                <TableCell>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeStep(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {steps.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-sm text-muted-foreground">
                  단계를 추가하여 상세 레시피를 완성하세요.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecipeStepList;
