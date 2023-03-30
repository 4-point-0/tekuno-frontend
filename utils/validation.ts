import {
  FormAttributeValue,
  SharedFormValues,
  UploadedFileValue,
} from "@/components/admin/CampaignForm/FormContext";
import { CampaignFormConfig } from "@/enums/CampaignType";

export const RESTRICTIONS = {
  name: {
    min: 2,
    max: 128,
  },
  description: {
    max: 1024,
  },
  additionalDescription: {
    max: 1024,
  },
  nft: {
    name: {
      min: 2,
      max: 64,
    },
    description: {
      max: 128,
    },
    attribute: {
      max: 64,
    },
    supply: {
      min: 1,
      max: 10_000,
    },
  },
};

export function getNftValidator(enabled: boolean) {
  if (!enabled) {
    return {};
  }

  return {
    name: (value?: string) => {
      if (!value) {
        return "Name is required";
      }
      return value.length < RESTRICTIONS.nft.name.min
        ? `Name must have at least ${RESTRICTIONS.nft.name.min} characters`
        : value.length > RESTRICTIONS.nft.name.max
        ? `Name should be shorter than ${RESTRICTIONS.nft.name.max} characters`
        : null;
    },
    file: (value?: UploadedFileValue) =>
      value?.response ? null : "Asset is required",
    description: (value?: string) =>
      value && value.length > RESTRICTIONS.nft.description.max
        ? `Description should be shorter than ${RESTRICTIONS.nft.description.max} characters`
        : null,
    supply: (value?: number) =>
      !value || value < RESTRICTIONS.nft.supply.min
        ? `Supply should be no less than ${RESTRICTIONS.nft.supply.min}`
        : value > RESTRICTIONS.nft.supply.max
        ? `Supply should less than ${RESTRICTIONS.nft.supply.max}`
        : null,
    attributes: (value?: FormAttributeValue[]) => {
      if (!value) {
        return null;
      }

      return value.some(
        ({ trait_type: key, value }: FormAttributeValue) => key && !value
      )
        ? "Attribute values are required"
        : value.length > RESTRICTIONS.nft.attribute.max
        ? `Description should be shorter than ${RESTRICTIONS.nft.attribute.max} characters`
        : null;
    },
  };
}

const campaignSharedValidations = {
  name: (value?: string) => {
    if (!value) {
      return "Name is required";
    }

    return value.length < RESTRICTIONS.name.min
      ? `Name must have at least ${RESTRICTIONS.name.min} characters`
      : value.length > RESTRICTIONS.name.max
      ? `Name should be shorter than ${RESTRICTIONS.name.max} characters`
      : null;
  },
  startDate: (value: Date | null) => (!value ? "Start date is required" : null),
  endDate: (value: Date | null, { limitDate }: SharedFormValues) => {
    return limitDate && !value
      ? "Date range must be selected if the campaing date is limited"
      : null;
  },
  image: (value?: UploadedFileValue) =>
    value?.response ? null : "Image is required",
  description: (value?: string) => {
    if (!value) {
      return "Text is requred";
    }

    return value.length > RESTRICTIONS.description.max
      ? `Phrase is too long`
      : null;
  },
  additionalDescription: (value?: string) => {
    if (!value) {
      return;
    }

    return value.length > RESTRICTIONS.description.max
      ? `Details are too long`
      : null;
  },
};

export function getCampaignFormValidateInput(
  step: number,
  { hasPoap, hasRewards }: CampaignFormConfig
) {
  const { name, startDate, endDate, image, description } =
    campaignSharedValidations;

  if (step === 0)
    return {
      name,
      startDate,
      endDate,
      image,
    };

  if (step === 1) {
    return {
      description,
    };
  }

  if (step === 2) {
    return {
      poap: getNftValidator(hasPoap),
      collectibles: getNftValidator(hasRewards),
    };
  }

  if (step === 3) {
    return {
      reward: getNftValidator(hasRewards),
    };
  }

  return {};
}

export function getEditFormValidateInput() {
  return campaignSharedValidations;
}

export const authValidatons = {
  email: (value: string) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
  password: (value: string) =>
    value.length < 8 ? "Password should include at least 8 characters" : null,
  passwordConfirm: (value: string, password: string) => {
    return value === password ? null : "Passwords do not match";
  },
};
