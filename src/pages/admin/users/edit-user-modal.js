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
import { EditUserForm } from "./edit-user-form";
import backIcon from "../../../image/back-icon.svg";
import editIcon from "../../../image/edit-modal-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { useQuery, useQueryClient } from "react-query";
import { getUser, updateUser } from "../../../api/user";
import { searchFiles } from "../../../api/file";
import { getCollection } from "../../../api/collection";
import { ConfirmEmailModal } from "./confirm-email.modal";

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

export const EditAdminUserModal = (props) => {
  const { id: userId, isOpen, onClose } = props;
  const [selectedUser, setSelectedUser] = useState(null);
  const { data: user } = useQuery(["getUser", userId], () => getUser(userId), {
    enabled: isOpen,
  });
  const { data: userFiles } = useQuery(["userFiles", userId], () =>
    searchFiles({ owner_id: userId })
  );

  const { data: allUsers } = useQuery(["users"], () => getUser());

  useEffect(() => {
    if (allUsers) {
      const user = allUsers.users.find((user) => user.id === userId);
      setSelectedUser(user);
    }
  }, [allUsers, userId]);

  const collectionValues = Object.values(selectedUser?.collections || {});

  const { data: userCollections } = useQuery(
    ["collection", collectionValues],
    () => getCollection(collectionValues)
  );

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
      {!!user && isOpen ? (
        <EditAdminUser
          {...props}
          user={user}
          userFiles={userFiles}
          userCollections={userCollections}
        />
      ) : (
        <Box sx={styleEdit}>Loading....</Box>
      )}
    </Modal>
  );
};

export const EditAdminUser = ({
  onClose,
  user,
  userFiles,
  userCollections,
  id,
}) => {
  const userId = id;
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [openSnackbarSucces, setOpenSnackbarSucces] = useState(false);
  const [isErrorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const closeErrorSnackbar = () => setErrorSnackbarOpen(false);
  const title = user?.name ?? "";
  const [payloadToSubmit, setPayloadToSubmit] = useState({});
  const queryClient = useQueryClient();
  const [rolesToRemove, setRolesToRemove] = useState([]);
  const [rolesToAdd, setRolesToAdd] = useState([]);
  const [email, setEmail] = useState();
  const [openConfirmEmail, setOpenConfirmEmail] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbarSucces(false);
  };
  const removeRolesFromUsers = (roleId) => {
    if (rolesToAdd.find((entry) => entry.id === roleId)) {
      setRolesToAdd((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== roleId)
      );
    } else {
      setRolesToRemove((prevPolicie) => [roleId, ...prevPolicie]);
    }
  };
  const addRolesToUsers = (policiesToAdd) => {
    // deduplicate repeated files
    setRolesToAdd((prevPolicies) => [policiesToAdd, ...prevPolicies]);
  };
  const submitForm = async (payload) => {
    payload = payload ?? payloadToSubmit;
    try {
      await updateUser(payload);
      setIsEdit(false);
      setDisabled(false);
      setOpenConfirmEmail(false);
      queryClient.invalidateQueries(["getUser", userId]);
      queryClient.invalidateQueries(["users"]);
      // prevent optimistic update
      resetState();
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // The new array of files that should be set to the collection
    const newRolesArray = [
      ...user.roles.filter(({ id }) => !rolesToRemove.includes(id)),
      ...rolesToAdd,
    ];
    const formData = new FormData(e.target);
    const payload = {
      id: userId,
      roles: newRolesArray.map(({ id }) => id),
      overwrite: true,
    };
    for (const [key, value] of formData.entries()) {
      payload[key] = value;
    }
    setPayloadToSubmit(payload);
    setEmail(payload.email);
    if (payload.email !== user.email) {
      setOpenConfirmEmail(true);
    } else {
      submitForm(payload);
    }
  };
  const resetState = () => {
    setRolesToRemove([]);
    setRolesToAdd([]);
  };

  return (
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
              {title}
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
            User updated successfully
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
        <EditUserForm
          user={user}
          isEdit={isEdit}
          onClose={onClose}
          rolesToAdd={rolesToAdd}
          rolesToRemove={rolesToRemove}
          removeRolesFromUsers={removeRolesFromUsers}
          addRolesToUsers={addRolesToUsers}
          userFiles={userFiles}
          userCollections={userCollections}
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
                  setRolesToAdd([]);
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
      <ConfirmEmailModal
        open={openConfirmEmail}
        email={email}
        onClose={() => setOpenConfirmEmail(false)}
        onConfirm={submitForm}
      />
    </form>
  );
};
