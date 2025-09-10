export const useAbout = ({ crew }) => {
  const directors = crew.filter(
    ({ job }) => job === "Director" || job === "Producer"
  );

  const writers = crew.filter(({ job }) => job === "Writer");

  return {
    directors,
    writers,
  };
};
