import { Box, Button, Grid, Link, Modal, Typography } from "@mui/material";
import closeIcon from "../image/close-icon.svg";
import "./terms-and-conditions.css";

const styleTerms = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "654px",
  height: "714px",
  overflowY: "scroll",
  bgcolor: "#FAFAFA",
  border: "0px",
  boxShadow: 24,
  padding: "40px",
  borderRadius: "8px",
};
export const TermsConditionsModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="TermsModal"
      sx={{
        background:
          "linear-gradient(90deg, rgba(15, 127, 144, 0.8) -8.75%, rgba(0, 176, 138, 0.8) 113.12%);",
      }}
    >
      <Box sx={styleTerms}>
        <Grid container sx={{ flexWrap: "nowrap", justifyContent: "center" }}>
          <Grid item xs={2}></Grid>
          <Grid item>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "34px",
                lineHeight: "42px",
                letterSpacing: "0.25px",
                position: "relative",
                margin: "40px auto 6px auto",
                textAlign: "center",
              }}
            >
              Terms & Conditions
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item>
            <Button onClick={onClose} sx={{ margin: "40px auto 16px auto" }}>
              <img src={closeIcon} alt="close icon" />
            </Button>
          </Grid>
        </Grid>

        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          As a user of Innovative Health Data Hub you agree to the Terms and Conditions of
          Services defined herein and where applicable the terms defined by the
          NIH Genomic Data User Code of Conduct. These terms include, but are
          not limited to:
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          You will request controlled-access datasets solely in connection with
          an IRB approved research project
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          You will make no attempt to identify or contact individual
          participants or groups from whom data was collected, or generate
          information that could allow participants’ identities to be readily
          ascertained{" "}
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          You will not distribute controlled-access datasets to any entity or
          individual beyond those specified in an approved Data Access Request
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          You will adhere to computer security practices in compliance with NIH
          Security Best Practices for Controlled-Access Data such that only
          authorized individuals possess access to data files
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          You acknowledge Intellectual Property Policies should they exist as
          specified in a dataset’s associated Data Use Certification
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          You will report any inadvertent data release in accordance with the
          terms of the Data Use Certification, breach of data security, or other
          data management incidents contrary to the terms of data access
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          These terms and conditions may be changed at any time via a public
          posting of revisions to LymeCommons
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          {" "}
          As a user, you agree to review the Terms & Conditions each time you
          use LymeCommons so that you are aware of any modifications made to
          these policies
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          By accessing or using LymeCommons, you agree with all terms and
          conditions and policies
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          For data available from LymeCommons, the developers and administrators
          of LymeCommons do not warrant or assume any legal liability or
          responsibility for the accuracy, completeness, or usefulness of any
          information, apparatus, product, or process
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          {" "}
          No specific medical advice is provided by LymeCommons
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px" }}>
          {" "}
          Please consult with a qualified physician for diagnosis and for
          answers to personal questions
        </Typography>
        <Typography variant="body4" sx={{ margin: "25px 20px 5px 20px" }}>
          Please consult with a qualified physician for diagnosis and for
          answers to personal questions
        </Typography>
        <Typography variant="body4" sx={{ margin: "0px 20px" }}>
          {" "}
          NIH Genomic Data Sharing Policy:{" "}
          <Link
            sx={{ textDecoration: "none", color: "rgba(15, 127, 144, 1)" }}
            href="https://grants.nih.gov/grants/guide/notice-files/NOT-OD-14-124.html"
          >
            https://grants.nih.gov/grants/guide/notice-files/NOT-OD-14-124.html
          </Link>
        </Typography>
      </Box>
    </Modal>
  );
};
