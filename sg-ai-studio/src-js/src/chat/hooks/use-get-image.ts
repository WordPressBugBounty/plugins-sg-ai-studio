import { tryCatch } from "@/shared/utils/try-catch";
import { useState, useEffect, useCallback } from "react";

export interface UseUserImageResult {
  image: string;
  isLoading: boolean;
  error: Error | null;
}

export const getImage = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }

  const data = await response.blob();
  return data;
};

export const useGetImage = (imageUrl: string): UseUserImageResult => {
  const [image, setUserImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchImage = useCallback(async (imageUrl: string) => {
    if (!imageUrl) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await tryCatch(getImage(imageUrl));
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      const image = URL.createObjectURL(result.data);
      setUserImage(image ?? null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchImage(imageUrl);
  }, [fetchImage, imageUrl]);

  return {
    image,
    isLoading,
    error,
  };
};
