import { test, expect } from '@playwright/test';

test.describe('관리자 카페 관리 테스트', () => {
  test('관리자 로그인 후 카페 추가가 가능해야 함', async ({ page }) => {
    await page.goto('/login');
    
    // 로그인 (Firebase Auth Mocking이 필요할 수 있으나 UI 흐름 위주)
    await page.fill('input[type="email"]', 'admin@cafebook.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 관리 페이지로 이동 확인
    await expect(page).toHaveURL(/\/admin/);

    // 카페 추가 버튼 클릭
    await page.click('text=카페 추가');
    
    // 위치 검색 입력 (실제 카카오 API 호출은 Mocking 없이 진행하거나 결과 대기)
    await page.fill('input[placeholder*="카페 이름이나 주소"]', '스타벅스 강남');
    await page.click('button:has-text("검색")');

    // 검색 결과가 나타날 때까지 대기
    const firstResult = page.locator('button:has-text("스타벅스")').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    // 주소 및 좌표 자동 입력 확인
    await expect(page.locator('input[placeholder*="자동으로 입력"]')).not.toBeEmpty();
    await expect(page.locator('text=위치 좌표:')).toBeVisible();

    // 수동 입력 필드가 없는지 확인
    await expect(page.locator('label:has-text("위도")')).not.toBeVisible();
    await expect(page.locator('label:has-text("경도")')).not.toBeVisible();
    
    await page.click('button:has-text("저장하기")');

    // 목록에 추가되었는지 확인
    await expect(page.locator('table')).toContainText('스타벅스');
  });
});
