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
    
    // 폼 입력
    await page.fill('label:has-text("카페 이름") + input', 'E2E 테스트 카페');
    await page.fill('label:has-text("주소") + input', '서울시 테스트구');
    await page.fill('label:has-text("위도") + input', '37.5');
    await page.fill('label:has-text("경도") + input', '127.0');
    
    await page.click('button:has-text("저장")');

    // 목록에 추가되었는지 확인
    await expect(page.locator('table')).toContainText('E2E 테스트 카페');
  });
});
