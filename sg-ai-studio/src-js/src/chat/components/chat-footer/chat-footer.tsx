import * as React from "react";
import cn from "@siteground/styleguide/lib/utils/classnames";
import KEYS from "@siteground/styleguide/lib/utils/keys";
import "./styles.scss";
import { Flex, Textarea, IconButton, TextareaToolbar } from "@siteground/styleguide";
import FileUploadChip from "@/shared/components/file-upload-chip/file-upload-chip";
import { askQuestion, cancelReply } from "@/store/thunks/chat-thunks";
import { ChatMessageFiles } from "../chat-message-files/chat-message-files";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useDragAndDrop } from "../drag-and-drop-provider/drag-and-drop-provider";
import { ChatSubmitMessage } from "@/chat/api/types";
import { clearAttachedFiles } from "@/store/slices/files/filesSlice";
import { translate } from "i18n-calypso";
import { UpsellPrompt } from "../chat-upsell/upsell-prompt";
import { isImageFile } from "@/chat/utils/file-type-utils";

const MAX_MESSAGE_LENGTH = 5000;
const TEXTAREA_DOM_ID = "sg-chat-textarea";

interface ChatFooterProps {
  hasLengthError: boolean;
  setHasLengthError: (hasError: boolean) => void;
}

const ChatFooter = ({ hasLengthError, setHasLengthError }: ChatFooterProps) => {
  const dispatch = useAppDispatch();
  const { files } = useAppSelector((state) => state.files);
  const { threadId, activeStreamingMessageId } = useAppSelector((state) => state.messages);

  const { openFileSelector } = useDragAndDrop();
  const [message, setMessage] = React.useState("");

  const isStreaming = activeStreamingMessageId !== null;

  const textareaClasses = cn("message-box__textarea", "message-box__textarea--file-upload-enabled");
  const validationMessage = hasLengthError ? "Max length 5000 characters" : undefined;
  const textAreaState = hasLengthError ? "error" : undefined;

  const handleCancelReply = () => {
    dispatch(cancelReply());
  };

  const handleSendMessage = () => {
    const messageContent: Array<ChatSubmitMessage> = [];

    if (message.trim()) {
      messageContent.push({
        type: "text",
        text: message.trim(),
      });
    }

    files.attached.forEach((file) => {
      if (file && file.status === "success" && file.publicUrl) {
        const mimeType = file.file.type;

        if (isImageFile(mimeType)) {
          messageContent.push({
            type: "image_url",
            image_url: {
              url: file.publicUrl,
            },
          });
        } else {
          messageContent.push({
            type: "file_url",
            file_url: {
              url: file.publicUrl,
              file_size: file.file.size,
              mime_type: mimeType,
              file_name: file.file.name,
            },
          });
        }
      }
    });

    if (messageContent.length > 0) {
      dispatch(
        askQuestion({
          question:
            messageContent.length === 1 && messageContent[0].type === "text" ? messageContent[0].text : messageContent,
          threadId,
        })
      );

      setMessage("");
      setHasLengthError(false);
      dispatch(clearAttachedFiles());
    }
  };

  const canSendMessage = !isStreaming && message.trim() && !hasLengthError;

  return (
    <Flex
      style={{ width: "100%" }}
      padding={["none", "medium", hasLengthError ? "xx-large" : "medium", "medium"]}
      align="center"
      justify="center"
      gap="x-small"
      wrap="nowrap"
      grow="1"
      className="message-box__wrapper"
    >
      <div className="message-box">
        <FileUploadChip />

        <div className="message-box__textarea-wrapper">
          <UpsellPrompt />
          <Textarea
            id={TEXTAREA_DOM_ID}
            className={textareaClasses}
            autoFocus
            expandable
            rows={2}
            maxRows={6}
            value={message}
            placeholder={translate("Ask me anything WordPress related and I'll help.")}
            state={textAreaState}
            validationMessage={validationMessage}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              const value = event.target.value || "";
              const hasError = value.length > MAX_MESSAGE_LENGTH;

              setHasLengthError(hasError);
              setMessage(value);
            }}
            onKeyPress={(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (event.key === KEYS.ENTER && !event.shiftKey) {
                event.preventDefault();
                if (canSendMessage) {
                  handleSendMessage();
                }
              }
            }}
            toolbarTop={
              files.attached.length > 0 && (
                <TextareaToolbar
                  backgroundColor="primary"
                  align="center"
                  justify="space-between"
                  gap="small"
                  className="toolbar-top"
                >
                  <ChatMessageFiles />
                </TextareaToolbar>
              )
            }
            toolbarBottom={
              <TextareaToolbar
                backgroundColor="secondary"
                align="center"
                justify="space-between"
                gap="small"
                className="toolbar-bottom"
              >
                <Flex align="center" gap="medium">
                  <IconButton color="secondary" icon="material/attach_file" onClick={openFileSelector} />
                </Flex>

                <Flex gap="x-small" direction="row">
                  {isStreaming ? (
                    <IconButton icon="material/close" type="contained" color="primary" onClick={handleCancelReply} />
                  ) : (
                    <IconButton
                      icon="material/arrow_upward"
                      type="contained"
                      color="primary"
                      disabled={!canSendMessage}
                      onClick={handleSendMessage}
                    />
                  )}
                </Flex>
              </TextareaToolbar>
            }
          />
        </div>
      </div>
    </Flex>
  );
};

export default ChatFooter;
