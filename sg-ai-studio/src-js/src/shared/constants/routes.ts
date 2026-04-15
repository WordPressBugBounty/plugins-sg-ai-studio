export const PAGE_ROUTES = {
  SETTINGS: "settings",
  CHAT: "chat",
} as const;

export type PageRoute = (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];

