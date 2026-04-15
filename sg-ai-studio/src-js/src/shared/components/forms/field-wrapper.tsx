import React from 'react';
import { Field, FieldProps } from 'react-final-form';

export const FieldWrapper: React.FC<FieldProps<any, any>> = (props) => {
  return (
    <Field
      format={(value) => {
        return typeof value === 'string' ? value?.trim() : value;
      }}
      formatOnBlur={true}
      {...props}
    />
  );
};
