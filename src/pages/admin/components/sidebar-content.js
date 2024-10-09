import { Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { SidebarSearch } from "./sidebar-search";
import "./sidebar-content.css";

export const SidebarContent = ({ user }) => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      <SidebarSearch />
      <Box
        sx={{
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: "58px",
        }}
      >
        <Box
          className={
            splitLocation[2] === "users" ? "userButtonActive" : "userButton"
          }
        >
          <Link to="/admin/users" className="sidebarLink">
            Users
          </Link>
        </Box>
        <Box
          className={
            splitLocation[2] === "files" ? "userButtonActive" : "userButton"
          }
        >
          <Link to="/admin/files" className="sidebarLink">
            Files
          </Link>
        </Box>
        <Box
          className={
            splitLocation[2] === "collections"
              ? "userButtonActive"
              : "userButton"
          }
        >
          <Link to="/admin/collections" className="sidebarLink">
            Collections
          </Link>
        </Box>
        <Box
          className={
            splitLocation[2] === "roles" ? "userButtonActive" : "userButton"
          }
        >
          <Link to="/admin/roles" className="sidebarLink">
            Roles
          </Link>
        </Box>
        <Box
          className={
            splitLocation[2] === "policies" ? "userButtonActive" : "userButton"
          }
        >
          <Link to="/admin/policies" className="sidebarLink">
            Policies
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
