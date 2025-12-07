import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, getLaPazDate } from '@/lib/utils';

describe('Utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base active');
    });

    it('should handle false conditional classes', () => {
      const isActive = false;
      const result = cn('base', isActive && 'active');
      expect(result).toBe('base');
    });

    it('should handle undefined and null values', () => {
      const result = cn('base', undefined, null, 'other');
      expect(result).toBe('base other');
    });

    it('should merge tailwind classes correctly (last one wins)', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toBe('p-2');
    });

    it('should merge conflicting tailwind classes', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toBe('text-blue-500');
    });

    it('should handle array of classes', () => {
      const result = cn(['class1', 'class2']);
      expect(result).toBe('class1 class2');
    });

    it('should handle object syntax', () => {
      const result = cn({ 'bg-red-500': true, 'bg-blue-500': false });
      expect(result).toBe('bg-red-500');
    });

    it('should return empty string for no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('should handle complex combinations', () => {
      const variant = 'primary';
      const size = 'lg';
      const result = cn(
        'base-class',
        variant === 'primary' && 'bg-primary text-white',
        size === 'lg' && 'px-6 py-3',
        { 'opacity-50': false, 'cursor-pointer': true }
      );
      expect(result).toContain('base-class');
      expect(result).toContain('bg-primary');
      expect(result).toContain('cursor-pointer');
      expect(result).not.toContain('opacity-50');
    });
  });

  describe('getLaPazDate', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return a date 4 hours behind current UTC time', () => {
      // Set a known date: January 1, 2024, 12:00:00 UTC
      const mockDate = new Date('2024-01-01T12:00:00Z');
      vi.setSystemTime(mockDate);

      const laPazDate = getLaPazDate();
      
      // The function subtracts 4 hours
      expect(laPazDate.getUTCHours()).toBe(8);
    });

    it('should handle day rollover correctly', () => {
      // Set a date at 2:00 AM UTC - subtracting 4 hours should go to previous day
      const mockDate = new Date('2024-01-02T02:00:00Z');
      vi.setSystemTime(mockDate);

      const laPazDate = getLaPazDate();
      
      // Should be 22:00 (10 PM) of the previous day
      expect(laPazDate.getUTCHours()).toBe(22);
      expect(laPazDate.getUTCDate()).toBe(1);
    });

    it('should return a Date object', () => {
      const result = getLaPazDate();
      expect(result).toBeInstanceOf(Date);
    });
  });
});
