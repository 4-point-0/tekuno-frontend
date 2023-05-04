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
import Link from "next/link";
import { useRouter } from "next/router";

import { authValidatons } from "@/utils/validations";

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

const REGISTRATION_ENABLED = false;

export function AuthForm({ providers, ...props }: AuthFormProps) {
  const router = useRouter();

  const inviteCode = router.query.code;
  const callbackUrl = (router.query.callbackUrl as string) || "/admin";

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
      email: authValidatons.email,
      password: type === "register" ? authValidatons.strongPassword : undefined,
      passwordConfirm: (value, values) => {
        if (type === "login") {
          return null;
        }

        return authValidatons.passwordConfirm(value, values.password);
      },
    },
  });

  const handleSignIn = (provider?: ClientSafeProvider) => {
    return () =>
      signIn(provider?.id, {
        callbackUrl,
        redirect: true,
      });
  };

  const handleSubmit = (values: AuthFormValues) => {
    signIn("credentials", {
      ...values,
      inviteCode: inviteCode,
      type,
      callbackUrl,
      redirect: true,
    });
  };

  const showProviders = Boolean(!inviteCode && providers?.google);
  const showToggle = REGISTRATION_ENABLED && !inviteCode;

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

          {type === "login" && (
            <Link
              href="/admin/auth/reset-password"
              style={{ textDecoration: "none" }}
            >
              <Text color="dimmed" size="xs">
                Forgot your password?
              </Text>
            </Link>
          )}

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

        <Group position="right" mt="xl">
          {showToggle && (
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
