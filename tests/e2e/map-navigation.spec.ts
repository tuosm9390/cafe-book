import { test, expect } from '@playwright/test';

test.describe('지도 내비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('카페 리스트 클릭 시 지도 중심이 이동해야 함', async ({ page }) => {
    // 첫 번째 카페 아이템 클릭
    const firstCafe = page.locator('h3').first();
    const cafeName = await firstCafe.innerText();
    await firstCafe.click();

    // 지도가 로드되었는지 확인 (Kakao Map 컨테이너 존재 여부)
    const mapContainer = page.locator('.react-kakao-maps-sdk-map');
    await expect(mapContainer).toBeVisible();
    
    // 리스트 아이템이 선택된 상태(배경색 등)인지 확인
    const selectedItem = page.locator('.bg-white');
    await expect(selectedItem).toContainText(cafeName);
  });

  test('검색 필터링이 정상 작동해야 함', async ({ page }) => {
    const searchInput = page.getByPlaceholder('카페 검색...');
    await searchInput.fill('스타벅스');
    
    // 필터링된 결과 확인
    const cafeListItems = page.locator('h3');
    const count = await cafeListItems.count();
    
    for (let i = 0; i < count; i++) {
      const text = await cafeListItems.nth(i).innerText();
      expect(text).toContain('스타벅스');
    }
  });

  test('관리 페이지 이동 및 메인 페이지 복귀가 가능해야 함', async ({ page }) => {
    // 사이드바 하단의 관리 페이지 버튼 클릭
    const adminButton = page.locator('button:has-text("관리페이지")');
    await adminButton.click();

    // 관리 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1')).toContainText('카페 데이터 관리');

    // "지도 돌아가기" 버튼 클릭
    const backButton = page.locator('button:has-text("지도 돌아가기")');
    await backButton.click();

    // 메인 페이지로 복귀했는지 확인
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('카페 도감');
  });
});
