import { PartialLoader } from "../partial-loader/partial-loader";
import { Button } from "@siteground/styleguide";
import { DialogProps } from "@siteground/styleguide/lib/components/types";
import DialogManager from "@siteground/styleguide/lib/composite/dialogs/dialog-manager";
import ManagedDialog from "@siteground/styleguide/lib/composite/dialogs/managed-dialog";
import { translate } from "i18n-calypso";
import React from "react";

export interface AppDialogProps extends DialogProps {
  id: string;
  isLoadingAPIs?: boolean[];
  isSuccessAPI?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
  intermediateButtons?: React.ReactNode;
  isSubmitDisabled?: boolean;
  isCancelDisabled?: boolean;
  onSubmit: () => void;
}

export const AppDialog: React.FC<AppDialogProps> = ({
  id,
  icon,
  state,
  onSubmit,
  isSuccessAPI,
  isLoadingAPIs,
  cancelLabel,
  submitLabel,
  intermediateButtons,
  isSubmitDisabled,
  isCancelDisabled,
  children,
  ...dialogProps
}) => {
  const translatedCancel = cancelLabel ?? translate("cancel");
  const translatedSubmit = submitLabel ?? translate("save");

  React.useEffect(() => {
    if (isSuccessAPI) {
      DialogManager.close(id);
    }
  }, [id, isSuccessAPI]);

  return (
    <ManagedDialog
      id={id}
      icon={icon}
      state={state}
      {...dialogProps}
      footer={
        <div>
          <Button onClick={() => DialogManager.close(id)} disabled={isCancelDisabled}>
            {translatedCancel}
          </Button>
          {intermediateButtons}
          <Button color="primary" onClick={onSubmit} disabled={isSubmitDisabled}>
            {translatedSubmit}
          </Button>
        </div>
      }
    >
      <PartialLoader isLoadingAPIs={isLoadingAPIs}>{children}</PartialLoader>
    </ManagedDialog>
  );
};
