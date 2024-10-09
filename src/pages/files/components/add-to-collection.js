import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import { StyledFormGroup } from "../../../common/styled-form-group";
import { useQuery, useQueryClient } from "react-query";
import { getUserCollections } from "../../../api/user";
import closeIcon from "../../../image/close-icon.svg";
import { CreateBasicCollection } from "./create-basic-collection";
import { useReducer, useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { patchCollection } from "../../../api/collection";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  bgcolor: "#FAFAFA",
  transform: "translate(-50%, -50%)",
  width: "696px",
  boxShadow: 24,
  p: 4,
};

const groupCollections = (collections, currentOwner) => {
  const groupedMap = {
    ownedByMe: {
      label: "My files (Private)",
      collections: [],
    },
    public: {
      label: "Public",
      collections: [],
    },
    sharedWithMe: {
      label: "Shared with me",
      collections: [],
    },
  };

  for (const collection of collections) {
    if (collection.owner_id !== currentOwner) {
      groupedMap.sharedWithMe.collections.push(collection);
    } else if (collection.accessibility === "locked") {
      groupedMap.ownedByMe.collections.push(collection);
    } else if (collection.accessibility === "open") {
      groupedMap.public.collections.push(collection);
    }
  }
  return groupedMap;
};

export const CollectionSelector = ({ label, collections, value, onChange }) => {
  const [isOpen, toggleOpen] = useReducer((state) => !state, true);
  return (
    <Box sx={{ margin: "20px 0", background: "#FFF", borderRadius: "8px" }}>
      <ListItemButton onClick={toggleOpen}>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
        <ListItemText>
          <Typography variant="modalTitle">{label}</Typography>
        </ListItemText>
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemText>
            <StyledFormGroup>
              {collections.map(({ id, name }) => (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <div
                      style={{
                        width: "100%",
                        whiteSpace: "nowrap",
                        position: "relative",
                        margin: "5px 35px",
                      }}
                    >
                      <Box component="div">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={value === id}
                              onChange={() =>
                                onChange(value === id ? null : id)
                              }
                            />
                          }
                          label={name}
                          sx={{
                            maxWidth: "400px",
                            whitespace: "nowrap",
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                          }}
                        />
                      </Box>
                    </div>
                  </Grid>
                </Box>
              ))}
            </StyledFormGroup>
          </ListItemText>
        </List>
      </Collapse>
    </Box>
  );
};

export const AddToCollectionModal = ({
  isOpen,
  onClose,
  user,
  selectionModel,
}) => {
  const currentOwner = user?.id;
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery(["userCollections"], () => getUserCollections());
  const [selectedCollection, setSelectedCollection] = useState(null);
  const groupedCollections = groupCollections(collections, currentOwner);
  const filteredGroups = Object.values(groupedCollections).filter(
    ({ collections }) => collections.length > 0
  );
  const queryClient = useQueryClient();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCollection === null) {
      // TODO: show the user a validation message if no collection was selected
      return;
    }
    const foundCollection = collections.find(
      (entry) => entry.id === selectedCollection
    );
    const {
      id,
      description,
      name,
      collections: innerCollections,
      files,
      image_url,
      visibility,
      accessibility,
      owner_id,
    } = foundCollection;
    const payload = {
      id,
      description,
      name,
      collections: innerCollections,
      files: [...new Set([...selectionModel, ...files])],
      image_url,
      visibility,
      accessibility,
      owner_id,
    };
    try {
      await patchCollection(payload);
      queryClient.invalidateQueries(["collection", id]);
      queryClient.invalidateQueries(["userCollections"]);
      queryClient.invalidateQueries(["files"]);
      setSelectedCollection(null);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };

  const onCloseModal = () => {
    setSelectedCollection(null);
    onClose();
  };

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  return (
    <Modal
      open={isOpen}
      onClose={onCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="TermsModal"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="subtitle4"
            sx={{ display: "block", textAlign: "center", position: "relative" }}
          >
            <Button
              sx={{ position: "absolute", right: "-24px", top: "-18px" }}
              onClick={() => {
                onClose(true);
              }}
            >
              <img src={closeIcon} alt="close icon" />
            </Button>
            Select Collections
          </Typography>

          <Typography
            id="modal-modal-description"
            sx={{ textAlign: "center", margin: "24px auto" }}
          >
            Select the collection that you would like to add these files:
          </Typography>
          <Box
            sx={{
              backgroundColor: "#FFF",
              margin: "24px 60px",
              maxHeight: "350px",
              overflow: "auto",
            }}
          >
            {filteredGroups.map(({ label, collections }, i) => (
              <CollectionSelector
                key={i}
                label={label}
                collections={collections}
                value={selectedCollection}
                onChange={(collectionId) => setSelectedCollection(collectionId)}
              />
            ))}
          </Box>
          <Box
            sx={{
              backgroundColor: "#FFF",
              margin: "24px 60px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CreateBasicCollection
              selectionModel={selectionModel}
              onCreate={onClose}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              margin: "40px auto",
            }}
          >
            <Button
              onClick={onCloseModal}
              variant="secondary"
              sx={{
                fontWeight: "700",
                height: "53px",
                width: "auto",
                padding: "16px 32px",
                background:
                  "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              sx={{
                width: "auto",
                padding: "16px 32px",
                textTransform: "none",
                "&:hover": {
                  boxShadow: "0px 4px 9px rgba(119, 119, 119, 0.50)",
                },
              }}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      </form>
    </Modal>
  );
};
