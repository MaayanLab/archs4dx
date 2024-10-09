import { Box } from "@mui/material";
import { SidebarSearch } from "./sidebar-search";
import { SidebarCollectionsSelect } from "./sidebar-collections-select";
import CustomProgressBar from "./sidebar-storage";
import { DragAndDrop } from "./drag-and-drop-component";
import { Container } from "@mui/system";
import { CreateCollection } from "./create-collection";

export const SidebarContent = ({ user }) => {
  return (
    <>
      <SidebarSearch />
      <Box sx={{ margin: "20px" }}>
        <SidebarCollectionsSelect user={user} />
        <Container
          maxWidth="false"
          disableGutters={true}
          sx={{ borderTop: "1px solid #B0C9CB", margin: "50px auto 60px auto" }}
        >
          <CreateCollection user={user} />
        </Container>
        <DragAndDrop />
        <CustomProgressBar />
      </Box>
    </>
  );
};
