import { useState, Children, cloneElement, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Snackbar,
  Typography,
} from "@mui/material";
import backIcon from "../../../image/back-icon.svg";
import editIcon from "../../../image/edit-modal-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { useMutation, useQueryClient } from "react-query";
import { patchFile } from "../../../api/file";

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

const patchAndAnnotateFile = async ({ payload }) => {
  await patchFile(payload);
};

export const EditFileModal = ({
  isOpen,
  onClose,
  title,
  children,
  id,
  file,
}) => {
  const selectedFile = file.find((file) => file.id === id);
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();
  const [selectedCollectionToAdd, setSelectedCollectionToAdd] = useState(
    selectedFile
      ? {
          value: selectedFile.collection.id,
          label: selectedFile.collection.name,
        }
      : null
  );
  const [selectedUserToAdd, setSelectedUserToAdd] = useState(
    selectedFile
      ? {
          value: selectedFile.owner.id,
          label: selectedFile.owner.first_name + " " + selectedFile.owner.last_name,
        }
      : null
  );
  const [openSnackbarSucces, setOpenSnackbarSucces] = useState(false);
  const [isErrorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const closeErrorSnackbar = () => setErrorSnackbarOpen(false);
  const { mutateAsync, isLoading, error } = useMutation(patchAndAnnotateFile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["files"]);
      setOpenSnackbarSucces(true);
      setSelectedCollectionToAdd(null);
      closeErrorSnackbar();
    },
    onError: () => {
      setErrorSnackbarOpen(true);
    },
  });
  useEffect(() => {
    if (selectedFile) {
      setSelectedCollectionToAdd({
        value: selectedFile.collection.id,
        label: selectedFile.collection.name,
      });
    }
  }, [selectedFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const payload = {};
      payload.id = id;
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      payload.collection_id = selectedCollectionToAdd
        ? selectedCollectionToAdd.value
        : null;
      payload.owner_id = selectedUserToAdd ? selectedUserToAdd.value : null;
      await mutateAsync({ id, payload });
    } catch (e) {
      console.error(e);
      return;
    }
    setIsEdit(false);
    setDisabled(false);
  };

  if (!selectedFile) {
    return null;
  }
  const { display_name } = selectedFile;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbarSucces(false);
  };

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
                {display_name ? display_name : title}
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
              {error?.message}
            </Alert>
          </Snackbar>

          {Children.map(children, (child) =>
            cloneElement(child, {
              isEdit,
              isLoading,
              error,
              onClose,
              selectedCollectionToAdd,
              setSelectedCollectionToAdd,
              selectedUserToAdd,
              setSelectedUserToAdd,
            })
          )}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
      </form>
    </Modal>
  );
};
