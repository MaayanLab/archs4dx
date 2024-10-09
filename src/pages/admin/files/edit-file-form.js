import {
  Autocomplete,
  Box,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import getReadableFileSizeString from "../../../common/readable-file-size";
import "./edit-file-form.css";
import { useQuery } from "react-query";
import { getUser } from "../../../api/user";
import { getCollections } from "../../../api/collection";
import { MetadataDisplay } from "./metadata-display";

export const EditFileForm = ({
  isEdit,
  data,
  isLoading,
  error,
  id,
  selectedCollectionToAdd,
  setSelectedCollectionToAdd,
  selectedUserToAdd,
  setSelectedUserToAdd,
}) => {
  const selectedFile = data.find((data) => data.id === id);

  const { data: allUserCollections = [] } = useQuery(["userCollections"], () =>
    getCollections()
  );
  const collectionOptions =
    allUserCollections.map((entry) => ({
      value: entry.id,
      label: entry.name,
    })) ?? [];

  const { data: allUsers = [] } = useQuery(["allUsers"], () => getUser());

  const usersOptions =
    allUsers.users?.map((entry) => ({
      value: entry.id,
      label: entry.name,
    })) ?? [];

  if (!selectedFile) {
    return null;
  }
  const {
    accessibility,
    creation_date,
    display_name,
    name,
    size,
    owner,
    visibility,
    collection,
    status,
    uuid,
  } = selectedFile;

  return (
    <Box
      sx={{ padding: "24px", height: "calc(100vh - 180px)", overflow: "auto" }}
    >
      {error && "there was an error updating the file"}
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          ID:{" "}
        </Typography>
        <Typography>{id}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          UUID:{" "}
        </Typography>
        <Typography>{uuid}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Name:{" "}
        </Typography>
        <Typography>{name}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Display Name:{" "}
        </Typography>
        {isEdit ? (
          <OutlinedInput
            name="display_name"
            defaultValue={display_name}
            disabled={isLoading}
            sx={{ width: "204px", height: "45px" }}
          />
        ) : (
          <Typography>{display_name}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Creation Date:{" "}
        </Typography>
        <Typography>{creation_date}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Size:{" "}
        </Typography>
        <Typography>{getReadableFileSizeString(size)}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Collection:{" "}
        </Typography>
        {isEdit ? (
          <Autocomplete
            options={collectionOptions}
            value={selectedCollectionToAdd}
            onChange={(_e, selectedOption) =>
              setSelectedCollectionToAdd(selectedOption)
            }
            sx={{ width: "204px", height: "45px" }}
            renderInput={(params) => (
              <TextField
                {...params}
                required={selectedCollectionToAdd === null}
              />
            )}
          ></Autocomplete>
        ) : (
          <Typography>{collection.name}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Owner:{" "}
        </Typography>
        {isEdit ? (
          <Autocomplete
            options={usersOptions}
            value={selectedUserToAdd}
            onChange={(_e, selectedOption) =>
              setSelectedUserToAdd(selectedOption)
            }
            sx={{ width: "204px", height: "45px" }}
            renderInput={(params) => (
              <TextField {...params} required={selectedUserToAdd === null} />
            )}
          ></Autocomplete>
        ) : (
          <Typography>
            {" "}
            {owner.first_name} {owner.last_name}
          </Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Status:{" "}
        </Typography>
        {isEdit ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="status"
            defaultValue={status}
            sx={{ width: "204px", height: "45px" }}
          >
            <MenuItem value="uploading">Uploading</MenuItem>
            <MenuItem value="ready">Ready</MenuItem>
          </Select>
        ) : (
          <Typography>{status}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Accessibility:{" "}
        </Typography>
        {isEdit ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="accessibility"
            defaultValue={accessibility}
            sx={{ width: "204px", height: "45px" }}
          >
            <MenuItem value="locked">Locked</MenuItem>
            <MenuItem value="open">Open</MenuItem>
          </Select>
        ) : (
          <Typography>{accessibility}</Typography>
        )}
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Visibility:{" "}
        </Typography>
        {isEdit ? (
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            name="visibility"
            defaultValue={visibility}
            sx={{ width: "204px", height: "45px" }}
          >
            <MenuItem value="hidden">Hidden</MenuItem>
            <MenuItem value="visible">Visible</MenuItem>
          </Select>
        ) : (
          <Typography>{visibility}</Typography>
        )}
      </Grid>
      <Typography
        variant="modalTitle"
        sx={{ color: "#0F7F90", margin: "42px auto 20px auto" }}
      >
        Metadata:
      </Typography>
      <MetadataDisplay ids={[id]} isEdit={isEdit} />
    </Box>
  );
};
