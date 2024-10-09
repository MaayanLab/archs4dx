import * as React from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  Grid,
  Input,
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  gridPageSizeSelector,
  gridRowCountSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import nextIcon from "../../../image/next-icon.svg";
import prevDisabledIcon from "../../../image/disabled-prev-icon.svg";
import "./custom-roles-data-grid.css";
import { useState } from "react";
import { format, parse } from "date-fns";
import config from "../../../data/config.json";

const MISSING_DATA_TEXT = "Missing data";
const getEmailLink = (params) => {
  const email = params?.row?.email;
  if (!email) {
    return (
      <span style={{
        background: "linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        textFillColor: "transparent",
      }}>
        {MISSING_DATA_TEXT}
      </span>
    );
  } else {
    return (
      <a
        href={`mailto:${email}`}
        style={{
          background: "linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textFillColor: "transparent",
          textDecoration: "none",
        }}
      >
        {email}
      </a>
    );
  }
};

const columns = [
  {
    field: "name",
    headerName: "Name",
    editable: false,
    sortable: false,
    flex: 1,
    valueGetter: (params) => params?.row?.name ?? MISSING_DATA_TEXT,
  },
  {
    field: "email",
    headerName: "Email",
    editable: false,
    sortable: false,
    flex: 1,
    renderCell: (params) => getEmailLink(params),
  },
  {
    field: "institution",
    headerName: "Institution",
    editable: false,
    sortable: false,
    flex: 1,
    valueGetter: (params) => params?.row?.affiliation ?? MISSING_DATA_TEXT,
  },
  {
    field: "roles",
    headerName: "Roles",
    editable: false,
    sortable: false,
    flex: 1,
    valueGetter: (params) =>
      params?.row?.roles?.map(({ name }) => name).join(", ") ??
      MISSING_DATA_TEXT,
  },
  {
    field: "creation_date",
    headerName: "Creation Date",
    editable: false,
    sortable: false,
    flex: 0.8,
    valueFormatter: (params) => {
      if (params.value === null) {
        return "";
      }
      try {
        return format(
          parse(params.value, "EEE, dd MMM yyyy HH:mm:ss 'GMT'", new Date()),
          config.date_format
        );
      } catch {
        return "Missing data";
      }
    },
  },
];

const StyledDataGrid = styled(DataGrid)(() => ({
  "& .MuiDataGrid-columnHeaderTitle": {
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "24px",
    color: "#003541",
  },

  "& .MuiDataGrid-row": {
    fontSize: "14px",
    fontWeight: "400",
    lineHeight: "20px",
    color: "#003541",
  },

  "& .MuiDataGrid-row.Mui-selected": {
    background: "#EFF4F5",
  },
  "& .MuiDataGrid-row.Mui-selected:hover": {
    background: "#FFF",
  },
  "& .MuiDataGrid-row:hover": {
    background: "#EFF4F5",
  },
  "& .MuiDataGrid-cell:focus-within": {
    outline: "0px",
  },
  "& .MuiDataGrid-columnHeader:focus-within": {
    outline: "0px",
  },
  "& .MuiCheckbox-root svg": {
    width: 20,
    height: 20,
    boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
    color: "#fff",
    borderRadius: 4,
  },
  "& .MuiCheckbox-root svg path": {
    d: "path('M13.3332 4.50974L5.99984 11.8431L2.6665 8.50974')",
    boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
    color: "transparent",
  },
  "& .MuiCheckbox-root.Mui-checked svg path": {
    width: 20,
    height: 20,
    d: "path('M 13.3332 4.50974 L 5.99984 11.8431 L 2.6665 8.50974')",
    stroke: "rgb(244, 144, 77)",
    transform: "scale(1.5)",
  },
  "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
    borderColor: "transparent",
    boxShadow: "0px 0px 6px rgba(244, 144, 77, 0.25)",
  },
  "& .MuiCheckbox-root.Mui-checked(.MuiCheckbox-indeterminate) svg": {
    borderColor: "transparent",
    boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#B0C9CB !important",
    borderWidth: "1px !important",
    borderRadius: "4px !important",
  },
}));

const CustomFooter = () => {
  const apiRef = useGridApiContext();
  const page0Index = useGridSelector(apiRef, gridPageSelector);
  const page = page0Index + 1;
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const from = page0Index * pageSize + 1;
  const to = from + pageSize - 1 > rowCount ? rowCount : from + pageSize - 1;

  const nextPage = () => apiRef.current.setPage(page0Index + 1);
  const previousPage = () => apiRef.current.setPage(page0Index - 1);
  const setPage = ({ target: { value } }) =>
    apiRef.current.setPage(Number(value) - 1);
  const setPageSize = ({ target: { value } }) =>
    apiRef.current.setPageSize(Number(value));

  return (
    <Grid
      container
      alignItems="center"
      sx={{
        margin: "40px auto",
      }}
    >
      <Grid item flexGrow={1} alignContent="center">
        <Typography variant="body1">
          Showing {from}-{to} of {rowCount} users
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          disabled={page === 1}
          onClick={previousPage}
        >
          {page === 1 ? (
            <Box
              sx={{
                marginRight: "15px",
                display: "flex",
              }}
            >
              <img src={prevDisabledIcon} alt="previous icon" />
            </Box>
          ) : (
            <Box
              sx={{
                marginRight: "15px",
                display: "flex",
              }}
            >
              <img
                src={nextIcon}
                alt="next icon"
                style={{ transform: "rotate(180deg)" }}
              />
            </Box>
          )}
          Previous
        </Button>
      </Grid>{" "}
      <Grid item sx={{ padding: "0 20px" }}>
        <Grid container sx={{ alignItems: "center" }}>
          <Typography>Page </Typography>
          <Input
            sx={{
              width: "52px",
              height: "40px",
              margin: "0 8px",
              padding: "0 0 0 14px",
              border: "1px solid rgba(0, 53, 65, 0.4)",
              borderRadius: "4px",
            }}
            value={page}
            type="number"
            min={1}
            max={pageCount}
            onChange={setPage}
          />
          <Typography> of {pageCount} </Typography>
        </Grid>
      </Grid>
      <Grid item className="styled-select">
        <Select
          value={pageSize}
          onChange={setPageSize}
          sx={{ width: "120px", height: "40px" }}
        >
          <MenuItem value={5}>5 rows</MenuItem>
          <MenuItem value={10}>10 rows</MenuItem>
          <MenuItem value={20}>20 rows</MenuItem>
        </Select>
      </Grid>{" "}
      <Grid item>
        <Button
          variant="contained"
          disabled={page === pageCount}
          onClick={nextPage}
        >
          Next{" "}
          {page === pageCount ? (
            <Box
              sx={{
                marginLeft: "18px",
                display: "flex",
              }}
            >
              <img
                src={prevDisabledIcon}
                alt="previous icon"
                style={{ transform: "rotate(180deg)" }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                marginLeft: "15px",
                display: "flex",
              }}
            >
              <img src={nextIcon} alt="next icon" />
            </Box>
          )}
        </Button>
      </Grid>
    </Grid>
  );
};

export const CustomRolesDataGrid = (props) => {
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState([
    {
      field: "name",
      sort: "asc",
    },
  ]);
  return (
    <StyledDataGrid
      autoHeight
      columns={columns}
      rowsPerPageOptions={[5, 10, 20]}
      checkboxSelection
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
      sx={{
        boxShadow: 0,
        border: 0,
      }}
      components={{
        Footer: CustomFooter,
      }}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      sortModel={sortModel}
      onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
      {...props}
    />
  );
};
