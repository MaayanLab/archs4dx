import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import "./main-table.css";
import { useQuery } from "react-query";
import { MainButtons } from "./main-buttons";
import { useFilterContext } from "../filter-context";
import { CustomRolesDataGrid } from "./custom-roles-data-grid";
import { getUser, searchUser } from "../../../api/user";

export const MainUsersTable = ({ sidebarOpen, toggleSidebar, user }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const { filterState, clearFilters } = useFilterContext();
  const searchQuery = filterState["/search"];
  const hasSearchQuery = !!searchQuery;

  const { data: searchResults = [] } = useQuery(
    ["users", "search", searchQuery],
    () => searchUser({ search: filterState["/search"] }),
    {
      enabled: hasSearchQuery,
      select: (data) => data.users,
    }
  );

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, [clearFilters]);

  const {
    data: allUsers,
    isLoading,
    error,
  } = useQuery(["users"], () => getUser(), {
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
          <CustomRolesDataGrid
            rows={hasSearchQuery ? searchResults : allUsers.users}
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
