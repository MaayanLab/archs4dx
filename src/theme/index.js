import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    info: { main: "#005163" },
  },

  components: {
    MuiLink: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            textDecoration: "none",
            background:
              "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "16px",
            margin: "6px 0",
          },
        },
        {
          props: { color: "secondary" },
          style: {
            background:
              "linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "16px",
            textDecoration: "none",
            width: "fit-content",
            "&:hover": {
              borderBottom: "1px solid #F4904D",
            },
          },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "primary" },
          style: {
            fontWeight: 700,
            color: "#fff",
            width: "109px",
            height: "53px",
            margin: "auto 30px",
            background:
              "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
            outline: "4px solid rgba(0, 81, 99, 0.1)",
            boxShadow: "0px 4px 9px rgba(0, 176, 138, 0.22)",
            borderRadius: " 80px",
            flex: "none",
            order: "1",
            flexGrow: "0",
          },
        },
        {
          props: { variant: "secondary" },
          style: {
            fontWeight: 400,
            fontSize: "14px",
            color: "#005163",
            margin: "auto 30px",
            background: "#FAFAFA",
            outline: "4px solid #EFF4F5",
            borderRadius: " 80px",
            padding: "18px 34px",
          },
        },
        {
          props: { variant: "text" },
          style: {
            fontWeight: 700,
            fontSize: "15px",
            lineHeight: "21px",
            letterSpacing: "0.46px",
            outline: "0px",
            boxShadow: "0px 0px 0px",
            margin: "auto 0",
            textTransform: "capitalize",
            color: "#003541",
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
        {
          props: { variant: "outline" },
          style: {
            padding: "6px 20px",
            background: "#FAFAFA",
            boxShadow: " 0px 4px 9px rgba(0, 43, 52, 0.12)",
            borderRadius: "6px",
            width: "100%",
            height: "44px",
            textAlign: "left",
            justifyContent: "flex-start",
            margin: "12px auto",
          },
        },
        {
          props: { variant: "contained" },
          style: {
            fontWeight: 700,
            fontSize: "15px",
            height: "50px",
            background:
              "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
            margin: "auto 30px",
            outline: "4px solid rgba(176, 201, 203, 0.22);",
            borderRadius: " 80px",
            textTransform: "capitalize",
            padding: "10px 28px 10px 25px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              background: "rgba(176, 201, 203, 1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            },
          },
        },
        {
          props: { variant: "view" },
          style: {
            fontSize: "14px",
            fontWeight: "700",
            textTransform: "capitalize",
            background:
              " linear-gradient(97.08deg, #F38B97 20.01%, #F4904D 75.82%)",
            webkitbackgroundclip: "text",
            webkittextfillcolor: "transparent",
            backgroundClip: "text",
            textFillColor: "transparent",
          },
        },
      ],
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          "&::before": {
            borderBottom: "0px solid black",
          },
          "&::after": {
            borderBottom: "0px solid black",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottom: "0px solid black",
          },
          "&:hover:not(.Mui-disabled):after": {
            borderBottom: "0px solid black",
          },
        },
      },
    },
  },

  typography: {
    fontFamily: [
      "Chakra Petch",
      "-apple-system",
      "BlinkMacSystemFont",
      "sans-serif",
    ].join(","),
    body1: {
      color: "#003541",
      fontWeight: 400,
      fontSize: "16px",
    },
    body2: {
      fontWeight: 400,
      fontSize: "24px",
      lineHeight: "133.4%",
    },
    body3: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "166%",
      display: "block",
      color: "#003541",
    },
    body4: {
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "24px",
      display: "block",
      color: "#003541",
      letterSpacing: "0.01em",
    },
    text1: {
      fontWeight: 500,
      fontSize: "20px",
      lineHeight: "32px",
      display: "block",
      color: "#003541",
      letterSpacing: "0.15px",
    },
    subtitle1: {
      color: "#0F7F90",
      fontWeight: 400,
      fontSize: "48px",
      lineHeight: "72px",
      letterSpacing: " -0.5px",
      margin: "0 auto 20px auto",
      textAlign: "center",
    },
    subtitle2: {
      color: "#0F7F90",
      fontWeight: 300,
      fontSize: "60px",
      lineHeight: "72px",
      letterSpacing: " -0.5px",
      marginBottom: "20px",
    },
    subtitle3: {
      fontWeight: 400,
      fontSize: "34px",
      lineHeight: "42px",
      letterSpacing: "0.25px",
    },
    subtitle4: {
      fontWeight: 400,
      fontSize: "34px",
      lineHeight: "42px",
      letterSpacing: "0.25px",
      color: "#0F7F90",
      margin: "auto",
      textAlign: "center",
    },
    modalTitle: {
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "0.15px",
      margin: "0 4px",
    },
    modalSubtitle: {
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "24px",
      letterSpacing: "0.15px",
      margin: "0 4px",
      color: "rgba(0, 53, 65, 0.4)",
      display: "block",
    },
    countFilter: {
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "16px",
      letterSpacing: "0.09em",
    },
    uploadTextLight: {
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "20px",
      letterSpacing: "0.17px",
      color: "rgba(0, 53, 65, 0.4);",
    },
  },
});
