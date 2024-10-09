import { FormGroup } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledFormGroup = styled(FormGroup)(() => ({
  "& .MuiCheckbox-root": {
    padding: "9px 9px 9px 14px",
  },
  "& .MuiCheckbox-root svg": {
    width: 20,
    height: 20,
    boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
    color: "#fff",
    borderRadius: 4,
  },
  "& .MuiCheckbox-root svg path": {
    d: "path('M13.3332 4.50974L5.99984 11.8431L2.6665 8.50974')",
    boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
    color: "transparent",
  },
  "& .MuiCheckbox-root.Mui-checked svg path": {
    width: 20,
    height: 20,
    d: "path('M 13.3332 4.50974 L 5.99984 11.8431 L 2.6665 8.50974')",
    stroke: "rgb(244, 144, 77)",
    transform: "scale(1.5)",
  },
  "& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg": {
    borderColor: "transparent",
    boxShadow: "0px 0px 6px rgba(244, 144, 77, 0.25)",
  },
  "& .MuiCheckbox-root.Mui-checked(.MuiCheckbox-indeterminate) svg": {
    borderColor: "transparent",
    boxShadow: "0px 0px 6px rgba(0, 43, 52, 0.25)",
  },
}));
