import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logoutAndClearTokens } from "../slices/logout";
import { getAiToken } from "@/shared/tokens/token";
import type { RootState } from "../index";

type Seconds = number;

const cacheTimeout: Seconds = 0;

const MAX_REFRESH_TRIES = 3;

export const ApiTags = {
  Files: "Files",
  ChatMessages: "ChatMessages",
} as const;

export interface PresignedUrlResponse {
  url: string;
  fields?: Record<string, string>;
  presignedUrl: string;
  key: string;
  publicUrl: string;
}

export interface GetPresignedUrlRequest {
  operation: string;
  key: string;
  contentType: string;
  contentLength: number;
}

export interface UploadToS3Request {
  presignedUrl: string;
  file: File;
}

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const state = api.getState() as RootState;
  const isStaging = state.app.config?.is_staging;
  const baseUrl = isStaging ? "https://api.staging.studio.siteground.ai" : "https://api.studio.siteground.ai";

  const baseQuery = fetchBaseQuery({
    baseUrl,
    timeout: 10000,
    prepareHeaders: async (headers) => {
      const token = await getAiToken().getToken();

      headers.set("accept", "application/json");
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    let attempts = 0;

    while (attempts < MAX_REFRESH_TRIES) {
      attempts++;
      getAiToken().setToken(null);
      const token = await getAiToken().getToken();

      if (!token) {
        break;
      }

      result = await baseQuery(args, api, extraOptions);

      if (!result.error || result.error.status !== 401) {
        break;
      }
    }

    if (result.error && result.error.status === 401) {
      api.dispatch(logoutAndClearTokens());
    }
  }

  return result;
};

export const ai_api = createApi({
  reducerPath: "api",
  keepUnusedDataFor: cacheTimeout,
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPresignedUrl: builder.mutation<PresignedUrlResponse, GetPresignedUrlRequest>({
      query: (body) => ({
        url: "api/v1/files/wp-presigned-url",
        method: "POST",
        body,
      }),
    }),

    uploadToStorage: builder.mutation<void, UploadToS3Request>({
      // Custom queryFn for S3 upload (doesn't use file service base URL)
      queryFn: async ({ presignedUrl, file }, { signal }) => {
        try {
          const response = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: {
              "Content-Type": file.type,
            },
            signal,
          });

          if (!response.ok) {
            throw new Error("Failed to upload file to S3");
          }

          return { data: undefined };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: error.message } };
        }
      },
      invalidatesTags: [ApiTags.Files],
    }),
  }),
  tagTypes: Object.values(ApiTags),
});

export const { useGetPresignedUrlMutation, useUploadToStorageMutation } = ai_api;
