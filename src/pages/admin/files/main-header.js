import {
  Breadcrumbs,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { getCollection } from "../../../api/collection";
import { useQuery } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import backIcon from "../../../image/breadcrums-back.svg";

const HEADER_NAME = "Files";
const HEADER_DESCRIPTION = "Search and edit files.";

export const MainFilesHeader = ({ user }) => {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collectionId");
  const isCollection = !!collectionId;

  const {
    data: collection,
    isLoading,
    error,
  } = useQuery(
    ["collection", collectionId],
    () => getCollection(collectionId),
    {
      enabled: isCollection,
    }
  );
  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";
  
  return (
    <Container>
      {isCollection && (
        <Grid
          container
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Grid item>
            <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "24px 0" }}>
              <Link
                to="/myfiles"
                style={{
                  textDecoration: "none",
                  color: "#F4904D",
                  fontSize: "16px",
                  fontWeight: "400",
                  display: "flex",
                }}
              >
                <img src={backIcon} alt="Back icon" />
                My Files
              </Link>
              <Typography color="#005163">{collection.name}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      )}
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
