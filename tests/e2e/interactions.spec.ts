import { test, expect } from '@playwright/test';

test.describe('사용자 상호작용 테스트', () => {
  test('카페 선택 시 리뷰 작성이 가능해야 함', async ({ page }) => {
    await page.goto('/');
    
    // 첫 번째 카페 클릭
    await page.locator('h3').first().click();

    // 상호작용 영역 확인
    const interactionSection = page.locator('textarea[placeholder*="코멘트"]');
    await expect(interactionSection).toBeVisible();

    // 별점 및 코멘트 입력
    await page.fill('textarea[placeholder*="코멘트"]', '훌륭한 커피 맛입니다!');
    
    // 저장 버튼 클릭
    await page.click('text=리뷰 저장하기');

    // 성공 메시지 확인 (alert mock 또는 UI 변화 확인)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('저장되었습니다');
      await dialog.accept();
    });
  });
});
