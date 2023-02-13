import { IndigoButton } from "@/components/core/IndigoButton";
import { Field } from "@/components/form/Field";
import { ActionIcon, Group, Select, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { CirclePlus, Trash } from "tabler-icons-react";

import {
  ATTRIBUTE_INITIAL_VALUE,
  IFormAttribute,
  useFormContext,
} from "./FormContext";

interface IAttributesFormProps {
  formKey: string;
}

const ATTRIBUTE_KEYS = ["Rarity", "Tier", "Privacy"];

export const AttributesForm: React.FC<IAttributesFormProps> = ({ formKey }) => {
  const [data, setData] = useState(() =>
    ATTRIBUTE_KEYS.map((key) => ({ label: key, value: key }))
  );
  const form = useFormContext();
  const attributes = form.getInputProps(formKey).value
    .attributes as Array<IFormAttribute>;
  const { error } = form.getInputProps(`${formKey}.attributes`);

  const traitTypeValues = attributes.map(
    ({ trait_type }: IFormAttribute) => trait_type
  );
  const unselectedKeys = data.filter(
    ({ value }) => !traitTypeValues.includes(value)
  );
  const hasEmptyAttributes = traitTypeValues.some((key: string) => !key);

  const getData = ({ trait_type }: IFormAttribute) => {
    const data = trait_type
      ? [...unselectedKeys, { label: trait_type, value: trait_type }]
      : unselectedKeys;

    return data.sort(({ label: labelA }, { label: labelB }) =>
      labelA.localeCompare(labelB)
    );
  };

  const handleAddNew = () => {
    form.setFieldValue(`${formKey}.attributes`, [
      ...attributes,
      ATTRIBUTE_INITIAL_VALUE,
    ]);
  };

  const handleRemove = (index: number) => {
    return () => {
      const value = attributes;
      value.splice(index, 1);

      if (value.length === 0) {
        value.push(ATTRIBUTE_INITIAL_VALUE);
      }

      form.setFieldValue(`${formKey}.attributes`, value);
    };
  };

  return (
    <Stack align="flex-start">
      <Field
        label="Attributes"
        description="Add attributes to your POD (Optional)"
        error={error}
      >
        <Stack my="md" align="flex-start">
          {attributes.map((attribute: IFormAttribute, i: number) => (
            <Group key={attribute.trait_type} align="baseline">
              <Select
                searchable
                getCreateLabel={(query) =>
                  traitTypeValues.includes(query) ? "" : `+ Add ${query}`
                }
                creatable
                nothingFound="Write custom attribute"
                placeholder="Select Attribute type"
                onCreate={(query) => {
                  if (traitTypeValues.includes(query)) {
                    return;
                  }

                  const item = { value: query, label: query };
                  setData((current) => [...current, item]);
                  return item;
                }}
                data={getData(attribute)}
                {...form.getInputProps(`${formKey}.attributes.${i}.trait_type`)}
              />

              <TextInput
                max={1}
                placeholder="Set value"
                {...form.getInputProps(`${formKey}.attributes.${i}.value`)}
                disabled={!attribute.trait_type}
              />

              <ActionIcon color="red" onClick={handleRemove(i)}>
                <Trash size={14} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      </Field>
      <IndigoButton
        onClick={handleAddNew}
        leftIcon={<CirclePlus size={14} />}
        disabled={hasEmptyAttributes}
      >
        Add New Attribute
      </IndigoButton>
    </Stack>
  );
};
