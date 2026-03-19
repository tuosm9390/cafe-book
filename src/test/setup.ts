import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// 각 테스트가 종료될 때마다 cleanup을 실행하여 DOM을 초기화합니다.
afterEach(() => {
  cleanup();
});
