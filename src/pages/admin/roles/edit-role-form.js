import {
  Autocomplete,
  Box,
  Button,
  Grid,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import "./edit-role-form.css";
import { useState } from "react";
import { getPolicy } from "../../../api/policy";
import { useQuery } from "react-query";
import deleteIcon from "../../../image/delete-red-icon.svg";
import saveIcon from "../../../image/save-icon.svg";
import { parse, format } from "date-fns";
import config from "../../../data/config.json";

export const EditRoleForm = ({
  isEdit,
  role,
  policiesToAdd,
  policiesToRemove,
  removePoliciesFromRoles,
  addPoliciesToRoles,
}) => {
  // TODO: grab the other user files from the API
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
  const filteredPolicies =
    role?.policies?.filter(({ id }) => !policiesToRemove.includes(id)) ?? [];
  const stagedPolicies = [...filteredPolicies, ...policiesToAdd];
  const stagedPoliciesIds = stagedPolicies.map(({ id }) => id);
  const filteredAllInternalPolicies = allPolicies?.policies?.filter(
    ({ id }) => !stagedPoliciesIds.includes(id)
  );
  const policiesOptions =
    filteredAllInternalPolicies?.map((entry) => ({
      label: entry.name ? entry.name : "Missing name",
      id: entry.id,
    })) ?? [];
  return (
    <Box
      sx={{ padding: "24px", height: "calc(100vh - 180px)", overflow: "auto" }}
    >
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          ID:{" "}
        </Typography>
        <Typography sx={{ maxWidth: "50%" }}>
          {role.id ? role.id : ""}
        </Typography>
      </Grid>

      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="name"
            defaultValue={role.name ? role.name : ""}
            sx={{ width: "204px", height: "40px", maxWidth: "60%" }}
          />
        ) : (
          <Typography sx={{ overflowWrap: "break-word" }}>
            {" "}
            {role.name ? role.name : ""}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Role Description:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="description"
            defaultValue={role.description ? role.description : ""}
            multiline
            rows={3}
            sx={{ width: "100%" }}
          />
        ) : (
          <Typography
            sx={{
              margin: "0 10px",
              maxWidth: "100%",
              overflowWrap: "break-word",
            }}
          >
            {" "}
            {role.description ? role.description : ""}
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
              {isEdit && (
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
              )}
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
        {isEdit && (
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
        )}
      </Grid>
    </Box>
  );
};
