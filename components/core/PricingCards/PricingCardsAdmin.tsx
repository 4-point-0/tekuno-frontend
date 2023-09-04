import { Loader } from "@mantine/core";
import { useEffect, useState } from "react";

import { fetchAdminControllerFindMe } from "@/services/api/admin/adminComponents";
import { UserDto } from "@/services/api/admin/adminSchemas";

import PricingCard from "./PricingCard";

export const PricingCards = ({ cards }: any) => {
  const [userData, setUserData] = useState<UserDto>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await fetchAdminControllerFindMe({});
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return <Loader />;
  }

  return (
    <>
      {cards.map((card: any, index: number) => {
        return <PricingCard key={index} card={card} userData={userData} />;
      })}
    </>
  );
};

export default PricingCards;
