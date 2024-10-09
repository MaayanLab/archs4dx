import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import "./main-table.css";
import { useQuery } from "react-query";
import { MainButtons } from "./main-buttons";
import { useFilterContext } from "../filter-context";
import { CustomPoliciesDataGrid } from "./custom-policies-data-grid";
import { getPolicy, searchPolicy } from "../../../api/policy";

export const MainPoliciesTable = ({ sidebarOpen, toggleSidebar, user }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const { filterState, clearFilters } = useFilterContext();
  const searchQuery = filterState["/search"];
  const hasSearchQuery = !!searchQuery;

  const { data: searchResults = [] } = useQuery(
    ["policies", "search", searchQuery],
    () => searchPolicy({ search: filterState["/search"] }),
    {
      enabled: hasSearchQuery,
      select: (data) => data.policies,
    }
  );

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, [clearFilters]);

  const {
    data: allPolicies,
    isLoading,
    error,
  } = useQuery(["policies"], () => getPolicy(), {
    enabled: !hasSearchQuery,
  });

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  return (
    <>
      <MainButtons
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        user={user}
      />
      <Container>
        <Box sx={{ width: "100%" }}>
          <CustomPoliciesDataGrid
            rows={hasSearchQuery ? searchResults : allPolicies.policies}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            selectionModel={selectionModel}
          />
        </Box>
      </Container>
    </>
  );
};
