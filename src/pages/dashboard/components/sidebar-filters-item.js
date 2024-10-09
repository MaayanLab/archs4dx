import {
    Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { StyledFormGroup } from "../../../common/styled-form-group";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Fragment, useReducer } from "react";

export const SidebarFiltersItem = ({ category, detail, toggleFilter, filterState }) => {
    const [isOpen, toggleOpen] = useReducer((state) => !state, true);

  return (
    <Box sx={{ margin: "20px", background: "#FAFAFA", borderRadius: "8px" }}>
      <ListItemButton onClick={toggleOpen}>
        {isOpen ? <ExpandLess /> : <ExpandMore />}
        <ListItemText>
          <Typography
            variant="modalTitle"
            sx={{
              textTransform: "capitalize",
            }}
          >
            {category.replaceAll("/", " ")}
          </Typography>
        </ListItemText>
      </ListItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton>
            <ListItemText>
              <StyledFormGroup>
                <Box
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
                    {Object.keys(detail).map((key) => (
                      <Fragment key={key}>
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
                                <Checkbox
                                  onChange={toggleFilter}
                                  checked={filterState[category] === key}
                                  value={key}
                                  name={category}
                                />
                              }
                              label={key}
                              sx={{
                                maxWidth: "197px",
                                whitespace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            />
                          </Box>
                        </div>
                        <Typography variant="countFilter">
                          {detail[key]}
                        </Typography>
                      </Fragment>
                    ))}
                  </Grid>
                </Box>
              </StyledFormGroup>
            </ListItemText>
          </ListItemButton>
        </List>
      </Collapse>
    </Box>
  );
};
