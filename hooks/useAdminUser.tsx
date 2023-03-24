import { useAdminControllerFindMe } from "@/services/api/admin/adminComponents";

interface AdminUser {
  email: string;
  organization_id: string | null;
  role: "Admin" | "Member";
  username: string;
}

export const useAdminUser = () => {
  const { data, ...rest } = useAdminControllerFindMe({});

  return {
    data: data as unknown as AdminUser | undefined,
    ...rest,
  };
};
