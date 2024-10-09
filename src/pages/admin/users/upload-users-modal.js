import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import closeIcon from "../../../image/close-icon.svg";
import { bulkUser } from "../../../api/user";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./drag-and-drop-component.css";
import Papa from "papaparse";
import { useQueryClient } from "react-query";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "654px",
  overflowY: "scroll",
  bgcolor: "#FAFAFA",
  border: "0px",
  boxShadow: 24,
  padding: "40px",
  borderRadius: "8px",
};

export const UploadUsersModal = ({ isOpen, onClose }) => {
  const [isUsersLoaded, setIsUsersLoaded] = useState(false);
  const [totalCreated, setTotalCreated] = useState(0);
  const [totalFailed, setTotalFailed] = useState(0);
  const queryClient = useQueryClient();

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv, application/json",
    onDropAccepted: (files) => {
      createBulkUser(files);
    },
  });

  function createBulkUser(files) {
    Promise.all(files.map(processFile))
      .then((responses) => {
        const totalFailed = responses.reduce(
          (acc, curr) => acc + curr.failed.length,
          0
        );
        const totalCreated = responses.reduce(
          (acc, curr) => acc + curr.users.length,
          0
        );

        setTotalFailed(totalFailed);
        setTotalCreated(totalCreated);
        setIsUsersLoaded(totalFailed > 0 || totalCreated > 0);

        const downloadFailedUsersBtn = document.querySelector(
          ".download-failed-users-btn"
        );
        if (downloadFailedUsersBtn) {
          downloadFailedUsersBtn.addEventListener("click", () => {
            downloadFailedUsersFile(responses);
          });
        } else {
          console.error("Element not found: .download-failed-users-btn");
        }
      })
      .catch((error) => console.error("Error", error));
  }

  if (isUsersLoaded) {
    queryClient.invalidateQueries(["users"]);
  }

  async function processFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reject(reader.error);
      };
      if (file.type === "application/json") {
        reader.onload = async () => {
          try {
            const json = JSON.parse(reader.result);
            const response = await bulkUser(json);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      } else if (file.type === "text/csv") {
        reader.onload = () => {
          const csv = reader.result;
          Papa.parse(csv, {
            header: true,
            complete: async (results) => {
              try {
                let json = results.data;
                json = json.map((item) => {
                  if (item.hasOwnProperty("roles")) {
                    item.roles = item.roles.split(",");
                  }
                  return item;
                });
                const response = await bulkUser(json);
                resolve(response);
              } catch (error) {
                reject(error);
              }
            },
          });
        };
        reader.readAsText(file);
      } else {
        reject(new Error("Unsupported file type"));
      }
    });
  }

  function downloadFailedUsersFile(responses) {
    let failedUsers = [];
    responses.forEach((resp) => {
      Array.prototype.push.apply(failedUsers, resp.failed);
    });
    const csvFile = Papa.unparse(failedUsers);
    const link = document.createElement("a");
    const textContent = csvFile;
    const file = new Blob([textContent], { type: "text/csv" });
    link.href = URL.createObjectURL(file);
    link.download = "failed_users.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  }

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
          {isUsersLoaded ? (
            <Box>
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
                      margin: "10px auto 20px auto",
                      textAlign: "center",
                    }}
                  >
                    Upload Confirmation
                  </Typography>
                  <Typography sx={{ textAlign: "center" }}>
                    {totalCreated} users were uploaded correctly.
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
              <Grid
                container
                sx={{
                  backgroundColor: "#FFF",
                  margin: "24px 0 0 0",
                  padding: "24px 24px 84px 24px",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "2px solid #D32F2F",
                  borderRadius: "4px",
                }}
              >
                <Typography sx={{ color: "#D32F2F" }}>
                  {totalFailed} users were not uploaded
                </Typography>
                <Typography variant="body3">
                  Download CSV with errors and correct to try uploading them
                  again.
                </Typography>
              </Grid>
            </Box>
          ) : (
            <Box>
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
                      margin: "10px auto 60px auto",
                      textAlign: "center",
                    }}
                  >
                    Upload Bulk User
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
                    Choose File
                  </Button>
                </Box>
                <Box>
                  <input {...getInputProps()} />
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: "14px",
                      margin: "16px",
                    }}
                  >
                    or Drag and drop your CSV or JSON file here to upload
                  </Typography>
                </Box>
              </Grid>
            </Box>
          )}
          <Button
            className="download-failed-users-btn"
            style={{
              display: isUsersLoaded ? "block" : "none",
              margin: "-70px auto 35px auto",
              width: "210px",
              height: "53px",
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 700,
              color: "#fff",
              background:
                "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
              outline: "4px solid rgba(0, 81, 99, 0.1)",
              boxShadow: "0px 4px 9px rgba(0, 176, 138, 0.22)",
              borderRadius: " 80px",
              flex: "none",
              order: "1",
              flexGrow: "0",
            }}
          >
            Download Conflicts
          </Button>
        </Box>
      </Modal>
    </>
  );
};
