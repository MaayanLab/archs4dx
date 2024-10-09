import { fetchPublic } from "./fetch.js";

export const getStats = async () => {
  const response = await fetchPublic("/stats");
  return response;
};

export const getNews = async () => {
  const response = await fetchPublic('/news')
  return response.data;
}

