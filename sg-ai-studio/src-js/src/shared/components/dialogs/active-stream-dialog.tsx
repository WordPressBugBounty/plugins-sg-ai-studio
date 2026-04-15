import { Text } from "@siteground/styleguide";
import { DialogManager } from "@siteground/styleguide/lib/composite/dialogs";
import * as React from "react";
import { AppDialog } from "./app-dialog";
import { DIALOG_IDS } from "@/shared/constants/dialogs";
import { translate } from "i18n-calypso";
import { cancelReply } from "@/store/thunks/chat-thunks";
import { navigationController } from "@/chat/utils/navigation-controller";
import { useAppDispatch } from "@/store/hooks";

const ActiveStreamDialog: React.FC = () => {
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    dispatch(cancelReply());

    DialogManager.close(DIALOG_IDS.ACTIVE_STREAM_DIALOG);

    navigationController.executePendingNavigation();
  };

  return (
    <AppDialog
      id={DIALOG_IDS.ACTIVE_STREAM_DIALOG}
      onSubmit={handleSubmit}
      submitLabel={translate("Leave Anyway")}
      state="warning"
      icon="warning"
      title={translate("Response still in progress")}
      subTitle={
        <Text>
          {translate("Leaving now will stop the response from finishing. You may lose the rest of the answer.")}
        </Text>
      }
    >
      {translate("Are you sure you want to proceed?")}
    </AppDialog>
  );
};

export default ActiveStreamDialog;
