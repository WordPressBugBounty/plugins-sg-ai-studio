import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A hook that provides scrolling functionality for a scrollable container
 *
 * @param containerRef - Reference to the scrollable container element
 * @param streamingState - Optional object containing streaming state information
 * @returns An object with scrolling-related functions and state
 */
export function useScrollableManager(
  containerRef: React.RefObject<HTMLElement>,
  streamingState?: {
    isStreaming: boolean;
    chatPhase?: "initial" | "chat-active" | "loading" | "load-chat-error-occured";
  }
) {
  // State for scroll position tracking
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [visibleHeight, setVisibleHeight] = useState(0);

  // Use a ref to track scroll state without re-renders
  const scrollState = useRef({
    userHasScrolled: false,
    isScrolling: false,
    lastScrollHeight: 0,
    scrollDetachTimeout: null as NodeJS.Timeout | null,
    streamingInterval: null as NodeJS.Timeout | null,
  });

  // Track previous streaming state to detect transitions
  const prevStreamingRef = useRef<boolean>(false);

  /**
   * Update the visible height of the container
   */
  const updateVisibleHeight = useCallback(() => {
    if (containerRef.current) {
      setVisibleHeight(containerRef.current.clientHeight);
    }
  }, [containerRef]);

  /**
   * Check if the container is scrolled to the bottom
   * Uses throttling to prevent excessive updates
   */
  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current || scrollState.current.isScrolling) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Use a small threshold (5px) to make it easy to detach on a single scroll
    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;

    // Only update state if changed (prevents unnecessary renders)
    if (atBottom !== isAtBottom) {
      setIsAtBottom(atBottom);
      setShowScrollButton(!atBottom);
    }
  }, [containerRef, isAtBottom]);

  /**
   * Scroll to the bottom of the container
   *
   * @param behavior - The scroll behavior (smooth or auto)
   * @param resetUserScroll - Whether to reset the user's scroll position
   */
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "smooth", resetUserScroll = false) => {
      if (!containerRef.current) {
        return;
      }

      scrollState.current.isScrolling = true;

      // Only reset the userHasScrolled flag if explicitly requested
      if (resetUserScroll) {
        scrollState.current.userHasScrolled = false;
      }

      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });

      // Reset scrolling flag after animation completes
      setTimeout(
        () => {
          scrollState.current.isScrolling = false;
          setIsAtBottom(true);
          setShowScrollButton(false);
        },
        behavior === "smooth" ? 300 : 0
      );
    },
    [containerRef]
  );

  /**
   * Handle scroll events
   */
  const handleScroll = useCallback(() => {
    if (scrollState.current.isScrolling) {
      return;
    }

    // Get current scroll position
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Use a larger threshold to make it easier to detach (20px instead of 5px)
      const atBottom = scrollTop + clientHeight >= scrollHeight - 20;

      // Only mark as scrolled if not at bottom - this makes it easier to detach
      if (!atBottom) {
        // Mark that user has manually scrolled
        scrollState.current.userHasScrolled = true;
      } else if (streamingState && (streamingState.isStreaming || streamingState.chatPhase === "loading")) {
        // If at bottom during streaming, reset the flag to allow auto-scrolling
        scrollState.current.userHasScrolled = false;
      }
    }

    // Clear any existing timeout
    if (scrollState.current.scrollDetachTimeout) {
      clearTimeout(scrollState.current.scrollDetachTimeout);
    }

    // Set a timeout to check position after scrolling stops
    scrollState.current.scrollDetachTimeout = setTimeout(() => {
      checkScrollPosition();
      scrollState.current.scrollDetachTimeout = null;
    }, 50);
  }, [checkScrollPosition, containerRef, streamingState]);

  /**
   * Checks if we're currently in a streaming state
   */
  const isCurrentlyStreaming = useCallback(() => {
    const streaming = streamingState ? streamingState.isStreaming || streamingState.chatPhase === "loading" : false;

    return streaming;
  }, [streamingState]);

  /**
   * Handles auto-scrolling during streaming content changes
   */
  const handleStreamingContentChange = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      // Use a larger threshold to prevent accidental detachment (20px)
      const atBottom = scrollTop + clientHeight >= scrollHeight - 20;

      // If user has scrolled away from bottom, respect that choice
      if (scrollState.current.userHasScrolled && !atBottom) {
        return;
      }

      // If user is at bottom or hasn't scrolled, keep auto-scrolling
      if ((atBottom || !scrollState.current.userHasScrolled) && containerRef.current) {
        // Use immediate scrolling during streaming for smoother experience
        containerRef.current.scrollTop = containerRef.current.scrollHeight;

        // If we're auto-scrolling and at the bottom, ensure userHasScrolled is false
        // This prevents auto-detachment during streaming
        if (atBottom) {
          scrollState.current.userHasScrolled = false;
        }
      }
    },
    [containerRef]
  );

  /**
   * Handles auto-scrolling for non-streaming content changes
   */
  const handleNonStreamingContentChange = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number, heightChanged: boolean) => {
      // For non-streaming content changes:
      // 1. If we're at the bottom and user hasn't manually scrolled
      // 2. If we're close to the bottom and content has changed significantly
      const closeToBottom = scrollTop + clientHeight >= scrollHeight - 5;

      if ((isAtBottom && !scrollState.current.userHasScrolled && heightChanged) || (closeToBottom && heightChanged)) {
        scrollToBottom("auto", false);
      }
    },
    [isAtBottom, scrollToBottom]
  );

  /**
   * Handle content changes in the container
   */
  const handleContentChange = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const newScrollHeight = containerRef.current.scrollHeight;
    const heightChanged = Math.abs(newScrollHeight - scrollState.current.lastScrollHeight) > 2;

    // Store the new scroll height
    scrollState.current.lastScrollHeight = newScrollHeight;

    // Get current scroll position
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Check if we're in a streaming response
    const isStreaming = isCurrentlyStreaming();

    // Handle streaming vs non-streaming content changes differently
    if (isStreaming) {
      handleStreamingContentChange(scrollTop, scrollHeight, clientHeight);
    } else {
      handleNonStreamingContentChange(scrollTop, scrollHeight, clientHeight, heightChanged);
    }
  }, [containerRef, isCurrentlyStreaming, handleStreamingContentChange, handleNonStreamingContentChange]);

  /**
   * Stop continuous scrolling
   */
  const stopContinuousScroll = useCallback(() => {
    if (scrollState.current.streamingInterval) {
      clearInterval(scrollState.current.streamingInterval);
      scrollState.current.streamingInterval = null;
    }
  }, []);

  /**
   * Start continuous scrolling (useful during streaming responses)
   * Returns a function to stop continuous scrolling
   */
  const startContinuousScroll = useCallback(() => {
    // Clear any existing timer
    if (scrollState.current.streamingInterval) {
      clearInterval(scrollState.current.streamingInterval);
    }

    // Only do initial scroll to bottom if user hasn't manually scrolled
    if (containerRef.current && !scrollState.current.userHasScrolled) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    // Set up an interval to continuously scroll to the bottom
    // but only if the user hasn't manually scrolled away
    scrollState.current.streamingInterval = setInterval(() => {
      if (!containerRef.current) {
        return;
      }

      // Get current scroll position
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      // Use a larger threshold to prevent accidental detachment
      // This helps prevent auto-detachment during streaming
      const atBottom = scrollTop + clientHeight >= scrollHeight - 20;

      // If user has manually scrolled and is not at bottom, respect that choice
      if (scrollState.current.userHasScrolled && !atBottom) {
        // User has explicitly scrolled away, don't auto-scroll
        return;
      }

      // Only auto-scroll if:
      // 1. User is at the bottom already, OR
      // 2. User hasn't manually scrolled at all
      if (atBottom || !scrollState.current.userHasScrolled) {
        // Use immediate scrolling for smoother experience
        // Use a small offset to prevent accidental detachment
        containerRef.current.scrollTop = containerRef.current.scrollHeight;

        // If we're auto-scrolling and at the bottom, ensure userHasScrolled is false
        // This prevents auto-detachment during streaming
        if (atBottom) {
          scrollState.current.userHasScrolled = false;
        }
      }
    }, 50); // Check frequently for smoother scrolling

    // Return a function to stop continuous scrolling
    return stopContinuousScroll;
  }, [containerRef, stopContinuousScroll]);

  /**
   * Check for streaming content and setup/teardown continuous scrolling if needed
   */
  useEffect(() => {
    const isStreaming = streamingState ? streamingState.isStreaming || streamingState.chatPhase === "loading" : false;
    const wasStreaming = prevStreamingRef.current;

    // Detect transition from not streaming to streaming (new response starting)
    if (isStreaming && !wasStreaming) {
      // Reset flag when NEW response begins - user submitted a prompt and expects to see the response
      scrollState.current.userHasScrolled = false;
    }

    // Update previous streaming state
    prevStreamingRef.current = isStreaming;

    // If streaming and no interval is set, start continuous scrolling
    if (isStreaming && !scrollState.current.streamingInterval) {
      startContinuousScroll();
    }
    // If not streaming and interval is set, clear it
    else if (!isStreaming && scrollState.current.streamingInterval) {
      stopContinuousScroll();
    }

    return () => {
      stopContinuousScroll();
    };
  }, [containerRef, startContinuousScroll, stopContinuousScroll, streamingState]);

  /**
   * Creates a throttled resize observer
   */
  const createResizeObserver = useCallback(
    (container: HTMLElement) => {
      let resizeTimeoutId: ReturnType<typeof setTimeout> | null = null;
      let lastResizeTime = 0;
      const RESIZE_THROTTLE_MS = 100; // Throttle to max 10 updates per second

      const handleResize = () => {
        updateVisibleHeight();

        // Only auto-scroll on resize if we're at the bottom and user hasn't manually scrolled
        if (isAtBottom && !scrollState.current.userHasScrolled) {
          scrollToBottom("auto", false);
        }
      };

      const resizeObserver = new ResizeObserver(() => {
        const now = Date.now();

        // Skip if we've processed a resize recently
        if (now - lastResizeTime < RESIZE_THROTTLE_MS) {
          // If we already have a pending update, don't schedule another one
          if (resizeTimeoutId) {
            return;
          }

          // Schedule a throttled update
          resizeTimeoutId = setTimeout(() => {
            handleResize();
            lastResizeTime = Date.now();
            resizeTimeoutId = null;
          }, RESIZE_THROTTLE_MS);

          return;
        }

        // Immediate update if we haven't updated recently
        handleResize();
        lastResizeTime = now;
      });

      resizeObserver.observe(container);

      return {
        observer: resizeObserver,
        cleanup: () => {
          if (resizeTimeoutId) {
            clearTimeout(resizeTimeoutId);
          }
        },
      };
    },
    [updateVisibleHeight, isAtBottom, scrollToBottom]
  );

  /**
   * Creates a throttled mutation observer
   */
  const createMutationObserver = useCallback(
    (container: HTMLElement) => {
      let mutationTimeoutId: ReturnType<typeof setTimeout> | null = null;
      let lastMutationTime = 0;
      const MUTATION_THROTTLE_MS = 50; // Throttle to max 20 updates per second

      const mutationObserver = new MutationObserver(() => {
        const now = Date.now();

        // Skip if we've processed a mutation recently
        if (now - lastMutationTime < MUTATION_THROTTLE_MS) {
          // If we already have a pending update, don't schedule another one
          if (mutationTimeoutId) {
            return;
          }

          // Schedule a throttled update
          mutationTimeoutId = setTimeout(() => {
            handleContentChange();
            lastMutationTime = Date.now();
            mutationTimeoutId = null;
          }, MUTATION_THROTTLE_MS);

          return;
        }

        // Immediate update if we haven't updated recently
        handleContentChange();
        lastMutationTime = now;
      });

      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      });

      return {
        observer: mutationObserver,
        cleanup: () => {
          if (mutationTimeoutId) {
            clearTimeout(mutationTimeoutId);
          }
        },
      };
    },
    [handleContentChange]
  );

  /**
   * Performs initial setup for the container
   */
  const performInitialSetup = useCallback(() => {
    // Initial scroll to bottom only on first mount
    if (!scrollState.current.userHasScrolled) {
      scrollToBottom("auto", false);
    }

    // Initial height calculation
    updateVisibleHeight();
  }, [scrollToBottom, updateVisibleHeight]);

  /**
   * Setup event listeners and observers
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Copy ref values at the start of the effect to avoid stale closure issues
    const currentScrollState = scrollState.current;

    // Perform initial setup
    performInitialSetup();

    // Use passive listeners for better performance
    container.addEventListener("scroll", handleScroll, { passive: true });

    // Create observers
    const resizeObserverData = createResizeObserver(container);
    const mutationObserverData = createMutationObserver(container);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserverData.observer.disconnect();
      mutationObserverData.observer.disconnect();

      // Cleanup timeouts
      resizeObserverData.cleanup();
      mutationObserverData.cleanup();

      // Use the copied ref values to avoid stale closure issues
      if (currentScrollState.scrollDetachTimeout) {
        clearTimeout(currentScrollState.scrollDetachTimeout);
      }

      // Call stopContinuousScroll directly to avoid dependency issues
      if (currentScrollState.streamingInterval) {
        clearInterval(currentScrollState.streamingInterval);
        currentScrollState.streamingInterval = null;
      }
    };
  }, [containerRef, handleScroll, createResizeObserver, createMutationObserver, performInitialSetup]);

  /**
   * Scroll to a specific element within the container
   *
   * @param element - The element to scroll to
   * @param options - Scroll options
   */
  const scrollToElement = useCallback(
    (
      element: HTMLElement | null,
      options: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition; topOffset?: number } = {}
    ) => {
      if (!containerRef.current || !element) {
        return;
      }

      scrollState.current.isScrolling = true;

      // If topOffset is provided, calculate the exact scroll position
      if (options.topOffset !== undefined) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const currentScrollTop = containerRef.current.scrollTop;

        // Calculate the target scroll position
        const targetScrollTop = currentScrollTop + (elementRect.top - containerRect.top) - options.topOffset;

        containerRef.current.scrollTo({
          top: Math.max(0, targetScrollTop), // Ensure we don't scroll above the top
          behavior: options.behavior || "smooth",
        });
      } else {
        // Use the default scrollIntoView behavior
        element.scrollIntoView({
          behavior: options.behavior || "smooth",
          block: options.block || "start",
        });
      }

      setTimeout(
        () => {
          scrollState.current.isScrolling = false;
          checkScrollPosition();
        },
        options.behavior === "auto" ? 0 : 300
      );
    },
    [containerRef, checkScrollPosition]
  );

  return {
    isAtBottom,
    showScrollButton,
    scrollToBottom,
    scrollToElement,
    startContinuousScroll,
    stopContinuousScroll,
    visibleHeight,
  };
}
