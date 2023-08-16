import React from "react";

import { AdminTable } from "../../../components/master/Admin/AdminTable";

export default function Admins() {
  const data = {
    total: 8,
    count: 8,
    results: [
      {
        id: "e180873b-f5dc-45cb-807c-ec3afb7883eb",
        email: "sradja2@gmail.com",
        role: "MasterAdmin",
        provider: "Google",
      },
      {
        id: "f7755e19-08df-4ae7-a84b-ae5ee351dc4a",
        email: "dominik@4pto.io",
        role: "MasterAdmin",
        provider: "Google",
      },
      {
        id: "89233be3-10e0-490a-b55f-6f6f4fcbc228",
        email: "ivor@4pto.io",
        role: "MasterAdmin",
        provider: "Google",
      },
      {
        id: "b2ac7128-4fb4-474e-b79f-da23181910a7",
        email: "ivor.baric.v2@gmail.com",
        role: "Admin",
        provider: "Google",
      },
      {
        id: "3f5ef97a-3912-4948-91ce-0c14dd600c57",
        email: "intern@4pto.io",
        role: "Admin",
        provider: null,
      },
      {
        id: "3f7aa45a-d095-4a28-9bee-876618b72318",
        email: "slaven@4pto.io",
        role: "Admin",
        provider: "Google",
      },
      {
        id: "eda24513-defe-42e7-9b51-7bec0fdd5231",
        email: "dominik.bosnjak94@gmail.com",
        role: "User",
        provider: null,
        profile: {
          id: "3c35e027-841b-45b3-aef2-ac6212bfa338",
          wallet_address:
            "f63ef430fc8978905850b249dc33b986926c4cf7bce5cfe54d507f6f8ee18d5d",
          chain_id: "962a2648-10d4-4b50-9eaf-66b3139f9add",
          user_id: "eda24513-defe-42e7-9b51-7bec0fdd5231",
          created_at: "2023-06-20T20:29:49.996Z",
          updated_at: "2023-06-20T20:29:49.996Z",
        },
      },
      {
        id: "bc458b5a-8112-4cd9-addf-25350969bb90",
        email: "boderistanac.matea@gmail.com",
        role: "User",
        provider: null,
        profile: {
          id: "a79b109f-6608-4dff-86c3-f168ffc4d899",
          wallet_address:
            "7b26dd4868a68b4f6122d32374a8a436ff6024594868ba853791c93ccd3e1736",
          chain_id: "962a2648-10d4-4b50-9eaf-66b3139f9add",
          user_id: "bc458b5a-8112-4cd9-addf-25350969bb90",
          created_at: "2023-06-26T08:44:16.045Z",
          updated_at: "2023-06-26T08:44:55.217Z",
        },
      },
    ],
  };

  return (
    <>
      <AdminTable data={data} />
    </>
  );
}
