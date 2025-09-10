export const getTime = (totalTime) => {
  const hours = Math.trunc(totalTime / 60);
  const minutes = totalTime % 60;

  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
};
