import { useQuery } from "react-query";
import { downloadListMetadata } from "../../../api/file";

export const MetadataDisplay = ({ ids }) => {
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
      <pre
        key={i}
        style={{
          background: "#FAFAFA",
          width: "95%",
          padding: "10px",
          margin: "10px",
        }}
      >
        {metadataAsString}
      </pre>
    );
  });
};
