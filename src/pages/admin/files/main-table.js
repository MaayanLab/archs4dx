import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import "./main-table.css";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { MainButtons } from "./main-buttons";
import { searchFiles } from "../../../api/file";
import { useFilterContext } from "../filter-context";
import { CustomFilesDataGrid } from "./custom-files-data-grid";

export const MainFilesTable = ({ sidebarOpen, toggleSidebar, user }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collectionId") ?? undefined;
  const { filterState, clearFilters } = useFilterContext();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const activeFiltersKey = Object.keys(filterState)
    .filter((key) => filterState[key] !== undefined) // filter entries that are undefined
    .sort() // sort alphabetically
    .map((key) => key + "." + filterState[key]) // add values to keys, example: /creator/name.c0
    .join(","); // join all with comma
  const {
    data: files,
    isLoading,
    error,
  } = useQuery(["files", activeFiltersKey, pageSize, page], () =>
    searchFiles({
      filters: filterState,
      limit: pageSize,
      offset: page * pageSize,
    })
  );

  const [rowCountState, setRowCountState] = useState(files?.total ?? 0);

  useEffect(() => {
    setRowCountState((prevRowCountState) =>
      files?.total !== undefined ? files?.total : prevRowCountState
    );
  }, [files?.total, setRowCountState]);

  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, [clearFilters]);

  if (error) return "There was a problem loading this page";
  return (
    <>
      <MainButtons
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        files={files?.files ?? []}
        collectionId={collectionId}
        user={user}
      />
      <Container>
        <Box sx={{ width: "100%" }}>
          <CustomFilesDataGrid
            key={rowCountState.toString() + isLoading.toString()}
            loading={isLoading}
            rowCount={rowCountState}
            paginationMode="server"
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rows={files?.files ?? []}
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
