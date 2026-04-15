export type WPAIStudioConfig = {
  home_url: string;
  admin_url: string;
  rest_base: string;
  assetsPath: string;
  localeSlug: string;
  locale: string;
  wp_nonce: string | null;
  is_staging: boolean;
  welcome_msg: string;
  minimizeOverride?: boolean;
  quickActions?: QuickActions;
};

export type InitOptions = {
  domElementId: string;
  page: string;
  config: WPAIStudioConfig;
};

export interface QuickActionCategory {
  type: string;
  title: string;
  icon: string;
}

export interface QuickActions {
  categories: QuickActionCategory[];
  actions: Record<string, string[]>;
  actionsTitle: string;
}