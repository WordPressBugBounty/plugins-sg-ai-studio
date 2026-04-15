const NO_ERROR = undefined;

const isValueEmpty = (value) => !value || (typeof value === "string" && value.trim() === "");

const isObjectEmpty = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0;

const isArrayEmpty = (value) => Array.isArray(value) && value.length === 0;

export const composeValidators =
  (...validators) =>
  (value, allValues, meta) =>
    validators.reduce((error, validator) => {
      if (typeof validator === "function") {
        if (allValues && meta) {
          return error || validator(value, allValues, meta);
        } else if (allValues) {
          return error || validator(value, allValues);
        }
        return error || validator(value);
      }
    }, undefined);

export const notBlank =
  (message: string, isDisabled = false) =>
  (value, __allValues, meta) => {
    if (isDisabled) {
      return NO_ERROR;
    }

    if (isValueEmpty(value) || isArrayEmpty(value) || isObjectEmpty(value) || (!value && meta.modified)) {
      return message;
    }

    return NO_ERROR;
  };
