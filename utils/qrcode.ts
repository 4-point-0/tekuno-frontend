export const getClaimURL = (nftId: string) => {
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
  const url = vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000";

  return `${url}/claim/${nftId}`;
};
