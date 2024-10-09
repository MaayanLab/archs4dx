import { useReducer, useState } from "react";
import { Button, Container, Grid, Menu, MenuItem } from "@mui/material";
import separatorIcon from "../../../image/separator.svg";
import moreIcon from "../../../image/more-icon.svg";
import buttons from "../../../data/main-buttons-admin-collections.json";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { searchFiles } from "../../../api/file";
import { useLocation } from "react-router-dom";
import { useFilterContext } from "../filter-context";
import { CreateAdminCollectionForm } from "./create-admin-collection-form";
import { createCollection, getCollections } from "../../../api/collection";
import { EditAdminCollectionModal } from "./edit-collection-modal";
import { ConfirmDeleteAdminCollectionsModal } from "./confirm-delete-collections-modal";

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
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [collectionsToRemove, setCollectionsToRemove] = useState([]);
  const [openConfirmDeleteCollections, setOpenConfirmDeleteCollections] =
    useState(false);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [collectionsToAdd, setCollectionsToAdd] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParentToAdd, setSelectedParentToAdd] = useState({
    label: "root",
    value: 1,
  });
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFilesToAdd([]);
    setCollectionsToAdd([]);
  };
  const [isEditModalOpen, toggleEditModal] = useReducer(
    (state) => !state,
    false
  );

  const { mutateAsync, isLoading, error } = useMutation(createCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
      queryClient.invalidateQueries(["userCollections"]);
      setSelectedParentToAdd(null);
      setFilesToAdd([]);
      setCollectionsToAdd([]);
      setOpenDialog(false);
    },
  });
  const { filterState } = useFilterContext();
  const activeFilters = Object.keys(filterState).filter(
    (key) => filterState[key] !== undefined
  );
  const location = useLocation();
  const isCollection = !!location.pathname.match(/^\/collection/);
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

  const { data: allCollections = [] } = useQuery(["allCollections"], () =>
    getCollections()
  );
  const { data: allFiles = [] } = useQuery(["files"], () => searchFiles({}), {
    refetchOnWindowFocus: false,
  });

  const removeFileFromCollection = (id) => {
    if (filesToAdd.find((entry) => entry.id === id)) {
      setFilesToAdd((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } else {
      setFilesToRemove((prevFiles) => [id, ...prevFiles]);
    }
  };

  const removeCollectionFromCollection = (CollectionId) => {
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

  const addFileToCollection = (fileToAdd) => {
    setFilesToAdd((prevFiles) => [fileToAdd, ...prevFiles]);
  };
  const addCollectionToCollection = (CollectionToAdd) => {
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
      const payload = {};
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      payload.collections = newCollectionsArray.map(({ id }) => id);
      payload.files = newFilesArray.map(({ id }) => id);
      payload.visibility = payload.visibility === "on" ? "visible" : "hidden";
      payload.parent_collection_id = selectedParentToAdd
        ? selectedParentToAdd.value
        : null;
      payload.accessibility =
        payload.accessibility === "on" ? "open" : "locked";
      await mutateAsync(payload);
    } catch (e) {
      console.error(e);
      return;
    }
  };

  const isVisible = "visible";
  const isOpen = "open";

  if (isLoading) return "Loading...";
  if (error) return "There was a problem creating collection";

  const handleAction = (actionName) => {
    switch (actionName) {
      case "refresh":
        refreshData();
        break;
      case "delete":
        setOpenConfirmDeleteCollections(true);
        break;
      case "create":
        handleClickOpenDialog();
        break;
      case "view_details":
        toggleEditModal();
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

      <CreateAdminCollectionForm
        handleSubmit={handleSubmit}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        isVisible={isVisible}
        isOpen={isOpen}
        filesToAdd={filesToAdd}
        collectionsToAdd={collectionsToAdd}
        addFileToCollection={addFileToCollection}
        addCollectionToCollection={addCollectionToCollection}
        removeFileFromCollection={removeFileFromCollection}
        removeCollectionFromCollection={removeCollectionFromCollection}
        allUSerCollections={allCollections}
        allFiles={allFiles?.files}
        selectedParentToAdd={selectedParentToAdd}
        setSelectedParentToAdd={setSelectedParentToAdd}
      />
      {selectionModel[0] !== undefined && (
        <EditAdminCollectionModal
          isOpen={isEditModalOpen}
          onClose={toggleEditModal}
          user={user}
          id={selectionModel[0]}
        />
      )}
      <ConfirmDeleteAdminCollectionsModal
        open={openConfirmDeleteCollections}
        onClose={() => setOpenConfirmDeleteCollections(false)}
        selectionModel={selectionModel}
      />
    </Container>
  );
};
