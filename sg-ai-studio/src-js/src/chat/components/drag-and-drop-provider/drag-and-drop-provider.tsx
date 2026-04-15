import React, { createContext, ReactNode, useCallback, useContext, useRef } from "react";
import { Flex } from "@siteground/styleguide";

import { useDnd } from "@/chat/hooks/use-dnd";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { attachFilesFromSelectorThunk, uploadFilesThunk } from "@/store/thunks/files";
import { RenderIf } from "@/shared/components/render-if/render-if";
import { DragAndDropZone } from "./drag-and-drop-zone";
import { MAX_FILES_ATTACHED } from "@/chat/constants/files";

interface DradAndDropContextType {
  openFileSelector: () => void;
}

const DradAndDropContext = createContext<DradAndDropContextType>({
  openFileSelector: () => {},
});

interface DradAndDropProviderProps {
  children: ReactNode;
  accept?: string;
  multiple?: boolean;
  infiniteFileUploadCount?: boolean;
  mode?: "upload" | "attach";
}

// Provider component
export const DradAndDropProvider: React.FC<DradAndDropProviderProps> = ({
  children,
  accept = "*",
  multiple = true,
  infiniteFileUploadCount = true,
  mode = "attach",
}) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files } = useAppSelector((state) => state.files);

  const handleFileChange = useCallback(
    (addFiles: File[]) => {
      if (!addFiles.length) return;

      if (!infiniteFileUploadCount) {
        const totalFiles = files.attached.length;
        const maxFilesToAdd = MAX_FILES_ATTACHED - totalFiles;

        if (addFiles.length > maxFilesToAdd) {
          console.error(`Maximum ${MAX_FILES_ATTACHED} files can be uploaded.`);
        }

        addFiles = Array.from(addFiles).slice(0, maxFilesToAdd);
      }

      if (mode === "attach") {
        dispatch(attachFilesFromSelectorThunk(addFiles));
      } else {
        dispatch(uploadFilesThunk(addFiles));
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [infiniteFileUploadCount, files, mode, dispatch]
  );

  const { isDragging, dragProps } = useDnd([], handleFileChange);

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const contextValue: DradAndDropContextType = {
    openFileSelector,
  };

  return (
    <DradAndDropContext.Provider value={contextValue}>
      <div className="md-drag-and-drop-wrapper" {...dragProps}>
        <RenderIf condition={isDragging}>
          <Flex className="md-drag-and-drop-overlay">
            <DragAndDropZone />
          </Flex>
        </RenderIf>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          accept={accept}
          multiple={multiple}
        />
        {children}
      </div>
    </DradAndDropContext.Provider>
  );
};

export const useDragAndDrop = () => {
  const context = useContext(DradAndDropContext);
  if (context === undefined) {
    throw new Error("useDragAndDrop must be used within a DragAndDropProvider");
  }
  return context;
};
