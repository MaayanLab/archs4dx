import {
  Typography,
  Box,
  Grid,
  Paper,
  Link,
  Button,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { format } from "date-fns";
import Carousel from "react-material-ui-carousel";
import blobImg from "../../../image/blob-news.svg";
import blobImg2 from "../../../image/blob-news2.svg";
import twitterIcon from "../../../image/twitter-icon.svg";
import data from "../../../data/config.json";
import { getNews } from "../../../api/public";
import { useQuery } from "react-query";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  backgroundColor: "#EFF4F5",
  padding: "120px 0",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    "& .subtitle": {
      fontSize: "32px",
      margin: "0 auto",
    },
    "& .carouselItem": {
      margin: "20px 0",
    },
  },
}));

export const NewsSection = () => {
  const smallScreens = useMediaQuery("(max-width: 1256px)");

  const { data: news, isLoading, error } = useQuery(["news"], () => getNews());

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  const MAX_ENTRIES_PER_SLIDE = smallScreens ? 1 : 2;
  const entriesPerSlide =
    news.length > MAX_ENTRIES_PER_SLIDE ? MAX_ENTRIES_PER_SLIDE : news.length;
  const slides = [];

  for (let i = 0; i < news.length; i += entriesPerSlide) {
    slides.push(
      <Paper
        key={i}
        elevation={0}
        sx={{
          width: "fit-content",
          backgroundColor: "transparent",
          margin: "auto",
        }}
      >
        <Grid container justifyContent="center">
          {news.slice(i, i + entriesPerSlide).map((tweet, j) => (
            <Grid
              item
              key={j}
              sx={{
                maxWidth: "540px",
                width: "70%",
                minHeight: "422px",
                margin: "10px",
                backgroundColor: "#FFF",
                padding: "24px 34px 64px 34px",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Box>
                <Grid
                  container
                  sx={{
                    borderBottom: "1px solid #B0C9CB",
                  }}
                >
                  <Grid item>
                    <Avatar
                      src={data.startpage.news.profile_image_url}
                      alt="avatar twitter"
                      sx={{
                        filter:
                          "drop-shadow(0px 0px 15px rgba(243, 139, 151, 0.15))",
                        margin: "17px 10px",
                        width: "48px",
                        height: "48px",
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      href={`https://www.twitter.com/${data.startpage.news.username}`}
                      target="_blank"
                      rel="noopener"
                      variant="text"
                      sx={{
                        margin: "14px 0 0 0",
                        fontWeight: 500,
                        fontSize: "20px",
                        padding: "6px 8px 6px 0",
                      }}
                    >
                      {data.startpage.news.name} @{data.startpage.news.username}
                    </Button>
                    <Typography
                      variant="body3"
                      sx={{
                        textTransform: "uppercase",
                        color: "rgba(0, 53, 65, 0.4)",
                        marginBottom: "15px",
                      }}
                    >
                      {format(new Date(tweet.created_at), "MMM dd, yyyy")}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Typography variant="body4">{tweet.text}</Typography>
              </Box>
              <Grid container alignItems="center">
                <Grid item sx={{ height: "35px", margin: "0 10px 0 0" }}>
                  <img src={twitterIcon} alt="twitter icon" />
                </Grid>
                <Grid item>
                  <Link
                    href={`https://twitter.com/${data.startpage.news.username}/status/${tweet.id}`}
                    target="_blank"
                    rel="noopener"
                    color="secondary"
                    sx={{
                      marginTop: "5px",
                    }}
                  >
                    View in Twitter
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  }

  return (
    <Container maxWidth="false" disableGutters={true}>
      <Typography
        variant="body3"
        sx={{ textAlign: "center", margin: "0 auto" }}
      >
        PRESS
      </Typography>

      <Typography
        variant="subtitle1"
        className="subtitle"
        sx={{ position: "relative", width: "fit-content" }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-32px",
            right: "-418px",
            zIndex: "2",
          }}
        >
          <img src={blobImg} alt="blob gradient" />
        </Box>
        <Box sx={{ position: "absolute", top: "-102px", right: "-162px" }}>
          <img src={blobImg2} alt="blob gradient" />
        </Box>
        {data.general.projectname} In the News
      </Typography>
      <Box>
        <Carousel
          animation="slide"
          duration="700"
          className="carouselItem"
          sx={{ margin: "80px 61px 10px 61px" }}
          fullHeightHover={false}
          navButtonsAlwaysVisible={true}
          autoPlay={false}
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
          {slides}
        </Carousel>
      </Box>
    </Container>
  );
};
