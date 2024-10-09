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
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import closeIcon from "../../../image/close-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { useQuery } from "react-query";
import { getPolicy } from "../../../api/policy";
import { useState } from "react";
import deleteIcon from "../../../image/delete-red-icon.svg";
import { format, parse } from "date-fns";
import config from "../../../data/config.json";

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

export const CreateAdminRoleForm = ({
  handleSubmit,
  openDialog,
  handleCloseDialog,
  policiesToAdd,
  removePoliciesFromRoles,
  addPoliciesToRoles,
}) => {
  const [selectedPoliciesToAdd, setSelectedPoliciesToAdd] = useState(null);

  const handleAddPolicies = () => {
    addPoliciesToRoles({
      id: selectedPoliciesToAdd.id,
      name: selectedPoliciesToAdd.label,
      effect: selectedPoliciesToAdd.effect,
      action: selectedPoliciesToAdd.action,
      collections: selectedPoliciesToAdd.collections,
      files: selectedPoliciesToAdd.files,
      creation_date: selectedPoliciesToAdd.creation_date,
    });
    setSelectedPoliciesToAdd(null);
  };

  const { data: allPolicies = [] } = useQuery(["policies"], () => getPolicy());

  const stagedPolicies = [...policiesToAdd];
  const stagedPoliciesIds = stagedPolicies.map(({ id }) => id);
  const filteredAllInternalPolicies = allPolicies?.policies?.filter(
    ({ id }) => !stagedPoliciesIds.includes(id)
  );

  const policiesOptions =
    filteredAllInternalPolicies?.map((entry) => ({
      label: entry.name ? entry.name : "Missing name",
      id: entry.id,
      effect: entry.effect,
      action: entry.action,
      collections: entry.collections,
      files: entry.files,
      creation_date: entry.creation_date,
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
            Create New Role
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
            <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
              Policies:{" "}
            </Typography>
            <Typography>{stagedPolicies?.length}</Typography>
            {stagedPolicies.map(
              (
                { id, name, effect, action, collections, files, creation_date },
                i
              ) => (
                <Box
                  key={i}
                  sx={{
                    display: "block",
                    width: "100%",
                    margin: "10px 5px",
                    position: "relative",
                  }}
                >
                  <Typography variant="modalTitle" sx={{ margin: "4px 0" }}>
                    {name ? name : "Missing name"}
                  </Typography>

                  <Button
                    onClick={() => removePoliciesFromRoles(id)}
                    sx={{
                      padding: "0",
                      minWidth: "35px",
                      position: "absolute",
                      top: "0",
                      right: "0",
                    }}
                  >
                    <img src={deleteIcon} alt="delete icon" />
                  </Button>

                  <Typography>Effect: {effect ? effect : ""}</Typography>
                  <Typography>Action: {action ? action : ""}</Typography>
                  {collections?.map(({ name }) => (
                    <Typography>Collections: {name ? name : ""}</Typography>
                  ))}
                  <Typography>Files: {files?.length} files</Typography>
                  <Typography>
                    Creation date:{" "}
                    {creation_date
                      ? format(
                          parse(
                            creation_date,
                            "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
                            new Date()
                          ),
                          config.date_format
                        )
                      : ""}
                  </Typography>
                </Box>
              )
            )}
            <Grid container sx={{ margin: "15px auto" }}>
              <Autocomplete
                disablePortal
                value={selectedPoliciesToAdd}
                onChange={(_e, selectedOption) =>
                  setSelectedPoliciesToAdd(selectedOption)
                }
                options={policiesOptions}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} />}
              />
              <Button
                variant="contained"
                onClick={handleAddPolicies}
                disabled={selectedPoliciesToAdd === null}
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
                Add Policy
              </Button>
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
