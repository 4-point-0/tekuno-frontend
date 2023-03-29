import { Group, Stack, Title } from "@mantine/core";
import { DataTable, DataTableColumn } from "mantine-datatable";
import { useState } from "react";

import { useOrganizationControllerFindAll } from "@/services/api/admin/adminComponents";
import { UserDto } from "@/services/api/admin/adminSchemas";

import { DeleteUser } from "./DeleteUser";
import { InviteUser } from "./InviteUser";
import { ResendInvite } from "./ResendInvite";

const PAGE_LIMIT = 10;

interface OrganizationUserProps {
  currentUser: UserDto;
}

export const OrganizationUsers = ({ currentUser }: OrganizationUserProps) => {
  const [page, setPage] = useState(1);

  const {
    data: users,
    isLoading,
    refetch,
  } = useOrganizationControllerFindAll({
    queryParams: { limit: PAGE_LIMIT },
  });

  const columns: DataTableColumn<UserDto>[] = [
    { accessor: "email" },
    { accessor: "role" },
    {
      accessor: "actions",
      render: (user) => {
        if (currentUser.email === user.email) {
          return null;
        }

        return (
          <Group spacing="xs">
            <ResendInvite user={user} />

            <DeleteUser user={user} onRemove={refetch} />
          </Group>
        );
      },
    },
  ];

  return (
    <Stack>
      <Title order={2}>Manage users</Title>

      <Group position="right">
        <InviteUser onInvite={refetch} />
      </Group>

      <DataTable
        columns={columns}
        records={users?.results as unknown as Array<UserDto>}
        fetching={isLoading}
        totalRecords={users?.total}
        recordsPerPage={PAGE_LIMIT}
        page={page}
        onPageChange={(p) => setPage(p)}
      />
    </Stack>
  );
};
