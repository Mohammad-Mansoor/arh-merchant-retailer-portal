export const handleSetSearch = (setSearch, value, timeoutRef) => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }

  timeoutRef.current = setTimeout(() => {
    setSearch(value);
  }, 300);
};
