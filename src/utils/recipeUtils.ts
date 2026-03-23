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
export const formatSecondsToTimeDisplay = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * 초(seconds)를 사용자가 읽기 쉬운 "m분 s초" 형식으로 변환합니다.
 */
export const formatSecondsToTime = (totalSeconds: number): string => {
  if (totalSeconds < 60) return `${totalSeconds}초`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${seconds}초`;
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
 * 인덱스에 따른 단계 이름을 반환합니다.
 * 0: 뜸들이기, 1: 1차 추출, 2: 2차 추출...
 */
export const getStepName = (index: number): string => {
  if (index === 0) return '뜸들이기';
  return `${index}차 추출`;
};

/**
 * 두 단계 시작 시간 사이의 소요 시간을 계산합니다.
 */
export const calculateStepDuration = (currentStartTime: number, nextStartTime?: number): number => {
  if (nextStartTime === undefined) return 0;
  return nextStartTime - currentStartTime;
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
 * (하위 호환성 유지용)
 */
export const calculateTotalTime = (steps: { time: number }[]): number => {
  return steps.reduce((total, step) => total + step.time, 0);
};
