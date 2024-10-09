import { createContext, useContext, useState } from "react";

export const FilterContext = createContext({
  filterState: {},
  toggleFilter: () => {},
  clearFilters: () => {},
  setFileInfoFilter: () => {}
});

export const FilterContextProvider = ({ children }) => {
  const [filterState, setFilterState] = useState({});

  const toggleFilter = ({ target: { name: category, value } }) => {
    setFilterState((prevState) => ({
      ...prevState,
      [category]: prevState[category] === value ? undefined : value,
    }));
  };

  const setFileInfoFilter = (value) => {
    setFilterState((prevState) => ({
      ...prevState,
      "/file_info": value === "" ? undefined : value     
    }))
  }

  const clearFilters = () => {
    setFilterState({})
  };

  const value = {
    filterState,
    toggleFilter,
    clearFilters,
    setFileInfoFilter
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
