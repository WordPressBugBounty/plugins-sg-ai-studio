import { PLAN_TYPES, UPSELL_ACTIONS } from "../components/chat-upsell/constants";
import { PlanType } from "../components/chat-upsell/types";

const SG_UA_URL = "https://my.siteground.com";

class UpsellService {
  handleUpgrade(): void {
    const url = SG_UA_URL + "/ai-studio/order/Plus";
    window.open(url, "_blank");
  }

  handleAddTokens(): void {
    const url = SG_UA_URL + "/ai-studio/add-tokens";
    window.open(url, "_blank");
  }

  executeActionForPlan(planType: PlanType): void {
    const action = planType === PLAN_TYPES.ESSENTIAL ? UPSELL_ACTIONS.UPGRADE : UPSELL_ACTIONS.ADD_TOKENS;

    if (action === UPSELL_ACTIONS.UPGRADE) {
      this.handleUpgrade();
    } else {
      this.handleAddTokens();
    }
  }
}

export const upsellService = new UpsellService();
