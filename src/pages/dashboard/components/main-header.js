import { Breadcrumbs, Container, Typography } from "@mui/material";
import { getCollection } from "../../../api/collection";
import { useQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import backIcon from "../../../image/breadcrums-back.svg";

const SEARCH_NAME = "Data Search";
const SEARCH_DESCRIPTION =
  "Search and download the files you need. To upload files you need to Request Data Access from the menu.";

export const MainHeader = () => {
  const location = useLocation();
  const isCollection = !!location.pathname.match(/^\/collection/);
  const { collectionId } = useParams();
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
        <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "24px 0" }}>
          <Link
            to="/search"
            style={{
              textDecoration: "none",
              color: "#F4904D",
              fontSize: "16px",
              fontWeight: "400",
              display: "flex",
            }}
          >
            <img src={backIcon} alt="Back icon" />
            Search page
          </Link>
          <Typography color="#005163">{collection.name}</Typography>
        </Breadcrumbs>
      )}
      <Typography
        variant="subtitle1"
        sx={{ textAlign: "left", margin: "24px auto 8px auto" }}
      >
        {isCollection ? collection.name : SEARCH_NAME}
      </Typography>
      <Typography variant="body4" sx={{ margin: "0px auto" }}>
        {isCollection ? collection.description : SEARCH_DESCRIPTION}
      </Typography>
    </Container>
  );
};
