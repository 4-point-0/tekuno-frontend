import { Loader } from "@mantine/core";
import { useEffect, useState } from "react";

import { useRamper } from "@/context/RamperContext";

import PricingCard from "./PricingCard";

export const PricingCards = ({ cards }: any) => {
  const [userData, setUserData] = useState<any>();

  const { user } = useRamper();

  useEffect(() => {
    setUserData(user);
  }, [user]);

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
