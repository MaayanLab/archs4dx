import { Switch } from "@mui/material";
import { styled } from "@mui/system";

export const CustomSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 58,
  height: 38,
  margin: "10px",
  padding: 12,
  "& .MuiSwitch-switchBase": {
    margin: 8,
    padding: 0,

    "&.Mui-checked": {
      color: "#fff",

      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#0F7F90",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#FFFFFF",
    width: 20,
    height: 20,
    boxShadow:
      "0px 2px 3px -1px rgba(0, 0, 0, 0.2), 0px 1px 3px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);",
  },
  "& .MuiSwitch-track": {
    opacity: "0.5",
    backgroundColor: "#0F7F90",
    borderRadius: 20 / 2,
  },
}));
