import { test, expect } from '@playwright/test';

test.describe('사용자 상호작용 테스트', () => {
  test('카페 선택 시 리뷰 작성 및 자동 저장이 가능해야 함', async ({ page }) => {
    // 1. 메인 페이지 접속 (로그인 상태 가정 또는 목업 필요 시 처리)
    await page.goto('/');
    
    // 2. 카페 목록이 로드될 때까지 대기 후 첫 번째 카페 클릭
    const firstCafe = page.locator('h3').first();
    await firstCafe.waitFor();
    await firstCafe.click();

    // 3. 상호작용 영역 확인 (플레이스홀더 확인)
    const commentArea = page.locator('textarea[placeholder*="메모나 리뷰"]');
    await expect(commentArea).toBeVisible();

    // 4. 별점 변경 테스트 (자동 저장 확인은 네트워크 요청 감시 등으로 가능하지만, 여기서는 UI 피드백 위주)
    const starRating = page.locator('.flex.flex-col >> .flex.gap-1').first();
    await expect(starRating).toBeVisible();
    
    // 5. 즐겨찾기 토글 테스트
    const favoriteBtn = page.locator('button[title*="즐겨찾기"]');
    await favoriteBtn.click();
    // 하트 색상 변경 등 스타일 확인 가능 (bg-red-50 등)
    await expect(favoriteBtn).toHaveClass(/text-red-500/);

    // 6. 코멘트 입력 및 전체 저장 버튼 클릭
    const testComment = `E2E 테스트 코멘트 - ${new Date().getTime()}`;
    await commentArea.fill(testComment);
    
    const saveBtn = page.locator('text=리뷰 전체 저장하기');
    await saveBtn.click();

    // 7. 성공 메시지 확인 (성공 텍스트 노출 확인)
    const successMsg = page.locator('text=성공적으로 저장되었습니다');
    await expect(successMsg).toBeVisible();

    // 8. 페이지 새로고침 후 데이터 유지 확인
    await page.reload();
    await firstCafe.click();
    await expect(commentArea).toHaveValue(testComment);
    await expect(favoriteBtn).toHaveClass(/text-red-500/);
  });
});
