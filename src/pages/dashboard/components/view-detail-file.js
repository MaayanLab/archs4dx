import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import getReadableFileSizeString from "../../../common/readable-file-size";
import { ViewModal } from "../../../common/view-modal";
import { MetadataDisplay } from "./metadata-display";

export const ViewDetailFile = ({ id, isOpen, onClose, files }) => {
  const selectedFile = files.find((file) => file.id === id);
  if (!selectedFile) {
    return null;
  }
  const {
    accessibility,
    creation_date,
    name,
    size,
    visibility,
    collection,
    status,
    checksum
  } = selectedFile;

  const DetailItem = ({ label, value }) => (
    <Grid container justifyContent="space-between" margin="10px 0">
      <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
        {label}:{" "}
      </Typography>
      <Typography>{value}</Typography>
    </Grid>
  );

  return (
    <ViewModal isOpen={isOpen} onClose={onClose} title={name}>
      <Box
        sx={{
          padding: "24px",
          height: "calc(100vh - 180px)",
          overflow: "auto",
        }}
      >
        <Grid container justifyContent="space-between" margin="10px 0">
          <DetailItem label="File Name" value={name ?? "Missing data"} />
          <DetailItem label="Date" value={creation_date ?? "Missing data"} />
          <DetailItem
            label="Size"
            value={getReadableFileSizeString(size) ?? "Missing data"}
          />
          <Grid container justifyContent="space-between" margin="10px 0">
            <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
              sha1sum:{" "}
            </Typography>
            <Typography sx={{fontSize: 11, marginTop: "5px" }}>{checksum}</Typography>
          </Grid>
          <DetailItem
            label="Collection"
            value={collection?.name ?? "Missing data"}
          />
          <DetailItem label="Status" value={status ?? "Missing data"} />
          <DetailItem
            label="Accessibility"
            value={accessibility ?? "Missing data"}
          />
          <DetailItem label="Visibility" value={visibility ?? "Missing data"} />
          <Typography
            variant="modalTitle"
            sx={{ color: "#0F7F90", marginTop: "12px" }}
          >
            Metadata:
          </Typography>
          <MetadataDisplay ids={[id]} />
        </Grid>
      </Box>
    </ViewModal>
  );
};
