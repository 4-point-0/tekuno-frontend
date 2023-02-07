export enum PODTemplate {
  ATTENDANCE = "attendance",
  LOYALTY = "loyalty",
}

interface IPODTemplateDatum {
  card: {
    title: string;
    image: string;
    perks: Array<string>;
  };
  form: {
    hasRewards: boolean;
  };
}

export const templateData: Record<PODTemplate, IPODTemplateDatum> = {
  [PODTemplate.ATTENDANCE]: {
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
  [PODTemplate.LOYALTY]: {
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

export const TEMPLATES = Object.values(PODTemplate);
