import { Button } from "@mui/material";
import { getFilters } from "../../../api/file";
import { useQuery } from "react-query";
import { useFilterContext } from "../filter-context";
import BackIcon from "../../../image/back-all-icon.svg";
import { SidebarFiltersItem } from "./sidebar-filters-item";

export const SidebarFiltersSelect = () => {
  const { filterState, toggleFilter, clearFilters } = useFilterContext();

  const {
    data: filters,
    isLoading,
    error,
  } = useQuery(["filters"], () => getFilters());

  const activeFilters = Object.keys(filterState).filter(
    (key) => filterState[key] !== undefined
  );

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  return (
    <>
      {activeFilters.length > 0 && (
        <Button
          onClick={clearFilters}
          sx={{
            width: "87%",
            margin: "10px 22px 0 22px",
            color: "#0F7F90",
            textTransform: "none",
            backgroundColor: "#FAFAFA",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          <img src={BackIcon} alt="Back icon" style={{ marginRight: "10px" }} />
          Back to all filters
        </Button>
      )}

      {filters.filters.map(({ category, detail }, i) => (
        <SidebarFiltersItem
          key={i}
          category={category}
          detail={detail}
          toggleFilter={toggleFilter}
          filterState={filterState}
        />
      ))}
    </>
  );
};
