import { Box, Button } from "@mui/material";
import { SidebarSearch } from "./sidebar-search";
import BackIcon from "../../../image/back-all-icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarCollectionsSelect } from "./sidebar-collections-select";
import { SidebarFiltersSelect } from "./sidebar-filters-select";

export const SidebarContent = () => {
  const location = useLocation();
  const isCollection = !!location.pathname.match(/^\/collection/);
  const navigate = useNavigate();

  return (
    <>
      <SidebarSearch />
      {isCollection && (
        <Button
          sx={{
            margin: "0 22px",
            color: "#0F7F90",
            textTransform: "none",
            backgroundColor: "#FAFAFA",
            padding: "12px",
            borderRadius: "8px",
          }}
          onClick={() => navigate(`/search`)}
        >
          <img src={BackIcon} alt="Back icon" style={{ marginRight: "10px" }} />
          Back to all collections
        </Button>
      )}

      <Box
        sx={{ margin: "0px 20px", background: "#FAFAFA", borderRadius: "8px" }}
      >
        {!isCollection && <SidebarCollectionsSelect />}
      </Box>
      <Box>
        <SidebarFiltersSelect />
      </Box>
    </>
  );
};
