export const getAvatarUrl = (seed?: string) => {
  if (!seed) {
    return;
  }

  return `https://api.dicebear.com/5.x/thumbs/svg?seed=${seed}&shapeColor=0a5b83,1c799f,69d2e7&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear,solid`;
};
