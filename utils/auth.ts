import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

import { fetchAdminControllerFindMe } from "@/services/api/admin/adminComponents";

import { authOptions } from "../pages/api/auth/[...nextauth]";

export const getUserServerSideProps = ({
  organizationRequired,
  adminOnly,
}: {
  organizationRequired?: boolean;
  adminOnly?: boolean;
}) =>
  async function (context: GetServerSidePropsContext) {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );

    if (!session?.token) {
      return { notFound: true };
    }

    const user = await fetchAdminControllerFindMe({
      headers: { authorization: `Bearer ${session.token}` },
    });

    if (organizationRequired && !user.organization_id) {
      return user.role === "Admin"
        ? {
            redirect: {
              destination: "/admin/organization",
              permanent: false,
            },
          }
        : { notfound: true };
    }

    if (adminOnly && user.role !== "Admin") {
      return { notFound: true };
    }

    console.log(user);

    return {
      props: {
        user,
      },
    };
  };

export const redirectIfActiveSession = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/admin/user",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
