import { useReducer } from "react";
import { getCollections } from "../../../api/collection";
import { useQuery } from "react-query";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { StyledFormGroup } from "../../../common/styled-form-group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { SidebarCollectionItem } from "./sidebar-collection-item";

export const SidebarCollectionsSelect = () => {
  const [isOpen, toggleOpen] = useReducer((state) => !state, true);

  const {
    data: collections,
    isLoading,
    error,
  } = useQuery(["collections"], () => getCollections());

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  return (
    <>
      <ListItemButton onClick={toggleOpen}>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
        <ListItemText>
          <Typography variant="modalTitle">Collection</Typography>
        </ListItemText>
      </ListItemButton>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <ListItemText>
              <StyledFormGroup>
                {collections.slice(1).map(({ id, name, files }) => (
                  <SidebarCollectionItem key={id} id={id} name={name} files={files} />
                ))}
              </StyledFormGroup>
            </ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
};
