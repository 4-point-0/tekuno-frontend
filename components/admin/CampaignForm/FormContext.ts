import { FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import { createFormContext } from "@mantine/form";

import { FileDto } from "@/services/api/admin/adminSchemas";

export const CAMPAIGN_IMAGE_TYPES = [MIME_TYPES.jpeg, MIME_TYPES.png];
export const NFT_ASSET_TYPES = [
  MIME_TYPES.jpeg,
  MIME_TYPES.png,
  MIME_TYPES.gif,
  MIME_TYPES.mp4,
];
export const CAMPAIGN_DOCUMENT_TYPES = [MIME_TYPES.pdf];

// 20 mb
export const MAX_FILE_SIZE = 20 * 1024 ** 2;

export const ATTRIBUTE_INITIAL_VALUE = {
  trait_type: "",
  value: "",
};

export const NFT_INITIAL_VALUE = {
  name: "",
  description: "",
  supply: 1,
  attributes: [ATTRIBUTE_INITIAL_VALUE],
};

export interface UploadedFileValue {
  file?: FileWithPath;
  response?: FileDto;
}

export interface FormAttributeValue {
  trait_type: string;
  value: string;
}

export interface FormNFTValue {
  name: string;
  file: UploadedFileValue;
  description: string;
  attributes: FormAttributeValue[];
  supply: number;
}

export interface SharedFormValues {
  name: string;
  chainName: string;
  limitDate: boolean;
  startDate: Date | null;
  endDate: Date | null;
  image?: UploadedFileValue;
  description?: string;
  additionalDescription?: string;
  documents: UploadedFileValue[];
}

export interface CreateFormValues extends SharedFormValues {
  reward?: Partial<FormNFTValue>;
  poap?: Partial<FormNFTValue>;
  collectibles: Partial<FormNFTValue>[];
}

export const [FormProvider, useFormContext, useForm] =
  createFormContext<CreateFormValues>();
