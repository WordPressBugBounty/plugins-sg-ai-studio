import { Dropdown } from '@siteground/styleguide';
import { translate } from 'i18n-calypso';

export const FormDropdown = ({ input, meta, ...props }) => {
  let status;
  let error;

  if (meta.error && (meta.touched || meta.active)) {
    status = 'error';
    error = translate(meta.error);
  }

  if (meta.submitError && !meta.modifiedSinceLastSubmit) {
    status = 'error';
    error = translate(meta.submitError);
  }

  return (
    <Dropdown
      size="medium"
      name={input.name}
      value={input.value}
      onChange={input.onChange}
      {...input}
      {...props}
      state={status}
      validationMessage={error}
      data-e2e={`${input.name}-dropdown`}
    />
  );
};
