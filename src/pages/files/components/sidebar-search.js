import { useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import searchIcon from "../../../image/search-icon.svg";
import { styled } from "@mui/material/styles";
import { useFilterContext } from "../filter-context";

const ListChipItem = styled("li")(({ theme }) => ({
  margin: "5px",
  "& div": {
    background: "#EFF4F5",
    color: "rgba(0, 81, 99, 1)",
    fontSize: "13px",
    fontWeight: "400",
    "& svg": {
      fill: "rgba(176, 201, 203, 1)",
    },
  },
}));

export const SidebarSearch = () => {
  const [value, setValue] = useState("");
  // const [chipData, setChipData] = useState([]);

  const { setFileInfoFilter, filterState } = useFilterContext();

  const handleDelete = (_chipToDelete) => () => {
    // setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    setFileInfoFilter(undefined);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setChipData((chips) => [...new Set([...chips, value])]); use this line for multiple chips
    setFileInfoFilter(value);
    setValue("");
  };

  const chipData = filterState["/file_info"];

  return (
    <Box sx={{ margin: "20px" }} as="form" onSubmit={handleSubmit}>
      <FormControl
        id="outlined-basic"
        variant="outlined"
        color="info"
        sx={{
          width: "100%",
        }}
      >
        <OutlinedInput
          placeholder="Search"
          id="outlined-adornment-password"
          sx={{
            position: "relative",
            paddingLeft: "25px",
            height: "40px",
            outline: "0px",
            fontSize: "16px",
          }}
          name="file_info"
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          endAdornment={
            <InputAdornment
              position="start"
              sx={{
                zIndex: "2",
                position: "absolute",
                left: "5px",
              }}
            >
              <img src={searchIcon} alt="search icon" />
            </InputAdornment>
          }
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            flexWrap: "wrap",
            listStyle: "none",
            p: 0.5,
            m: 0,
          }}
          component="ul"
        >
          {chipData && (
            <ListChipItem>
              <Chip label={chipData} onDelete={handleDelete(chipData)} />
            </ListChipItem>
          )}
        </Box>
      </FormControl>
    </Box>
  );
};
