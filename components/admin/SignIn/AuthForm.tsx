import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { useRouter } from "next/router";

import { GoogleButton } from "./SocialButtons";

interface AuthFormProps extends PaperProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
}

interface AuthFormValues {
  email: string;
  password: string;
  password_confirm: string;
}

export function AuthForm({ providers, ...props }: AuthFormProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const router = useRouter();

  const form = useForm<AuthFormValues>({
    initialValues: {
      email: "",
      password: "",
      password_confirm: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8
          ? "Password should include at least 8 characters"
          : null,
      password_confirm: (value, values) => {
        if (type === "login") {
          return null;
        }

        return value === values.password ? null : "Passwords do not match";
      },
    },
  });

  const handleSignIn = (provider?: ClientSafeProvider) => {
    return () =>
      signIn(provider?.id, {
        redirect: true,
        callbackUrl: router.query.callbackUrl as string,
      });
  };

  const handleSubmit = (values: AuthFormValues) => {
    signIn("credentials", {
      ...values,
      type,
      redirect: true,
      callbackUrl: router.query.callbackUrl as string,
    });
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" weight={500}>
        Welcome to Tekuno, {type} with
      </Text>

      {providers?.google && (
        <>
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl" onClick={handleSignIn(providers.google)}>
              Google
            </GoogleButton>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />
        </>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@tekuno.app"
            radius="md"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps("password")}
          />

          {type === "register" && (
            <PasswordInput
              required
              label="Confirm password"
              placeholder="Confirm password"
              radius="md"
              {...form.getInputProps("password_confirm")}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
