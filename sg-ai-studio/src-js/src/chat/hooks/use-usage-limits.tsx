import { useAppSelector } from "@/store/hooks";
import { USAGE_THRESHOLDS } from "../components/chat-upsell/constants";

export interface UsageLimitsState {
  usagePercent: number | null;
  isWarning: boolean;
  isExceeded: boolean;
  usageLevel: 80 | 100 | null;
}

export const useUsageLimits = (): UsageLimitsState => {
  const { balance, budget } = useAppSelector((state) => state.usage);

  const usagePercent = balance !== null && budget !== null && budget > 0 ? ((budget - balance) / budget) * 100 : null;

  const isWarning =
    usagePercent !== null && usagePercent >= USAGE_THRESHOLDS.WARNING && usagePercent < USAGE_THRESHOLDS.EXCEEDED;

  const isExceeded = usagePercent !== null && usagePercent >= USAGE_THRESHOLDS.EXCEEDED;

  const usageLevel = isExceeded ? USAGE_THRESHOLDS.EXCEEDED : isWarning ? USAGE_THRESHOLDS.WARNING : null;

  return {
    usagePercent,
    isWarning,
    isExceeded,
    usageLevel,
  };
};
