import { Button } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { useIsMutating } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { PlayerPause, PlayerPlay, PlayerStop } from "tabler-icons-react";

import {
  useCampaignControllerFindAll,
  useCampaignControllerFindOne,
  useCampaignControllerPause,
} from "@/services/api/admin/adminComponents";
import { CampaignDto } from "@/services/api/admin/adminSchemas";
import { hasEnded } from "@/utils/campaign";
import { notifications } from "@/utils/notifications";

interface StatusButtonsProps {
  campaign: CampaignDto;
}

type MutableStatus = "Started" | "Paused" | "Ended";

interface StatusTexts {
  confirm: {
    title: string;
    description: string;
    confirm: string;
  };
}

const getStatusTexts = (
  status?: CampaignDto["status"]
): Record<MutableStatus, StatusTexts> => {
  return {
    Started: {
      confirm: {
        title: status === "Created" ? "Start the POD?" : "Resume the POD?",
        description:
          status === "Created"
            ? "Once started, it can't be edited."
            : "User will be able to claims NFTs again.",
        confirm: status === "Created" ? "Start" : "Resume",
      },
    },
    Paused: {
      confirm: {
        title: "Pause the POD?",
        description: "Once paused, users won't be able to claim NFTs.",
        confirm: "Pause",
      },
    },
    Ended: {
      confirm: {
        title: "End the POD?",
        description: "Once ended, users won't be able to claim NFTs.",
        confirm: "End",
      },
    },
  };
};

export const StatusButtons = ({ campaign }: StatusButtonsProps) => {
  const router = useRouter();
  const changeStatus = useCampaignControllerPause({});
  const isMutating = useIsMutating();

  const { status } = campaign;

  const { refetch } = useCampaignControllerFindOne({
    pathParams: {
      id: router.query.id as string,
    },
  });
  const { refetch: refetchAll } = useCampaignControllerFindAll({});

  const disabled = isMutating > 0;
  const isEnded = hasEnded(campaign);

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

  if (isEnded) {
    return null;
  }

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

  return null;
};
