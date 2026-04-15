import "./scrollable-container.scss";
import { ScrollableProvider } from "./scrollable-context";
import { ScrollableContainerProps } from "./types";
import { IconButton } from "@siteground/styleguide";
import React, { useEffect, useRef } from "react";
import { useScrollableManager } from "../../hooks/use-scrollable-manager";
import { useUsageLimits } from "../../hooks/use-usage-limits";
import { cn } from "@siteground/styleguide/lib";

/**
 * A reusable scrollable container component with auto-scrolling capabilities
 * and a scroll-to-bottom button that appears when the user scrolls away from the bottom.
 */
export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  bottomContent,
  className = "",
  dataComponent,
  onScrollPositionChange,
  showScrollButton = true,
  showFadeOverlay = true,
  style,
  scrollableAreaStyle,
  bottomContentStyle,
  scrollButtonPosition,
  fadeOverlayPosition,
  streamingState,
  header,
  headerStyle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomContentRef = useRef<HTMLDivElement>(null);
  const [bottomContentHeight, setBottomContentHeight] = React.useState(0);

  const {
    isAtBottom,
    showScrollButton: shouldShowScrollButton,
    scrollToBottom,
    scrollToElement,
    startContinuousScroll,
    stopContinuousScroll,
    visibleHeight,
  } = useScrollableManager(containerRef, streamingState);

  const { isWarning, isExceeded } = useUsageLimits();
  const isUpsellVisible = isWarning || isExceeded;

  useEffect(() => {
    if (onScrollPositionChange) {
      onScrollPositionChange(isAtBottom);
    }
  }, [isAtBottom, onScrollPositionChange]);

  useEffect(() => {
    const bottomContentElement = bottomContentRef.current;
    if (!bottomContentElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setBottomContentHeight(entry.target.clientHeight);
      }
    });

    resizeObserver.observe(bottomContentElement);
    setBottomContentHeight(bottomContentElement.clientHeight);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const containerClassName = cn("sg-scrollable-container", className);

  const displayScrollButton = showScrollButton && shouldShowScrollButton;
  const displayFadeOverlay = showFadeOverlay && shouldShowScrollButton;

  const SCROLL_BUTTON_OFFSET = 16;
  const WITH_UPSELL_VISIBLE_OFFSET = 22;

  const calculatedScrollButtonPosition =
    scrollButtonPosition !== undefined
      ? scrollButtonPosition
      : bottomContentHeight + SCROLL_BUTTON_OFFSET - (isUpsellVisible ? WITH_UPSELL_VISIBLE_OFFSET : 0);

  const scrollButtonStyle = { bottom: `${calculatedScrollButtonPosition}px` };

  const fadeOverlayStyle = fadeOverlayPosition !== undefined ? { bottom: `${fadeOverlayPosition}px` } : undefined;

  return (
    <ScrollableProvider
      value={{
        isAtBottom,
        showScrollButton: shouldShowScrollButton,
        scrollToBottom,
        scrollToElement,
        startContinuousScroll,
        stopContinuousScroll,
        containerRef,
        visibleHeight,
      }}
    >
      <div className={containerClassName} style={style}>
        {header && (
          <div className="sg-scrollable-container__header" style={headerStyle}>
            {header}
          </div>
        )}

        <div
          className="sg-scrollable-container__content"
          ref={containerRef}
          data-component={dataComponent}
          style={scrollableAreaStyle}
        >
          {children}
        </div>

        {showScrollButton && (
          <IconButton
            className={`sg-scrollable-container__scroll-button ${displayScrollButton ? "visible" : ""}`}
            style={scrollButtonStyle}
            color="contrast"
            type="contained"
            icon="material/arrow_downward"
            size="large"
            onClick={() => scrollToBottom("smooth", true)}
          />
        )}

        {showFadeOverlay && (
          <div
            className={`sg-scrollable-container__fade-overlay ${displayFadeOverlay ? "visible" : ""}`}
            aria-hidden="true"
            style={fadeOverlayStyle}
          />
        )}

        {bottomContent && (
          <div ref={bottomContentRef} style={bottomContentStyle}>
            {bottomContent}
          </div>
        )}
      </div>
    </ScrollableProvider>
  );
};
