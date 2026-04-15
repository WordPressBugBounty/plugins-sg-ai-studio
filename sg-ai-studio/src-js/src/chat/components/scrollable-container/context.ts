import { createContext } from 'react';
import { ScrollContextValue } from './types';

export const ScrollableContext = createContext<ScrollContextValue>({
  isAtBottom: true,
  showScrollButton: false,
  scrollToBottom: () => {
    // Default implementation
  },
  scrollToElement: () => {
    // Default implementation
  },
  startContinuousScroll: () => () => {
    // Default implementation
  },
  stopContinuousScroll: () => {
    // Default implementation
  },
  containerRef: { current: null },
  visibleHeight: 0
});