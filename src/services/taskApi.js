import apiClient from "./apiClient";

const taskApi = {
  // Get tasks cho INBOX (hỗ trợ pagination với pageToken)
  getTaskInbox: async (pageToken = null) => {
    try {
      const url = pageToken ? `/tasks/inbox?page=${pageToken}` : `/tasks/inbox`;
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Get tasks theo status (TODO, DONE, etc.) với pagination
  getTaskOfStatus: async (status, pageToken = null) => {
    try {
      let url = `/tasks/processing?status=${status}`;
      if (pageToken) {
        url += `&page=${pageToken}`;
      }
      const response = await apiClient.get(url);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Update status của task
  updateStatusTask: async (data) => {
    try {
      const response = await apiClient.post("/tasks/update-task-status", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get snoozed tasks
  getTaskSnooze: async () => {
    try {
      const response = await apiClient.get(
        "/tasks/processing?status=SNOOZED&size=50"
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic function để get tasks cho bất kỳ type nào
  getTasksByType: async (typeName, pageToken = null) => {
    try {
      if (typeName === "INBOX") {
        return await taskApi.getTaskInbox(pageToken);
      } else {
        return await taskApi.getTaskOfStatus(typeName, pageToken);
      }
    } catch (error) {
      throw error;
    }
  },
  addType: async (typeName) => {
    try {
      const response = await apiClient.post("/tasks/status", {
        status: typeName,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default taskApi;
