import { v4 as uuidv4 } from "uuid";
import { UploadingFile } from "../../slices/files/filesSlice";
import { validateFileMimeType, validateFileSize } from "@/chat/utils/validations";
import { generateImagePreview } from "@/chat/components/chat-message-files/utils";
import { genericNotifications } from "@/shared/components/notifications-container/generic-notifications";

export interface FileValidationResult {
  validFiles: UploadingFile[];
  invalidFiles: { file: File; error: string }[];
}

export interface ProcessFilesOptions {
  initialStatus?: "idle" | "uploading";
}

export async function processAndValidateFiles(
  files: File[],
  options: ProcessFilesOptions = {}
): Promise<FileValidationResult> {
  const { initialStatus = "idle" } = options;
  const validFiles: UploadingFile[] = [];
  const invalidFiles: { file: File; error: string }[] = [];

  for (const file of files) {
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      invalidFiles.push({ file, error: sizeValidation.error! });
      continue;
    }

    const typeValidation = validateFileMimeType(file);
    if (!typeValidation.valid) {
      invalidFiles.push({ file, error: typeValidation.error! });
      continue;
    }

    const preview = await generateImagePreview(file);

    const uploadingFile: UploadingFile = {
      id: uuidv4(),
      file,
      status: initialStatus,
      preview: preview || undefined,
    };

    validFiles.push(uploadingFile);
  }

  for (const { file, error } of invalidFiles) {
    genericNotifications.addNotification({
      type: "error",
      message: `${file.name}: ${error}`,
    });
  }

  return { validFiles, invalidFiles };
}

export function validateProcessingResult(
  result: FileValidationResult,
  rejectWithValue: (value: string) => any
): result is FileValidationResult & { validFiles: [UploadingFile, ...UploadingFile[]] } {
  if (result.validFiles.length === 0) {
    rejectWithValue("No valid files to upload");
    return false;
  }
  return true;
}

