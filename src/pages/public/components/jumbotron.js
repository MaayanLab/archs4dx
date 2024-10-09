import { Grid, Box, Typography } from "@mui/material";
import heroImg1 from "../../../image/hero-img-01.png";
import heroImg2 from "../../../image/hero-img-02.png";
import blobImg from "../../../image/blob-gradient.svg";
import data from "../../../data/config.json";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: "#FAFAFA",
  [theme.breakpoints.down("lg")]: {
    "& .jumbotronText": {
      maxWidth: "100%",
      width: "80%",
      margin: "0px auto",
    },
    "& .gridContainer": {
      minHeight: "550px",
    },
    "& .gridItem": {
      display: "none",
    },
    "& .headerTitle": {
      fontSize: "40px",
    },
    "& .headerSubtitle": {
      fontSize: "18px",
    },
    "& .headerAbout": {
      fontSize: "18px",
    },
  },
  [theme.breakpoints.up("md")]: {
    "& .gridItem": {
      display: "block",
    },
  },
}));

export const Jumbotron = () => {
  return (
    <Container
      maxWidth="false"
      disableGutters={true}
      sx={{
        position: "relative",
        backgroundColor: "#FAFAFA",
      }}
    >
      <Grid
        container
        sx={{
          marginTop: "0",
          height: "100%",
          display: "flex",
          minHeight: "860px",
          alignContent: "center",
        }}
        className="gridContainer"
      >
        <Grid
          item
          xs={0}
          lg={6}
          sx={{
            minHeight: "860px",
            position: "relative",
          }}
          className="gridItem"
        >
          <Box
            sx={{
              position: "absolute",
              top: 40,
              left: 150,
              zIndex: "1",
              height: "auto",
            }}
            className="boxImg"
          >
            <img
              src={heroImg2}
              alt="Speaker"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 326,
              left: 340,
              zIndex: "2",
              height: "auto",
            }}
          >
            <img
              src={heroImg1}
              alt="Speaker"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: 315,
              left: 0,
              zIndex: "3",
              height: "auto",
            }}
          >
            <img
              src={blobImg}
              alt="Blob with grandient"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{ maxWidth: "538px", marginTop: "-132px" }}
            className="jumbotronText"
          >
            <Typography variant="subtitle2" className="headerTitle">
              {data.startpage.title}
            </Typography>
            <Typography
              className="headerSubtitle"
              sx={{
                fontSize: " 24px",
                lineHeight: "32px",
                letterSpacing: "0px",
                marginBottom: "20px",
              }}
            >
              {data.startpage.subtitle}
            </Typography>
            <Typography
              className="headerAbout"
              sx={{
                fontSize: "20px",
                fontWeight: "500",
                lineHeight: "32px",
                letterSpacing: " 0.15px",
              }}
            >
              {data.startpage.about}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
