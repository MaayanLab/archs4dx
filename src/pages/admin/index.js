import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { SidebarContent } from "./components/sidebar-content";
import { UserMenu } from "../dashboard/components/user-menu";
import data from "../../data/config.json";
import { MainFilesHeader } from "./files/main-header";
import { MainFilesTable } from "./files/main-table";
import { FilterContextProvider } from "./filter-context";
import { Helmet } from "react-helmet-async";
import { getLoggedUser } from "../../api/user";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { MainCollectionsHeader } from "./collections/main-header";
import { MainCollectionsTable } from "./collections/main-table";
import { MainRolesHeader } from "./roles/main-header";
import { MainRolesTable } from "./roles/main-table";
import { MainPoliciesHeader } from "./policies/main-header";
import { MainPoliciesTable } from "./policies/main-table";
import { MainUsersHeader } from "./users/main-header";
import { MainUsersTable } from "./users/main-table";
import { FooterSection } from "../../layout/compactfooter";
import { useNavigate } from 'react-router-dom';
import logo from "../../image/archs4vector.svg";
import { RetryJobs } from "./components/RetryJobs";
import { TaskControl } from "./components/TaskControl";

const drawerWidth = 344;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  boxShadow: "none",
  background: "#EFF4F5",
  height: "93px",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/logout');
    }, 60 * 1000 * 10);
    return () => clearTimeout(timer);
  }, [navigate]);

  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((state) => !state);
  const params = useParams();
  const isAdminFiles = params.page === "files";
  const isAdminCollections = params.page === "collections";
  const isAdminRoles = params.page === "roles";
  const isAdminPolicies = params.page === "policies";
  const isAdminUsers = params.page === "users";
  const isAdminRetry = params.page === "retry";
  const isAdminTasks = params.page === "tasks";
  const {
    data: user,
    isLoading,
    error,
  } = useQuery(["user/getLoggedUser"], () => getLoggedUser());

  if (isLoading) return "Loading...";
  if (error) {
    setTimeout(() => navigate("/logout"), 0);
    return "There was a problem loading this page";
  }

  return (
    <>
      <Helmet>
        <title>{data.general.project_title}</title>
        <link rel="icon" type="image/png" href={data.general.project_icon} />
        <meta
          name="description"
          content="Beginner friendly page for learning React Helmet."
        />
      </Helmet>
      <FilterContextProvider>
        <Box sx={{ display: "flex" }}>
          <AppBar position="fixed" open={open}>
            <UserMenu sidebarOpen={open} toggleSidebar={toggle} />
          </AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                boxShadow: "12px 0px 24px rgba(0, 81, 99, 0.08)",
                borderRight: "0px",
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <a href="/" style={{ margin: "30px auto" }}>
                <img
                  style={{ width: "180px", marginTop: "6px" }}
                  src={logo}
                  alt="project logo"
                />
              </a>
            </DrawerHeader>
            <SidebarContent user={user} />
          </Drawer>
          <Main open={open}>
            <DrawerHeader />
            {isAdminFiles && (
              <>
                <MainFilesHeader user={user} />
                <MainFilesTable
                  sidebarOpen={open}
                  toggleSidebar={toggle}
                  user={user}
                />
              </>
            )}
            {isAdminCollections && (
              <>
                <MainCollectionsHeader user={user} />
                <MainCollectionsTable
                  sidebarOpen={open}
                  toggleSidebar={toggle}
                  user={user}
                />
              </>
            )}
            {isAdminRoles && (
              <>
                <MainRolesHeader user={user} />
                <MainRolesTable
                  sidebarOpen={open}
                  toggleSidebar={toggle}
                  user={user}
                />
              </>
            )}
            {isAdminPolicies && (
              <>
                <MainPoliciesHeader user={user} />
                <MainPoliciesTable
                  sidebarOpen={open}
                  toggleSidebar={toggle}
                  user={user}
                />
              </>
            )}
            {isAdminUsers && (
              <>
                <MainUsersHeader user={user} />
                <MainUsersTable
                  sidebarOpen={open}
                  toggleSidebar={toggle}
                  user={user}
                />
              </>
            )}
            {isAdminRetry && (
              <RetryJobs />
            )}
            {isAdminTasks && (
              <TaskControl />
            )}
            <FooterSection />
          </Main>
        </Box>
      </FilterContextProvider>
    </>
  );
};