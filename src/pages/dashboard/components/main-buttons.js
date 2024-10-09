import { useReducer, useState } from "react";
import {
  Button,
  Container,
  Grid,
  Menu,
  MenuItem,
  Snackbar,
} from "@mui/material";
import separatorIcon from "../../../image/separator.svg";
import moreIcon from "../../../image/more-icon.svg";
import buttons from "../../../data/main-buttons-search.json";
import nFilesDownload from "../../../data/config.json";
import { useQueryClient } from "react-query";
import {
  getFileDownloadUrl,
  downloadListMetadata,
  downloadListFiles,
} from "../../../api/file";
import { ViewDetailFile } from "./view-detail-file";
import { useLocation } from "react-router-dom";
import { useFilterContext } from "../filter-context";

export const MainButtons = ({
  sidebarOpen,
  toggleSidebar,
  selectionModel,
  setSelectionModel,
  files,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMoreMenuOpen = !!anchorEl;
  const openMoreMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMoreMenu = () => setAnchorEl(null);
  const [isViewModalOpen, toggleViewModal] = useReducer(
    (state) => !state,
    false
  );

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const { filterState } = useFilterContext();

  const activeFilters = Object.keys(filterState).filter(
    (key) => filterState[key] !== undefined
  );

  const location = useLocation();
  const isCollection = !!location.pathname.match(/^\/collection/);
  const isMyFiles = !!location.pathname.match(/^\/myfiles/);

  const filteredButtons = buttons.buttons.filter(({ show_for }) => {
    if (show_for === "MULTIPLE" && selectionModel.length > 1) {
      return true;
    }
    if (show_for === "SINGLE" && selectionModel.length === 1) {
      return true;
    }
    if (
      show_for === "SINGLE_FILES" &&
      selectionModel.length === 1 &&
      isMyFiles
    ) {
      return true;
    }
    if (
      show_for === "SINGLE_OR_MULTIPLE_FILES" &&
      (selectionModel.length === 1 || selectionModel.length > 1) &&
      isMyFiles
    ) {
      return true;
    }
    if (
      show_for === "SINGLE_SEARCH" &&
      selectionModel.length === 1 &&
      !isMyFiles
    ) {
      return true;
    }
    if (show_for === "NONE" && selectionModel.length === 0) {
      return true;
    }
    if (
      show_for === "NONE_OR_MULTIPLE" &&
      (selectionModel.length === 0 || selectionModel.length > 1)
    ) {
      return true;
    }
    if (
      show_for === "SINGLE_OR_MULTIPLE" &&
      (selectionModel.length === 1 || selectionModel.length > 1)
    ) {
      return true;
    }
    if (
      show_for === "NONE_OR_SINGLE" &&
      (selectionModel.length === 0 || selectionModel.length === 1)
    ) {
      return true;
    }
    if (
      show_for === "FILTERED" &&
      activeFilters.length > 0 &&
      selectionModel.length === 0
    ) {
      return true;
    }
    if (show_for === "ALL") {
      return true;
    }
    if (show_for === "ALL_SEARCH" && !isMyFiles) {
      return true;
    }
    if (
      show_for === "UNSELECT_FILE" &&
      selectionModel.length === 0 &&
      isMyFiles
    ) {
      return true;
    }
    return false;
  });

  const queryClient = useQueryClient();

  const refreshData = () => {
    queryClient.invalidateQueries("searchFiles");
  };

  const unselectCheckbox = () => {
    setSelectionModel([]);
  };

  const navigateFilesUrls = async (urls) => {
    try {
      const response = await fetch(urls.url);
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.status}`);
      }
      const blob = await response.blob();
      let filename = urls.url.split("/").pop();
      filename = filename.substring(0, filename.indexOf("?"));
      const fileUrl = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };

  const downloadSelection = async () => {
    const fileId = selectionModel.slice(0, nFilesDownload.n_files_download);
    const { urls } = await downloadListFiles(fileId);
    Promise.all(urls.map(navigateFilesUrls));
  };

  const downloadCollection = async () => {
    const fileId = files
      .map((file) => file.id)
      .slice(0, nFilesDownload.n_files_download);
    const { urls } = await downloadListFiles(fileId);
    Promise.all(urls.map(navigateFilesUrls));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsSnackbarOpen(false);
  };

  const createTextFile = async (metadataObject, filename) => {
    const link = document.createElement("a");
    const textContent = JSON.stringify(metadataObject, null, 4);
    const file = new Blob([textContent], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const onDownloadMetadata = async () => {
    const idList = selectionModel.slice(0, nFilesDownload.n_files_download);
    const metadata = await downloadListMetadata(idList);

    createTextFile(metadata, "metadata.json");
  };

  const onCopyLink = async () => {
    const fileId = selectionModel[0];
    const { url } = await getFileDownloadUrl(fileId);
    navigator.clipboard.writeText(url);
    setIsSnackbarOpen(true);
  };

  const downloadFile = async () => {
    const fileId = selectionModel[0];
    const { url } = await getFileDownloadUrl(fileId);
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleAction = (actionName) => {
    switch (actionName) {
      case "refresh":
        refreshData();
        break;
      case "view_details":
        toggleViewModal();
        break;
      case "download_collection":
        downloadCollection();
        break;
      case "download_selection":
        downloadSelection();
        break;
      case "download_results":
        downloadCollection();
        break;
      case "download_metadata":
        onDownloadMetadata();
        break;
      case "download_file":
        downloadFile();
        break;
      case "filter":
        toggleSidebar();
        break;
      case "unselect":
        unselectCheckbox();
        break;
      case "copy_link":
        onCopyLink();
        break;
      default:
        throw new Error(`${actionName} is not implemented`);
    }
  };

  return (
    <Container
      maxWidth="false"
      disableGutters={true}
      sx={{ maxWidth: "1201px" }}
    >
      <Grid container sx={{ margin: "44px auto" }}>
        {filteredButtons
          .slice(0, 7)
          .map(({ id, text, name, icon_url, action, separator }) => (
            <Grid item key={id}>
              <Button
                variant="text"
                onClick={() => handleAction(action)}
                sx={{
                  padding: "0 15px",
                  display:
                    (name === "filters" && sidebarOpen) ||
                    (name === "Download Collection" && !isCollection)
                      ? "none"
                      : "inline-flex",
                }}
              >
                <img
                  src={icon_url}
                  alt="button icon"
                  style={{ margin: "0 8px 0 0" }}
                />{" "}
                {text}
                {separator === true && (
                  <img
                    src={separatorIcon}
                    alt="separator"
                    style={{ position: "absolute", right: "0" }}
                  />
                )}
              </Button>
            </Grid>
          ))}
        {filteredButtons.length > 7 && (
          <>
            <Grid item>
              <Button
                aria-controls={isMoreMenuOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isMoreMenuOpen ? "true" : undefined}
                onClick={openMoreMenu}
                sx={{ padding: "0 15px" }}
              >
                <img src={moreIcon} alt="more icon" /> More
              </Button>
            </Grid>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={isMoreMenuOpen}
              onClose={closeMoreMenu}
              PaperProps={{
                sx: {
                  mt: "10px",
                  boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
                  borderRadius: "8px",
                },
              }}
            >
              {filteredButtons
                .slice(7)
                .map(({ id, text, icon_url, action }) => (
                  <MenuItem
                    onClick={() => handleAction(action)}
                    key={id}
                    sx={{ fontWeight: "700" }}
                  >
                    <img
                      src={icon_url}
                      alt="button icon"
                      style={{ margin: "0 10px 0 0" }}
                    />{" "}
                    {text}
                  </MenuItem>
                ))}
            </Menu>
          </>
        )}
      </Grid>
      <ViewDetailFile
        id={selectionModel[0]}
        files={files}
        isOpen={isViewModalOpen}
        onClose={toggleViewModal}
      />
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message="URL copied to clipboard!"
        sx={{
          "& .MuiSnackbarContent-root": {
            fontSize: "16px",
            minWidth: "230px",
            display: "flex",
            justifyContent: "center",
          },
        }}
      />
    </Container>
  );
};
