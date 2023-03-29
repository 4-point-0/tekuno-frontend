import { useAdminControllerFindMe } from "@/services/api/admin/adminComponents";

interface AdminUser {
  email: string;
  organization_id: string | null;
  role: "Admin" | "Member";
  username: string;
}

export const useAdminUser = (enabled = true) => {
  const { data, ...rest } = useAdminControllerFindMe({}, { enabled });

  return {
    data: data as unknown as AdminUser | undefined,
    ...rest,
  };
};
