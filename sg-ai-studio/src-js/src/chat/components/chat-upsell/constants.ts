import { UpsellActionType } from "./types";

export const USAGE_THRESHOLDS = {
  WARNING: 80,
  EXCEEDED: 100,
} as const;

export const PLAN_TYPES = {
  ESSENTIAL: "essential",
  PLUS: "plus",
} as const;

export const UPSELL_ACTIONS: Record<string, UpsellActionType> = {
  UPGRADE: "upgrade",
  ADD_TOKENS: "add-tokens",
} as const;
