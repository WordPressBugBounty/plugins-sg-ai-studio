// import { ApiLabelsGetCollectionApiResponse } from '../../api/labels';
import { FieldWrapper } from './field-wrapper';
import { FormDropdown } from './form-dropdown';
import { Chip, Column, Flex, FormLabel, Grid } from '@siteground/styleguide';
import { translate } from 'i18n-calypso';
import React from 'react';

interface FormDropdownWithChipsProps {
  selectedLabels: Record<string, unknown>;
  setSelectedLabels: (setter: (prev: Record<string, unknown>) => Record<string, unknown>) => void;
  labels: Array<{ id: string; name: string }> | undefined;
  maxHeight?: number;
}

export const FormDropdownWithChips: React.FC<FormDropdownWithChipsProps> = ({
  selectedLabels,
  setSelectedLabels,
  labels = [],
  maxHeight
}) => {
  const [labelsFieldName, setLabelsFieldRevision] = React.useState(0);

  const handleChipClosed = React.useCallback(
    (label) => {
      setSelectedLabels((prevSelected) => {
        return Object.entries(prevSelected).reduce((acc, [k, val]) => {
          if (label === k) {
            return acc;
          }

          return { ...acc, [k]: val };
        }, {});
      });
    },
    [setSelectedLabels]
  );

  return (
    <React.Fragment>
      <Grid gap="large" sm="12">
        <Column smSpan="12">
          <FieldWrapper
            key={`field-${labelsFieldName}`} // creates a new Field for every new revision
            destroyOnUnregister
            name="labels"
            component={FormDropdown}
            placeholder={translate('Select or search groups')}
            onChange={(selectedLabelName, selectedLabelData) => {
              setSelectedLabels((prevSelectedLabels) => ({
                ...prevSelectedLabels,
                [selectedLabelName]: selectedLabelData.id
              }));

              // Increments the field revision, which will unregister the field "labels"
              // A fix for not being able to reset Dropdown Placeholder
              setLabelsFieldRevision((prev) => prev + 1);
            }}
            options={labels?.filter((l) => !selectedLabels[l.name])}
            optionValue="name"
            optionLabel="name"
            label={translate('Groups')}
            searchable
            maxHeight={maxHeight}
          />
        </Column>
        {Object.keys(selectedLabels).length > 0 && (
          <Column smSpan="12">
            <FormLabel>{translate('Selected Groups')}</FormLabel>
            <Flex gap="small">
              {Object.keys(selectedLabels).map((label, index) => (
                <Chip key={index} onClose={() => handleChipClosed(label)}>
                  {label}
                </Chip>
              ))}
            </Flex>
          </Column>
        )}
      </Grid>
    </React.Fragment>
  );
};
