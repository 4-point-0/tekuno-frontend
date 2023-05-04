import { Button, Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { useAuthControllerForgotPassword } from "@/services/api/admin/adminComponents";
import { notifications } from "@/utils/notifications";
import { authValidatons } from "@/utils/validations";

export const SendResetPassword = () => {
  const forgotPassword = useAuthControllerForgotPassword({});

  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: authValidatons.email,
    },
  });

  const handleSubmit = async ({ email }: { email: string }) => {
    try {
      notifications.create({});

      await forgotPassword.mutateAsync({
        body: {
          email,
        },
      });

      notifications.success({ title: "E-mail sent!" });
    } catch {
      notifications.error({});
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Stack mb="md" spacing="xs">
        <Text size="lg" weight={500}>
          Reset your password
        </Text>

        <Text c="dimmed">
          A link will be sent to your email address to reset your password.
        </Text>
      </Stack>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            name="email"
            autoComplete="email"
            placeholder="hello@tekuno.app"
            radius="md"
            {...form.getInputProps("email")}
          />
        </Stack>

        <Group position="right" mt="xl">
          <Button type="submit" radius="xl" disabled={forgotPassword.isLoading}>
            Send
          </Button>
        </Group>
      </form>
    </Paper>
  );
};
