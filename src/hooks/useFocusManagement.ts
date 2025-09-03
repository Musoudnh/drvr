import { useRef, useEffect, useCallback } from 'react';

interface FocusManagementOptions {
  restoreFocus?: boolean;
  trapFocus?: boolean;
  skipToContent?: boolean;
}

export const useFocusManagement = (options: FocusManagementOptions = {}) => {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Store the previously focused element
  const storePreviousFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  // Restore focus to the previously focused element
  const restorePreviousFocus = useCallback(() => {
    if (options.restoreFocus && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [options.restoreFocus]);

  // Focus the first focusable element in the container
  const focusFirstElement = useCallback(() => {
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, []);

  // Trap focus within the container
  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!options.trapFocus || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [options.trapFocus]);

  // Set up focus trap
  useEffect(() => {
    if (options.trapFocus) {
      document.addEventListener('keydown', trapFocus);
      return () => document.removeEventListener('keydown', trapFocus);
    }
  }, [trapFocus, options.trapFocus]);

  // Announce content changes to screen readers
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    containerRef,
    storePreviousFocus,
    restorePreviousFocus,
    focusFirstElement,
    announceToScreenReader
  };
};

// Hook for managing focus in modals
export const useModalFocus = () => {
  const { storePreviousFocus, restorePreviousFocus, focusFirstElement, containerRef } = useFocusManagement({
    restoreFocus: true,
    trapFocus: true
  });

  const openModal = useCallback(() => {
    storePreviousFocus();
    // Small delay to ensure modal is rendered
    setTimeout(focusFirstElement, 100);
  }, [storePreviousFocus, focusFirstElement]);

  const closeModal = useCallback(() => {
    restorePreviousFocus();
  }, [restorePreviousFocus]);

  return {
    modalRef: containerRef,
    openModal,
    closeModal
  };
};