import { SUPPORTED_MIME_TYPES } from "../components/chat-message-files/types";
import { megabytesToBytes } from "../components/chat-message-files/utils";
import { MAX_FILE_SIZE_MB, FILE_UPLOAD_ERRORS } from "../constants/files";

export const validateFileSize = (
  file: File
): {
  valid: boolean;
  error?: string;
} => {
  if (file.size > megabytesToBytes(MAX_FILE_SIZE_MB)) {
    return {
      valid: false,
      error: FILE_UPLOAD_ERRORS.FILE_TOO_LARGE,
    };
  }

  return { valid: true };
};

export const validateFileMimeType = (file: File): { valid: boolean; error?: string } => {
  if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: FILE_UPLOAD_ERRORS.UNSUPPORTED_TYPE,
    };
  }
  return { valid: true };
};
