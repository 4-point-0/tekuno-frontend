export enum CampaignType {
  ATTENDANCE = "attendance",
  LOYALTY = "loyalty",
}

interface ICampaignTypeDatum {
  card: {
    title: string;
    image: string;
    perks: Array<string>;
  };
  form: {
    hasRewards: boolean;
  };
}

export const campaignTypeData: Record<CampaignType, ICampaignTypeDatum> = {
  [CampaignType.ATTENDANCE]: {
    card: {
      title: "Attendance",
      image: "/images/attendance.png",
      perks: [
        "Proves on-chain that you’ve attended an event",
        "Can be scanned on site",
        "Non transferable",
      ],
    },
    form: {
      hasRewards: false,
    },
  },
  [CampaignType.LOYALTY]: {
    card: {
      title: "Loyalty / Rewards",
      image: "/images/loyalty.png",
      perks: [
        "Claimed after scanning QR code or can be sent by email and claimed afterwards",
        "Multiple collections",
        "User receives an award upon completion",
        "Transferable",
        "Lead generation",
      ],
    },
    form: {
      hasRewards: true,
    },
  },
};

export const TYPES = Object.values(CampaignType);
