import { test, expect } from '@playwright/test';

test.describe('Coffee Recipe Journey', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 프로세스 (간소화된 예시, 실제 프로젝트의 로그인 방식에 맞춤)
    await page.goto('/login');
    // 테스트용 계정으로 로그인 필요 (또는 Mocking)
  });

  test('사용자는 새로운 레시피를 작성하고 목록에서 확인할 수 있어야 함', async ({ page }) => {
    await page.goto('/recipe');
    await page.click('text=작성');

    // 기본 정보 입력
    await page.fill('placeholder="예: 에티오피아 예가체프 드립"', '테스트 레시피');
    await page.fill('label:has-text("물 온도")', '94');
    await page.fill('label:has-text("원두 양")', '18');
    await page.fill('label:has-text("총 사용 물 양")', '270');

    // 추출 비율 자동 계산 확인 (1:15.0)
    await expect(page.locator('text=약 1:15.0')).toBeVisible();

    // 단계 추가
    await page.click('text=단계 추가');
    await page.fill('table input >> nth=0', '30'); // 시간
    await page.fill('table input >> nth=1', '40'); // 물

    await page.click('text=단계 추가');
    await page.fill('table input >> nth=2', '60'); // 시간
    await page.fill('table input >> nth=3', '230'); // 물

    // 누적 물 양 및 총 시간 확인
    await expect(page.locator('text=270g')).toBeVisible(); // 누적
    await expect(page.locator('text=01:30')).toBeVisible(); // 총 시간

    // 코멘트 입력 및 저장
    await page.fill('placeholder="맛 평가나 특이사항을 기록하세요."', '깔끔한 맛');
    await page.click('text=레시피 저장');

    // 리스트 페이지로 이동 및 확인
    await expect(page).toHaveURL(/\/recipe$/);
    await expect(page.locator('text=테스트 레시피')).toBeVisible();
    await expect(page.locator('text=94°C')).toBeVisible();
  });
});
