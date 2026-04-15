import createDecorator from './decorators/focus-decorator';
import { formSubmit } from './utils';
import { KEYS } from '@siteground/styleguide/lib/utils';
import * as React from 'react';
import { Form } from 'react-final-form';

type Props = {
  id: string;
  children: React.ReactNode;
  formRef?: React.MutableRefObject<unknown>;
  onSubmit?: (values: any) => Promise<void>;
  destroyOnUnregister?: boolean;
};

const focusOnErrors = createDecorator();

export const FormWrapper = ({ id, children, onSubmit, formRef, destroyOnUnregister = true }: Props) => {
  const [hasSingleField, setHasSingleField] = React.useState(false);

  const handleKeyDown = (event, form) => {
    if (hasSingleField && event.key === KEYS.ENTER && !event.shiftKey) {
      form.submit();
    }
  };

  return (
    <Form destroyOnUnregister={destroyOnUnregister} onSubmit={onSubmit ? formSubmit(onSubmit) : () => {}} decorators={[focusOnErrors]}>
      {({ handleSubmit, form }) => {
        if (formRef) {
          formRef.current = form;
        }

        React.useEffect(() => {
          const handleFormChange = () => {
            const fieldCount = Object.keys(form.getState().values || {}).length;
            setHasSingleField(fieldCount === 1);
          };

          const unsubscribe = form.subscribe(handleFormChange, { values: true });
          return unsubscribe;
        }, [form]);

        return (
          <form id={id} onSubmit={handleSubmit} onKeyDown={(event) => handleKeyDown(event, form)}>
            {children}
          </form>
        );
      }}
    </Form>
  );
};
