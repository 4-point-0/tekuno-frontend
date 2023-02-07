import { FileWithPath } from "@mantine/dropzone";
import { createFormContext } from "@mantine/form";

export interface IFormValues {
  name: string;
  limitDate: boolean;
  dateRange: Array<Date | null>;
  image?: FileWithPath;
}

export const [FormProvider, useFormContext, useForm] =
  createFormContext<IFormValues>();
