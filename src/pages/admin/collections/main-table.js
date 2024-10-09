import * as React from "react";
import { Box, Container } from "@mui/material";
import { useState } from "react";
import "./main-table.css";
import { useQuery } from "react-query";
import { MainButtons } from "./main-buttons";
import { useFilterContext } from "../filter-context";
import { CustomCollectionsDataGrid } from "./custom-collections-data-grid";
import { getCollections, searchCollection } from "../../../api/collection";

export const MainCollectionsTable = ({ sidebarOpen, toggleSidebar, user }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const { filterState } = useFilterContext();
  const searchQuery = filterState["/search"];
  const hasSearchQuery = !!searchQuery;

  const { data: searchResults = [] } = useQuery(
    ["collections", "search", searchQuery],
    () => searchCollection({ filters: filterState }),
    {
      enabled: hasSearchQuery,
      select: (data) => data.collections,
    }
  );

  const {
    data: allCollections = [],
    isLoading,
    error,
  } = useQuery(
    ["collections"],
    () => getCollections({ filters: filterState }),
    {
      enabled: !hasSearchQuery,
    }
  );

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
          <CustomCollectionsDataGrid
            rows={hasSearchQuery ? searchResults : allCollections}
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
