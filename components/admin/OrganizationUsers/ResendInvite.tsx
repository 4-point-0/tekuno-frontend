import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Send } from "tabler-icons-react";

import { useOrganizationControllerResendInvite } from "@/services/api/admin/adminComponents";
import { UserDto } from "@/services/api/admin/adminSchemas";
import { notifications } from "@/utils/notifications";

interface ResendInviteProps {
  user: UserDto;
}

export const ResendInvite = ({ user }: ResendInviteProps) => {
  const resend = useOrganizationControllerResendInvite({});

  const handleResend = async () => {
    try {
      notifications.create({ title: `Removing ${user.email}` });

      await resend.mutateAsync({
        pathParams: {
          email: user.email,
        },
      });

      notifications.success({ title: `Removed ${user.email}` });
    } catch (error) {
      console.log(error);
      notifications.error({});
    }
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: `Resend invite to ${user.email}?`,
      confirmProps: {
        variant: "light",
        color: "blue",
      },
      labels: { confirm: "Resend", cancel: "Cancel" },
      onConfirm: () => handleResend(),
    });

  return (
    <Tooltip label="Resend invite">
      <ActionIcon color="blue">
        <Send size={14} onClick={openModal} />
      </ActionIcon>
    </Tooltip>
  );
};
