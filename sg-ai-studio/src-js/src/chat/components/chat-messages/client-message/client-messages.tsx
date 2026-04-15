import * as React from "react";
import Text from "@siteground/styleguide/lib/components/text/text";
import cn from "@siteground/styleguide/lib/utils/classnames";
import { Flex } from "@siteground/styleguide";
import { translate } from "i18n-calypso";
import { useGetImage } from "@/chat/hooks/use-get-image";
import { ImagePreview } from "../image-handler/image-handler";
import { parseMessageContent } from "@/chat/utils/parse-message-content";
import { DeletedMediaChip } from "./deleted-media-chip";
import { FileItem } from "./file-item";

const DeletedImageChip = () => {
  return <DeletedMediaChip mediaType="image" />;
};

const ImageOrDeletedChip = ({
  imageUrl,
  alt,
  renderDeleted,
}: {
  imageUrl: string;
  alt: string;
  renderDeleted?: boolean;
}) => {
  const { image, isLoading } = useGetImage(imageUrl);

  if (isLoading) return null;

  if (!image) {
    return renderDeleted ? <DeletedImageChip /> : null;
  }

  return renderDeleted ? null : (
    <div className="user-message-image-container">
      <ImagePreview className="user-message-image" imageUrl={imageUrl} alt={alt} />
    </div>
  );
};

interface Props {
  message: string;
}

const ClientMessage: React.FC<Props> = ({ message }) => {
  const classes = cn("wp-ai-studio-client-message", "wp-ai-studio-message-vertical-align-client");

  const contentClasses = cn("wp-ai-studio-client-message__content");

  const renderMessageContent = () => {
    const parsedContent = parseMessageContent(message);

    if (!parsedContent) {
      return <Text className="text-pre-wrap">{message}</Text>;
    }

    const { textItems, imageItems, fileItems } = parsedContent;
    const hasMedia = imageItems.length > 0 || fileItems.length > 0;

    return (
      <>
        {textItems.map((item, index) => (
          <Text className="text-pre-wrap" key={`text-${index}`}>
            {item.text}
          </Text>
        ))}

        {hasMedia && (
          <>
            <Flex direction="row" gap="small" align="flex-start" className="user-message-media">
              {imageItems.map((item, index) => (
                <ImageOrDeletedChip
                  key={`image-${index}`}
                  imageUrl={item.image_url.url}
                  alt={translate("User uploaded image")}
                />
              ))}
              {fileItems.map((item, index) => (
                <FileItem
                  key={`file-${index}`}
                  fileUrl={item.file_url.url}
                  fileName={item.file_url.file_name}
                  mimeType={item.file_url.mime_type}
                  fileSize={item.file_url.file_size}
                />
              ))}
            </Flex>

            <Flex direction="column" gap="small" alignSelf="flex-end" className="user-message-deleted-media">
              {imageItems.map((item, index) => (
                <ImageOrDeletedChip
                  key={`deleted-image-${index}`}
                  imageUrl={item.image_url.url}
                  alt={translate("User uploaded image")}
                  renderDeleted
                />
              ))}
              {fileItems.map((item, index) => (
                <FileItem
                  key={`deleted-file-${index}`}
                  fileUrl={item.file_url.url}
                  fileName={item.file_url.file_name}
                  mimeType={item.file_url.mime_type}
                  fileSize={item.file_url.file_size}
                  renderDeleted
                />
              ))}
            </Flex>
          </>
        )}
      </>
    );
  };

  return (
    <div className={classes}>
      <div className={contentClasses}>
        <div className="wp-ai-studio-client-message__text">{renderMessageContent()}</div>
      </div>
    </div>
  );
};

export default ClientMessage;
