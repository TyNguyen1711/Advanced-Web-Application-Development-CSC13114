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
  setIndexForSemanticSearch: async () => {
    const response = await apiClient.post(
      `/search/semantic/index?page-size=20`,
      {}
    );
    return response.data;
  },
  semanticSearch: async (keyword, pageToken) => {
    const response = await apiClient.post(`/search/semantic`, {
      query: keyword,
      page_token: pageToken || null,
    });
    return response.data;
  },
  autoSuggestions: async (keyword) => {
    const response = await apiClient.get(
      `/search/suggestions?query=${keyword}&limit=5`
    );
    return response.data;
  },
};
export default searchApi;
