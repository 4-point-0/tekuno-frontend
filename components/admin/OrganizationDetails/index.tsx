import { Divider, Stack } from "@mantine/core";

import { useOrganizationControllerFindOne } from "@/services/api/admin/adminComponents";
import { UserDto } from "@/services/api/admin/adminSchemas";

import { OrganizationForm } from "../OrganizationForm";
import { OrganizationUsers } from "../OrganizationUsers";

interface OrganizationDetailsProps {
  user: UserDto;
}

export const OrganizationDetails = ({ user }: OrganizationDetailsProps) => {
  const { data: organization, isLoading } = useOrganizationControllerFindOne(
    {
      pathParams: { id: user.organization_id as string },
    },
    { enabled: Boolean(user.organization_id) }
  );

  return (
    <>
      {!isLoading && (
        <Stack spacing={80}>
          <OrganizationForm organization={organization} />
          {organization && (
            <>
              <Divider />
              <OrganizationUsers currentUser={user} />
            </>
          )}
        </Stack>
      )}
    </>
  );
};
