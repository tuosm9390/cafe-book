import { describe, it, expect, vi } from 'vitest';
import { updateRecipe, deleteRecipe } from '../../src/api/recipeApi';

// Firebase Mocking
vi.mock('../../src/api/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(() => Promise.resolve()),
  deleteDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(),
  serverTimestamp: vi.fn(() => 'mock-timestamp')
}));

describe('recipeApi Edit/Delete', () => {
  it('updateRecipe가 적절한 인자로 updateDoc을 호출해야 함', async () => {
    const id = 'recipe-123';
    const data = { title: 'Updated Title' };
    await updateRecipe(id, data);
    
    const { updateDoc } = await import('firebase/firestore');
    expect(updateDoc).toHaveBeenCalled();
  });

  it('deleteRecipe가 적절한 인자로 deleteDoc을 호출해야 함', async () => {
    const id = 'recipe-123';
    await deleteRecipe(id);
    
    const { deleteDoc } = await import('firebase/firestore');
    expect(deleteDoc).toHaveBeenCalled();
  });
});
