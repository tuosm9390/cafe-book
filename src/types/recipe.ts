import { Timestamp } from 'firebase/firestore';

export interface ExtractionStep {
  name: string;
  time: number; // 소요 시간 (초)
  waterUsed: number; // 해당 단계 물 사용량 (g)
  waterCumulative: number; // 해당 단계까지의 누적 물 양 (g)
}

export interface Recipe {
  id?: string;
  title: string;
  waterTemp: number; // 물 온도 (°C)
  waterAmount: number; // 총 사용 물 양 (g)
  coffeeAmount: number; // 사용 원두 양 (g)
  ratio: string; // 추출 비율 (예: "1:15.0")
  steps: ExtractionStep[];
  totalTime: number; // 총 추출 시간 (초)
  comment?: string;
  userId: string;
  createdAt: Timestamp | Date;
}
