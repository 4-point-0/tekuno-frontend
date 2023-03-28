import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Send } from "tabler-icons-react";

import { IndigoButton } from "@/components/core/IndigoButton";
import { useOrganizationControllerInvite } from "@/services/api/admin/adminComponents";
import { notifications } from "@/utils/notifications";

interface InviteFormProps {
  onInvite(): void;
}

interface InviteFormValues {
  email: string;
  role: "Admin" | "Member";
}

const InviteForm = ({ onInvite }: InviteFormProps) => {
  const invite = useOrganizationControllerInvite({});

  const form = useForm<InviteFormValues>({
    initialValues: {
      email: "",
      role: "Member",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async ({ email, role }: InviteFormValues) => {
    try {
      notifications.create({ title: `Inviting ${email}` });

      await invite.mutateAsync({
        body: { role },
        pathParams: { email },
      });

      notifications.success({ title: `Invited ${email}` });
      form.reset();
      onInvite();
    } catch (error) {
      console.error(error);

      notifications.error({});
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          required
          label="Email"
          placeholder="hello@tekuno.app"
          radius="md"
          {...form.getInputProps("email")}
        />

        <Select
          label="Role"
          data={[
            { value: "Admin", label: "Admin" },
            { value: "Member", label: "Member" },
          ]}
          {...form.getInputProps("role")}
        />
        <Group position="right">
          <Button type="submit" disabled={invite.isLoading}>
            Invite
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

interface InviteUserProps {
  onInvite(): void;
}

export const InviteUser = ({ onInvite }: InviteUserProps) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Invite users to organization"
      >
        <InviteForm onInvite={onInvite} />
      </Modal>
      <IndigoButton onClick={open} leftIcon={<Send size={14} />}>
        Invite new
      </IndigoButton>
    </>
  );
};
