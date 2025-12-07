import { describe, it, expect } from 'vitest';
import { reducer } from '@/hooks/use-toast';

describe('Toast Reducer', () => {
  const initialState = { toasts: [] };

  describe('ADD_TOAST', () => {
    it('should add a toast to empty state', () => {
      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: '1',
          title: 'Test Toast',
          description: 'Test description',
        },
      };

      const newState = reducer(initialState, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('1');
      expect(newState.toasts[0].title).toBe('Test Toast');
    });

    it('should add new toast at the beginning (respecting TOAST_LIMIT)', () => {
      const stateWithToast = {
        toasts: [{ id: '1', title: 'First Toast' }],
      };

      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: '2',
          title: 'Second Toast',
        },
      };

      const newState = reducer(stateWithToast, action);
      
      // TOAST_LIMIT is 1, so the new toast replaces the old one
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
      expect(newState.toasts[0].title).toBe('Second Toast');
    });

    it('should limit toasts to TOAST_LIMIT (1)', () => {
      const stateWithToast = {
        toasts: [{ id: '1', title: 'First Toast' }],
      };

      const action = {
        type: 'ADD_TOAST' as const,
        toast: {
          id: '2',
          title: 'Second Toast',
        },
      };

      const newState = reducer(stateWithToast, action);
      
      // TOAST_LIMIT is 1, so only the newest toast should remain
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });
  });

  describe('UPDATE_TOAST', () => {
    it('should update an existing toast', () => {
      const stateWithToast = {
        toasts: [{ id: '1', title: 'Original Title' }],
      };

      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'Updated Title',
        },
      };

      const newState = reducer(stateWithToast, action);
      
      expect(newState.toasts[0].title).toBe('Updated Title');
    });

    it('should not affect other toasts when updating', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' },
        ],
      };

      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'Updated Toast 1',
        },
      };

      const newState = reducer(stateWithToasts, action);
      
      expect(newState.toasts.find(t => t.id === '2')?.title).toBe('Toast 2');
    });

    it('should preserve other properties when updating', () => {
      const stateWithToast = {
        toasts: [{ id: '1', title: 'Title', description: 'Description' }],
      };

      const action = {
        type: 'UPDATE_TOAST' as const,
        toast: {
          id: '1',
          title: 'New Title',
        },
      };

      const newState = reducer(stateWithToast, action);
      
      expect(newState.toasts[0].title).toBe('New Title');
      expect(newState.toasts[0].description).toBe('Description');
    });
  });

  describe('DISMISS_TOAST', () => {
    it('should set open to false for specific toast', () => {
      const stateWithToast = {
        toasts: [{ id: '1', title: 'Toast', open: true }],
      };

      const action = {
        type: 'DISMISS_TOAST' as const,
        toastId: '1',
      };

      const newState = reducer(stateWithToast, action);
      
      expect(newState.toasts[0].open).toBe(false);
    });

    it('should dismiss all toasts when no toastId provided', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1', open: true },
          { id: '2', title: 'Toast 2', open: true },
        ],
      };

      const action = {
        type: 'DISMISS_TOAST' as const,
        toastId: undefined,
      };

      const newState = reducer(stateWithToasts, action);
      
      expect(newState.toasts.every(t => t.open === false)).toBe(true);
    });
  });

  describe('REMOVE_TOAST', () => {
    it('should remove a specific toast', () => {
      const stateWithToast = {
        toasts: [{ id: '1', title: 'Toast' }],
      };

      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1',
      };

      const newState = reducer(stateWithToast, action);
      
      expect(newState.toasts).toHaveLength(0);
    });

    it('should remove all toasts when no toastId provided', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' },
        ],
      };

      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: undefined,
      };

      const newState = reducer(stateWithToasts, action);
      
      expect(newState.toasts).toHaveLength(0);
    });

    it('should not affect other toasts when removing one', () => {
      const stateWithToasts = {
        toasts: [
          { id: '1', title: 'Toast 1' },
          { id: '2', title: 'Toast 2' },
        ],
      };

      const action = {
        type: 'REMOVE_TOAST' as const,
        toastId: '1',
      };

      const newState = reducer(stateWithToasts, action);
      
      expect(newState.toasts).toHaveLength(1);
      expect(newState.toasts[0].id).toBe('2');
    });
  });
});
