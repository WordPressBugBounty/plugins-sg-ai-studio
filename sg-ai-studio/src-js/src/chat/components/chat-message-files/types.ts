export interface FileTypeConfig {
  mimeType: string;
  extensions: string[];
  displayName: string;
  category: "image" | "document" | "data" | "code";
}

export const FILE_TYPE_CONFIGS: FileTypeConfig[] = [
  // Images
  {
    mimeType: "image/jpeg",
    extensions: ["jpg", "jpeg"],
    displayName: "JPG",
    category: "image",
  },
  {
    mimeType: "image/png",
    extensions: ["png"],
    displayName: "PNG",
    category: "image",
  },

  // Documents
  {
    mimeType: "application/pdf",
    extensions: ["pdf"],
    displayName: "PDF",
    category: "document",
  },
  {
    mimeType: "application/rtf",
    extensions: ["rtf"],
    displayName: "RTF",
    category: "document",
  },
  {
    mimeType: "application/msword",
    extensions: ["doc"],
    displayName: "DOC",
    category: "document",
  },
  {
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extensions: ["docx"],
    displayName: "DOCX",
    category: "document",
  },
  {
    mimeType: "application/vnd.ms-excel",
    extensions: ["xls"],
    displayName: "XLS",
    category: "document",
  },
  {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extensions: ["xlsx"],
    displayName: "XLSX",
    category: "document",
  },
  // Data files
  {
    mimeType: "text/plain",
    extensions: ["txt"],
    displayName: "TXT",
    category: "data",
  },
  {
    mimeType: "text/csv",
    extensions: ["csv"],
    displayName: "CSV",
    category: "data",
  },
  {
    mimeType: "application/json",
    extensions: ["json"],
    displayName: "JSON",
    category: "data",
  },
  {
    mimeType: "application/xml",
    extensions: ["xml"],
    displayName: "XML",
    category: "data",
  },
  // Code files
  {
    mimeType: "text/javascript",
    extensions: ["js"],
    displayName: "JS",
    category: "code",
  },
  {
    mimeType: "text/css",
    extensions: ["css"],
    displayName: "CSS",
    category: "code",
  },
  {
    mimeType: "text/html",
    extensions: ["html", "htm"],
    displayName: "HTML",
    category: "code",
  },
];

// Derived constants
export const SUPPORTED_MIME_TYPES = FILE_TYPE_CONFIGS.map((config) => config.mimeType);

export const FILE_TYPE_MAPPING = FILE_TYPE_CONFIGS.reduce((acc, config) => {
  acc[config.mimeType] = config.displayName;
  return acc;
}, {} as Record<string, string>);

export const EXTENSION_TO_MIME_TYPE = FILE_TYPE_CONFIGS.reduce((acc, config) => {
  config.extensions.forEach((ext) => {
    acc[ext] = config.mimeType;
  });
  return acc;
}, {} as Record<string, string>);

export const getSupportedFileFormats = (): string => {
  return FILE_TYPE_CONFIGS.map((config) => config.displayName).join(", ");
};
