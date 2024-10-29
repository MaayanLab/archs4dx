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
          <Grid item 
            xs={12} 
            md={2} 
            className="imageFooter">
            <img
              src={data.general.footer.image_url}
              alt="footer logo"
              style={{ width: "111px" }}
            />
          </Grid>
          <Grid item xs={8} md={6} sx={{ padding: "0 25px", textAlign: "center"}}>
            <Typography>{data.general.footer.description}</Typography>
          </Grid>
          <Grid
            item
            xs={1}
            sm={1}
            md={1}
            lg={1}
            sx={{ borderLeft: "1px solid #B0C9CB", height: "120px" }}
          ></Grid>
          <Grid
            item
            xs={3}
            md={3}
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
          <Grid item xs={3} lg={3} className="rightsLogo">
            <img
              src={data.general.lab_logo}
              alt="logo"
              style={{ width: "140px", height: "auto"}}
            />
          </Grid>
          <Grid item xs={6} lg={6} className="rightsLogo"></Grid>
          <Grid item xs={3} lg={3} className="rightsLogo">
            <img
              src={data.general.mssm_logo}
              alt="logo"
              style={{ width: "140px", height: "auto" }}
            />
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              className="rightsText"
              sx={{
                textAlign: "center",
                fontWeight: 400,
              }}
            >
              © 2024 {data.general.projectname}. All rights reserved.
            </Typography>
          </Grid>

        </Grid>

      </Box>
    </Container>
  );
};
