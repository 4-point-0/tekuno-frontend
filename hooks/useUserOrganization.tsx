import { useMemo } from "react";

import { useOrganizationControllerFindOne } from "@/services/api/admin/adminComponents";

import { useAdminUser } from "./useAdminUser";

export function useUserOrganization() {
  const { data: user, isLoading: isLoadingUser } = useAdminUser();
  const hasOrganization = useMemo(() => {
    return Boolean(user?.organization_id);
  }, [user?.organization_id]);

  const {
    isLoading,
    data: organization,
    ...result
  } = useOrganizationControllerFindOne(
    {
      pathParams: {
        id: user?.organization_id as string,
      },
    },
    { enabled: hasOrganization }
  );

  return {
    organization,
    hasOrganization,
    user,
    isLoading: isLoading || isLoadingUser,
    ...result,
  };
}
