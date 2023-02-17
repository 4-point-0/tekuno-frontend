import { Badge, Button } from "@mantine/core";
import { useIsMutating } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";
import { PlayerPause, PlayerPlay, PlayerStop } from "tabler-icons-react";
import { openConfirmModal } from "@mantine/modals";

import {
  useCampaignControllerFindAll,
  useCampaignControllerFindOne,
  useCampaignControllerPause,
} from "@/services/api/admin/adminComponents";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { notifications } from "@/utils/notifications";

interface IStatusButtonsProps {
  status?: CampaignDto["status"];
}

export const StatusButtons: React.FC<IStatusButtonsProps> = ({ status }) => {
  const router = useRouter();
  const changeStatus = useCampaignControllerPause({});
  const isMutating = useIsMutating();

  const { refetch } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });
  const { refetch: refetchAll } = useCampaignControllerFindAll({});

  const disabled = isMutating > 0;

  const updateStatus = async (status: "Started" | "Paused" | "Ended") => {
    notifications.create({ title: "Changing campaign status" });

    try {
      await changeStatus.mutateAsync({
        pathParams: {
          id: router.query.id as string,
        },
        body: {
          status,
        },
      });

      refetch();
      refetchAll();
      notifications.success({ title: "Campaign status changed" });
    } catch {
      notifications.error({ title: "Failed to update status" });
    }
  };

  const handleStatusChange = (status: "Started" | "Paused" | "Ended") => {
    return async () => {
      openConfirmModal({
        title: "Change the campaign status?",
        labels: { confirm: "Confirm", cancel: "Cancel" },
        confirmProps: {
          color: "pink",
        },
        onConfirm: () => updateStatus(status),
      });
    };
  };

  const EndButton = (
    <Button
      color="pink"
      leftIcon={<PlayerStop size={14} />}
      onClick={handleStatusChange("Ended")}
      disabled={disabled}
    >
      End campaign
    </Button>
  );

  const StartButton = (
    <Button
      color="pink"
      variant="light"
      leftIcon={<PlayerPlay size={14} />}
      onClick={handleStatusChange("Started")}
      disabled={disabled}
    >
      Start
    </Button>
  );

  const PauseButton = (
    <Button
      color="pink"
      variant="light"
      leftIcon={<PlayerPause size={14} />}
      onClick={handleStatusChange("Paused")}
      disabled={disabled}
    >
      Pause
    </Button>
  );

  if (status === "Created") {
    return <>{StartButton}</>;
  }

  if (status === "Started") {
    return (
      <>
        {PauseButton}
        {EndButton}
      </>
    );
  }

  if (status === "Paused") {
    return (
      <>
        {StartButton}
        {EndButton}
      </>
    );
  }

  if (status === "Ended") {
    return (
      <Badge color="dark" size="xl">
        {status}
      </Badge>
    );
  }

  return null;
};
