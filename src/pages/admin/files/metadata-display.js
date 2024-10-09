import { TextField } from "@mui/material";
import { Fragment } from "react";
import { useQuery } from "react-query";
import { downloadListMetadata } from "../../../api/file";

export const MetadataDisplay = ({ ids, isEdit }) => {
  const idList = ids.join(",");
  const {
    data: metadataList,
    isLoading,
    error,
  } = useQuery(["metadata", idList], () => downloadListMetadata(idList), {
    enabled: !!idList,
  });
  if (isLoading) return "Loading...";
  if (error) return "There was a problem loading this page";

  return metadataList.map((metadataItem, i) => {
    const metadataAsString = JSON.stringify(metadataItem.metadata, null, 4);
    return (
      <Fragment key={i}>
        {isEdit ? (
          <TextField
            id="metadataTextarea"
            multiline
            defaultValue={metadataAsString}
            variant="standard"
            sx={{
              display: "block",
              marginTop: "20px",
              border: "1px solid #B0C9CB",
              borderRadius: "4px",
              margin: "10px",
              padding: "10px",
            }}
          />
        ) : (
          <pre
            style={{
              width: "95%",
              padding: "10px",
              margin: "10px",
              border: "1px solid #B0C9CB",
              borderRadius: "4px",
            }}
          >
            {metadataAsString}
          </pre>
        )}
      </Fragment>
    );
  });
};
