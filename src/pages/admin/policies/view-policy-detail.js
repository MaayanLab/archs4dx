import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import backIcon from "../../../image/back-icon.svg";
import { useQuery } from "react-query";
import { getPolicy } from "../../../api/policy";

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

export const ViewPolicyDetailModal = ({ isOpen, onClose, id }) => {
  const {
    data: allPolicies,
    isLoading,
    error,
  } = useQuery(["policies"], () => getPolicy());

  const filteredPolicy = allPolicies?.policies?.filter(
    (policy) => policy.id === id
  );
  const title =
    filteredPolicy && filteredPolicy.length > 0 ? filteredPolicy[0].name : "";

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

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
      {isOpen ? (
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
            <Grid
              item
              sx={{
                width: "450px",
                maxWidth: "80%",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  padding: "24px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                Policy - {title}
              </Typography>
            </Grid>
          </Grid>
          {filteredPolicy &&
            filteredPolicy.map((policy) => (
              <Box
                key={policy.id}
                sx={{
                  padding: "24px",
                  height: "calc(100vh - 180px)",
                  overflow: "auto",
                }}
              >
                <Grid container justifyContent="space-between" margin="24px 0">
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    ID:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.id ? policy.id : ""}
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" margin="24px 0">
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Effect:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.effect ? policy.effect : ""}
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" margin="24px 0">
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Name:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.name ? policy.name : "Missing data"}
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" margin="24px 0">
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Action:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.action ? policy.action : ""}
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" margin="24px 0">
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Policy Description:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.description ? policy.description : ""}
                  </Typography>
                </Grid>
                <Grid container justifyContent="space-between" margin="24px 0">
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Creation Date:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.creation_date ? policy.creation_date : ""}
                  </Typography>
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  margin="24px 0 10px 0"
                >
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Collections:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.collections.length}
                  </Typography>
                </Grid>
                <Grid sx={{ margin: "0 5px" }}>
                  {policy.collections.map(({ name }) => (
                    <Typography>{name}</Typography>
                  ))}
                </Grid>
                <Grid
                  container
                  justifyContent="space-between"
                  margin="24px 0 10px 0"
                >
                  <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
                    Files:{" "}
                  </Typography>
                  <Typography sx={{ maxWidth: "50%" }}>
                    {policy.files.length}
                  </Typography>
                </Grid>
                <Grid sx={{ margin: "0 5px" }}>
                  {policy.files.map(({ display_name }) => (
                    <Typography>{display_name}</Typography>
                  ))}
                </Grid>
              </Box>
            ))}
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
      ) : (
        <Box sx={styleEdit}>Loading....</Box>
      )}
    </Modal>
  );
};
