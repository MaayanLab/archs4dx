import * as React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { getCollection } from "../../../api/collection";
import { useQuery } from "react-query";

export const ViewDetailCollection = ({ id }) => {
  const {
    data: collections,
    isLoading,
    error,
  } = useQuery(["collections", id], () => getCollection(id));

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";
  return (
    <Box
      sx={{ padding: "24px", height: "calc(100vh - 180px)", overflow: "auto" }}
    >
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          ID:{" "}
        </Typography>
        <Typography>{collections.id}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Name:{" "}
        </Typography>
        <Typography>{collections.name}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Creation Date:{" "}
        </Typography>
        <Typography>
          {collections.date
            ? collections.date
            : "Missing field"}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Description:{" "}
        </Typography>
        <Typography>{collections.description ? collections.description : "Missing field"}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Image:{" "}
        </Typography>
        <Typography>{collections.image_url ? collections.image_url : "Missing field"}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Collections:{" "}
        </Typography>
        <Typography>{collections.collections}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Files:{" "}
        </Typography>
        <Typography>{collections.files}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Owner Name:{" "}
        </Typography>
        <Typography>{collections.owner.name}</Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Parent Collection:{" "}
        </Typography>
        <Typography>
          {collections.path[0]?.name ? collections.path[0]?.name : "Missing field"}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          Parent Collection ID:{" "}
        </Typography>
        <Typography>
          {collections.parent_collection_id ? collections.parent_collection_id : "Missing field"}
        </Typography>
      </Grid>
      <Grid container justifyContent="space-between" margin="24px 0">
        <Typography variant="modalTitle" sx={{ color: "#0F7F90" }}>
          uuid:{" "}
        </Typography>
        <Typography>{collections.uuid}</Typography>
      </Grid>
    </Box>
  );
};
