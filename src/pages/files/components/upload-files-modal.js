import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import closeIcon from "../../../image/close-icon.svg";
import data from "../../../data/config.json";
import React from "react";
import { useDropzone } from "react-dropzone";
import "./drag-and-drop-component.css";
import getReadableFileSizeString from "../../../common/readable-file-size";
import { useFileUploadContext } from "../file-upload-context";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "654px",
  height: "395px",
  overflowY: "scroll",
  bgcolor: "#FAFAFA",
  border: "0px",
  boxShadow: 24,
  padding: "40px",
  borderRadius: "8px",
};

const maxFiles = data.my_files_page.upload_files.max_n_files;
const maxSize = data.my_files_page.upload_files.max_size;

function maxSizeFile(file) {
  if (file.size > maxSize) {
    return {
      code: "file-too-large",
      message: `File is larger than ${maxSize} bytes`,
    };
  }

  return null;
}

export const UploadFilesModal = ({ isOpen, onClose }) => {
  const { uploadFiles } = useFileUploadContext();
  const { getRootProps, getInputProps } =
    useDropzone({
      maxFiles: maxFiles,
      validator: maxSizeFile,
      onDropAccepted: (files) => {
        onClose();
        uploadFiles(files);
      }
    });

  return (
    <>
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
        <Box sx={styleModal}>
          <Grid
            container
            sx={{
              flexWrap: "nowrap",
              position: "relative",
              justifyContent: "center",
            }}
          >
            <Grid item>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "34px",
                  lineHeight: "42px",
                  letterSpacing: "0.25px",
                  position: "relative",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                Upload Files
              </Typography>
            </Grid>
            <Button
              onClick={onClose}
              sx={{
                margin: "0 auto",
                position: "absolute",
                right: "-40px",
                top: "-25px",
              }}
            >
              <img src={closeIcon} alt="close icon" />
            </Button>
          </Grid>

          <Typography
            variant="modalSubtitle"
            sx={{ margin: "25px 20px", color: "#003541", textAlign: "center" }}
          >
            to my Files (Private)
          </Typography>
          <Grid
            {...getRootProps()}
            container
            sx={{
              backgroundColor: "#FFF",
              padding: "24px",
              flexDirection: "column",
              alignItems: "center",
              border: " 1px dashed #B0C9CB",
              borderRadius: "4px",
            }}
          >
            <Box>
              <Button
                variant="primary"
                sx={{
                  width: "160px",
                  margin: "auto",
                  textTransform: "none",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              >
                Choose Files
              </Button>
            </Box>
            <Box>
              <input {...getInputProps()} />
              <Typography
                sx={{ textAlign: "center", fontSize: "14px", margin: "16px" }}
              >
                or Drag and drop your files here to upload
              </Typography>

              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginTop: "17px",
                  textAlign: "center",
                  color: "rgba(0, 53, 65, 0.4)",
                }}
              >
                Maximum file size:{" "}
                {getReadableFileSizeString(
                  data.my_files_page.upload_files.max_size
                )}
              </Typography>
              <Typography
                sx={{
                  textTransform: "uppercase",
                  fontSize: "14px",
                  fontWeight: "500",
                  textAlign: "center",
                  color: "rgba(0, 53, 65, 0.4)",
                }}
              >
                Maximum of files: {data.my_files_page.upload_files.max_n_files}
              </Typography>
            </Box>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};
