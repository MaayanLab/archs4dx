import { Grid, Box, Link, Typography } from "@mui/material";
import blobImg from "../image/footer-blob-gradient.svg";
import data from "../data/config.json";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    "& .footerBox": {
      height: "auto",
    },
    "& .rightsBox": {
      margin: "auto",
    },
    "& .gridContainer": {
      padding: "0px 10px",
    },
    "& .imageFooter": {
      margin: "20px auto",
      display: "flex",
      justifyContent: "center",
    },
    "& .blobBox": {
      display: "none",
    },
    "& .rightsText": {
      margin: "15px auto",
      textAlign: "center",
    },
    "& .rightsLogo": {
      margin: "15px auto",
      display: "flex",
      justifyContent: "center",
    },
  },
}));

export const FooterSection = () => {
  return (
    <Container>
      <Box
        className="footerBox"
        sx={{
          background: "#FAFAFA",
          position: "relative",
          height: "276px",
          bottom: 0,
        }}
      >
        <Grid
          container
          className="gridContainer"
          sx={{
            padding: "0px 80px 0 160px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Grid item xs={12} lg={1} className="imageFooter">
            <img
              src={data.general.footer.image_url}
              alt="footer logo"
              style={{ width: "111px" }}
            />
          </Grid>
          <Grid item xs={12} lg={5} sx={{ padding: "0 25px" }}>
            <Typography>{data.general.footer.description}</Typography>
          </Grid>
          <Grid item xs={0} lg={1}></Grid>
          <Grid
            item
            xs={1}
            sx={{ borderLeft: "1px solid #B0C9CB", height: "100%" }}
          ></Grid>
          <Grid
            item
            xs={7}
            lg={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "25px 0",
              margin: "auto 0",
              justifyContent: "center",
            }}
          >
            {data.general.footer.links.map(({ text, url }) => (
              <Link href={url} key={url}>
                {text}
              </Link>
            ))}
          </Grid>
          <Grid
            item
            xs={3}
            lg={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "auto 15px",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "-154px",
              }}
              className="blobBox"
            >
              <img src={blobImg} alt="Blob grandient" />
            </Box>
            <Box
              sx={{
                width: 106,
                height: 93,
                marginTop: "30px",
              }}
            >
              
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box
        className="rightsBox"
        sx={{
          height: "181px",
          margin: "auto 160px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container>
          <Grid item xs={12} lg={8}>
            <Typography
              className="rightsText"
              sx={{
                fontWeight: 500,
              }}
            >
              © 2024 {data.general.projectname}. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} lg={4} className="rightsLogo">
            <img
              src={data.general.project_logo}
              alt="logo"
              style={{ width: "182px", height: "auto" }}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
