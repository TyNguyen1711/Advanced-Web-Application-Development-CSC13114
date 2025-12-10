import apiClient from "./apiClient";
const taskApi = {
  getTaskInbox: async (status) => {
    try {
      const response = await apiClient.get(`/tasks/inbox`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  getTaskOfStatus: async (status) => {
    try {
      const response = await apiClient.get(
        `/tasks/processing?status=${status}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
  updateStatusTask: async (data) => {
    try {
      const response = await apiClient.post("/tasks/update-task-status", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getTaskSnooze: async () => {
    try {
      const response = await apiClient.get("/tasks/processing?status=SNOOZED");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};
export default taskApi;
