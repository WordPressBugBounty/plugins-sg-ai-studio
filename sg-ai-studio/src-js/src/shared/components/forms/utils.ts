const getErrors = (error: any) => {
  const errors = {};

  if (error?.fieldName && error?.message) {
    errors[error.fieldName] = error.message;
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
};

export const formSubmit =
  (submit: (values: any) => Promise<void>) =>
  async (values): Promise<any> => {
    try {
      const res = submit(values);

      if (res['unwrap']) {
        await res['unwrap']();
      } else {
        await res;
      }
    } catch (err) {
      return getErrors(err);
    }
  };
