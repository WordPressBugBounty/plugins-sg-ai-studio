import { Flex, Text, Button } from "@siteground/styleguide";
import "./styles.scss";
import { translate } from "i18n-calypso";
import { useUsageLimits } from "../../hooks/use-usage-limits";
import { usePlanInfo } from "../../hooks/use-plan-info";
import { upsellService } from "@/chat/utils/upsell-service";
import { PLAN_TYPES } from "./constants";

export const UpsellPrompt = () => {
  const { planType } = usePlanInfo();
  const { isWarning, isExceeded } = useUsageLimits();

  if (!isWarning && !isExceeded) {
    return null;
  }

  let text = "";
  let buttonText = "";

  if (planType === PLAN_TYPES.ESSENTIAL && isWarning) {
    text = translate("You’re running low on tokens.");
    buttonText = translate("Upgrade to Plus");
  } else if (planType === PLAN_TYPES.ESSENTIAL && isExceeded) {
    text = translate("You've run out of tokens.");
    buttonText = translate("Upgrade to Plus");
  } else if (planType === PLAN_TYPES.PLUS && isWarning) {
    text = translate("You’re almost out of tokens.");
    buttonText = translate("Add tokens");
  } else if (planType === PLAN_TYPES.PLUS && isExceeded) {
    text = translate("You've run out of tokens.");
    buttonText = translate("Add tokens");
  }

  return (
    <Flex justify="space-between" align="flex-start" className="chat-input__upsell-prompt">
      <Flex justify="flex-start" align="center" gap="x-small" className="chat-input__upsell-prompt__wrapper">
        <Text color="primary" weight="medium">
          {text}
        </Text>
      </Flex>

      <Button size="small" color="primary" onClick={() => upsellService.executeActionForPlan(planType)}>
        {buttonText}
      </Button>
    </Flex>
  );
};
