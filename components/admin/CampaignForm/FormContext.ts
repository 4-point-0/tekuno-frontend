import { FileDto } from "@/services/api/admin/adminSchemas";
import { FileWithPath } from "@mantine/dropzone";
import { createFormContext } from "@mantine/form";

export interface IUploadedFile {
  file: FileWithPath;
  response?: FileDto;
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
}

export const [FormProvider, useFormContext, useForm] =
  createFormContext<IFormValues>();
