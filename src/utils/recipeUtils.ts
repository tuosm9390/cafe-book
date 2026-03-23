/**
 * 원두 양과 물 양을 바탕으로 추출 비율을 계산합니다.
 * 예: 원두 20g, 물 300g -> "1:15.0"
 */
export const calculateRatio = (coffeeAmount: number, waterAmount: number): string => {
  if (coffeeAmount <= 0 || waterAmount <= 0) return '1:0.0';
  const ratio = waterAmount / coffeeAmount;
  return `1:${ratio.toFixed(1)}`;
};

/**
 * 초(seconds)를 mm:ss 형식의 문자열로 변환합니다.
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * mm:ss 형식의 문자열을 초(seconds)로 변환합니다.
 */
export const formatTimeToSeconds = (timeStr: string): number => {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  if (isNaN(minutes) || isNaN(seconds)) return 0;
  return minutes * 60 + seconds;
};

/**
 * 각 단계의 물 사용량을 합산하여 누적 물 양을 계산합니다.
 */
export const calculateCumulativeWater = (steps: { waterUsed: number }[]): number[] => {
  let cumulative = 0;
  return steps.map((step) => {
    cumulative += step.waterUsed;
    return cumulative;
  });
};

/**
 * 모든 단계의 시간을 합산하여 총 추출 시간을 계산합니다.
 */
export const calculateTotalTime = (steps: { time: number }[]): number => {
  return steps.reduce((total, step) => total + step.time, 0);
};
