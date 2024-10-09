import * as React from "react";
import { Box, Container } from "@mui/material";
import { useState } from "react";
import "./main-table.css";

import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { MainButtons } from "./main-buttons";
import { useFilterContext } from "../filter-context";
import { searchFiles } from "../../../api/file";
import { CustomDataGrid } from "../../../common/custom-data-grid";
import { getUserFiles } from "../../../api/user";

const useData = ({ page, pageSize, filterState, collectionId }) => {
  const definedFilters = Object.keys(filterState).filter(
    (key) => filterState[key] !== undefined
  ); // filter entries that are undefined
  const isUserFiles = collectionId === undefined && definedFilters.length === 0;
  const activeFiltersKey = definedFilters
    .sort() // sort alphabetically
    .map((key) => key + "." + filterState[key]) // add values to keys, example: /creator/name.c0
    .join(","); // join all with comma
  
  //  const transformData = (data) => ({
  //  ...data,
  //  files: data.files.map((entry) => ({ ...entry, creation_date: entry.date })),
  //});
  const transformData = (data) => data; // Simply return the data as is without transformation

  const offset = page * pageSize;
  const queryKey = isUserFiles
    ? ["userfiles", pageSize, page]
    : ["files", collectionId, activeFiltersKey, pageSize, page];
  return useQuery(
    queryKey,
    () => {
      //if (isUserFiles) {
      //  return getUserFiles({ offset, limit: pageSize });
      //}
      return searchFiles({
        collectionId,
        filters: filterState,
        limit: pageSize,
        offset,
      });
    },
    { select: isUserFiles ? transformData : undefined }
  );
};

export const MainTable = ({ sidebarOpen, toggleSidebar }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const { collectionId } = useParams();
  const { filterState } = useFilterContext();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: files,
    isLoading,
    error,
  } = useData({ page, pageSize, filterState, collectionId });

  const [rowCountState, setRowCountState] = useState(files?.total || 0);

  React.useEffect(() => {
    setRowCountState((prevRowCountState) => {
      return files?.total !== undefined ? files?.total : prevRowCountState;
    });
  }, [files?.total, setRowCountState]);

  if (error) return "There was a problem loading this page";

  return (
    <>
      <MainButtons
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        files={files?.files ?? []}
      />
      <Container>
        <Box sx={{ width: "100%" }}>
          <CustomDataGrid
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
