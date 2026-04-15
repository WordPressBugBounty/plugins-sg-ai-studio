import { Text } from "@siteground/styleguide";
import * as React from "react";
import FormDialog from "../forms/form-dialog";
import { FieldWrapper } from "../forms/field-wrapper";
import { DIALOG_IDS } from "@/shared/constants/dialogs";
import { FORM_IDS } from "@/shared/constants/forms";
import { translate } from "i18n-calypso";
import { composeValidators, notBlank } from "@/shared/utils/form-validations";
import { DialogManager } from "@siteground/styleguide/lib/composite/dialogs";
import { FormInput } from "../forms/form-input";
import { ConnectRequest, useConnectMutation } from "@/store/api/wp-api";
import { genericNotifications } from "../notifications-container/generic-notifications";
import { broadcast } from "@/shared/utils/event-broadcast";

const AddTokenDialog: React.FC = () => {
  const [connect, { isLoading }] = useConnectMutation();

  const handleSubmit = async (values: ConnectRequest) => {
    return connect(values)
      .unwrap()
      .then((data) => {
        if (data.success) {
          genericNotifications.addNotification({
            type: "success",
            message: data.message,
          });
          broadcast("connection_status_changed", { type: "connected" });
          DialogManager.close(DIALOG_IDS.ADD_TOKEN_DIALOG);
        }
      })
      .catch((error) => {
        if (error?.status === 400 && error?.data?.message) {
          throw { fieldName: "data", message: error.data.message };
        }

        genericNotifications.addNotification({
          type: "error",
          message: translate("Something went wrong. Please try again later."),
        });

        DialogManager.close(DIALOG_IDS.ADD_TOKEN_DIALOG);
      });
  };

  return (
    <FormDialog
      id={DIALOG_IDS.ADD_TOKEN_DIALOG}
      formId={FORM_IDS.ADD_TOKEN}
      isLoadingAPIs={[isLoading]}
      onSubmit={handleSubmit}
      submitLabel={translate("Confirm")}
      state="active"
      icon="edit"
      size="large"
      title={translate("Add Token")}
      subTitle={<Text>{translate("Enable the connection to AI Studio by pasting your secret connection token.")}</Text>}
    >
      <FieldWrapper
        name="data"
        label={translate("Secret Connection Token")}
        component={FormInput}
        validate={composeValidators(notBlank(translate("Token can not be empty.")))}
      />
    </FormDialog>
  );
};

export default AddTokenDialog;
