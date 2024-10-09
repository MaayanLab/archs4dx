import { fetchPublic } from "./fetch";

export const getUser = async (id) => {
  if (id) {
    return fetchPublic(`/user/${id}`);
  }
  return fetchPublic("/user");
};

export const getUserFiles = async ({ offset = 0, limit = 1000 }) => {
  const response = await fetchPublic(
    "/user/file?offset=" + offset + "&limit=" + limit
  );
  return response;
};

export const patchUser = async (data) => {
  const response = await fetchPublic("/user", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteUser = async (id) => {
  const response = await fetchPublic("/user/" + id, { method: "DELETE" });
  return response;
};

export const getLoggedUser = async () => {
  const response = await fetchPublic("/user/i");
  return response;
};

export const getUserCollections = async () => {
  const response = await fetchPublic("/user/collection");
  return response.collections;
};

export const getUserStorage = async () => {
  const response = await fetchPublic("/user/storage");
  return response;
};

export const createUser = async (data) => {
  // Create the user with email, first_name, last_name.
  // name is created with first_name and last_name
  // name alwas must be created/updated because /user/search endpoint search users by name
  const dataCreate = {
    name: data.first_name + " " + data.last_name,
    first_name: data.first_name,
    last_name: data.last_name,
    affiliation: data.affiliation,
    email: data.email,
  };

  const response = await fetchPublic("/user", {
    method: "POST",
    body: JSON.stringify(dataCreate),
  });

  // Update new user to add list of roles
  const dataUpdate = {
    id: response.user.id,
    roles: data.roles,
  };

  const response2 = await updateUser(dataUpdate);

  return response2;
};

export const updateUser = async (data) => {
  if (data.first_name || data.last_name) {
    data.name = data.first_name + " " + data.last_name;
  }
  const response = await fetchPublic("/user", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return response;
};

export const searchUser = async (query) => {
  const response = await fetchPublic("/user/search", {
    method: "POST",
    body: JSON.stringify(query),
  });
  return response;
};

export const bulkUser = async (query) => {
  const filteredArray = query.filter((item) => item.hasOwnProperty("name"));
  const response = await fetchPublic("/user/bulk", {
    method: "POST",
    body: JSON.stringify(filteredArray),
  });
  return response;
};
