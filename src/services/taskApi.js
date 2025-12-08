import apiClient from "./apiClient";
export const taskApi = {
  getTaskOfStatus: async (status) => {
    const response = await apiClient.get(`/tasks/processing?status=${status}`);
    return response.data;
  },
  updateStatusTask: async (data) => {
    const response = await apiClient.post("/tasks/update-task-status", data);
    return response.data;
  },
};
