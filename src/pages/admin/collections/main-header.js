import { Container, Grid, Typography } from "@mui/material";

const HEADER_NAME = "Collections";
const HEADER_DESCRIPTION = "Create and edit collections.";

export const MainCollectionsHeader = ({ user }) => {
  return (
    <Container>
      <Grid
        container
        sx={{ justifyContent: "flex-start", alignItems: "center" }}
      >
        <Grid item>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "left", margin: "24px auto 8px auto" }}
          >
            {HEADER_NAME}
          </Typography>
        </Grid>
      </Grid>

      <Typography variant="body4" sx={{ margin: "0px auto" }}>
        {HEADER_DESCRIPTION}
      </Typography>
    </Container>
  );
};
