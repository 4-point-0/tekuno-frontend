import {
  Box,
  Button,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";

import { useAuthControllerResetPassword } from "@/services/api/admin/adminComponents";
import { notifications } from "@/utils/notifications";
import { authValidatons } from "@/utils/validations";

interface ResetPasswordFormProps extends PaperProps {
  resetToken: string;
}

interface ResetPasswordFormValues {
  email: string;
  password: string;
  passwordConfirm: string;
}

export function ResetPasswordForm({
  resetToken,
  ...props
}: ResetPasswordFormProps) {
  const router = useRouter();

  const resetPassword = useAuthControllerResetPassword({});

  const form = useForm<ResetPasswordFormValues>({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },

    validate: {
      email: authValidatons.email,
      password: authValidatons.strongPassword,
      passwordConfirm: (value, values) => {
        return authValidatons.passwordConfirm(value, values.password);
      },
    },
  });

  const handleSubmit = async ({
    email,
    password,
    passwordConfirm,
  }: ResetPasswordFormValues) => {
    try {
      notifications.create({});

      await resetPassword.mutateAsync({
        body: {
          email,
          token: resetToken,
          password,
          password_confirm: passwordConfirm,
        },
      });

      notifications.success({ title: "Password reset" });
      router.push("/admin/auth/signin");
    } catch (error) {
      console.error(error);
      notifications.error({});
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Box mb="md">
        <Text size="lg" weight={500}>
          Reset your password
        </Text>
      </Box>

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

          <PasswordInput
            required
            name="password"
            autoComplete="new-password"
            label="Password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            required
            name="confirm-password"
            autoComplete="new-password"
            label="Confirm password"
            placeholder="Confirm password"
            radius="md"
            {...form.getInputProps("passwordConfirm")}
          />
        </Stack>

        <Group position="right" mt="xl">
          <Button type="submit" radius="xl" disabled={resetPassword.isLoading}>
            Reset
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
