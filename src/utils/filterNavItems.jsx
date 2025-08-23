
export const filterNavItems = (items, accountType) => {
  return items
    .filter(item => !item.accountType || item.accountType.includes(accountType))
    .map(item => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(
            subItem => !subItem.accountType || subItem.accountType.includes(accountType)
          )
        };
      }
      return item;
    })
    .filter(item => !item.subItems || item.subItems.length > 0); 
};