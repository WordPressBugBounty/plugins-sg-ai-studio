import { FormWrapper } from "./form-wrapper";
import { KEYS } from "@siteground/styleguide/lib";
import DialogManager from "@siteground/styleguide/lib/composite/dialogs/dialog-manager";
import { FormApi } from "final-form";
import * as React from "react";
import { AppDialog, AppDialogProps } from "../dialogs/app-dialog";

interface FormDialogProps extends Omit<AppDialogProps, "onSubmit"> {
  formId: string;
  children: React.ReactNode;
  onSubmit?: (values: { [key: string]: string }) => Promise<any>;
}

const FormDialog: React.FC<FormDialogProps> = ({ children, formId, onSubmit, ...dialogProps }) => {
  const formRef = React.useRef<FormApi | null>(null);

  React.useEffect(() => {
    const handleEnterKeyPress = (event) => {
      if (!formRef.current) {
        return;
      }
      const isSingleField = Object.keys(formRef.current?.getState().values || {}).length <= 1;

      // TODO: Remove this check with the new dropdown component once it's available.
      // The new component should handle the onKeyDown event and call stopPropagation()
      // to prevent the form from being submitted when the dropdown is open and the Enter key is pressed.

      const isMultipleDropDownOpen = document.querySelector(".sg-multiple-dropdown__opened-state");

      if (event.key === KEYS.ENTER && isSingleField && !isMultipleDropDownOpen) {
        event.preventDefault();
        formRef.current.submit();
      }
    };
    document.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, [formRef]);

  React.useEffect(() => {
    const addVisibilityListener = () => {
      formRef.current = null;
    };

    DialogManager.subscribe(dialogProps.id, addVisibilityListener, "close");

    return () => DialogManager.unsubscribe(dialogProps.id, addVisibilityListener, "close");
  }, [dialogProps.id]);

  return (
    <AppDialog onSubmit={() => formRef.current?.submit()} {...dialogProps}>
      <FormWrapper onSubmit={onSubmit} id={formId} formRef={formRef}>
        {children}
      </FormWrapper>
    </AppDialog>
  );
};

export default FormDialog;
