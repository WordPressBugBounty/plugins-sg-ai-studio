import { Switch } from '@siteground/styleguide/lib';
import { translate } from 'i18n-calypso';

export const FormSwitch = (props) => {
  const { input, meta, ...rest } = props;
  const touchedOrActive = meta.touched || meta.active;
  const touchedOrHasValue = meta.touched || Boolean(input.value);

  let status;
  let error;

  if (meta.error && touchedOrActive && touchedOrHasValue) {
    status = 'error';
    error = translate(meta.error);
  }

  if (meta.submitError && !meta.modifiedSinceLastSubmit) {
    status = 'error';
    error = translate(meta.submitError);
  }

  return (
    <Switch
      size="medium"
      state={status}
      validationMessage={error}
      data-e2e={input.name}
      name={input.name}
      value={input.value}
      onChange={input.onChange}
      {...input}
      {...rest}
    />
  );
};
