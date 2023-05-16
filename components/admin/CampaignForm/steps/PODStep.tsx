import { Button, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { Fragment } from "react";
import { CirclePlus, Trash } from "tabler-icons-react";

import { NFT_INITIAL_VALUE, useFormContext } from "../FormContext";
import { NFTForm } from "../NFTForm";

export const PODStep = ({ isReward }: any) => {
  const form = useFormContext();

  const { poap, collectibles, reward } = form.values;

  const handleAddNew = () => {
    form.setFieldValue("collectibles", [...collectibles, NFT_INITIAL_VALUE]);
  };

  const handleRemove = (index: number) => {
    return () => {
      const remove = () => {
        let value = collectibles;
        collectibles.splice(index, 1);
        form.setFieldValue("collectibles", value);
      };

      if (form.isDirty(`collectibles.${index}`)) {
        openConfirmModal({
          title: "Remove POD?",
          children: <Text>All of the inputed data will be lost.</Text>,
          labels: { confirm: "Remove", cancel: "Cancel" },
          confirmProps: {
            variant: "light",
            color: "red",
          },
          onConfirm: remove,
        });
      } else {
        remove();
      }
    };
  };

  if (isReward) {
    return (
      <>
        {poap && (
          <Stack>
            <NFTForm formKey="poap" withAttributes />
          </Stack>
        )}

        {reward && (
          <Stack>
            <Fragment>
              <NFTForm formKey={`reward`} withAttributes isReward />
            </Fragment>
          </Stack>
        )}
      </>
    );
  }

  return (
    <>
      {poap && (
        <Stack>
          <NFTForm formKey="poap" withAttributes />
        </Stack>
      )}

      {Boolean(collectibles.length) && (
        <Stack>
          {collectibles.map((_, i) => (
            <Fragment key={i}>
              {i !== 0 && <Divider my="xl" />}

              {collectibles.length > 1 && <Title order={5}>{i + 1}.</Title>}

              <NFTForm formKey={`collectibles.${i}`} withAttributes />

              {collectibles.length > 1 && (
                <Group position="right">
                  <Button
                    color="red"
                    variant="light"
                    leftIcon={<Trash size={14} />}
                    onClick={handleRemove(i)}
                  >
                    Remove
                  </Button>
                </Group>
              )}
            </Fragment>
          ))}

          <Group>
            <Button
              onClick={handleAddNew}
              color="dark"
              leftIcon={<CirclePlus size={14} />}
            >
              Add New POD to collection
            </Button>
          </Group>
        </Stack>
      )}
    </>
  );
};
