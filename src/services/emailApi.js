import apiClient from "./apiClient";
import { tokenManager } from "./apiClient";

const emailApi = {
  getThreads: async (page) => {
    const url = `/emails/threads?category=primary&size=10${
      page ? `&page=${page}` : ""
    }`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getThreadById: async (id) => {
    if (id != "") {
      const response = await apiClient.get(`/emails/threads/${id}`);
      return response.data;
    }
    return null;
  },
  sendEmail: async (data) => {
    const response = await apiClient.post("/emails/messages/send", data);
    return response.data;
  },
  modifyEmail: async (data) => {
    const response = await apiClient.post("/emails/messages/modify", data);
    return response.data;
  },
  replyEmail: async (data) => {
    const response = await apiClient.post("/emails/messages/reply", data);
    return response.data;
  },
  forwardEmail: async (data) => {
    const response = await apiClient.post("/emails/messages/forward", data);
    return response.data;
  },
  getAttachment: async (messageId, id) => {
    const response = await apiClient.get(
      `/emails/attachments?message-id=${messageId}&id=${id}`
    );
    return response.data;
  },
  deleteEmail: async (id) => {
    const response = await apiClient.delete(`/emails/messages/${id}`);
    return response.data;
  },
  searchEmails: async (keyword, pageToken) => {
    const response = await apiClient.get(
      `/emails/search/fuzzy?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
  },
};
export default emailApi;
