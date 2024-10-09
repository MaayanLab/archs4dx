import { fetchPublic } from "./fetch";

export const getPolicy = async (id) => {
  if (id) {
    return fetchPublic(`/policy/${id}`);
  }
  return fetchPublic("/policy");
};

export const createPolicy = async (data) => {
  const response = await fetchPublic("/policy", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const deletePolicy = async (id) => {
  const response = await fetchPublic(`/policy/${id}`, { method: "DELETE" });
  return response;
};

export const searchPolicy = async (query) => {
  const response = await fetchPublic("/policy/search", {
    method: "POST",
    body: JSON.stringify(query),
  });
  return response;
};
