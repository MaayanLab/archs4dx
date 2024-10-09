import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import getReadableFileSizeString from "../../../common/readable-file-size";
import "./edit-profile-form.css";
import downloadFileIcon from "../../../image/download-file-icon.svg";
import downloadMetaIcon from "../../../image/download-meta-icon.svg";
import deleteIcon from "../../../image/delete-icon.svg";
import { MetadataDisplay } from "../../dashboard/components/metadata-display";
import { useQuery } from "react-query";
import { downloadListMetadata, getFileDownloadUrl } from "../../../api/file";
import { getUserCollections } from "../../../api/user";
import { useState } from "react";
import { ConfirmDeleteFilesModal } from "./confirm-delete-files-modal";

export const EditFileForm = ({
  isEdit,
  data,
  isLoading,
  error,
  id,
  selectionModel,
  onClose,
  selectedCollectionToAdd,
  setSelectedCollectionToAdd,
}) => {
  const selectedFile = data.find((data) => data.id === id);
  const [openConfirmDeleteFiles, setOpenConfirmDeleteFiles] = useState(false);

  const { data: allUserCollections = [] } = useQuery(["userCollections"], () =>
    getUserCollections()
  );

  const collectionOptions =
    allUserCollections.map((entry) => ({
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
    size,
    owner,
    visibility,
    collection,
    status,
  } = selectedFile;

  const createTextFile = async (metadataObject, filename) => {
    const link = document.createElement("a");
    const textContent = JSON.stringify(metadataObject, null, 4);
    const file = new Blob([textContent], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const onDownloadSelectMetadata = async () => {
    const idList = id;
    const metadata = await downloadListMetadata(idList);
    createTextFile(metadata, "metadata.json");
  };

  const downloadFile = async () => {
    const fileId = id;
    const { url } = await getFileDownloadUrl(fileId);
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Box
        sx={{
          padding: "24px",
          height: "calc(100vh - 180px)",
          overflow: "auto",
        }}
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
            File Name:{" "}
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
            Date:{" "}
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
          <Typography>
            {owner.first_name} {owner.last_name}
          </Typography>
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
        <Grid container>
          <Grid item xs={6}>
            <Button
              onClick={downloadFile}
              variant="secondary"
              sx={{
                width: "90%",
                outline: "0px",
                borderRadius: "0px",
                padding: "20px",
                fontSize: "15px",
                fontWeight: "700",
                textTransform: "capitalize",
                margin: "24px auto 12px auto",
                display: "flex",
              }}
            >
              <img
                src={downloadFileIcon}
                alt="Download icon"
                style={{ margin: "0 10px 0 0" }}
              />
              Download File
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="secondary"
              onClick={onDownloadSelectMetadata}
              sx={{
                width: "90%",
                outline: "0px",
                borderRadius: "0px",
                padding: "20px",
                fontSize: "15px",
                fontWeight: "700",
                textTransform: "capitalize",
                margin: "24px auto 12px auto",
                display: "flex",
              }}
            >
              <img
                src={downloadMetaIcon}
                alt="Download icon"
                style={{ margin: "0 10px 0 0" }}
              />
              Download Metadata
            </Button>
          </Grid>
        </Grid>

        <Button
          variant="secondary"
          onClick={() => setOpenConfirmDeleteFiles(true)}
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
            src={deleteIcon}
            alt="Delete icon"
            style={{ margin: "0 10px 0 0" }}
          />
          Delete File
        </Button>
        <Typography
          variant="modalTitle"
          sx={{ color: "#0F7F90", margin: "42px auto 20px auto" }}
        >
          Metadata:
        </Typography>
        <MetadataDisplay ids={[id]} isEdit={isEdit} />
      </Box>
      <ConfirmDeleteFilesModal
        open={openConfirmDeleteFiles}
        onClose={() => setOpenConfirmDeleteFiles(false)}
        selectionModel={selectionModel}
      />
    </>
  );
};
