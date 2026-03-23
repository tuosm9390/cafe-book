import React from "react";
import { ExtractionStep } from "../../types/recipe";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getStepName,
  calculateStepDuration,
  formatSecondsToTime,
} from "../../utils/recipeUtils";

interface RecipeStepListProps {
  steps: ExtractionStep[];
  onChange: (steps: ExtractionStep[]) => void;
}

const RecipeStepList: React.FC<RecipeStepListProps> = ({ steps, onChange }) => {
  const addStep = () => {
    const lastStep = steps[steps.length - 1];
    const nextStartTime = lastStep ? (lastStep.startTime ?? 0) + 30 : 0;

    const newStep: ExtractionStep = {
      name: "", // 동적으로 렌더링하므로 빈 값
      time: 0,
      startTime: nextStartTime,
      waterUsed: 0,
      waterCumulative: 0,
    };

    const newSteps = [...steps, newStep];
    updateCalculatedFields(newSteps);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    updateCalculatedFields(newSteps);
  };

  const handleStepChange = (
    index: number,
    field: keyof ExtractionStep,
    value: string | number,
  ) => {
    const newSteps = [...steps];
    let finalValue = value;

    if (field === "startTime") {
      const numValue = Number(value) || 0;
      // 이전 단계보다 작을 수 없음 (첫 단계 제외)
      const prevStep = newSteps[index - 1];
      if (prevStep && numValue < (prevStep.startTime ?? 0)) {
        finalValue = prevStep.startTime ?? 0;
      } else {
        finalValue = numValue;
      }
    }

    newSteps[index] = { ...newSteps[index], [field]: finalValue };
    updateCalculatedFields(newSteps);
  };

  const updateCalculatedFields = (currentSteps: ExtractionStep[]) => {
    let cumulativeWater = 0;
    const updatedSteps = currentSteps.map((step, index) => {
      cumulativeWater += Number(step.waterUsed) || 0;

      // 소요 시간 계산: 다음 단계 시작 시간 - 현재 단계 시작 시간
      const nextStep = currentSteps[index + 1];
      const duration = nextStep
        ? calculateStepDuration(step.startTime ?? 0, nextStep.startTime ?? 0)
        : 0;

      return {
        ...step,
        name: getStepName(index), // 이름 강제 재지정 (US2)
        waterCumulative: cumulativeWater,
        time: duration, // 하위 호환성을 위해 time 필드에 계산된 소요 시간 저장
      };
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
              <TableHead className="w-20 text-xs">단계</TableHead>
              <TableHead className="w-20 text-xs">시작(s)</TableHead>
              <TableHead className="w-20 text-xs">소요</TableHead>
              <TableHead className="w-20 text-xs">물(g)</TableHead>
              <TableHead className="text-right text-xs">누적</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {steps.map((step, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-[11px] px-2">
                  {getStepName(index)}
                </TableCell>
                <TableCell className="px-2">
                  <div className="space-y-1">
                    <Input
                      type="number"
                      className="h-8 px-2 text-xs"
                      value={step.startTime ?? ""}
                      onChange={(e) =>
                        handleStepChange(index, "startTime", e.target.value)
                      }
                      placeholder="초"
                    />
                    <div className="text-[10px] text-muted-foreground text-center">
                      {formatSecondsToTime(step.startTime ?? 0)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center text-xs text-muted-foreground px-1">
                  {index < steps.length - 1 ? `${step.time}s` : "-"}
                </TableCell>
                <TableCell className="px-2">
                  <Input
                    type="number"
                    className="h-8 px-2 text-xs"
                    value={step.waterUsed || ""}
                    onChange={(e) =>
                      handleStepChange(index, "waterUsed", e.target.value)
                    }
                  />
                </TableCell>
                <TableCell className="text-right text-[11px] text-muted-foreground px-2">
                  {step.waterCumulative}g
                </TableCell>
                <TableCell className="px-1">
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
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-sm text-muted-foreground"
                >
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
