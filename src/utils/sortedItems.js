import { useMemo } from "react";

export const sortedItems = useMemo(
  (items, sortDescriptor) => {
    return [...items].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      // Add type-specific comparisons here if needed
      const cmp =
        (first ?? "") < (second ?? "")
          ? -1
          : (first ?? "") > (second ?? "")
          ? 1
          : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  },
  [items, sortDescriptor]
);
