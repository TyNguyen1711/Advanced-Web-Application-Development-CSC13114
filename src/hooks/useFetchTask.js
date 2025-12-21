import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import taskApi from "../services/taskApi";
import {
  setThreadsForType,
  appendThreadsForType,
  setLoadingForType,
  setErrorForType,
} from "../redux/taskSlice";

// Helper function to add summary to last message of each thread
const addSummaryToThreads = (tasks) => {
  return tasks.map((task) => {
    const thread = task.thread;
    if (thread.messages && thread.messages.length > 0) {
      const lastMessageIndex = thread.messages.length - 1;
      thread.messages[lastMessageIndex] = {
        ...thread.messages[lastMessageIndex],
        summary: task.summary || "No summary available",
      };
    }
    return thread;
  });
};

const useGetAllTasks = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listTypes = useSelector((state) => state.tasks.listTypes);
  console.log("[useFetchTask] listTypes from Redux:", listTypes);
  // Fetch tất cả tasks cho tất cả types (lần đầu load)
  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tasks cho tất cả các types
      const fetchPromises = listTypes.map((typeName) =>
        taskApi.getTasksByType(typeName.status)
      );

      const results = await Promise.all(fetchPromises);
      console.log("[useFetchTask] Fetched tasks for all types:", results);
      // Dispatch results cho từng type
      results.forEach((data, index) => {
        const typeObj = listTypes[index];
        const threads = addSummaryToThreads(data.mailTasks || []);
        dispatch(
          setThreadsForType({
            typeName: typeObj.status,
            threads,
            nextPageToken: data.nextPageToken || null,
          })
        );
      });

      return results;
    } catch (err) {
      setError(err.message || "Failed to fetch tasks");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks cho một type cụ thể (dùng cho load more)
  const fetchTasksForType = useCallback(
    async (typeName, pageToken = null) => {
      try {
        dispatch(setLoadingForType({ typeName, loading: true }));
        dispatch(setErrorForType({ typeName, error: null }));

        const data = await taskApi.getTasksByType(typeName, pageToken);
        const threads = addSummaryToThreads(data.mailTasks || []);

        if (pageToken) {
          // Nếu có pageToken, append thêm vào danh sách hiện tại (infinity scroll)
          dispatch(
            appendThreadsForType({
              typeName,
              threads,
              nextPageToken: data.nextPageToken || null,
            })
          );
        } else {
          // Nếu không có pageToken, replace toàn bộ
          dispatch(
            setThreadsForType({
              typeName,
              threads,
              nextPageToken: data.nextPageToken || null,
            })
          );
        }

        return data;
      } catch (err) {
        const errorMsg = err.message || `Failed to fetch tasks for ${typeName}`;
        dispatch(setErrorForType({ typeName, error: errorMsg }));
        throw err;
      } finally {
        dispatch(setLoadingForType({ typeName, loading: false }));
      }
    },
    [dispatch]
  );

  // Refresh một type cụ thể
  const refreshTasksForType = useCallback(
    async (typeName) => {
      return fetchTasksForType(typeName, null);
    },
    [fetchTasksForType]
  );

  // Fetch initial data for a new type (useful when adding new columns)
  // This automatically enables infinity scroll for the new column
  const initializeNewType = useCallback(
    async (typeName) => {
      console.log(
        `[useFetchTask] Initializing data for new column: ${typeName}`
      );
      try {
        dispatch(setLoadingForType({ typeName, loading: true }));
        const data = await taskApi.getTasksByType(typeName);
        const threads = addSummaryToThreads(data.mailTasks || []);

        dispatch(
          setThreadsForType({
            typeName,
            threads,
            nextPageToken: data.nextPageToken || null,
          })
        );

        console.log(
          `[useFetchTask] ${typeName} initialized with ${
            threads.length
          } items, nextPageToken: ${!!data.nextPageToken}`
        );
        return data;
      } catch (err) {
        const errorMsg = err.message || `Failed to initialize ${typeName}`;
        dispatch(setErrorForType({ typeName, error: errorMsg }));
        throw err;
      } finally {
        dispatch(setLoadingForType({ typeName, loading: false }));
      }
    },
    [dispatch]
  );

  return {
    fetchAllTasks,
    fetchTasksForType,
    refreshTasksForType,
    initializeNewType, // New helper for initializing custom columns
    loading,
    error,
  };
};

export default useGetAllTasks;
