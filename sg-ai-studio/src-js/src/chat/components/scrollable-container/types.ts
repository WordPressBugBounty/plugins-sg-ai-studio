import { ReactNode } from 'react';

export interface ScrollableContainerProps {
  /**
   * Optional streaming state information to control auto-scrolling behavior
   */
  streamingState?: {
    isStreaming: boolean;
    chatPhase?: 'initial' | 'chat-active' | 'loading' | 'load-chat-error-occured';
  };
  /**
   * The content to be rendered inside the scrollable container
   */
  children: ReactNode;

  /**
   * Optional content to be rendered below the scrollable area (e.g., input box)
   */
  bottomContent?: ReactNode;

  /**
   * Optional CSS class name to apply to the container
   */
  className?: string;

  /**
   * Optional data attribute for the scrollable element
   */
  dataComponent?: string;

  /**
   * Optional callback when scroll position changes
   */
  onScrollPositionChange?: (isAtBottom: boolean) => void;

  /**
   * Whether to show the scroll-to-bottom button when not at bottom
   * @default true
   */
  showScrollButton?: boolean;

  /**
   * Whether to show the fade overlay when not at bottom
   * @default true
   */
  showFadeOverlay?: boolean;

  /**
   * Custom styles for the container
   */
  style?: React.CSSProperties;

  /**
   * Custom styles for the scrollable area
   */
  scrollableAreaStyle?: React.CSSProperties;

  /**
   * Custom styles for the bottom content area
   */
  bottomContentStyle?: React.CSSProperties;

  /**
   * Custom position for the scroll button (in pixels from bottom)
   */
  scrollButtonPosition?: number;

  /**
   * Custom position for the fade overlay (in pixels from bottom)
   */
  fadeOverlayPosition?: number;

  /**
   * Optional header content to be rendered at the top of the container (fixed, non-scrollable)
   */
  header?: ReactNode;

  /**
   * Custom styles for the header area
   */
  headerStyle?: React.CSSProperties;
}

export interface ScrollContextValue {
  /**
   * Whether the scrollable container is currently at the bottom
   */
  isAtBottom: boolean;

  /**
   * Whether the scroll button should be shown
   */
  showScrollButton: boolean;

  /**
   * Scroll to the bottom of the container
   * @param behavior - The scroll behavior (smooth or auto)
   * @param resetUserScroll - Whether to reset the user's scroll position
   */
  scrollToBottom: (behavior?: ScrollBehavior, resetUserScroll?: boolean) => void;

  /**
   * Scroll to a specific element within the container
   * @param element - The element to scroll to
   * @param options - Scroll options
   */
  scrollToElement: (
    element: HTMLElement | null,
    options?: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition; topOffset?: number }
  ) => void;

  /**
   * Start continuous scrolling (useful during streaming responses)
   */
  startContinuousScroll: () => () => void;

  /**
   * Stop continuous scrolling
   */
  stopContinuousScroll: () => void;

  /**
   * Reference to the scrollable container element
   */
  containerRef: React.RefObject<HTMLDivElement>;

  /**
   * The visible height of the scrollable container
   * Used for setting minimum heights for messages
   */
  visibleHeight: number;
}