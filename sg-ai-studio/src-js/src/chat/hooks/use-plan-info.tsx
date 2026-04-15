import { useAppSelector } from "@/store/hooks";
import { PLAN_TYPES } from "../components/chat-upsell/constants";
import { PlanType } from "../components/chat-upsell/types";

export interface PlanInfo {
  isPremium: boolean;
  planType: PlanType;
}

export const usePlanInfo = (): PlanInfo => {
  const aclFeatures = useAppSelector((state) => state.acl.features);

  if (!aclFeatures) {
    return {
      isPremium: false,
      planType: PLAN_TYPES.ESSENTIAL,
    };
  }

  const isPremium = Boolean(aclFeatures.allow_shortcuts);
  const planType = isPremium ? PLAN_TYPES.PLUS : PLAN_TYPES.ESSENTIAL;

  return {
    isPremium,
    planType,
  };
};
