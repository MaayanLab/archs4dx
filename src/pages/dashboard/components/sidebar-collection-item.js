import viewIcon from "../../../image/view-icon.svg";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { useReducer } from "react";
import { ViewDetailCollection } from "./view-detail-collection";
import { ViewModal } from "../../../common/view-modal";
import { useNavigate } from "react-router-dom";

export const SidebarCollectionItem = ({ id, name, files }) => {
  const [isEditModalOpen, toggleEditModal] = useReducer(
    (state) => !state,
    false
  );
  

  const navigate = useNavigate();

  return (
    <Box
      key={id}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center">
        <div style={{ width: "200px", whiteSpace: "nowrap" }}>
          <Box
            component="div"
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox onClick={() => navigate(`/collection/${id} `)} />
              }
              label={name}
              sx={{
                maxWidth: "197px",
                whitespace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            />
          </Box>
        </div>
        <Typography variant="countFilter">{files.length}</Typography>
      </Grid>
      <Button variant="view" onClick={toggleEditModal}>
        <img src={viewIcon} alt="View icon" style={{ margin: "0 6px" }} />
        View Details
      </Button>
      <ViewModal
        isOpen={isEditModalOpen}
        onClose={toggleEditModal}
        title={`Collection - "${name}" `}
      >
        <ViewDetailCollection
          id={id}
    
        />
      </ViewModal>
    </Box>
  );
};
