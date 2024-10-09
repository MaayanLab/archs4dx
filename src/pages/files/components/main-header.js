import {
  Breadcrumbs,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { getCollection } from "../../../api/collection";
import { useQuery } from "react-query";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import backIcon from "../../../image/breadcrums-back.svg";
import editCollectionIcon from "../../../image/edit-collection-icon.svg";
import { CustomSwitch } from "../../../common/custom-switch";
import { EditCollectionModal } from "./edit-collection-modal";
import { useReducer } from "react";
import { MakePublicCollectionModal } from "./make-collection-public-modal";
import { MakePrivateCollectionModal } from "./make-collection-private-modal copy";

const SEARCH_NAME = "My Files";
const SEARCH_DESCRIPTION =
  "The files and collections on your files are private and only you have access. You can create collections, made them public and/or share with others.";

export const MainHeader = ({ user }) => {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collectionId");
  const isCollection = !!collectionId;

  const location = useLocation();
  const isFilesCollection = !!location.search.match(/collectionId/);

  const [isEditModalOpen, toggleEditModal] = useReducer(
    (state) => !state,
    false
  );

  const [isMakePublicModalOpen, toggleMakePublicModal] = useReducer(
    (state) => !state,
    false
  );

  const [isMakePrivateModalOpen, toggleMakePrivateModal] = useReducer(
    (state) => !state,
    false
  );
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

  const isOpen = collection?.accessibility === "open";
  const isPrivate = collection?.accessibility === "locked";

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
              <Typography color="#005163">
                {collection.id === 1 ? "Unassigned" : collection.name}
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  sx={{ color: "#0F7F90" }}
                  value="start"
                  label="Make Public"
                  control={
                    <CustomSwitch
                      checked={isOpen}
                      onClick={
                        isPrivate
                          ? toggleMakePublicModal
                          : toggleMakePrivateModal
                      }
                    />
                  }
                  labelPlacement="start"
                />
              </FormGroup>
            </FormControl>
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
            {isCollection
              ? collection.id === 1
                ? "Unassigned"
                : collection.name
              : SEARCH_NAME}
          </Typography>
        </Grid>
        <Grid
          item
          sx={{
            margin: "15px 0 0 5px",
            alignItems: "flex-end",
            padding: "5px 10px",
          }}
        >
          {isFilesCollection && (
            <Button onClick={toggleEditModal}>
              <img
                src={editCollectionIcon}
                alt="Edit icon"
                style={{ marginRight: "5px" }}
              />{" "}
              Edit
            </Button>
          )}
        </Grid>
      </Grid>

      <Typography variant="body4" sx={{ margin: "0px auto" }}>
        {isCollection ? collection.description : SEARCH_DESCRIPTION}
      </Typography>
      <EditCollectionModal
        isOpen={isEditModalOpen}
        onClose={toggleEditModal}
        title={isFilesCollection ? collection?.name : ""}
        collection={collection}
        user={user}
      />
      <MakePublicCollectionModal
        isOpen={isMakePublicModalOpen}
        onClose={toggleMakePublicModal}
        collectionId={collectionId}
      />

      <MakePrivateCollectionModal
        isOpen={isMakePrivateModalOpen}
        onClose={toggleMakePrivateModal}
        collectionId={collectionId}
      />
    </Container>
  );
};
