import { fetchPublic } from "./fetch";

export const getCollections = async () => {
  const { collections } = await fetchPublic("/collection");
  return collections;
};

export const getCollection = async (id) => {
  const response = await fetchPublic(`/collection/${id}`);
  return response;
};

export const getCollectionFiles = async (id, offset = 0, limit = 1000) => {
  const response = await fetchPublic(
    "/collection/" + id + "/files?offset=" + offset + "&limit=" + limit
  );
  return response.files;
};

export const patchCollection = async (data) => {
  const response = await fetchPublic("/collection", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

export const createCollection = async (data) => {
  const response = await fetchPublic("/collection", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const data2 = {
    id: response.collection.id,
    collections: data.collections,
    files: data.files,
  };

  const response2 = await patchCollection(data2);

  return response2;
};

export const deleteCollection = async (id) => {
  const response = await fetchPublic(`/collection/${id}`, { method: "DELETE" });
  return response;
};

export const searchCollection = async ({ filters = {} }) => {
  const validFilters = Object.keys(filters).filter(
    (key) => key !== "/search" && filters[key] !== undefined // filter entries that are undefined or file_info
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
    search: filters["/search"],
    query: filterQuery,
    offset: 0,
    limit: 500,
  };
  const response = await fetchPublic("/collection/search", {
    method: "POST",
    body: JSON.stringify(query),
  });
  return response;
};
