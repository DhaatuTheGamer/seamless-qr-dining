import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from './useBodyScrollLock';

describe('useBodyScrollLock', () => {
    let originalOverflow: string;

    beforeEach(() => {
        originalOverflow = document.body.style.overflow;
    });

    afterEach(() => {
        document.body.style.overflow = originalOverflow;
    });

    it('should set body overflow to hidden when isLocked is true', () => {
        renderHook(() => useBodyScrollLock(true));
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('should set body overflow to unset when isLocked is false', () => {
        renderHook(() => useBodyScrollLock(false));
        expect(document.body.style.overflow).toBe('unset');
    });

    it('should set body overflow to unset on unmount', () => {
        const { unmount } = renderHook(() => useBodyScrollLock(true));
        expect(document.body.style.overflow).toBe('hidden');
        unmount();
        expect(document.body.style.overflow).toBe('unset');
    });

    it('should update body overflow when isLocked changes', () => {
        const { rerender } = renderHook(({ isLocked }) => useBodyScrollLock(isLocked), {
            initialProps: { isLocked: true }
        });
        expect(document.body.style.overflow).toBe('hidden');

        rerender({ isLocked: false });
        expect(document.body.style.overflow).toBe('unset');

        rerender({ isLocked: true });
        expect(document.body.style.overflow).toBe('hidden');
    });
});
