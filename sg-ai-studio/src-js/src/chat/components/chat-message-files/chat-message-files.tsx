import { Flex } from "@siteground/styleguide";
import { ChatMessageFileItem } from "./chat-message-file-item";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeAttachedFile } from "@/store/slices/files/filesSlice";

export const ChatMessageFiles: React.FC = () => {
  const dispatch = useAppDispatch();
  const { files } = useAppSelector((state) => state.files);

  return (
    <Flex gap="large">
      {files.attached.map((file, index) => {
        const isLoading = file.status === "uploading";

        return (
          <ChatMessageFileItem
            key={index}
            file={file.file}
            previewUrl={file.preview}
            loading={isLoading}
            error={file.error}
            onRemove={() => {
              dispatch(removeAttachedFile({ id: file.id }));
            }}
          />
        );
      })}
    </Flex>
  );
};
