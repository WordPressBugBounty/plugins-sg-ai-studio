interface CopyToClipboardOptions {
  contentType: "text/html" | "text/plain" | "image";
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const copyToClipboard = async (content: string, options: CopyToClipboardOptions) => {
  try {
    if (options.contentType === "text/plain") {
      await navigator.clipboard.writeText(content);
      options?.onSuccess?.();
    } else if (options.contentType === "image") {
      const response = await fetch(content);
      const blob = await response.blob();
      const data = [new ClipboardItem({ [blob.type]: blob })];
      await navigator.clipboard.write(data);
      options?.onSuccess?.();
    } else {
      const htmlBlob = new Blob([content], { type: "text/html" });
      const plainTextBlob = new Blob([content.replace(/<[^>]*>/g, "")], {
        type: "text/plain",
      });

      const data = [
        new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": plainTextBlob,
        }),
      ];

      await navigator.clipboard.write(data);
      options?.onSuccess?.();
    }
  } catch (err: unknown) {
    console.error(err);
    options?.onFailure?.();
  }
};
