import { Grid, Box, Typography, Modal, Button } from "@mui/material";
import { useQuery } from "react-query";
import { getCollection } from "../../../api/collection";
import collectionIcon from "../../../image/collection-icon.svg";
import data from "../../../data/config.json";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import closeIcon from "../../../image/close-icon.svg";
import googleIcon from "../../../image/google-icon.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "635px",
  bgcolor: "#FAFAFA",
  border: "0px",
  boxShadow: 24,
  padding: "40px",
  borderRadius: "8px",
};

export const CollectionCard = ({ id }) => {
  const {
    data: collection,
    isLoading,
    error,
  } = useQuery(["collections", id], () => getCollection(id));

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  const handleLoginRedirection = (url) => {
    if (process.env.NODE_ENV === "development") {
      navigate("/search");
    } else {
      window.location.replace(url);
    }
  };

  if (isLoading)
    return (
      <Box
        sx={{
          height: "332px",
          width: "70%",
          maxWidth: "350px",
          minWidth: "300px",
          backgroundColor: "#FAFAFA",
          margin: "10px",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            margin: "40% auto",
            justifyContent: "center",
          }}
        >
          "Loading..."
        </Typography>
      </Box>
    );
  if (error) return "Collection Missing";
  
  return (
    <Grid
      item
      sx={{
        width: "70%",
        maxWidth: "350px",
        height: "332px",
        margin: "10px",
        backgroundColor: "#FAFAFA",
        padding: "48px 24px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <Box sx={{ height: "44px", width: "auto" }}>
        <img
          src={collection.image_url ? collection.image_url : ""}
          alt={`Collection logo `}
          style={{ width: "auto", height: "100%" }}
        />
      </Box>
      <Typography variant="text1">
        {collection.name ? collection.name : ""}
      </Typography>
      <Typography variant="body3">
        {collection.description ? collection.description : ""}
      </Typography>
      <Typography variant="body3">
        {collection.owner.affiliation ? collection.owner.affiliation : ""}
      </Typography>
      <Grid container alignItems="center" marginTop="45px">
        <Grid item sx={{ margin: "0 10px 0 0" }}>
          {" "}
          <img src={collectionIcon} alt="collection icon" />
        </Grid>
        <Grid item>
          {data.startpage.sso.length > 1 ? (
            <Link
              style={{
                background:
                  "linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textFillColor: "transparent",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                textDecoration: "none",
                width: "fit-content",
                "&:hover": {
                  borderBottom: "1px solid #F4904D",
                },
              }}
              onClick={handleOpen}
            >
              View collection
            </Link>
          ) : (
            <Link
              style={{
                background:
                  "linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textFillColor: "transparent",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                textDecoration: "none",
                width: "fit-content",
                "&:hover": {
                  borderBottom: "1px solid #F4904D",
                },
              }}
              onClick={() => handleLoginRedirection(data.startpage.sso[0].url)}
            >
              {" "}
              <img
                src={googleIcon}
                alt="Service"
                style={{ width: "24px", height: "24px", marginRight: "11px" }}
              />{" "}
              View collection
            </Link>
          )}
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          background:
            "linear-gradient(97.08deg, rgba(243, 139, 151, 0.8) 20.01%, rgba(244, 144, 77, 0.8) 75.82%);",
        }}
      >
        <Box sx={style}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography
                id="modal-modal-title"
                variant="body2"
                sx={{ color: "#0F7F90" }}
              >
                Login with one of this options
              </Typography>
            </Grid>
            <Grid item justifyContent="flex-end" marginRight="-10px">
              <Button onClick={handleClose}>
                <img src={closeIcon} alt="close icon" />
              </Button>
            </Grid>
          </Grid>
          <Box margin="40px auto">
            {data.startpage.sso.map(({ service, icon_service, url }, i) => (
              <Button
                variant="outline"
                key={i}
                onClick={() => handleLoginRedirection(url)}
              >
                <Box marginRight="13px" marginTop="5px">
                  <img src={icon_service} alt="icon service" />
                </Box>
                Sign in with {service}
              </Button>
            ))}
          </Box>
          <Typography id="modal-modal-description" variant="body4">
            Note: IHDH uses Google for authentication purposes only.
            The application will not have access to your private data, and will
            not send you any e-mails.
          </Typography>
        </Box>
      </Modal>
    </Grid>
  );
};
