import { FC } from "react";
import { Link, Switch, Text } from "@siteground/styleguide";
import { translate } from "i18n-calypso";
import ActionCard from "@/shared/components/action-card/action-card";

interface Props {
  enabled: boolean;
  isConnected: boolean;
  handlePowermodeToggle: (enabled: boolean) => void;
}

const PowerAgent: FC<Props> = ({ enabled, isConnected, handlePowermodeToggle }) => {
  return (
    <ActionCard
      title={translate("Agent Settings")}
      extraDescription={
        <div>
          <Text tag="span">
            {translate(
              "Supercharge AI Studio with Power Mode. Enable it to go beyond simple answers by executing complex, multi-step tasks and utilizing a broader set of capabilities and skills."
            )}
          </Text>{" "}
          <Link href="https://www.siteground.com/kb/power-mode-ai-agent-wordpress" target="_blank">
            {translate("Learn More.")}
          </Link>
        </div>
      }
      name={translate("Power Mode")}
      label={enabled ? translate("On") : translate("Off")}
      labelColor={enabled ? "success" : "typography-quaternary"}
      actions={
        <Switch
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePowermodeToggle(e.target.checked)}
          checked={enabled}
          disabled={!isConnected}
        />
      }
    />
  );
};

export default PowerAgent;
