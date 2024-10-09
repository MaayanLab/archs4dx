import { Button } from "@mui/material";
import { Box } from "@mui/system";
import createIcon from "../../../image/create-icon.svg";
import { useState } from "react";
import { createCollection } from "../../../api/collection";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CreateCollectionForm } from "./create-collection-form";
import { getUserCollections } from "../../../api/user";
import { searchFiles } from "../../../api/file";

export const CreateCollection = ({ user }) => {
  const [filesToRemove, setFilesToRemove] = useState([]);
  const [collectionsToRemove, setCollectionsToRemove] = useState([]);
  const [filesToAdd, setFilesToAdd] = useState([]);
  const [collectionsToAdd, setCollectionsToAdd] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedParentToAdd, setSelectedParentToAdd] = useState({
    label: "root",
    value: 1,
  });
  const owner_id = user.id;
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFilesToAdd([]);
    setCollectionsToAdd([]);
  };
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading, error } = useMutation(createCollection, {
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
      queryClient.invalidateQueries(["userCollections"]);
      setSelectedParentToAdd({
        label: "root",
        value: 1,
      });
      setFilesToAdd([]);
      setCollectionsToAdd([]);
      setOpenDialog(false);
    },
  });

  const { data: allUSerCollections = [] } = useQuery(["userCollections"], () =>
    getUserCollections()
  );
  const { data: allUserFiles } = useQuery(
    ["files", undefined, "", user.id],
    () => searchFiles({ owner_id }),
    {
      refetchOnWindowFocus: false,
    }
  );

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
  return (
    <Box>
      <Button
        onClick={handleClickOpenDialog}
        sx={{ margin: "10px auto 10px auto" }}
      >
        <img
          src={createIcon}
          alt="Create icon"
          style={{ marginRight: "8px" }}
        />{" "}
        Create Collection
      </Button>
      <CreateCollectionForm
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
        allUSerCollections={allUSerCollections}
        allUserFiles={allUserFiles?.files}
        selectedParentToAdd={selectedParentToAdd}
        setSelectedParentToAdd={setSelectedParentToAdd}
      />
    </Box>
  );
};
