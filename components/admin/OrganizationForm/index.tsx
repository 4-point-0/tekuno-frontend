import { Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import { Check, Pencil } from "tabler-icons-react";

import { Field } from "@/components/form/Field";
import {
  useOrganizationControllerCreate,
  useOrganizationControllerUpdate,
} from "@/services/api/admin/adminComponents";
import { OrganizationDto } from "@/services/api/admin/adminSchemas";
import { notifications } from "@/utils/notifications";

interface OrganizationFormProps {
  organization?: OrganizationDto;
}

interface OrganizationFormValues {
  name: string;
}

export const OrganizationForm = ({ organization }: OrganizationFormProps) => {
  const createOrganization = useOrganizationControllerCreate({});
  const updateOrganization = useOrganizationControllerUpdate({});
  const isUpdate = Boolean(organization);

  const router = useRouter();

  const form = useForm<OrganizationFormValues>({
    initialValues: {
      name: organization?.name || "",
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name is too short" : null),
    },
  });

  const create = async ({ name }: OrganizationFormValues) => {
    try {
      notifications.create({ message: "Creating new organizatoon" });

      await createOrganization.mutateAsync({
        body: { name },
      });

      notifications.success({ message: "New organization created!" });

      router.push("/admin/user");
    } catch {
      notifications.error({});
    }
  };

  const edit = async ({ name }: OrganizationFormValues) => {
    try {
      notifications.create({ message: "Creating new organizatoon" });

      await updateOrganization.mutateAsync({
        body: { name },
        pathParams: {
          id: organization?.id as string,
        },
      });

      notifications.success({ message: "New organization created!" });
    } catch {
      notifications.error({});
    }
  };

  const handleSubmit = async (values: OrganizationFormValues) => {
    if (isUpdate) {
      edit(values);
    } else {
      create(values);
    }
  };

  return (
    <Stack>
      <Title order={2}>
        {isUpdate ? "Edit your organization" : "Create new organization"}
      </Title>

      {!isUpdate && (
        <Text c="dimmed">
          {`Creating an organization is required before creating and launching
          campaigns. You'll be able to edit the organization and invite new
          users to join you.`}
        </Text>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Field withAsterisk label="Name">
            <TextInput
              mt="xs"
              placeholder="Your organization name"
              {...form.getInputProps("name")}
            />
          </Field>
          <Group position="right">
            <Button
              color="dark"
              type="submit"
              disabled={createOrganization.isLoading}
              leftIcon={isUpdate ? <Pencil size={14} /> : <Check size={14} />}
            >
              {isUpdate ? "Edit" : "Create"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};
