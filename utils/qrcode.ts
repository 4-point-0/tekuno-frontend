export const getClaimURL = (nftId: string) => {
  return `${location.origin}/claim/${nftId}`;
};
