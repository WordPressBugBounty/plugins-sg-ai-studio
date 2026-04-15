import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FileInfo {
  key: string;
  size: number;
  lastModified: string;
  publicUrl: string;
  url: string;
  isProcessing: boolean;
  filename?: string;
}

export interface UploadingFile {
  id: string;
  file: File;
  status: "idle" | "uploading" | "deleting" | "success" | "error";
  error?: string;
  preview?: string;
  publicUrl?: string;
}

export interface FileState {
  attached: UploadingFile[];
}

export interface FileManagerState {
  files: FileState;
}

const initialState: FileManagerState = {
  files: {
    attached: [],
  },
};

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    uploadFilesStarted: (state, action: PayloadAction<{ files: UploadingFile[] }>) => {
      state.files.attached = [...action.payload.files, ...state.files.attached];
    },
    addAttachedFile: (state, action: PayloadAction<{ file: UploadingFile }>) => {
      state.files.attached = [...state.files.attached, action.payload.file];
    },
    updateAttachedFileStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: UploadingFile["status"];
        publicUrl?: string;
        error?: string;
      }>
    ) => {
      const fileIndex = state.files.attached.findIndex((file) => file.id === action.payload.id);
      if (fileIndex !== -1) {
        state.files.attached[fileIndex].status = action.payload.status;
        if (action.payload.publicUrl) {
          state.files.attached[fileIndex].publicUrl = action.payload.publicUrl;
        }
        if (action.payload.error) {
          state.files.attached[fileIndex].error = action.payload.error;
        }
      }
    },
    removeAttachedFile: (state, action: PayloadAction<{ id: string }>) => {
      state.files.attached = state.files.attached.filter((file) => file.id !== action.payload.id);
    },
    clearAttachedFiles: (state) => {
      state.files.attached = [];
    },

    clearFailedUploads: (state) => {
      state.files.attached = state.files.attached.filter((file) => file.status !== "error");
    },
    removeFileFromState: (state, action: PayloadAction<{ id: string }>) => {
      state.files.attached = state.files.attached.filter((file) => file.id !== action.payload.id);
    },
  },
});

export const {
  uploadFilesStarted,
  addAttachedFile,
  updateAttachedFileStatus,
  removeAttachedFile,
  clearAttachedFiles,
  clearFailedUploads,
  removeFileFromState,
} = filesSlice.actions;

export default filesSlice.reducer;
