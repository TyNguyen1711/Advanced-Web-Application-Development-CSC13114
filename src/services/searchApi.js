import apiClient from "./apiClient";
import { tokenManager } from "./apiClient";

const searchApi = {
  searchEmails: async (keyword, pageToken) => {
    const response = await apiClient.get(
      `/search/fuzzy?keyword=${keyword}${
        pageToken ? `&page-token=${pageToken}` : ""
      }`
    );
    return response.data;
  },
};
export default searchApi;
