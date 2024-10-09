import { fetchPublic } from "./fetch";

export const getKey = async (id) => {
  return fetchPublic("/user/accesskey");
};

export const createKey = async (expiration) => {
  const response = await fetchPublic(`/user/accesskey/${expiration}`, {method: "POST"});
  return response;
};

export const deleteKey = async (id) => {
  const response = await fetchPublic(`/user/accesskey/${id}`, { method: "DELETE" });
  return response;
};
