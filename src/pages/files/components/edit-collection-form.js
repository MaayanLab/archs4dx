import {
  Autocomplete,
  Box,
  Button,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CustomSwitch } from "../../../common/custom-switch";
import deleteIcon from "../../../image/delete-red-icon.svg";
import deleteCollectionIcon from "../../../image/delete-icon.svg";
import "./edit-profile-form.css";
import saveIcon from "../../../image/save-icon.svg";
import { useQuery } from "react-query";
import { searchFiles } from "../../../api/file";
import { getUserCollections } from "../../../api/user";
import "./edit-collection-form.css";
import { ConfirmDeleteCollectionModal } from "./confirm-delete-collection-modal";

export const EditCollectionForm = ({
  user,
  isEdit,
  collection,
  filesToRemove,
  filesToAdd,
  collectionsToRemove,
  removeFileFromCollection,
  removeCollectionFromCollection,
  collectionFiles,
  addFileToCollection,
  addCollectionToCollection,
  collectionsToAdd,
  selectedParentToAdd,
  setSelectedParentToAdd,
  onClose,
}) => {
  // TODO: grab the other user files from the API
  const [selectedFileToAdd, setSelectedFileToAdd] = useState(null);
  const [selectedCollectionToAdd, setSelectedCollectionToAdd] = useState(null);
  const [openConfirmDeleteCollection, setOpenConfirmDeleteCollection] =
    useState(false);
  const owner_id = user.id;

  const handleAddFile = () => {
    addFileToCollection({
      id: selectedFileToAdd.id,
      display_name: selectedFileToAdd.label,
    });
    setSelectedFileToAdd(null);
  };

  const handleAddCollection = () => {
    addCollectionToCollection({
      id: selectedCollectionToAdd.id,
      name: selectedCollectionToAdd.label,
    });
    setSelectedCollectionToAdd(null);
  };

  const { data: allUserFiles = [] } = useQuery(
    ["files", undefined, "", user.id],
    () => searchFiles({ owner_id }),
    {
      enabled: isEdit,
      refetchOnWindowFocus: false,
    }
  );
  const { data: allUserCollections = [] } = useQuery(["userCollections"], () =>
    getUserCollections()
  );

  const filteredFiles =
    collectionFiles?.filter(({ id }) => !filesToRemove.includes(id)) ?? [];
  const stagedFiles = [...filteredFiles, ...filesToAdd];
  const filteredCollections =
    collection?.child_collections?.filter(
      ({ id }) => !collectionsToRemove.includes(id)
    ) ?? [];
  const stagedCollections = [...filteredCollections, ...collectionsToAdd];

  const parentCollection = collection?.path?.find(
    (pathEntry) => pathEntry.id === collection.parent_collection_id
  );

  const selfAndChildCollections = [
    collection?.id,
    ...(collection?.child_collections
      ? collection.child_collections.map(({ id }) => id)
      : []),
  ];

  const filteredAllCollections = allUserCollections.filter(
    ({ id }) => !selfAndChildCollections.includes(id)
  );
  const parentOptions =
    filteredAllCollections
      ?.filter((entry) => entry.id !== collection.id)
      .map((entry) => ({
        value: entry.id,
        label: entry.name,
      })) ?? [];
  const isRootCollection = collection.id === 1;
  if (parentOptions.length === 0 && !isRootCollection) {
    parentOptions.push({
      value: 1,
      label: "Root",
    });
  }

  const stagedFilesIds = [...stagedFiles.map(({ id }) => id)];
  const filteredAllFiles = allUserFiles.files.filter(
    ({ id }) => !stagedFilesIds.includes(id)
  );

  const filesOptions =
    filteredAllFiles?.map((entry) => ({
      label: entry.display_name,
      id: entry.id,
    })) ?? [];

  const stagedCollectionsIds = stagedCollections.map(({ id }) => id);

  const filteredAllInternalCollections = allUserCollections.filter(
    ({ id }) => !stagedCollectionsIds.includes(id)
  );
  const collectionsOptions =
    filteredAllInternalCollections
      ?.filter(
        (entry) =>
          entry.id !== collection.parent_collection_id &&
          entry.id !== collection.id
      )
      .map((entry) => ({
        label: entry.name,
        id: entry.id,
      })) ?? [];

  const isVisible = collection.visibility === "visible";
  const isOpen = collection.accessibility === "open";
  return (
    <Box
      sx={{ padding: "24px", height: "calc(100vh - 180px)", overflow: "auto" }}
    >
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          ID:{" "}
        </Typography>
        <Typography sx={{ maxWidth: "50%" }}>
          {collection.id ? collection.id : ""}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          uuid:{" "}
        </Typography>
        <Typography sx={{ maxWidth: "50%" }}>
          {collection.uuid ? collection.uuid : "Missing field"}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Creation date:{" "}
        </Typography>
        <Typography sx={{ maxWidth: "50%" }}>
          {collection.date ? collection.date : "Missing field"}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Collection Description:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="description"
            defaultValue={collection.description ? collection.description : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography
            sx={{
              margin: "0 10px",
              maxWidth: "95%",
              overflowWrap: "break-word",
            }}
          >
            {" "}
            {collection.description ? collection.description : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="name"
            defaultValue={collection.name ? collection.name : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {collection.name ? collection.name : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Owner Name:{" "}
        </Typography>
        <Typography sx={{ maxWidth: "50%" }}>
          {collection?.owner?.name ? collection.owner.name : "Missing field"}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Institution Logo:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="image_url"
            defaultValue={collection.image_url ? collection.image_url : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography
            sx={{
              margin: "0 10px",
              maxWidth: "95%",
              overflowWrap: "break-word",
            }}
          >
            {" "}
            {collection.image_url ? collection.image_url : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Make this Collection Public:{" "}
        </Typography>
        {isEdit ? (
          <CustomSwitch
            name="accessibility"
            defaultChecked={isOpen}
            sx={{ margin: "0" }}
            key="accessibilityEnabled"
          />
        ) : (
          <CustomSwitch
            name="accessibility"
            checked={isOpen}
            sx={{ margin: "0" }}
            key="accessibilityDisabled"
          />
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Make this Collection Visible:{" "}
        </Typography>
        {isEdit ? (
          <CustomSwitch
            name="visibility"
            defaultChecked={isVisible}
            sx={{ margin: "0" }}
            key="visibilityEnabled"
          />
        ) : (
          <CustomSwitch
            name="visibility"
            checked={isVisible}
            sx={{ margin: "0" }}
            key="visibilityDisabled"
          />
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Parent Collection:{" "}
        </Typography>

        {isEdit ? (
          <Autocomplete
            options={parentOptions}
            value={selectedParentToAdd}
            onChange={(_e, selectedOption) =>
              setSelectedParentToAdd(selectedOption)
            }
            sx={{ width: "204px", height: "45px" }}
            disabled={isRootCollection}
            renderInput={(params) => <TextField {...params} />}
          ></Autocomplete>
        ) : (
          <Typography>
            {collection.parent_collection_id
              ? parentCollection.name ?? collection.parent_collection_id
              : ""}
          </Typography>
        )}
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          margin: "24px 0",
        }}
      >
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Internal Collections:{" "}
        </Typography>
        <Typography>{stagedCollections.length}</Typography>
        {stagedCollections.map(({ id, name }, i) => (
          <Typography
            key={i}
            sx={{ display: "block", width: "100%", margin: "10px 5px" }}
          >
            {name}
            {isEdit && (
              <Button
                onClick={() => removeCollectionFromCollection(id)}
                sx={{ padding: "0", minWidth: "35px" }}
              >
                <img src={deleteIcon} alt="delete icon" />
              </Button>
            )}
          </Typography>
        ))}
        {isEdit && (
          <Grid container sx={{ margin: "15px auto" }}>
            <Autocomplete
              disablePortal
              value={selectedCollectionToAdd}
              onChange={(_e, selectedOption) =>
                setSelectedCollectionToAdd(selectedOption)
              }
              options={collectionsOptions}
              sx={{ width: 250 }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button
              variant="contained"
              onClick={handleAddCollection}
              disabled={selectedCollectionToAdd === null}
              type="button"
              sx={{
                outline: "4px solid rgba(176, 201, 203, 1)",
                padding: "6px 14px 6px 10px",
                height: "38px",
              }}
            >
              <img
                src={saveIcon}
                alt="close icon"
                style={{ margin: "0 9px 0 0" }}
              />
              Add Collection
            </Button>
          </Grid>
        )}
      </Grid>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          margin: "24px 0",
        }}
      >
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Files:{" "}
        </Typography>
        <Typography>{stagedFiles.length}</Typography>
        {stagedFiles.map(({ id, display_name }, i) => (
          <Typography
            key={i}
            sx={{ display: "block", width: "100%", margin: "10px 5px" }}
          >
            {display_name}
            {isEdit && (
              <Button
                onClick={() => removeFileFromCollection(id)}
                sx={{ padding: "0", minWidth: "35px" }}
              >
                <img src={deleteIcon} alt="delete icon" />
              </Button>
            )}
          </Typography>
        ))}
        {isEdit && (
          <Grid container sx={{ margin: "15px auto" }}>
            <Autocomplete
              disablePortal
              value={selectedFileToAdd}
              onChange={(_e, selectedOption) =>
                setSelectedFileToAdd(selectedOption)
              }
              options={filesOptions}
              sx={{ width: 250 }}
              renderInput={(params) => <TextField {...params} />}
            />
            <Button
              variant="contained"
              onClick={handleAddFile}
              disabled={selectedFileToAdd === null}
              type="button"
              sx={{
                outline: "4px solid rgba(176, 201, 203, 1)",
                padding: "6px 14px 6px 10px",
                height: "38px",
              }}
            >
              <img
                src={saveIcon}
                alt="close icon"
                style={{ margin: "0 9px 0 0" }}
              />
              Add File
            </Button>
          </Grid>
        )}
      </Grid>
      {isEdit && (
        <Grid>
          <Button
            variant="secondary"
            onClick={() => setOpenConfirmDeleteCollection(true)}
            sx={{
              display: "flex",
              width: "95%",
              outline: "0px",
              borderRadius: "0px",
              padding: "20px",
              fontSize: "15px",
              fontWeight: "700",
              textTransform: "capitalize",
              margin: "12px auto 40px auto",
              color: "rgba(211, 47, 47, 1)",
            }}
          >
            <img
              src={deleteCollectionIcon}
              alt="Delete icon"
              style={{ margin: "0 10px 0 0" }}
            />
            Delete Collection
          </Button>
        </Grid>
      )}
      <ConfirmDeleteCollectionModal
        open={openConfirmDeleteCollection}
        closeModal={() => setOpenConfirmDeleteCollection(false)}
        onClose={onClose}
        id={collection?.id}
        name={collection.name ? collection.name : ""}
      />
    </Box>
  );
};
