import { useReducer, useState } from "react";
import { Button, Container, Grid, Menu, MenuItem } from "@mui/material";
import separatorIcon from "../../../image/separator.svg";
import moreIcon from "../../../image/more-icon.svg";
import buttons from "../../../data/main-buttons-admin-policies.json";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useFilterContext } from "../filter-context";
import { CreateAdminPolicyForm } from "./create-admin-policy-form";
import { ViewPolicyDetailModal } from "./view-policy-detail";
import { ConfirmDeleteAdminPolicies } from "./confirm-delete-policies-modal";
import { useLocation } from "react-router-dom";
import { getCollections } from "../../../api/collection";
import { searchFiles } from "../../../api/file";
import { createPolicy } from "../../../api/policy";

export const MainButtons = ({
  sidebarOpen,
  toggleSidebar,
  selectionModel,
  setSelectionModel,
  user,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMoreMenuOpen = !!anchorEl;
  const openMoreMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMoreMenu = () => setAnchorEl(null);
  const [openConfirmDeletePolicies, setOpenConfirmDeletePolicies] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [collectionsToRemove, setCollectionsToRemove] = useState([]);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [collectionsToAdd, setCollectionsToAdd] = useState([]);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFilesToAdd([]);
    setCollectionsToAdd([]);
  };
  const [isViewModalOpen, toggleViewModal] = useReducer(
    (state) => !state,
    false
  );

  const { data: allUSerCollections = [] } = useQuery(["allCollections"], () =>
    getCollections()
  );
  const { data: allFiles = [] } = useQuery(["files"], () => searchFiles({}), {
    refetchOnWindowFocus: false,
  });

  const location = useLocation();
  const isCollection = !!location.pathname.match(/^\/collection/);
  const { mutateAsync, isLoading, error } = useMutation(createPolicy, {
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]);
      setFilesToAdd([]);
      setCollectionsToAdd([]);
      setOpenDialog(false);
    },
  });
  const { filterState } = useFilterContext();
  const activeFilters = Object.keys(filterState).filter(
    (key) => filterState[key] !== undefined
  );
  const filteredButtons = buttons.buttons.filter(({ show_for }) => {
    if (show_for === "MULTIPLE" && selectionModel.length > 1) {
      return true;
    }
    if (show_for === "SINGLE" && selectionModel.length === 1) {
      return true;
    }
    if (show_for === "NONE" && selectionModel.length === 0) {
      return true;
    }
    if (show_for === "ALL") {
      return true;
    }
    if (show_for === "SINGLE_REMOVE" && selectionModel.length === 1) {
      return true;
    }
    if (show_for === "MULTIPLE_REMOVE" && selectionModel.length > 1) {
      return true;
    }
    if (
      show_for === "SINGLE_OR_MULTIPLE" &&
      (selectionModel.length === 1 || selectionModel.length > 1)
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
    return false;
  });
  const queryClient = useQueryClient();

  const refreshData = () => {
    queryClient.invalidateQueries("collections");
  };

  const unselectCheckbox = () => {
    setSelectionModel([]);
  };

  const removeFileFromPolicy = (id) => {
    if (filesToAdd.find((entry) => entry.id === id)) {
      setFilesToAdd((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } else {
      setFilesToRemove((prevFiles) => [id, ...prevFiles]);
    }
  };

  const removeCollectionFromPolicy = (CollectionId) => {
    if (collectionsToAdd.find((entry) => entry.id === CollectionId)) {
      setCollectionsToAdd((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== CollectionId)
      );
    } else {
      setCollectionsToRemove((prevCollection) => [
        CollectionId,
        ...prevCollection,
      ]);
    }
  };

  const addFileToPolicy = (fileToAdd) => {
    setFilesToAdd((prevFiles) => [fileToAdd, ...prevFiles]);
  };
  const addCollectionToPolicy = (CollectionToAdd) => {
    setCollectionsToAdd((prevCollections) => [
      CollectionToAdd,
      ...prevCollections,
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFilesArray = [
      ...filesToAdd.filter(({ id }) => !filesToRemove.includes(id)),
    ];
    const newCollectionsArray = [
      ...collectionsToAdd.filter(({ id }) => !collectionsToRemove.includes(id)),
    ];
    const formData = new FormData(e.target);
    try {
      const payload = {
        collections: newCollectionsArray.map(({ id }) => id),
        files: newFilesArray.map(({ id }) => id),
        effect: "allow",
      };
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      await mutateAsync(payload);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  if (isLoading) return "Loading...";
  if (error) return "There was a problem creating collection";

  const handleAction = (actionName) => {
    switch (actionName) {
      case "refresh":
        refreshData();
        break;
      case "delete":
        setOpenConfirmDeletePolicies(true);
        break;
      case "create":
        handleClickOpenDialog();
        break;
      case "view_details":
        toggleViewModal();
        break;
      case "filter":
        toggleSidebar();
        break;
      case "unselect":
        unselectCheckbox();
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
          .slice(0, 6)
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
        {filteredButtons.length > 6 && (
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
                .slice(6)
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

      <CreateAdminPolicyForm
        handleSubmit={handleSubmit}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        filesToAdd={filesToAdd}
        collectionsToAdd={collectionsToAdd}
        addFileToPolicy={addFileToPolicy}
        addCollectionToPolicy={addCollectionToPolicy}
        removeFileFromPolicy={removeFileFromPolicy}
        removeCollectionFromPolicy={removeCollectionFromPolicy}
        allUSerCollections={allUSerCollections}
        allFiles={allFiles?.files}
      />
      {selectionModel[0] !== undefined && (
        <ViewPolicyDetailModal
          isOpen={isViewModalOpen}
          onClose={toggleViewModal}
          user={user}
          id={selectionModel[0]}
        />
      )}
      <ConfirmDeleteAdminPolicies
        open={openConfirmDeletePolicies}
        onClose={() => setOpenConfirmDeletePolicies(false)}
        selectionModel={selectionModel}
      />
    </Container>
  );
};
