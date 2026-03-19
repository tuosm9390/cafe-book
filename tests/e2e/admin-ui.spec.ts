import { test, expect } from '@playwright/test';

test.describe('Admin Page UI Changes', () => {
  test.beforeEach(async ({ page }) => {
    // 실제 환경에서는 로그인이 필요할 수 있으나, 여기서는 UI 구조 검증에 집중합니다.
    // 어드민 페이지로 직접 이동 (인증 우회 설정이 되어 있다고 가정하거나, ProtectedRoute 동작 확인)
    await page.goto('/admin');
  });

  test('카페 등록 폼이 항상 노출되는지 확인', async ({ page }) => {
    // "새 카페 등록" 텍스트가 포함된 제목이 있는지 확인
    const formTitle = page.getByText('새 카페 등록');
    await expect(formTitle).toBeVisible();
  });

  test('기존 "카페 추가" 버튼이 제거되었는지 확인', async ({ page }) => {
    // "카페 추가"라는 텍스트를 가진 버튼이 없는지 확인
    const addBtn = page.getByRole('button', { name: '카페 추가' });
    await expect(addBtn).not.toBeVisible();
  });

  test('레이아웃이 shadcn 스타일로 변경되었는지 확인 (Table)', async ({ page }) => {
    // Table 요소가 존재하는지 확인
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Table Header 확인
    const header = page.getByRole('columnheader', { name: '이름' });
    await expect(header).toBeVisible();
  });
});
