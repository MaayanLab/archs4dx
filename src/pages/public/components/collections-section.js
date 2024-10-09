import { Typography, Paper, Grid, Box, useMediaQuery } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import data from "../../../data/config.json";
import { CollectionCard } from "./collection-card";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  overflow: "hidden",
  padding: "100px 0 20px 0",
  [theme.breakpoints.down("lg")]: {
    padding: "20px 0",
    "& .titleSection": {
      fontSize: "32px",
    },
    "& .carouselItem": {
      margin: "20px 0",
    },
    "& .dataText": {
      padding: "0 15px",
    },
  },
  [theme.breakpoints.up("md")]: {},
}));

export const DataCollections = () => {
  const smallScreens = useMediaQuery("(max-width: 1024px)");

  const { ids_list, title } = data.startpage.collections_highlight;

  const MAX_ENTRIES_PER_SLIDE = smallScreens ? 1 : 3;

  const entriesPerSlide =
    ids_list.length > MAX_ENTRIES_PER_SLIDE
      ? MAX_ENTRIES_PER_SLIDE
      : ids_list.length;
  const slides = [];

  for (let i = 0; i < ids_list.length; i += entriesPerSlide) {
    slides.push(
      <Paper
        key={i}
        elevation={0}
        sx={{
          backgroundColor: "transparent",
          margin: "auto",
          animation: "none",
        }}
      >
        <Grid container alignItems="center" justifyContent="center">
          {ids_list.slice(i, i + entriesPerSlide).map((id, j) => (
            <CollectionCard id={id} key={j} />
          ))}
        </Grid>
      </Paper>
    );
  }

  return (
    <Container maxWidth="false" disableGutters={true}>
      <Typography variant="subtitle1" className="titleSection">
        Data Collections
      </Typography>
      <Typography
        variant="body1"
        sx={{
          maxWidth: "610px",
          margin: "20px auto",
          textAlign: "center",
        }}
        className="dataText"
      >
        {title}
      </Typography>
      <Box>
        <Carousel
          autoPlay={false}
          duration="700"
          sx={{ margin: "80px 61px" }}
          fullHeightHover={false}
          navButtonsAlwaysVisible={true}
          className="carouselItem"
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
              margin: "0 2px",
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
          {slides}
        </Carousel>
      </Box>
    </Container>
  );
};
