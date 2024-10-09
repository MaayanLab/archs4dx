import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { Children, cloneElement } from "react";
import backIcon from "../image/back-icon.svg";

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
export const ViewModal = ({ isOpen, onClose, title, children }) => {
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
          <Grid item>
            <Typography
              variant="body2"
              sx={{
                padding: "24px",
              }}
            >
              {title}
            </Typography>
          </Grid>
        </Grid>
        {Children.map(children, (child) => cloneElement(child))}
        <Box
          sx={{
            width: "100%",
            borderTop: "1px solid #B0C9CB ",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
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
        </Box>
      </Box>
    </Modal>
  );
};
