import { useEffect } from 'react';

/**
 * A custom hook to lock body scrolling when a condition is met.
 *
 * @param {boolean} isLocked - Whether the body scroll should be locked.
 */
export const useBodyScrollLock = (isLocked: boolean): void => {
    useEffect(() => {
        if (isLocked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLocked]);
};
