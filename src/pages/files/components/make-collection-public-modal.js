import { Box, Button, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { getCollection, patchCollection } from "../../../api/collection";
import closeIcon from "../../../image/close-icon.svg";
import confirmIcon from "../../../image/confirm-icon.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  bgcolor: "#FAFAFA",
  transform: "translate(-50%, -50%)",
  width: "696px",
  boxShadow: 24,
  p: 4,
};

export const MakePublicCollectionModal = ({
  isOpen,
  onClose,
  collectionId,
}) => {
  const {
    data: collection,
    isLoading,
    error,
  } = useQuery(["collection", collectionId], () => getCollection(collectionId), {
    enabled: isOpen
  });
  const [payloadToSubmit, setPayloadToSubmit] = useState({});
  const queryClient = useQueryClient();
  const submitForm = async (payload) => {
    payload = payload ?? payloadToSubmit;
    try {
      await patchCollection(payload);
      queryClient.invalidateQueries(["collection", collectionId]);
      queryClient.invalidateQueries(["userCollections"]);
      onClose();
    } catch (e) {
      console.log(e);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: collectionId,
      accessibility: "open",
    };
    submitForm(payload);
    setPayloadToSubmit(payload);
  };

  if(!isOpen){
    return null;
  }
  
  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

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
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="subtitle4"
          sx={{
            display: "block",
            textAlign: "center",
            position: "relative",
            color: "#003541",
            padding: "0 25px",
          }}
        >
          <Button
            sx={{ position: "absolute", right: "-24px", top: "-18px" }}
            onClick={() => {
              onClose(true);
            }}
          >
            <img src={closeIcon} alt="close icon" />
          </Button>
          Turn {collection.name} as public
        </Typography>

        <Typography
          id="modal-modal-description"
          sx={{ textAlign: "center", margin: "24px auto", padding: "0 60px" }}
        >
          This collection will be public. All information will have public
          access. Users can download it but not modify. You can turn it private
          again whenever you want.
        </Typography>
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "#0F7F90", margin: "25px auto" }}
        >
          Confirm you want to make this collection public?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            margin: "40px 25px 0 25px",
            padding: "25px 0",
            borderTop: "1px solid #B0C9CB",
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              width: "auto",
              padding: "16px 32px",
              textTransform: "none",
              background:
                "linear-gradient(90deg, #0F7F90 -8.75%, #00B08A 113.12%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
              outline: "4px solid #B0C9CB",
            }}
          >
            <img
              src={confirmIcon}
              alt="Resquest role icone"
              style={{ margin: "0 8px 0 0" }}
            />
            Yes, Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
