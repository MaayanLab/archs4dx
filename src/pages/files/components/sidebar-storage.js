import { Grid, Typography } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Box, styled } from "@mui/system";
import { useQuery } from "react-query";
import { getUserStorage } from "../../../api/user";
import getReadableFileSizeString from "../../../common/readable-file-size";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#B0C9CB",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#0F7F90",
  },
}));

export default function CustomProgressBar() {
  const {
    data: storage,
    isLoading,
    error,
  } = useQuery(["userStorage"], () => getUserStorage());

  const normalise = () =>
    ((storage.file_quota_used - 0) * 100) / (storage.file_quota - 0);

  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  return (
    <Box sx={{ flexGrow: 1, padding: "24px 0" }}>
      <BorderLinearProgress
        variant="determinate"
        value={normalise(storage.file_quota_used)}
      />
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          margin: "12px auto",
          alignItems: "center",
        }}
      >
        <Grid item>
          <Typography variant="countFilter">Storage</Typography>{" "}
        </Grid>
        <Grid item>
          <Typography sx={{ fontSize: "14px", fontWeight: "400" }}>
            {getReadableFileSizeString(storage.file_quota_used, "MB")} /{" "}
            {getReadableFileSizeString(storage.file_quota, "MB")}
          </Typography>{" "}
        </Grid>
      </Grid>
    </Box>
  );
}
