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

type MutableStatus = "Started" | "Paused" | "Ended";

interface IStatusTexts {
  confirm: {
    title: string;
    description: string;
    confirm: string;
  };
}

const getStatusTexts = (
  status?: CampaignDto["status"]
): Record<MutableStatus, IStatusTexts> => {
  return {
    Started: {
      confirm: {
        title: status === "Created" ? "Start the POD?" : "Resume the POD?",
        description:
          status === "Created"
            ? "Once started, it can't be edited."
            : "POD will be visible to the users again.",
        confirm: status === "Created" ? "Start" : "Resume",
      },
    },
    Paused: {
      confirm: {
        title: "Pause the POD?",
        description: "Once paused, it won't be visible to the users.",
        confirm: "Pause",
      },
    },
    Ended: {
      confirm: {
        title: "End the POD?",
        description: "Once ended, it won't visible and can't be resumed.",
        confirm: "End",
      },
    },
  };
};

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

  const updateStatus = async (newStatus: MutableStatus) => {
    notifications.create({ title: "Changing campaign status" });

    try {
      await changeStatus.mutateAsync({
        pathParams: {
          id: router.query.id as string,
        },
        body: {
          status: newStatus,
        },
      });

      refetch();
      refetchAll();
      notifications.success({ title: "Campaign status changed" });
    } catch {
      notifications.error({ title: "Failed to update status" });
    }
  };

  const handleStatusChange = (newStatus: MutableStatus) => {
    const {
      confirm: { title, confirm, description },
    } = getStatusTexts(status)[newStatus];

    return async () => {
      openConfirmModal({
        title,
        children: description,
        labels: { confirm, cancel: "Cancel" },
        confirmProps: {
          color: "pink",
        },
        onConfirm: () => updateStatus(newStatus),
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
      End POD
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
      {status === "Created" ? "Start" : "Resume"}
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
