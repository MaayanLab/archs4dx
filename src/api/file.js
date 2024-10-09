import { isJson } from "../utils/isJson";
import { fetchPublic } from "./fetch";

export const getFile = async (id) => {
  if (id) {
    return fetchPublic("/file/" + id);
  }
  return fetchPublic("/file");
};

export const getFilters = async () => {
  const response = await fetchPublic("/file/filter");
  return response;
};

export const downloadListFiles = async (list) => {
  const response = await fetchPublic("/file/download/list/" + list);
  return response;
};

export const downloadListMetadata = async (list) => {
  const response = await fetchPublic("/file/metadata/list/" + list);
  return response.meta;
};

export const getFileDownloadUrl = async (id) => {
  const response = await fetchPublic("/file/download/" + id);
  return response;
};

export const searchFiles = async ({
  collectionId,
  filters = {},
  owner_id,
  offset = 0,
  limit = 1000,
}) => {
  const validFilters = Object.keys(filters).filter(
    (key) => key !== "/file_info" && filters[key] !== undefined // filter entries that are undefined or file_info
  );
  const filterQuery = {};
  validFilters.forEach((key) => {
    const [category, subCategory] = key.slice(1).split("/");
    if (subCategory) {
      filterQuery[category] = {
        ...(filterQuery[category] ?? {}),
        [subCategory]: filters[key],
      };
    } else {
      filterQuery[category] = filters[key];
    }
  });
  const query = {
    collection_id:
      typeof collectionId === "string" && !Number.isNaN(collectionId)
        ? Number(collectionId)
        : collectionId,
    file_info: filters["/file_info"],
    query: filterQuery,
    offset,
    limit,
    owner_id: owner_id,
  };

  const response = await fetchPublic("/file/search", {
    method: "POST",
    body: JSON.stringify(query),
  });
  return response;
};

export const patchFile = async (data) => {
  const response = await fetchPublic("/file", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteFile = async (id) => {
  const response = await fetchPublic(`/file/${id}`, { method: "DELETE" });
  return response;
};

// Add metadata (data) to a file (id)
export const annotateFile = async (id, data) => {
  if (!isJson(data)) {
    throw new Error("Invalid metadata");
  }
  const response = await fetchPublic(`/file/annotate/${id}`, {
    method: "POST",
    body: data,
  });
  return response;
};
