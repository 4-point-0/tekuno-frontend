import { Button, PasswordInput, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";

import { Field } from "@/components/form/Field";
import { UserDto } from "@/services/api/admin/adminSchemas";
import { notifications } from "@/utils/notifications";
import { authValidatons } from "@/utils/validations";

import { useAuthControllerChangePassword } from "../../../services/api/admin/adminComponents";

interface OrganizationDetailsProps {
  user: UserDto;
}

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  passwordConfirm: string;
}

export const ProfileForm = ({ user }: OrganizationDetailsProps) => {
  console.log("user", user);

  const changePassword = useAuthControllerChangePassword();

  const form = useForm<ChangePasswordFormValues>({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
    },
    validate: {
      newPassword: authValidatons.strongPassword,
      passwordConfirm: (value, values) => {
        return authValidatons.passwordConfirm(value, values.newPassword);
      },
    },
  });

  const handleSubmit = async ({
    oldPassword,
    newPassword,
  }: ChangePasswordFormValues) => {
    try {
      notifications.create({});

      await changePassword.mutateAsync({
        body: {
          email: user.email,
          old_password: oldPassword,
          new_password: newPassword,
        },
      });

      notifications.success({ title: "Password Changed" });
      form.reset();
    } catch (error) {
      notifications.error({});
    }
  };

  return (
    <Stack>
      <Title order={2}>Edit profile</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Field>
            <PasswordInput
              mt="xs"
              placeholder="Your old password"
              {...form.getInputProps("oldPassword")}
            />
          </Field>
          <Field>
            <PasswordInput
              mt="xs"
              placeholder="Input your new password"
              {...form.getInputProps("newPassword")}
            />
          </Field>
          <Field>
            <PasswordInput
              mt="xs"
              placeholder="Repeat your new password"
              {...form.getInputProps("passwordConfirm")}
            />
          </Field>
        </Stack>
        <Button
          type="submit"
          radius="xl"
          my="xl"
          disabled={changePassword.isLoading}
        >
          Change password
        </Button>
        <Link href={`/admin/user`}>
          <Button type="submit" radius="xl" mt="xs" ml="xs">
            Back to profile
          </Button>
        </Link>
      </form>
    </Stack>
  );
};
