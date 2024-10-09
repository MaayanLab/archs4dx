import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import { EditCollectionForm } from "./edit-collection-form";
import backIcon from "../../../image/back-icon.svg";
import editIcon from "../../../image/edit-modal-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { patchCollection } from "../../../api/collection";
import { useQuery, useQueryClient } from "react-query";
import { DeleteFilesModal } from "./delete-files-modal";
import { DeleteCollectionsModal } from "./delete-collections-modal";
import { DeleteFilesAndCollectionsModal } from "./delete-file-and-collection-modal";
import { searchFiles } from "../../../api/file";

const styleEdit = {
  position: "absolute",
  top: "0",
  right: "0",
  width: "576px",
  height: "100vh",
  overflowY: "scroll",
  bgcolor: "#FFF",
  border: "0px",
  boxShadow: 24,
  padding: "0",
  borderRadius: "8px",
  margin: "0 -10px",
};

export const EditCollectionModal = ({
  isOpen,
  onClose,
  collection,
  title,
  user,
}) => {
  const collectionId = collection?.id;
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openDeleteFiles, setOpenDeleteFiles] = useState(false);
  const [openRemoveCollections, setOpenRemoveCollections] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSnackbarSucces, setOpenSnackbarSucces] = useState(false);
  const [isErrorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const closeErrorSnackbar = () => setErrorSnackbarOpen(false);
  const owner_id = user.id;
  const { data: collectionFiles = [] } = useQuery(
    ["files", collectionId, owner_id],
    () => searchFiles({ collectionId, owner_id })
  );
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [collectionsToRemove, setCollectionsToRemove] = useState([]);
  const [collectionsToAdd, setCollectionsToAdd] = useState([]);
  const [payloadToSubmit, setPayloadToSubmit] = useState({});
  const queryClient = useQueryClient();
  const parentCollection = collection?.path?.find(
    (pathEntry) => pathEntry.id === collection.parent_collection_id
  );
  const parentOption = parentCollection
    ? {
        value: parentCollection.id,
        label: parentCollection.name,
      }
    : null;
  const [selectedParentToAdd, setSelectedParentToAdd] = useState(parentOption);

  const removeFileFromCollection = (id) => {
    if (filesToAdd.find((entry) => entry.id === id)) {
      setFilesToAdd((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== id)
      );
    } else {
      setFilesToRemove((prevFiles) => [id, ...prevFiles]);
    }
  };
  const addFileToCollection = (fileToAdd) => {
    // deduplicate repeated files
    setFilesToAdd((prevFiles) => [fileToAdd, ...prevFiles]);
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
  const addCollectionToCollection = (CollectionToAdd) => {
    // deduplicate repeated files
    setCollectionsToAdd((prevCollections) => [
      CollectionToAdd,
      ...prevCollections,
    ]);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbarSucces(false);
  };

  const submitForm = async (payload) => {
    payload = payload ?? payloadToSubmit;
    try {
      await patchCollection(payload);
      setIsEdit(false);
      setDisabled(false);
      setOpenDeleteFiles(false);
      setOpenRemoveCollections(false);
      setOpenDeleteModal(false);
      queryClient.invalidateQueries(["collection", collectionId]);
      queryClient.invalidateQueries(["files", collectionId]);
      queryClient.invalidateQueries([
        "files",
        undefined,
        "",
        user.id,
        collectionId,
      ]);
      queryClient.invalidateQueries(["userCollections"]);
      // prevent optimistic update
      resetState();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // The new array of files that should be set to the collection
    const newFilesArray = [
      ...collectionFiles.files.filter(({ id }) => !filesToRemove.includes(id)),
      ...filesToAdd,
    ];
    const newCollectionsArray = [
      ...collection.child_collections.filter(
        ({ id }) => !collectionsToRemove.includes(id)
      ),
      ...collectionsToAdd,
    ];
    const formData = new FormData(e.target);
    const payload = {
      id: collectionId,
      collections: newCollectionsArray.map(({ id }) => id),
      files: newFilesArray.map(({ id }) => id),
      owner_id: collection.owner_id,
      overwrite: true,
    };

    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }
    payload.parent_collection_id = selectedParentToAdd
      ? selectedParentToAdd.value
      : null;
    payload.visibility = payload.visibility === "on" ? "visible" : "hidden";
    payload.accessibility = payload.accessibility === "on" ? "open" : "locked";
    setPayloadToSubmit(payload);
    if (filesToRemove.length > 0 && collectionsToRemove.length === 0) {
      setOpenDeleteFiles(true);
    } else if (collectionsToRemove.length > 0 && filesToRemove.length === 0) {
      setOpenRemoveCollections(true);
    } else if (collectionsToRemove.length > 0 && filesToRemove.length > 0) {
      setOpenDeleteModal(true);
    } else {
      submitForm(payload);
    }
  };

  const resetState = () => {
    setFilesToRemove([]);
    setFilesToAdd([]);
    setCollectionsToRemove([]);
    setCollectionsToAdd([]);
  };
  // reset the modal state on close
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  const filesNameArray =
    filesToRemove.length > 0
      ? collectionFiles.files.filter(({ id }) => filesToRemove.includes(id))
      : undefined;

  const collectionsNameArray =
    collectionsToRemove.length > 0
      ? collection.child_collections?.filter(({ id }) =>
          collectionsToRemove.includes(id)
        )
      : undefined;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="TermsModal"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={styleEdit}>
          <Grid
            container
            sx={{
              height: "80px",
              justifyContent: "space-between",
              alignItems: "center",
              background:
                "linear-gradient(75.61deg, rgba(244, 144, 77, 0.4) 3.76%, rgba(243, 139, 151, 0.4) 51.01%, rgba(15, 127, 144, 0.4) 98.26%);",
            }}
          >
            <Grid
              item
              sx={{
                width: "450px",
                maxWidth: "80%",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  padding: "24px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Collection - {title}
              </Typography>
            </Grid>
            <Grid item sx={{ maxWidth: "20%" }}>
              <Button
                sx={{ marginRight: "22px" }}
                disabled={disabled}
                onClick={() => {
                  setIsEdit(true);
                  setDisabled(true);
                }}
              >
                {isEdit ? (
                  "Editing"
                ) : (
                  <>
                    <img
                      src={editIcon}
                      alt="Edit icon"
                      style={{ margin: "0 6px 0 0" }}
                    />{" "}
                    Edit{" "}
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={openSnackbarSucces}
            onClose={handleClose}
            autoHideDuration={5000}
            sx={{
              zIndex: "10",
              "& .MuiSnackbarContent-root": {
                fontSize: "16px",
                minWidth: "230px",
                display: "flex",
                justifyContent: "center",
                anchorOrigin: "bottom, right",
              },
            }}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{
                width: "auto",
                position: "fixed",
                right: "24px",
                bottom: "20px",
                fontSize: "16px",
              }}
            >
              File updated successfully
            </Alert>
          </Snackbar>
          <Snackbar
            open={isErrorSnackbarOpen}
            onClose={closeErrorSnackbar}
            autoHideDuration={5000}
            sx={{
              zIndex: "10",
              "& .MuiSnackbarContent-root": {
                fontSize: "16px",
                minWidth: "230px",
                display: "flex",
                justifyContent: "center",
                anchorOrigin: "bottom, right",
              },
            }}
          >
            <Alert
              onClose={closeErrorSnackbar}
              severity="error"
              sx={{
                width: "auto",
                position: "fixed",
                right: "24px",
                bottom: "20px",
                fontSize: "16px",
              }}
            >
              "Error"
            </Alert>
          </Snackbar>
          <EditCollectionForm
            collection={collection}
            isEdit={isEdit}
            onClose={onClose}
            filesToRemove={filesToRemove}
            filesToAdd={filesToAdd}
            collectionsToAdd={collectionsToAdd}
            removeFileFromCollection={removeFileFromCollection}
            collectionsToRemove={collectionsToRemove}
            removeCollectionFromCollection={removeCollectionFromCollection}
            collectionFiles={collectionFiles.files}
            addFileToCollection={addFileToCollection}
            addCollectionToCollection={addCollectionToCollection}
            user={user}
            selectedParentToAdd={selectedParentToAdd}
            setSelectedParentToAdd={setSelectedParentToAdd}
          />
          <Box
            sx={{
              width: "100%",
              borderTop: "1px solid #B0C9CB ",
            }}
          >
            {isEdit ? (
              <>
                <Button
                  className="userLink"
                  onClick={() => {
                    setIsEdit(false);
                    setDisabled(false);
                    setFilesToAdd([]);
                    setCollectionsToAdd([]);
                  }}
                  sx={{
                    margin: "0 0 0 24px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    outline: "4px solid rgba(176, 201, 203, 1)",
                    margin: "24px",
                  }}
                >
                  <img
                    src={saveIcon}
                    alt="close icon"
                    style={{ margin: "0 9px 0 0" }}
                  />{" "}
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  setIsEdit(false);
                  setDisabled(false);
                  onClose(true);
                }}
                sx={{
                  outline: "4px solid rgba(176, 201, 203, 1)",
                  margin: "24px",
                }}
              >
                <img
                  src={backIcon}
                  alt="close icon"
                  style={{ margin: "0 9px 0 0" }}
                />{" "}
                Back
              </Button>
            )}
          </Box>
        </Box>
        <DeleteFilesModal
          filesNameArray={filesNameArray}
          filesToRemove={filesToRemove}
          open={openDeleteFiles}
          onClose={() => setOpenDeleteFiles(false)}
          onConfirm={submitForm}
        />
        <DeleteCollectionsModal
          collectionsNameArray={collectionsNameArray}
          collectionsToRemove={collectionsToRemove}
          open={openRemoveCollections}
          onClose={() => setOpenRemoveCollections(false)}
          onConfirm={submitForm}
        />
        <DeleteFilesAndCollectionsModal
          collectionsNameArray={collectionsNameArray}
          collectionsToRemove={collectionsToRemove}
          filesNameArray={filesNameArray}
          filesToRemove={filesToRemove}
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          onConfirm={submitForm}
        />
      </form>
    </Modal>
  );
};
