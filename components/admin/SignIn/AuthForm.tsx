import {
  Anchor,
  Box,
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
  passwordConfirm: string;
}

export function AuthForm({ providers, ...props }: AuthFormProps) {
  const router = useRouter();

  const inviteCode = router.query.code;

  const [type, toggle] = useToggle(
    inviteCode ? ["register"] : ["login", "register"]
  );

  const form = useForm<AuthFormValues>({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length < 8
          ? "Password should include at least 8 characters"
          : null,
      passwordConfirm: (value, values) => {
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
      inviteCode: inviteCode,
      type,
      redirect: true,
      callbackUrl: router.query.callbackUrl as string,
    });
  };

  const showProviders = Boolean(!inviteCode && providers?.google);

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Box mb="md">
        <Text size="lg" weight={500}>
          Welcome to Tekuno, {type} with
        </Text>
      </Box>

      {showProviders && (
        <>
          <Group grow mb="md">
            <GoogleButton radius="xl" onClick={handleSignIn(providers?.google)}>
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
            name="email"
            autoComplete="email"
            placeholder="hello@tekuno.app"
            radius="md"
            {...form.getInputProps("email")}
          />

          <PasswordInput
            required
            name="password"
            autoComplete={
              type === "login" ? "current-password" : "new-password"
            }
            label="Password"
            placeholder="Your password"
            radius="md"
            {...form.getInputProps("password")}
          />

          {type === "register" && (
            <PasswordInput
              required
              name="confirm-password"
              autoComplete="new-password"
              label="Confirm password"
              placeholder="Confirm password"
              radius="md"
              {...form.getInputProps("passwordConfirm")}
            />
          )}
        </Stack>

        <Group position={inviteCode ? "right" : "apart"} mt="xl">
          {!inviteCode && (
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
          )}
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
