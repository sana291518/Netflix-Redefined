export const getCompanies = (companies) => {
  const names = companies.map((company) => company.name);
  const joinedNames = names.join(", ");

  if (joinedNames.length > 50) {
    return joinedNames.substring(0, 50) + "...";
  }

  return joinedNames;
};
