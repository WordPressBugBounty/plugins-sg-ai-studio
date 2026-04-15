import { PLAN_TYPES } from "./constants";

export type PlanType = (typeof PLAN_TYPES)[keyof typeof PLAN_TYPES];

export type FeatureType = "agents" | "prompts" | "connectors" | "chat" | "usage";

export type UpsellTrigger =
  | "feature-locked" // Feature not available on current plan
  | "usage-warning" // 80% of usage reached
  | "usage-exceeded"; // 100% of usage reached

export type UsageLevel = 80 | 100;

export type UpsellActionType = "upgrade" | "add-tokens";

export interface UpsellConfig {
  feature: FeatureType;
  planType: PlanType;
  trigger: UpsellTrigger;
  usageLevel?: UsageLevel;
}

export interface UpsellAction {
  type: UpsellActionType;
  handler: () => void;
}
