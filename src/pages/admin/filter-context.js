import { createContext, useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";

export const FilterContext = createContext({
  filterState: {},
  toggleFilter: () => {},
  clearFilters: () => {},
  setFileInfoFilter: () => {},
});

export const FilterContextProvider = ({ children }) => {
  const [filterState, setFilterState] = useState({});

  const toggleFilter = ({ target: { name: category, value } }) => {
    setFilterState((prevState) => ({
      ...prevState,
      [category]: prevState[category] === value ? undefined : value,
    }));
  };
  const params = useParams();
  const isAdmin =
    params.page === "collections" ||
    params.page === "roles" ||
    params.page === "policies" ||
    params.page === "users";
  const searchKey = isAdmin ? "/search" : "/file_info";
  const setFileInfoFilter = (value) => {
    setFilterState((prevState) => ({
      ...prevState,
      [searchKey]: value === "" ? undefined : value,
    }));
  };

  const clearFilters = useCallback(() => setFilterState({}), []);

  const value = {
    filterState,
    toggleFilter,
    clearFilters,
    setFileInfoFilter,
  };

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  return useContext(FilterContext);
};
