/**
 * Promise에 타임아웃을 적용하는 유틸리티 함수
 * @param promise 실행할 Promise
 * @param timeoutMs 타임아웃 시간 (밀리초)
 * @param errorMessage 타임아웃 발생 시 표시할 에러 메시지
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = '요청 시간이 초과되었습니다. 네트워크 연결을 확인해 주세요.'
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
};
