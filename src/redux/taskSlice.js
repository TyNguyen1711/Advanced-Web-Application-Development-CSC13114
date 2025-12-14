import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    // Danh sách các loại list type
    listTypes: ["INBOX", "TODO", "DONE"],

    // Danh sách mails cho mỗi type với cấu trúc:
    // { name: "TODO", nextPageToken: "...", threads: [...], loading: false, hasMore: true }
    mails: [
      {
        name: "INBOX",
        nextPageToken: null,
        threads: [],
        loading: false,
        hasMore: true,
        error: null,
      },
      {
        name: "TODO",
        nextPageToken: null,
        threads: [],
        loading: false,
        hasMore: true,
        error: null,
      },
      {
        name: "DONE",
        nextPageToken: null,
        threads: [],
        loading: false,
        hasMore: true,
        error: null,
      },
    ],
  },
  reducers: {
    // Set threads cho một type cụ thể (replace toàn bộ)
    setThreadsForType: (state, action) => {
      const { typeName, threads, nextPageToken } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].threads = threads;
        state.mails[mailIndex].nextPageToken = nextPageToken || null;
        // hasMore chỉ true khi nextPageToken có giá trị (không null, undefined, hoặc empty string)
        state.mails[mailIndex].hasMore = !!(
          nextPageToken && nextPageToken.trim()
        );
      }
    },

    // Append threads cho một type (dùng cho infinity scroll)
    appendThreadsForType: (state, action) => {
      const { typeName, threads, nextPageToken } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].threads.push(...threads);
        state.mails[mailIndex].nextPageToken = nextPageToken || null;
        // hasMore chỉ true khi nextPageToken có giá trị (không null, undefined, hoặc empty string)
        state.mails[mailIndex].hasMore = !!(
          nextPageToken && nextPageToken.trim()
        );
      }
    },

    // Set loading state cho một type
    setLoadingForType: (state, action) => {
      const { typeName, loading } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].loading = loading;
      }
    },

    // Set error cho một type
    setErrorForType: (state, action) => {
      const { typeName, error } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].error = error;
      }
    },

    // Thêm một type mới
    addNewListType: (state, action) => {
      const { typeName, icon, color } = action.payload;
      if (!state.listTypes.includes(typeName)) {
        state.listTypes.push(typeName);
        state.mails.push({
          name: typeName,
          nextPageToken: null,
          threads: [],
          loading: false,
          hasMore: true,
          error: null,
          icon: icon || null,
          color: color || null,
        });
      }
    },

    // Remove một type
    removeListType: (state, action) => {
      const typeName = action.payload;
      state.listTypes = state.listTypes.filter((t) => t !== typeName);
      state.mails = state.mails.filter((m) => m.name !== typeName);
    },

    // Update một thread cụ thể trong một type (ví dụ: sau khi drag & drop)
    updateThreadInType: (state, action) => {
      const { typeName, threadId, updatedThread } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        const threadIndex = state.mails[mailIndex].threads.findIndex(
          (t) => t.id === threadId
        );
        if (threadIndex !== -1) {
          state.mails[mailIndex].threads[threadIndex] = {
            ...state.mails[mailIndex].threads[threadIndex],
            ...updatedThread,
          };
        }
      }
    },

    // Move thread từ type này sang type khác
    moveThreadBetweenTypes: (state, action) => {
      const { fromType, toType, threadId } = action.payload;
      const fromMailIndex = state.mails.findIndex((m) => m.name === fromType);
      const toMailIndex = state.mails.findIndex((m) => m.name === toType);

      if (fromMailIndex !== -1 && toMailIndex !== -1) {
        const threadIndex = state.mails[fromMailIndex].threads.findIndex(
          (t) => t.id === threadId
        );
        if (threadIndex !== -1) {
          const thread = state.mails[fromMailIndex].threads[threadIndex];
          // Remove từ source
          state.mails[fromMailIndex].threads.splice(threadIndex, 1);
          // Add vào destination
          state.mails[toMailIndex].threads.unshift(thread);
        }
      }
    },

    // Reset all data
    resetAllTasks: (state) => {
      state.mails = state.mails.map((mail) => ({
        ...mail,
        threads: [],
        nextPageToken: null,
        loading: false,
        hasMore: true,
        error: null,
      }));
    },
  },
});

export default taskSlice.reducer;
export const {
  setThreadsForType,
  appendThreadsForType,
  setLoadingForType,
  setErrorForType,
  addNewListType,
  removeListType,
  updateThreadInType,
  moveThreadBetweenTypes,
  resetAllTasks,
} = taskSlice.actions;
