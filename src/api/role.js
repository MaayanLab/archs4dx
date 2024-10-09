import { fetchPublic } from "./fetch";

export const getRole = async (id) => {
  if (id) {
    return fetchPublic(`/role/${id}`);
  }
  return fetchPublic("/role");
};

export const searchRoles = async (query) => {
  const response = await fetchPublic("/role/search", {
    method: "POST",
    body: JSON.stringify(query),
  });
  return response;
};

export const createRole = async (data) => {
  const response = await fetchPublic("/role", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

export const patchRole = async (data) => {
  const response = await fetchPublic("/role", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteRole = async (id) => {
  const response = await fetchPublic(`/role/${id}`, { method: "DELETE" });
  return response;
};
