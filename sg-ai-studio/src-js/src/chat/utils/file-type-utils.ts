import { FILE_TYPE_CONFIGS } from "@/chat/components/chat-message-files/types";

export const extractFileExtension = (urlOrFilename: string): string => {
  const withoutQuery = urlOrFilename.split("?")[0];
  const parts = withoutQuery.split(".");
  const extension = parts[parts.length - 1]?.toLowerCase() || "";
  return extension;
};

export const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith("image/");
};

export const getFileDisplayName = (mimeType: string, filename?: string): string => {
  const config = FILE_TYPE_CONFIGS.find((config) => config.mimeType === mimeType);
  if (config) {
    return config.displayName;
  }

  if (filename) {
    const extension = extractFileExtension(filename);
    return extension.toUpperCase() || "FILE";
  }

  return "FILE";
};
