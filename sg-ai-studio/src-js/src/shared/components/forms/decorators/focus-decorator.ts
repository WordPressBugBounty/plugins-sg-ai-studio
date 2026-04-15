import { getIn, Decorator, FormApi } from 'final-form';

type FocusableInput = { name: string; focus: () => void };
type GetInputs = () => FocusableInput[];
type FindInput = (inputs: FocusableInput[], obj: Record<string, unknown>) => FocusableInput | null | undefined;
type Errors = { errors?: Record<string, unknown>; submitErrors?: Record<string, unknown> };

const noop = () => {};

const isFocusableInput = (element: any) => !!(element && typeof element.focus === 'function');

const findCurrentInput: FindInput = (inputs: FocusableInput[], errors: Record<string, unknown>) =>
  inputs.find((input) => input.name && getIn(errors, input.name)) || null;

const getAllInputs: GetInputs = () => {
  if (typeof document === 'undefined') {
    return [];
  }
  return Array.prototype.slice
    .call(document.forms)
    .reduce((accumulator, form) => accumulator.concat(Array.prototype.slice.call(form).filter(isFocusableInput)), []);
};

const createDecorator =
  (getInputs: GetInputs = getAllInputs, findInput: FindInput = findCurrentInput): Decorator =>
  (form: FormApi) => {
    const focusOnFirstError = (errors: Errors | undefined) => {
      if (!errors) return;
      const firstInput = findInput(getInputs(), errors);
      if (firstInput) {
        firstInput.focus();
      }
    };

    const originalSubmit = form.submit;

    let state: Errors = {};
    const unsubscribe = form.subscribe(
      (nextState) => {
        state = nextState;
      },
      { errors: true, submitErrors: true }
    );

    const afterSubmit = () => {
      const { errors, submitErrors } = state;
      if (Object.keys(errors || {}).length) {
        focusOnFirstError(errors);
      } else if (Object.keys(submitErrors || {}).length) {
        focusOnFirstError(submitErrors);
      }
    };

    form.submit = () => {
      const result = originalSubmit.call(form);
      if (result && typeof result.then === 'function') {
        result.then(afterSubmit, noop);
      } else {
        afterSubmit();
      }
      return result;
    };

    return () => {
      unsubscribe();
      form.submit = originalSubmit;
    };
  };

export default createDecorator;
