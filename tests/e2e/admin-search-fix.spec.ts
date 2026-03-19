import { test, expect } from '@playwright/test';

test.describe('관리자 페이지 버그 재현 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 관리자 로그인 절차
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@cafebook.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/admin/);
  });

  test('관리자 페이지 직접 접속 시 카카오맵 SDK 로딩 확인', async ({ page }) => {
    // 1. 카페 추가 폼 열기
    await page.click('text=카페 추가');
    
    // 2. 검색 시도
    await page.fill('input[placeholder*="카페 이름이나 주소"]', '강남역');
    await page.click('button:has-text("검색")');

    // 성공적으로 로드되는 것을 확인
    const errorMsg = page.locator('text=카카오맵 라이브러리가 로드되지 않았습니다.');
    await expect(errorMsg).not.toBeVisible();
  });

  test('검색 후 저장 버튼 동작 확인', async ({ page }) => {
    await page.click('text=카페 추가');
    
    // 검색 및 결과 선택
    await page.fill('input[placeholder*="카페 이름이나 주소"]', '스타벅스');
    await page.click('button:has-text("검색")');
    
    const firstResult = page.locator('button:has-text("스타벅스")').first();
    await expect(firstResult).toBeVisible();
    await firstResult.click();

    // 저장 버튼 클릭
    const saveButton = page.locator('button:has-text("저장하기")');
    await expect(saveButton).toBeEnabled();
    await saveButton.click();

    // 저장 성공 시 폼이 닫혀야 함
    await expect(page.locator('h3:has-text("카페 정보 수정")')).not.toBeVisible();
  });
});
