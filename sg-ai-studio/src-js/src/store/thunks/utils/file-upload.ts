import { UploadingFile, updateAttachedFileStatus, addAttachedFile } from "../../slices/files/filesSlice";
import { tryCatch } from "@/shared/utils/try-catch";
import { ai_api as filesApi } from "../../api/ai-api";
import { genericNotifications } from "@/shared/components/notifications-container/generic-notifications";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { FILE_UPLOAD_ERRORS } from "@/chat/constants/files";

export interface UploadResult {
  success: boolean;
  file: UploadingFile;
}

export async function executeFileUpload(
  uploadingFile: UploadingFile,
  dispatch: ThunkDispatch<any, unknown, any>
): Promise<UploadResult> {
  try {
    dispatch(
      updateAttachedFileStatus({
        id: uploadingFile.id,
        status: "uploading",
      })
    );

    const presignedResult = await tryCatch(
      dispatch(
        filesApi.endpoints.getPresignedUrl.initiate({
          operation: "putObject",
          key: uploadingFile.file.name,
          contentType: uploadingFile.file.type,
          contentLength: uploadingFile.file.size,
        })
      ).unwrap()
    );

    if (presignedResult.error) {
      throw new Error("Failed to get presigned URL");
    }

    const uploadResult = await tryCatch(
      dispatch(
        filesApi.endpoints.uploadToStorage.initiate({
          presignedUrl: presignedResult.data.presignedUrl,
          file: uploadingFile.file,
        })
      ).unwrap()
    );

    if (uploadResult.error) {
      throw new Error("Failed to upload to S3");
    }

    dispatch(
      updateAttachedFileStatus({
        id: uploadingFile.id,
        status: "success",
        publicUrl: presignedResult.data.publicUrl,
      })
    );

    return { success: true, file: uploadingFile };
  } catch (error) {
    dispatch(
      updateAttachedFileStatus({
        id: uploadingFile.id,
        status: "error",
        error: FILE_UPLOAD_ERRORS.UPLOAD_FAILED,
      })
    );

    genericNotifications.addNotification({
      type: "error",
      message: `${uploadingFile.file.name}: ${FILE_UPLOAD_ERRORS.UPLOAD_FAILED}`,
    });

    return { success: false, file: uploadingFile };
  }
}

/**
 * Executes upload for multiple files in parallel
 */
export async function executeMultipleFileUploads(
  files: UploadingFile[],
  dispatch: ThunkDispatch<any, unknown, any>
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => executeFileUpload(file, dispatch));
  return Promise.all(uploadPromises);
}

export interface UploadSummary {
  successfulUploads: number;
  totalFiles: number;
  results: UploadResult[];
}

/**
 * Processes upload results and returns summary
 */
export function summarizeUploadResults(results: UploadResult[]): UploadSummary {
  const successfulUploads = results.filter((result) => result.success).length;

  return {
    successfulUploads,
    totalFiles: results.length,
    results,
  };
}

/**
 * Upload function specifically for attaching files that adds files to state immediately
 */
export async function executeAttachedFileUpload(
  uploadingFile: UploadingFile,
  dispatch: ThunkDispatch<any, unknown, any>
): Promise<UploadResult> {
  try {
    // Add file to attached state immediately
    dispatch(addAttachedFile({ file: uploadingFile }));

    const presignedResult = await tryCatch(
      dispatch(
        filesApi.endpoints.getPresignedUrl.initiate({
          operation: "putObject",
          key: uploadingFile.file.name,
          contentType: uploadingFile.file.type,
          contentLength: uploadingFile.file.size,
        })
      ).unwrap()
    );

    if (presignedResult.error) {
      throw new Error("Failed to get presigned URL");
    }

    const uploadResult = await tryCatch(
      dispatch(
        filesApi.endpoints.uploadToStorage.initiate({
          presignedUrl: presignedResult.data.presignedUrl,
          file: uploadingFile.file,
        })
      ).unwrap()
    );

    if (uploadResult.error) {
      throw new Error("Failed to upload file");
    }

    dispatch(
      updateAttachedFileStatus({
        id: uploadingFile.id,
        status: "success",
        publicUrl: presignedResult.data.publicUrl,
      })
    );

    return { success: true, file: uploadingFile };
  } catch (error) {
    console.error(error);

    dispatch(
      updateAttachedFileStatus({
        id: uploadingFile.id,
        status: "error",
        error: FILE_UPLOAD_ERRORS.UPLOAD_FAILED,
      })
    );

    return { success: false, file: uploadingFile };
  }
}

export async function executeMultipleAttachedFileUploads(
  files: UploadingFile[],
  dispatch: ThunkDispatch<any, unknown, any>
): Promise<UploadResult[]> {
  const uploadPromises = files.map((file) => executeAttachedFileUpload(file, dispatch));
  return Promise.all(uploadPromises);
}
