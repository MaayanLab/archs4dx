import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useDropzone } from "react-dropzone";
import "./drag-and-drop-component.css";
import data from "../../../data/config.json";
import getReadableFileSizeString from "../../../common/readable-file-size";
import { useFileUploadContext } from "../file-upload-context";

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

export const DragAndDrop = () => {
  const { uploadFiles } = useFileUploadContext();
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: maxFiles,
    validator: maxSizeFile,
    onDropAccepted: (files) => {
      uploadFiles(files);
    },
    onDropRejected: (rejectedFiles) => {
      const allErrors = [];
      for(const { errors, file } of rejectedFiles){
        for(const error of errors){
          allErrors.push("Failed to upload " + file.name + " reason: " + error.message)
        }
      }
    }
  });

  // Devuelve la zona de drag and drop.
  // Por defecto, se llama la ventana de seleccionar archivos al hacer click
  // y se puede hacer drag and drop.
  // Se puede arrastrar una carpeta completa
  // Mostramos la lista de archivos aceptados y los rechazados
  return (
    <Container maxWidth="false" disableGutters={true}>
      <Box {...getRootProps({ className: "dropZone" })}>
        <input {...getInputProps()} />
        <Typography sx={{ textAlign: "center", fontSize: "14px" }}>
          <span className="clickText">Click here</span> or drag and drop your
          files
        </Typography>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontSize: "14px",
            fontWeight: "500",
            marginTop: "17px",
            textAlign: "center",
          }}
        >
          Maximum file size:{" "}
          {getReadableFileSizeString(data.my_files_page.upload_files.max_size)}
        </Typography>
        <Typography
          sx={{
            textTransform: "uppercase",
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Maximum number of files: {data.my_files_page.upload_files.max_n_files}
        </Typography>
      </Box>
    </Container>
  );
};
