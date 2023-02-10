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

export const NFT_INITIAL_VALUE = {
  name: "",
  description: "",
  supply: 1,
};

export interface IUploadedFile {
  file: FileWithPath;
  response?: FileDto;
}

export interface IFormNFT {
  name: string;
  file: IUploadedFile;
  description: string;
  attributes: Record<string, string>;
  supply: number;
}

export interface IFormValues {
  name: string;
  limitDate: boolean;
  startDate: Date | null;
  endDate: Date | null;
  image?: IUploadedFile;
  description?: string;
  additonalDescription?: string;
  documents: Array<IUploadedFile>;
  reward?: Partial<IFormNFT>;
  poap?: Partial<IFormNFT>;
  collectibles: Array<Partial<IFormNFT>>;
}

export const [FormProvider, useFormContext, useForm] =
  createFormContext<IFormValues>();
