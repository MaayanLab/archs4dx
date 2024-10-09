import folderIcon from "../../../image/folder-icon.svg";
import folderBlackIcon from "../../../image/folder-black-icon.svg";
import { Box, Button, Grid } from "@mui/material";
import { useSearchParams } from "react-router-dom";

export const SidebarCollectionItem = ({ id, name }) => {
  const [, setSearchParams] = useSearchParams();
  const handleClick = () => {
    setSearchParams({
      collectionId: id,
    });
  };

  const [searchParams] = useSearchParams();

  const getCollectionId = searchParams.get("collectionId");
  const activeButton = id === Number(getCollectionId);

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
        <div
          style={{
            width: "260px",
            whiteSpace: "nowrap",
            position: "relative",
            margin: "5px auto",
          }}
        >
          <Box component="div">
            <Button
              onClick={handleClick}
              sx={{
                background: activeButton
                  ? "linear-gradient(75.61deg, rgba(244, 144, 77, 0.4) 3.76%, rgba(243, 139, 151, 0.4) 51.01%, rgba(15, 127, 144, 0.4) 98.26%)"
                  : undefined,
                padding: "6px 8px 6px 35px",
                fontSize: "16px",
                fontWeight: "400",
                width: "100%",
                display: "inline-block",
                textAlign: "left",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                zIndex: "5",
                minHeight: "30px",
                "&:hover": {
                  background: "#FFF3EC",
                },
              }}
            >
              {" "}
              {activeButton ? (
                <img
                  src={folderBlackIcon}
                  alt="folder icon"
                  style={{ position: "absolute", left: "5px", top: "2px" }}
                />
              ) : (
                <img
                  src={folderIcon}
                  alt="folder icon"
                  style={{ position: "absolute", left: "5px", top: "2px" }}
                />
              )}
              {name}
            </Button>
          </Box>
        </div>
      </Grid>
    </Box>
  );
};
