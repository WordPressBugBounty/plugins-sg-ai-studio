import { useState } from "react";
import { copyToClipboard } from "../utils/copy-to-clipboard";

interface CopyToClipboardOptions {
  contentType: "text/html" | "text/plain" | "image";
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (content: string, options: CopyToClipboardOptions) => {
    await copyToClipboard(content, {
      contentType: options.contentType,
      onSuccess: () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      },
    });
  };

  return {
    isCopied,
    copyToClipboard: copy,
  };
};
