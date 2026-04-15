import React, { useEffect, useState } from "react";
import { Flex, Icon, IconButton, Loader, Text } from "@siteground/styleguide";
import { cn } from "@siteground/styleguide/lib/utils";
import "./styles.scss";
import { FILE_TYPE_MAPPING } from "./types";
import { generateImagePreview, bytesToMegabytes } from "./utils";

interface FileItemProps {
  file: File;
  previewUrl?: string;
  loading: boolean;
  error?: string;
  onRemove: () => void;
}

export const ChatMessageFileItem: React.FC<FileItemProps> = ({ file, previewUrl, loading, error, onRemove }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(previewUrl || null);
  const isImage = file.type && file.type.startsWith("image/") && !error;

  useEffect(() => {
    // Use the previewUrl if provided, otherwise generate it
    if (previewUrl) {
      setImageSrc(previewUrl);
    } else if (isImage) {
      const loadImagePreview = async () => {
        const preview = await generateImagePreview(file);
        setImageSrc(preview);
      };
      loadImagePreview();
    }
  }, [file, previewUrl, isImage]);

  const imageCardContent = () => {
    if (loading) {
      return <Loader position="relative" style={{ background: "transparent" }} delay={0} />;
    }

    if (error) {
      return (
        <Text size="small" color="error">
          {error}
        </Text>
      );
    }

    return <img className="file__image" src={imageSrc || ""} alt={file.name} />;
  };

  const TextCard = (
    <Flex
      justify="flex-start"
      align="center"
      className={cn("file", "text-item", error && "text-item__error")}
      gap="xx-small"
    >
      {loading ? (
        <Loader position="relative" style={{ background: "transparent" }} delay={0} />
      ) : (
        <Icon name="material/description" size="30" color="primary" className={cn(error && "file__disable-icon")} />
      )}
      <Flex className="file__data" direction="column">
        <Text weight="bold" size="medium" truncate>
          {file.name}
        </Text>
        {error ? (
          <Text size="small" color="error">
            {error}
          </Text>
        ) : (
          <Text size="small" color="typography-disabled">
            {FILE_TYPE_MAPPING[file.type]}
            &nbsp;{`${bytesToMegabytes(file?.size)}MB`}
          </Text>
        )}
      </Flex>
      <IconButton
        className="file__close-button"
        icon="material/close"
        type="contained"
        size="small"
        onClick={onRemove}
      />
    </Flex>
  );

  const ImageCard = (
    <Flex className={cn("file", "image-item", error && "image-item__error")}>
      {imageCardContent()}

      <IconButton
        className="file__close-button"
        icon="material/close"
        type="contained"
        size="small"
        onClick={onRemove}
      />
    </Flex>
  );

  return isImage ? ImageCard : TextCard;
};
