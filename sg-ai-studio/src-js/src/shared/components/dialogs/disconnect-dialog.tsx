import { Text } from "@siteground/styleguide";
import { DialogManager } from "@siteground/styleguide/lib/composite/dialogs";
import * as React from "react";
import { AppDialog } from "./app-dialog";
import { DIALOG_IDS } from "@/shared/constants/dialogs";
import { translate } from "i18n-calypso";
import { genericNotifications } from "../notifications-container/generic-notifications";
import { broadcast } from "@/shared/utils/event-broadcast";

interface Props {
  disconnect: any;
}

const DisconnectDialog: React.FC<Props> = ({ disconnect }) => {
  const handleSubmit = async () => {
    DialogManager.close(DIALOG_IDS.DISCONNECT_DIALOG);

    try {
      const result = await disconnect();
      const isSuccess = result.data?.success;

      if (isSuccess) {
        broadcast("connection_status_changed", { type: "disconnected" });
      }

      genericNotifications.addNotification({
        type: isSuccess ? "success" : "error",
        message: isSuccess
          ? (translate(result.data.message) as string)
          : translate("Something went wrong. Please try again later."),
      });
    } catch (error) {
      genericNotifications.addNotification({
        type: "error",
        message: translate("Something went wrong. Please try again later."),
      });
      return;
    }
  };
  return (
    <AppDialog
      id={DIALOG_IDS.DISCONNECT_DIALOG}
      isLoadingAPIs={[false]}
      onSubmit={handleSubmit}
      submitLabel="Confirm"
      state="warning"
      icon="warning"
      size="large"
      title={translate("Disconnect from AI Studio")}
      subTitle={<Text>{translate("Are you sure you want to proceed?")}</Text>}
    ></AppDialog>
  );
};

export default DisconnectDialog;
