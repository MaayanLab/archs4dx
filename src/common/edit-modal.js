import { useState, Children, cloneElement } from "react";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import backIcon from "../image/back-icon.svg";
import editIcon from "../image/edit-modal-icon.svg";
import saveIcon from "../image/save-icon.svg";
import { useMutation, useQueryClient } from "react-query";
import { patchUser } from "../api/user";

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
export const EditModal = ({ isOpen, onClose, title, children, data }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, error } = useMutation(patchUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user/getLoggedUser"]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const payload = {};
      payload.id = data.id;
      for (const [key, value] of formData.entries()) {
        payload[key] = value;
      }
      await mutateAsync(payload);
    } catch (e) {
      console.error(e);
      return;
    }
    setIsEdit(false);
    setDisabled(false);
  };

  if (error) return "There was a problem updating the user...";

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
            <Grid item>
              <Typography
                variant="body2"
                sx={{
                  padding: "24px",
                }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item>
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
          {Children.map(children, (child) =>
            cloneElement(child, { isEdit, isLoading, error })
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
