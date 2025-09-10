import { useEffect, useState } from "react";

const maturity = {
  10: "child",
  12: "preteen",
  14: "teenager",
  16: "preadult",
  18: "adult",
};

export const useMaturityLevel = ({ ratings }) => {
  const [maturityLevel, setMaturityLevel] = useState("");
  const [contentRatings, setContentRatings] = useState(ratings);

  useEffect(() => {
    if (ratings) {
      if (!isNaN(Number(ratings))) {
        const closest = Object.keys(maturity).reduce((prev, curr) => {
          return Math.abs(Number(curr) - Number(ratings)) <
            Math.abs(Number(prev) - Number(ratings))
            ? curr
            : prev;
        });

        setMaturityLevel(maturity[Number(closest)]);
        setContentRatings(closest);

        return;
      }

      setMaturityLevel(maturity[18]);
      setContentRatings(ratings);
    }
  }, [ratings]);

  return {
    maturityLevel,
    contentRatings,
  };
};
