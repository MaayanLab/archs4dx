import { Grid, Typography, Button } from "@mui/material";
import data from "../../../data/config.json";
import { styled } from "@mui/system";

const Container = styled("div")(({ theme }) => ({
  padding: "80px 0",
  textAlign: "center",
  [theme.breakpoints.down("lg")]: {
    padding: "40px 0",
    "& .titleSection": {
      fontSize: "32px",
    },
    "& .mediaButtons": {
      margin: "20px 30px",
    },
  },
}));

export const StayConnected = () => {
  return (
    <Container maxWidth="false" disableGutters={true}>
      <Typography variant="subtitle4" className="titleSection">
        Stay connected with {data.general.projectname}
      </Typography>
      <Grid
        container
        sx={{
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {data.general.socialmedia.map(({ alt_name, url, icon_url }, i) => (
        <Grid item key={i}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mediaButtons"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="secondary">
              <img
                src={icon_url}
                alt={`${alt_name} icon`} 
                style={{ margin: "0 10px 0 0" }}
              />
              {alt_name}
            </Button>
          </a>
        </Grid>
      ))}
      </Grid>
    </Container>
  );
};
