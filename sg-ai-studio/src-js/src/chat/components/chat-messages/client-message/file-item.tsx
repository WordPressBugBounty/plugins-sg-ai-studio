import * as React from "react";
import { Flex, Icon } from "@siteground/styleguide";
import Text from "@siteground/styleguide/lib/components/text/text";
import { useGetImage } from "@/chat/hooks/use-get-image";
import { DeletedMediaChip } from "./deleted-media-chip";
import { getFileDisplayName } from "@/chat/utils/file-type-utils";
import { bytesToMegabytes } from "@/chat/components/chat-message-files/utils";

interface FileItemProps {
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  renderDeleted?: boolean;
}

export const FileItem: React.FC<FileItemProps> = ({ fileUrl, fileName, mimeType, fileSize, renderDeleted = false }) => {
  const { image, isLoading } = useGetImage(fileUrl);

  if (isLoading) return null;

  if (!image) {
    return renderDeleted ? <DeletedMediaChip mediaType="file" /> : null;
  }

  if (renderDeleted) {
    return null;
  }

  const fileType = getFileDisplayName(mimeType, fileName);
  const fileSizeMB = bytesToMegabytes(fileSize);

  return (
    <div className="file-item">
      <Icon name="material/description" size="30" color="primary" />
      <Flex direction="column" gap="xx-small" className="file-item__info">
        <Text size="small" weight="medium" color="typography-primary" className="file-item__name">
          {fileName}
        </Text>
        <Text size="small" color="typography-tertiary" className="file-item__meta">
          {fileType} {fileSizeMB}MB
        </Text>
      </Flex>
    </div>
  );
};
