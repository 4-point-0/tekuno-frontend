import { ActionIcon, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Trash } from "tabler-icons-react";

import { useOrganizationControllerRemove } from "@/services/api/admin/adminComponents";
import { UserDto } from "@/services/api/admin/adminSchemas";
import { notifications } from "@/utils/notifications";

interface DeleteUserProps {
  user: UserDto;
  onRemove(): void;
}

export const DeleteUser = ({ user, onRemove }: DeleteUserProps) => {
  const remove = useOrganizationControllerRemove({});

  const handleRemove = async () => {
    try {
      notifications.create({ title: `Removing ${user.email}` });

      await remove.mutateAsync({
        pathParams: {
          userId: user.id,
        },
      });

      notifications.success({ title: `Removed ${user.email}` });
      onRemove();
    } catch (error) {
      console.log(error);
      notifications.error({});
    }
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: `Remove user ${user.email}?`,
      children: (
        <Text size="sm">User will lose access to your organization.</Text>
      ),
      confirmProps: {
        color: "red",
      },
      labels: { confirm: "Remove", cancel: "Cancel" },
      onConfirm: () => handleRemove(),
    });

  return (
    <Tooltip label="Remove user">
      <ActionIcon color="red">
        <Trash size={14} onClick={openModal} />
      </ActionIcon>
    </Tooltip>
  );
};
