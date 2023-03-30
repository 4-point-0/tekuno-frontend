import { Container } from "@mantine/core";
import { useRouter } from "next/router";

import { ResetPasswordForm } from "@/components/admin/SignIn/ResetPasswordForm";
import { SendResetPassword } from "@/components/admin/SignIn/SendResetPassword";
import { redirectIfActiveSession } from "@/utils/auth";

const ResetPassword = () => {
  const router = useRouter();

  const resetToken = router.query.code as string;

  return (
    <Container size="xs">
      {resetToken ? (
        <ResetPasswordForm resetToken={resetToken} />
      ) : (
        <SendResetPassword />
      )}
    </Container>
  );
};

export const getServerSideProps = redirectIfActiveSession;

export default ResetPassword;
