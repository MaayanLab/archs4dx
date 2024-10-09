import { Grid, Box, Link, Typography } from "@mui/material";
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
