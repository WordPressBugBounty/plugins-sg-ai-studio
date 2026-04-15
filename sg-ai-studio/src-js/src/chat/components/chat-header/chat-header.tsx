import { Context, Draggable, Flex, Icon, IconButton, Spacer, Title } from "@siteground/styleguide";
import { useChatState } from "@/store/hooks/useChatState";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { translate } from "i18n-calypso";
import { FC, useContext, useRef } from "react";
import { calculateDragConstraints } from "@/chat/utils/draggable-constraints";
import { CHAT_WIDTH, CHAT_HEIGHT } from "@/chat/constants/chat";
import { useMediaQuery } from "@/shared/hooks/use-media-query";
import { clearSession } from "@/store/slices/messages/messagesSlice";

interface Props {
  updateChatStyles: () => void;
  domRef: HTMLDivElement | null;
  setIsDragging: (isDragging: boolean) => void;
}

const ChatHeader: FC<Props> = ({ updateChatStyles, domRef, setIsDragging }) => {
  const { device } = useContext(Context);
  const isNarrowViewport = useMediaQuery("(max-width: 799px)");
  const config = useAppSelector((state) => state.app.config);
  const { setMinimized, resetChatPosition } = useChatState();
  const draggableRef = useRef(null);
  const dispatch = useAppDispatch();

  const clearNoDragStyles = () => {
    //The draggable firing dragStart event but not the dragEnd so some styles staying in the dom
    document.body.style.userSelect = "";
    document.body.style.touchAction = "";
  };

  const handlePointerDown = () => {
    if (!domRef || !draggableRef.current) {
      return;
    }

    setIsDragging(true);

    const chatRect = domRef.getBoundingClientRect();
    const chatWidth = chatRect.width;
    const chatHeight = chatRect.height;

    // Calculate WordPress admin sidebar and topbar constraints
    const constraints = calculateDragConstraints(chatWidth, chatHeight);

    // Override the restraints in the draggable component instance
    if (draggableRef.current.restraints) {
      draggableRef.current.restraints = constraints;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    updateChatStyles();
  };

  const handleResetPosition = () => {
    if (!domRef) return;
    resetChatPosition(domRef, CHAT_WIDTH, CHAT_HEIGHT);
  };

  const headerContent = (
    <>
      <Flex gap="x-small" align="center">
        <Icon name="logo-siteground-compact-dark" size="32" multicolor />
        <Title level="5">{translate("SiteGround AI Studio")}</Title>
      </Flex>
      <Spacer />
      <Flex wrap="nowrap" gap="xx-small" data-none-draggable>
        <IconButton
          icon="material/flush"
          color="secondary"
          type="ghost"
          tooltip={translate("Clear chat")}
          onClick={() => dispatch(clearSession({ welcomeMsg: config.welcome_msg, quickActions: config.quickActions }))}
        />
        <IconButton
          icon="material/picture_in_picture_alt"
          tooltip={translate("Reposition")}
          color="secondary"
          type="ghost"
          onClick={handleResetPosition}
        />
        <IconButton
          icon="material/check_indeterminate_small"
          color="secondary"
          tooltip={translate("Minimize")}
          type="ghost"
          onClick={() => {
            setMinimized(true);
            clearNoDragStyles();
          }}
        />
      </Flex>
    </>
  );

  return (
    <Draggable
      ref={draggableRef}
      elementToDrag={domRef as HTMLElement}
      className="wp-ai-studio-chat__header"
      canDrag={(event: React.MouseEvent<HTMLElement>) => {
        const nonDraggable = document
          .querySelector("#wp-ai-studio-container")
          .shadowRoot.querySelector("[data-none-draggable]");
        if (!device) {
          return false;
        }

        if (isNarrowViewport || device.isDevicePhone || device.isDeviceTablet) {
          return false;
        }

        if (nonDraggable && event.target instanceof Element && nonDraggable.contains(event.target)) {
          return false;
        }

        return true;
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {headerContent}
    </Draggable>
  );
};

export default ChatHeader;
