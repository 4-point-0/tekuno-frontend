import { useMemo } from "react";

import {
  useAdminControllerFindMe,
  useOrganizationControllerFindOne,
} from "@/services/api/admin/adminComponents";

export function useUserOrganization(enabled = true) {
  const { data: user, isLoading: isLoadingUser } = useAdminControllerFindMe(
    {},
    { enabled }
  );
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
