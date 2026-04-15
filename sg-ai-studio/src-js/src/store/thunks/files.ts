import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFilesStarted } from "../slices/files/filesSlice";
import { RootState } from "..";
import { genericNotifications } from "@/shared/components/notifications-container/generic-notifications";
import { processAndValidateFiles, validateProcessingResult } from "./utils/file-processing";
import {
  executeMultipleFileUploads,
  summarizeUploadResults,
  executeMultipleAttachedFileUploads,
} from "./utils/file-upload";
import { MAX_FILES_ATTACHED } from "@/chat/constants/files";

export const uploadFilesThunk = createAsyncThunk(
  "files/uploadFiles",
  async (files: File[], { dispatch, rejectWithValue }) => {
    const validationResult = await processAndValidateFiles(files, { initialStatus: "idle" });

    if (!validateProcessingResult(validationResult, rejectWithValue)) {
      return rejectWithValue("No valid files to upload");
    }

    dispatch(uploadFilesStarted({ files: validationResult.validFiles }));

    const results = await executeMultipleFileUploads(validationResult.validFiles, dispatch);
    const summary = summarizeUploadResults(results);

    return { successfulUploads: summary.successfulUploads, totalFiles: summary.totalFiles };
  }
);

export const attachFilesFromSelectorThunk = createAsyncThunk(
  "fileManager/attachFilesFromSelector",
  async (files: File[], { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const currentAttachedFiles = state.files.files.attached;

    if (currentAttachedFiles.length + files.length > MAX_FILES_ATTACHED) {
      const message = `Cannot attach more than ${MAX_FILES_ATTACHED} files`;

      genericNotifications.addNotification({
        type: "error",
        message,
      });
      return rejectWithValue(message);
    }

    const validationResult = await processAndValidateFiles(files, { initialStatus: "uploading" });

    const results = await executeMultipleAttachedFileUploads(validationResult.validFiles, dispatch);
    const summary = summarizeUploadResults(results);

    if (summary.successfulUploads > 0) {
      const message =
        summary.successfulUploads === 1
          ? "File uploaded and attached successfully"
          : `${summary.successfulUploads} files uploaded and attached successfully`;

      genericNotifications.addNotification({
        type: "success",
        message,
      });
    }

    return { attachedFiles: summary.results.map((r) => r.file) };
  }
);
