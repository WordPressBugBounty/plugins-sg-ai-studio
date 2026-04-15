import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { resizeChatHandler } from "./chat-resize-handler";
import "./styles.scss";

import cn from "@siteground/styleguide/lib/utils/classnames";
import { useChatState } from "@/store/hooks/useChatState";
import { useAppSelector } from "@/store/hooks";
import { PartialLoader } from "@/shared/components/partial-loader/partial-loader";
import ChatHeader from "../chat-header/chat-header";
import ChatMessages from "../chat-messages/chat-messages";
import ChatFooter from "../chat-footer/chat-footer";
import ChatMinimized from "./chat-minimized";
import ChatResizer from "../chat-resizer/chat-resizer";
import { Context } from "@siteground/styleguide";
import { ScrollableContainer } from "../scrollable-container/scrollable-container";
import { DradAndDropProvider } from "../drag-and-drop-provider/drag-and-drop-provider";
import { RenderIf } from "@/shared/components/render-if/render-if";
import { CHAT_LAYOUT_DOM_ID, CHAT_MIN_WIDTH, CHAT_HEIGHT } from "@/chat/constants/chat";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { useGetACLQuery, useGetUsageQuery } from "@/store/api/wp-api";

const ChatLayout = () => {
  const { device } = useContext(Context);
  const isNarrowViewport = useMediaQuery("(max-width: 799px)");

  const [domRef, setDomRef] = useState<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasLengthError, setHasLengthError] = useState(false);
  const { minimized, position, updatePosition, resetChatPosition } = useChatState();

  // Initiate queries after chat mount
  useGetACLQuery();
  useGetUsageQuery(
    {},
    {
      pollingInterval: 60000,
      skipPollingIfUnfocused: true,
      refetchOnFocus: true,
      skip: minimized,
    }
  );

  const messagesState = useAppSelector((state) => state.messages);
  const prevIsNarrowViewport = useRef<boolean>();

  const { left, top, width, height } = position;

  const chatClasses = cn(
    "wp-ai-studio-chat",
    minimized ? "wp-ai-studio-chat__minimized" : "wp-ai-studio-chat__opened",
    isDragging && "wp-ai-studio-chat--dragging"
  );

  const contentClasses = cn(
    "wp-ai-studio-chat__content",
    "wp-ai-studio-chat__content__footer",
    "wp-ai-studio-chat__content--expand"
  );

  const footerClasses = cn("wp-ai-studio-chat__footer");

  const streamingState = {
    isStreaming: messagesState.activeStreamingMessageId !== null,
    chatPhase: (messagesState.phase === "error" ? "load-chat-error-occured" : messagesState.phase) as
      | "initial"
      | "chat-active"
      | "loading"
      | "load-chat-error-occured",
  };

  const updateChatStyles = useCallback(() => {
    if (!domRef || minimized || isNarrowViewport) return;

    const computedStyle = getComputedStyle(domRef);
    const computedWidth = parseInt(computedStyle.width) || 0;
    const computedHeight = parseInt(computedStyle.height) || 0;

    if (computedWidth < CHAT_MIN_WIDTH) {
      return;
    }

    const leftValue = parseInt(computedStyle.left) || 0;
    const topValue = parseInt(computedStyle.top) || 0;

    updatePosition({
      left: Math.max(0, leftValue),
      top: Math.max(0, topValue),
      width: computedWidth,
      height: computedHeight,
    });
  }, [domRef, minimized, isNarrowViewport, updatePosition]);

  const handleResetPosition = useCallback(() => {
    if (!domRef) return;
    resetChatPosition(domRef, CHAT_MIN_WIDTH, CHAT_HEIGHT);
  }, [domRef, resetChatPosition]);

  const initDomRef = useCallback(
    (newRef: HTMLDivElement | null): void => {
      setDomRef(newRef);

      if (!domRef || minimized || isNarrowViewport || (device && (device.isDevicePhone || device.isDeviceTablet))) {
        return;
      }

      resizeChatHandler(domRef);
    },
    [device, domRef, minimized, isNarrowViewport]
  );

  const showResizer = useCallback(() => {
    if (minimized) {
      return false;
    }

    if (isNarrowViewport || device?.isDevicePhone || device?.isDeviceTablet) {
      return false;
    }

    return true;
  }, [device, minimized, isNarrowViewport]);

  useEffect(() => {
    if (domRef) {
      updateChatStyles();
    }
  }, [domRef, updateChatStyles]);

  useEffect(() => {
    const isTransitioningFromNarrowToWide = prevIsNarrowViewport.current === true && isNarrowViewport === false;

    if (isTransitioningFromNarrowToWide) {
      handleResetPosition();
    }

    prevIsNarrowViewport.current = isNarrowViewport;
  }, [isNarrowViewport, handleResetPosition]);

  const getLayoutStyle = () => {
    if (minimized) {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      return {
        left: `${screenWidth - 60 - 30}px`,
        top: `${screenHeight - 60 - 30}px`,
        width: "60px",
        height: "60px",
        right: "auto",
        bottom: "auto",
      };
    }

    if (isNarrowViewport) {
      return {
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        maxHeight: "100vh",
        right: "auto",
        bottom: "auto",
        border: 0,
        zIndex: 100000, // HACK: Wordpress header and sidebar are 99999....
      };
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
      width: width > 0 ? `${width}px` : undefined,
      height: height > 0 ? `${height}px` : undefined,
    };
  };

  return (
    <div ref={initDomRef} id={CHAT_LAYOUT_DOM_ID} className={chatClasses} style={getLayoutStyle()}>
      <RenderIf condition={minimized}>
        <ChatMinimized />
      </RenderIf>

      <RenderIf condition={!minimized}>
        <PartialLoader isLoadingAPIs={[false]}>
          <ChatHeader updateChatStyles={updateChatStyles} domRef={domRef} setIsDragging={setIsDragging} />

          <DradAndDropProvider>
            <ScrollableContainer
              className={contentClasses}
              streamingState={streamingState}
              dataComponent="ai-chat-scrollable"
              bottomContent={
                <div className={footerClasses}>
                  <ChatFooter hasLengthError={hasLengthError} setHasLengthError={setHasLengthError} />
                </div>
              }
              showFadeOverlay={false}
            >
              <ChatMessages
                messages={messagesState.messages}
                activeStreamingMessageId={messagesState.activeStreamingMessageId}
              />
            </ScrollableContainer>
          </DradAndDropProvider>
        </PartialLoader>

        {showResizer() && <ChatResizer />}
      </RenderIf>
    </div>
  );
};

export default ChatLayout;
