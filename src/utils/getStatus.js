export const getStatus = (status) => {
  const statusMap = {
    "returning series": "Renewing",
    released: "Released",
    ended: "Ended",
  };

  return statusMap[status.toLowerCase()] || "Undefined";
};
