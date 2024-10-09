import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import closeIcon from "../../../image/close-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { useState } from "react";
import deleteIcon from "../../../image/delete-red-icon.svg";

const CustomDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "576px",
    height: "100vh",
    maxHeight: "100vh",
    position: "absolute",
    right: "0",
    margin: "0",
    backgroundColor: "#FAFAFA",
  },
}));

export const CreateAdminPolicyForm = ({
  handleSubmit,
  openDialog,
  handleCloseDialog,
  filesToAdd,
  collectionsToAdd,
  addFileToPolicy,
  addCollectionToPolicy,
  removeFileFromPolicy,
  removeCollectionFromPolicy,
  allUSerCollections,
  allFiles,
}) => {
  const [selectedFileToAdd, setSelectedFileToAdd] = useState(null);
  const [selectedCollectionToAdd, setSelectedCollectionToAdd] = useState(null);

  const handleAddFile = () => {
    addFileToPolicy({
      id: selectedFileToAdd.id,
      display_name: selectedFileToAdd.label,
    });
    setSelectedFileToAdd(null);
  };

  const handleAddCollection = () => {
    addCollectionToPolicy({
      id: selectedCollectionToAdd.id,
      name: selectedCollectionToAdd.label,
    });
    setSelectedCollectionToAdd(null);
  };

  const stagedFiles = [...filesToAdd];
  const stagedCollections = [...collectionsToAdd];

  const allFilesToRemove = [allFiles?.id, ...stagedFiles.map(({ id }) => id)];

  const filteredAllFiles = allFiles?.filter(
    ({ id }) => !allFilesToRemove.includes(id)
  );
  const filesOptions =
    filteredAllFiles?.map((entry) => ({
      label: entry.display_name,
      id: entry.id,
    })) ?? [];

  const allInternalCollectionsToRemove = [
    allUSerCollections?.id,
    ...stagedCollections?.map(({ id }) => id),
  ];
  const filteredAllInternalCollections = allUSerCollections.filter(
    ({ id }) => !allInternalCollectionsToRemove.includes(id)
  );
  const CollectionsOptions =
    filteredAllInternalCollections.map((entry) => ({
      label: entry.name,
      id: entry.id,
    })) ?? [];

  return (
    <CustomDialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="sm"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          id="alert-dialog-title"
          position="relative"
          sx={{
            height: "80px",
            background:
              "linear-gradient(75.61deg, rgba(244, 144, 77, 0.4) 3.76%, rgba(243, 139, 151, 0.4) 51.01%, rgba(15, 127, 144, 0.4) 98.26%)",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="body2"
            sx={{
              padding: "8px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            Create New Policy
          </Typography>
          <Box position="absolute" right="0" top="10px">
            <Button onClick={handleCloseDialog}>
              <img src={closeIcon} alt="close icon" />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ height: "calc(100vh - 180px)" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Effect:
            </DialogContentText>
            <Typography>Allow</Typography>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Name
            </DialogContentText>
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              type="text"
            />
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            margin="24px 0"
          >
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Action
            </DialogContentText>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              name="action"
              defaultValue="list"
              sx={{ width: "204px", height: "38px" }}
            >
              <MenuItem value="list" defaultValue>
                List
              </MenuItem>
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Write</MenuItem>
            </Select>
          </Grid>

          <Box margin="24px 0">
            <DialogContentText
              id="alert-dialog-description"
              variant="modalTitle"
              sx={{ color: "#0F7F90" }}
            >
              Description
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="description"
              multiline
              rows={3}
              name="description"
              type="text"
              fullWidth
              sx={{ maxWidth: "100%" }}
            />
          </Box>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              margin: "24px 0",
            }}
          >
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                margin: "24px 0",
              }}
            >
              <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                Collections:{" "}
              </Typography>
              <Typography>{stagedCollections.length}</Typography>
              {stagedCollections.map(({ id, name }, i) => (
                <Typography
                  key={i}
                  sx={{ display: "block", width: "100%", margin: "10px 5px" }}
                >
                  {name}
                  <Button
                    onClick={() => removeCollectionFromPolicy(id)}
                    sx={{ padding: "0", minWidth: "35px" }}
                  >
                    <img src={deleteIcon} alt="delete icon" />
                  </Button>
                </Typography>
              ))}
              <Grid container sx={{ margin: "15px auto" }}>
                <Autocomplete
                  disablePortal
                  value={selectedCollectionToAdd}
                  onChange={(_e, selectedOption) =>
                    setSelectedCollectionToAdd(selectedOption)
                  }
                  options={CollectionsOptions}
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
                  <Button
                    onClick={() => removeFileFromPolicy(id)}
                    sx={{ padding: "0", minWidth: "35px" }}
                  >
                    <img src={deleteIcon} alt="delete icon" />
                  </Button>
                </Typography>
              ))}
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
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            height: "100px",
            justifyContent: "left",
            borderTop: "1px solid #B0C9CB ",
          }}
        >
          <Button
            onClick={handleCloseDialog}
            sx={{
              fontWeight: "700",
              height: "53px",
              width: "auto",
              padding: "16px 32px",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              outline: "4px solid rgba(176, 201, 203, 1)",
              margin: "24px",
            }}
          >
            <img
              src={saveIcon}
              alt="close icon"
              style={{ margin: "0 9px 0 0" }}
            />
            Save
          </Button>
        </DialogActions>
      </form>
    </CustomDialog>
  );
};
