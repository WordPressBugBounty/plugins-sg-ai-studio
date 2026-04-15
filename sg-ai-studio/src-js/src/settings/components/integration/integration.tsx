import { Button } from "@siteground/styleguide";
import { FC } from "react";
import { translate } from "i18n-calypso";
import { DIALOG_IDS } from "@/shared/constants/dialogs";
import { DialogManager } from "@siteground/styleguide/lib/composite/dialogs";
import ActionCard from "@/shared/components/action-card/action-card";

interface Props {
  isConnected: boolean;
}

const Integration: FC<Props> = ({ isConnected }) => {
  return (
    <ActionCard
      title={translate("Integration")}
      label={isConnected ? translate("Connected") : translate("Not Connected")}
      labelColor={isConnected ? "success" : "warning"}
      description={
        isConnected
          ? translate("Your plugin is connected to your SiteGround AI Studio service.")
          : translate(
              "Your plugin is not linked to your SiteGround AI Studio service."
            )
      }
      name={translate("AI Studio Integration")}
      actions={
        isConnected ? (
          <Button leadingIcon="link_off" onClick={() => DialogManager.open(DIALOG_IDS.DISCONNECT_DIALOG)}>
            {translate("Disconnect")}
          </Button>
        ) : (
          <Button color="primary" leadingIcon="link" onClick={() => DialogManager.open(DIALOG_IDS.ADD_TOKEN_DIALOG)}>
            {translate("Connect")}
          </Button>
        )
      }
    />
  );
};

export default Integration;
