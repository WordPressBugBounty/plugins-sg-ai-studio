export const bytesToMegabytes = (bytes: number) => {
  const MEGABYTE = 1024 * 1024;
  return (bytes / MEGABYTE).toFixed(2);
};

export const megabytesToBytes = (megabytes: number) => {
  const MEGABYTE = 1024 * 1024;
  return megabytes * MEGABYTE;
};

export const generateImagePreview = async (file: File): Promise<string | null> => {
  if (!file || !file.type || !file.type.startsWith("image/")) {
    return null;
  }

  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = (error) => {
        console.error("Error reading image file:", error);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Error generating image preview:", error);
    return null;
  }
};
