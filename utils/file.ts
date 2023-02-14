import { FileDto } from "@/services/api/admin/adminSchemas";

export function getImageUrl(file?: FileDto) {
  if (!file) {
    return;
  }

  return `${file.url}?updatedAt=${file.updated_at}`;
}
