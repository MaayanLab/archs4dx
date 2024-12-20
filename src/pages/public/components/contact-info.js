import Carousel from "react-material-ui-carousel";
import { Paper, Typography, Box, Grid, Avatar } from "@mui/material";

import data from "../../../data/config.json";
import "./contact-info.css";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  margin: "140px auto",
  position: "relative",
  [theme.breakpoints.down("md")]: {
    margin: "40px auto",
    "& .blobContact": {
      display: "none",
    },
    "& .titleSection": {
      fontSize: "32px",
    },
    "& .boxCarousel": {
      margin: "20px auto",
    },
    "& .contactsAvatar": {
      width: 150,
      height: 150,
      margin: "0 auto -35px auto",
    },
  },
  [theme.breakpoints.up("md")]: {
    "& .gridItem": {
      display: "block",
    },
  },
}));

export const ContactInformation = () => {
  return (
    <Container maxWidth="false" disableGutters={true}>
     
      <Typography variant="subtitle1" className="titleSection">
        Contact information
      </Typography>
      <Box
        className="boxCarousel"
        sx={{
          maxWidth: "1116px",
          margin: "0px auto",
        }}
      >
        <Carousel
          fullHeightHover={false}
          navButtonsAlwaysVisible={true}
          autoPlay={false}
          duration={0}
          navButtonsWrapperProps={{
            className: "buttonsWrapper",
          }}
          navButtonsProps={{
            className: "buttonsPros",
            style: {
              backgroundColor: "#FFF",
              color: "#F4904D",
              padding: "10px",
              boxShadow: "1px 1px 8px 0px #dedede",
            },
          }}
          indicatorIconButtonProps={{
            style: {
              padding: "0px",
              color: "#fff",
              border: "1px solid #B0C9CB",
              margin: "80px 2px",
              width: "14px",
              height: "14px",
            },
          }}
          activeIndicatorIconButtonProps={{
            style: {
              backgroundColor: "#B0C9CB",
              color: "#B0C9CB",
            },
          }}
        >
          {data.startpage.contacts.map(
            ({ firstname, lastname, email, role, bio, url_photo }, i) => (
              <Paper key={i} elevation={0}>
                <Grid container>
                  <Grid item xs={1}></Grid>
                  <Grid
                    item
                    sm={12}
                    lg={1}
                    sx={{
                      marginTop: "100px",
                      marginRight: "0px",
                      zIndex: 1,
                    }}
                  >
                    <Avatar
                      className="contactsAvatar"
                      src={url_photo}
                      alt="Personal"
                      sx={{ width: 147, height: 147 }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={7}
                    sx={{
                      background: "#FAFAFA",
                      padding: "40px 96px",
                      width: "636px",
                    }}
                  >
                    <Typography variant="subtitle4">
                      {firstname} {lastname}
                    </Typography>
                    <Typography
                      variant="body3"
                      sx={{ margin: "4px auto", textTransform: "uppercase" }}
                    >
                      {role}
                    </Typography>
                    <Typography
                      variant="body3"
                      sx={{
                        color: " rgba(0, 53, 65, 0.4)",
                      }}
                    >
                      {email}
                    </Typography>
                    {bio.split("<br/>").map((parrafo, j) => (
                      <Typography key={j} variant="body3">
                        {parrafo}
                      </Typography>
                    ))}{" "}
                  </Grid>
                </Grid>
              </Paper>
            )
          )}
        </Carousel>
      </Box>
    </Container>
  );
};
