import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { RootState } from "../index";

type Seconds = number;

const cacheTimeout: Seconds = 0;

export const ApiTags = {
  PowerAgentMode: "PowerAgentMode",
  ActivityLog: "ActivityLog",
  initAuth: "initAuth",
} as const;

const createBaseQuery = (baseOptions: Parameters<typeof fetchBaseQuery>[0]) => {
  return fetchBaseQuery(baseOptions);
};

const baseQueryWithConfig: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const state = api.getState() as RootState;
  const config = state.app.config;

  const dynamicBaseQuery = createBaseQuery({
    baseUrl: config.rest_base,
    timeout: 10000,
    prepareHeaders: async (headers) => {
      headers.set("accept", "application/json");
      if (config.wp_nonce) {
        headers.set("X-WP-Nonce", config.wp_nonce);
      }
      return headers;
    },
  });

  return dynamicBaseQuery(args, api, extraOptions);
};

export type PowermodeRequest = { enabled: boolean };
export type PowermodeResponse = { enabled: boolean };

export type ConnectRequest = { data: string };

export type CheckStatusResponse = { connected: boolean };

export type GenerateTokenResponse = { client_id: string; expires_in: number; token: string };

export type ActivityLogParams = {
  page?: number;
  per_page?: number;
  activity?: string;
  from?: number;
  to?: number;
};

export type ActivityLogResponse = {
  entries: Array<{
    id: number;
    date: string;
    activity: string;
    message: string;
  }>;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

interface UsageGetParams {
  start?: string;
  end?: string;
  source?: string;
}

interface UsageResponseType {
  balance: number;
  budget: number;
  source: Record<string, number>;
}

export interface ACLFeatures {
  ai_tokens: number;
  ai_storage_mb: number;
  n_social_media_accounts: number;
  n_wp_agent_sites: number;
  n_sg_em_agent_uses: number;
  allow_translation: 0 | 1;
  allow_wp_power_mode: 0 | 1;
  allow_email_html_gen: 0 | 1;
  allow_ai_instant_help: 0 | 1;
  allow_chat_all_models: 0 | 1;
  allow_prompts_library: 0 | 1;
  allow_scheduled_posts: 0 | 1;
  allow_seo_content_gen: 0 | 1;
  allow_text_generation: 0 | 1;
  allow_image_generation: 0 | 1;
  allow_sg_support_agent: 0 | 1;
  allow_brand_voice_config: 0 | 1;
  allow_reputation_manager: 0 | 1;
  allow_user_prompts_creation: 0 | 1;
  allow_website_content_audit: 0 | 1;
  allow_shortcuts: 0 | 1;
  allowed_agents: string[];
  allowed_internal_agents: 0 | 1;
}

export interface ACLResponse {
  features: ACLFeatures;
}

export const wp_api = createApi({
  reducerPath: "wp_api",
  keepUnusedDataFor: cacheTimeout,
  baseQuery: baseQueryWithConfig,
  endpoints: (builder) => ({
    getPowermode: builder.query<PowermodeResponse, void>({
      query: () => ({
        url: "/sg-ai-studio/settings-page/powermode",
        method: "GET",
      }),
      providesTags: [ApiTags.PowerAgentMode],
    }),
    updatePowermode: builder.mutation<PowermodeResponse, PowermodeRequest>({
      query: (payload) => ({
        url: "/sg-ai-studio/settings-page/powermode",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [ApiTags.PowerAgentMode],
    }),
    checkStatus: builder.query<CheckStatusResponse, void>({
      query: () => ({
        url: "/sg-ai-studio/settings-page/connected",
        method: "GET",
      }),
      providesTags: [ApiTags.initAuth],
    }),
    connect: builder.mutation<{ success?: boolean; message?: string }, ConnectRequest>({
      query: (payload) => ({
        url: "/sg-ai-studio/init-auth",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [ApiTags.initAuth],
    }),
    disconnect: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        timeout: 30000,
        url: "/sg-ai-studio/settings-page/disconnect",
        method: "POST",
      }),
      invalidatesTags: [ApiTags.initAuth, ApiTags.PowerAgentMode],
    }),
    activityLog: builder.query<ActivityLogResponse, ActivityLogParams>({
      query: ({ page = 1, per_page, activity, from, to } = {}) => ({
        url: "/sg-ai-studio/activity-log",
        method: "GET",
        params: { page, per_page, activity, from, to },
      }),
    }),
    getUsage: builder.query<UsageResponseType, UsageGetParams>({
      query: ({ start, end, source } = {}) => ({
        url: "/sg-ai-studio/usage",
        method: "GET",
        params: {
          source,
          start,
          end,
        },
      }),
    }),
    getACL: builder.query<ACLResponse, void>({
      query: () => ({
        url: "/sg-ai-studio/acl",
        method: "GET",
      }),
    }),
  }),
  tagTypes: Object.values(ApiTags),
});

export const {
  useGetPowermodeQuery,
  useUpdatePowermodeMutation,
  useActivityLogQuery,
  useConnectMutation,
  useCheckStatusQuery,
  useDisconnectMutation,
  useGetUsageQuery,
  useGetACLQuery,
} = wp_api;
