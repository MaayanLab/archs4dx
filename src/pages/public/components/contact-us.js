import { Grid, Typography } from "@mui/material";
import data from "../../../data/config.json";
import addressIcon from "../../../image/addres-icon.svg";
import telIcon from "../../../image/tel-icon.svg";
import emailIcon from "../../../image/email-icon.svg";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    "& .titleSection": {
      fontSize: "32px",
    },
    "& .subtitleSection": {
      fontSize: "18px",
    },
    "& .contactContainer": {
      padding: "40px",
    },
    "& .gridItem": {
      margin: "15px auto",
    },
  },
}));

export const ContactUs = () => {
  return (
    <Container
      maxWidth="false"
      disableGutters={true}
      sx={{
        backgroundColor: "#0F7F90",
        textAlign: "center",
        padding: "100px 0",
      }}
    >
      <Typography
        variant="subtitle2"
        className="titleSection"
        sx={{ color: "#FFF" }}
      >
        Contact us
      </Typography>
      <Typography
        variant="body2"
        className="subtitleSection"
        sx={{ color: "#FFF", marginBottom: "80px" }}
      >
        Innovative Health Data Hub{" "}
        <span style={{ margin: "0 15px" }}>|</span>Mount Sinai Center for Bioinformatics
      </Typography>
      <Grid
        container
        className="contactContainer"
        sx={{
          padding: "50px 70px",
          backgroundColor: "#EFF4F5",
          margin: "auto",
          alignItems: "center",
          justifyContent: "center",
          width: "fit-content",
          borderRadius: "8px",
        }}
      >
        <Grid
          item
          className="gridItem"
          sx={{
            margin: "auto 25px",
          }}
        >
          <Typography variant="body4">
            <img
              src={addressIcon}
              alt="address icon"
              style={{
                position: "absolute",
                margin: " 0 0 0 -25px",
                maxWidth: "20px",
                maxHeight: "20px",
              }}
            />{" "}
            {data.startpage.general_contact.adress}
          </Typography>
        </Grid>
        <Grid
          item
          className="gridItem"
          sx={{
            margin: "auto 25px",
          }}
        >
          
        </Grid>
        <Grid
          item
          className="gridItem"
          sx={{
            margin: "auto 25px",
          }}
        >
          <Typography variant="body4">
            <img
              src={emailIcon}
              alt="email icon"
              style={{
                position: "absolute",
                margin: " 0 0 0 -25px",
                maxWidth: "20px",
                maxHeight: "20px",
              }}
            />{" "}
            {data.startpage.general_contact.email}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};
