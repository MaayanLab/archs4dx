import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Box, Button, Grid } from "@mui/material";
import { useFileUploadContext } from "../file-upload-context";
import uploadIcon from "../../../image/upload-icon.svg";
import failedUploadIcon from "../../../image/failed-upload-icon.svg";
import closeIcon from "../../../image/close-icon.svg";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import getReadableFileSizeString from "../../../common/readable-file-size";
import secondsToString from "../../../common/seconds-to-string";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#B0C9CB",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#0F7F90",
  },
}));

const FailedBorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#D32F2F",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#D32F2F",
  },
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  border: `0px solid #fff`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(() => ({
  background:
    "linear-gradient(75.61deg, rgba(244, 144, 77, 0.4) 3.76%, rgba(243, 139, 151, 0.4) 51.01%, rgba(15, 127, 144, 0.4) 98.26%);",
  height: "80px",
  flexDirection: "row",
  "& .MuiAccordionSummary-expandIconWrapper": {
    transform: "rotate(270deg)",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "0px solid rgba(0, 0, 0, .125)",
}));

export default function UploadProgressAccordion() {
  const {
    uploadingFiles,
    totalPercentage,
    expectedRemaingTime,
    removeFile,
    cancelAll,
    closeModal,
    cancelFile,
    uploadComplete,
  } = useFileUploadContext();
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const cancelAndClose = () => {
    cancelAll();
    closeModal();
  };

  if (uploadingFiles.length === 0) {
    return null;
  }
  const formattedTotalPercentage =
    totalPercentage === null ? null : totalPercentage.toFixed(0);
  const formattedExpectedRemaingTime =
    expectedRemaingTime === null ||
    expectedRemaingTime === Infinity ||
    expectedRemaingTime === isNaN()
      ? null
      : expectedRemaingTime.toFixed(0);
  const isUploadInProgress = uploadingFiles.some(
    (entry) => entry.upload.status === "Uploading"
  );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "474px",
        zIndex: "5",
      }}
    >
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Grid
            container
            sx={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Grid item>
              <Typography sx={{ fontWeight: "500", fontSize: "20px" }}>
                Uploading {uploadingFiles.length} file
                {uploadingFiles.length > 1 ? "s" : ""}
              </Typography>
              {!expanded && isUploadInProgress && (
                <Typography
                  sx={{
                    fontWeight: "400",
                    fontSize: "16px",
                  }}
                >
                  {formattedTotalPercentage}% · Estimated time:{" "}
                  {secondsToString(formattedExpectedRemaingTime)}
                </Typography>
              )}
            </Grid>
            <Grid item sx={{ margin: "0 10px" }}>
              <Button onClick={cancelAndClose} title="Cancel all and close">
                <img src={closeIcon} alt="close icon" />
              </Button>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{ maxHeight: "340px", overflow: "auto", padding: "0" }}
        >
          <Box>
            {uploadingFiles.map(
              (
                {
                  file: { name, size },
                  upload: { progress, status, error },
                  id,
                },
                i
              ) => (
                <Grid key={i} container sx={{ margin: "20px auto 10px auto" }}>
                  <Grid item xs={2} sx={{ padding: "5px 0 0 10px" }}>
                    <img
                      src={
                        status === "Failed" || status === "Canceled"
                          ? failedUploadIcon
                          : uploadIcon
                      }
                      alt="Upload icon"
                      style={{
                        background: "#FAFAFA",
                        borderRadius: "24px",
                        width: "40px",
                        height: "40px",
                        padding: "4px 8px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    {status === "Failed" || status === "Canceled" ? (
                      <Typography variant="body1" sx={{ color: "#D32F2F" }}>
                        {name}
                      </Typography>
                    ) : (
                      <Typography variant="body1">{name}</Typography>
                    )}
                    <Grid container>
                      <Grid item>
                        {status === "Failed" || status === "Canceled" ? (
                          <Typography
                            variant="uploadTextLight"
                            sx={{
                              color: "#D32F2F",
                            }}
                          >
                            {error}
                          </Typography>
                        ) : (
                          <Typography variant="uploadTextLight">
                            {getReadableFileSizeString(size)}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item sx={{ margin: "0 8px" }}>
                        <Typography variant="uploadTextLight"> • </Typography>
                      </Grid>
                      <Grid item>
                        {status === "Failed" || status === "Canceled" ? (
                          <Typography
                            variant="uploadTextLight"
                            sx={{ color: "#D32F2F" }}
                          >
                            {status}
                          </Typography>
                        ) : (
                          <Typography variant="uploadTextLight">
                            {status}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    {status === "Failed" || status === "Canceled" ? (
                      <FailedBorderLinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ margin: "16px auto" }}
                      />
                    ) : (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ margin: "16px auto" }}
                      />
                    )}
                  </Grid>
                  <Grid item xs={2}>
                    {["Complete", "Failed", "Canceled"].includes(status) && (
                      <Button onClick={() => removeFile(id)}>
                        <img
                          src={closeIcon}
                          alt="close icon"
                          style={{ width: "26px", height: "26px" }}
                        />
                      </Button>
                    )}
                    {status === "Uploading" && (
                      <Button onClick={() => cancelFile(id)}>
                        <img
                          src={closeIcon}
                          alt="close icon"
                          style={{ width: "26px", height: "26px" }}
                        />
                      </Button>
                    )}
                  </Grid>
                </Grid>
              )
            )}
          </Box>
        </AccordionDetails>
        <AccordionDetails sx={{ height: "53px", backgroundColor: "#EFF4F5" }}>
          <Grid
            container
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Grid item>
              {isUploadInProgress && (
                <Typography>
                  {formattedTotalPercentage}% · Estimated time:{" "}
                  {secondsToString(formattedExpectedRemaingTime)}
                </Typography>
              )}{" "}
            </Grid>
            <Grid item>
              {isUploadInProgress && (
                <Button onClick={cancelAll} sx={{ color: "#D32F2F" }}>
                  Cancel All
                </Button>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
