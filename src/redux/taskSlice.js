import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    // listTypes: ["INBOX", "TODO", "DONE", "DONE2", "SNOOZED"],
    listTypes: [{ id: "0000", status: "INBOX" }],
    isRunFirstFetch: false,
    // listTypes: [],
    googleLabel: [],
    mails: [
      {
        name: "INBOX",
        nextPageToken: null,
        threads: [],
        loading: false,
        hasMore: true,
        error: null,
      },
      // {
      //   name: "TODO",
      //   nextPageToken: null,
      //   threads: [],
      //   loading: false,
      //   hasMore: true,
      //   error: null,
      // },
      // {
      //   name: "DONE",
      //   nextPageToken: null,
      //   threads: [],
      //   loading: false,
      //   hasMore: true,
      //   error: null,
      // },
      // {
      //   name: "DONE2",
      //   nextPageToken: null,
      //   threads: [],
      //   loading: false,
      //   hasMore: true,
      //   error: null,
      // },
      // {
      //   name: "SNOOZED",
      //   nextPageToken: null,
      //   threads: [],
      //   loading: false,
      //   hasMore: true,
      //   error: null,
      // },
    ],
  },
  reducers: {
    setThreadsForType: (state, action) => {
      console.log("[Redux] setThreadsForType action.payload:", action.payload);
      const { typeName, threads, nextPageToken } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].threads = threads;
        state.mails[mailIndex].nextPageToken = nextPageToken || null;

        state.mails[mailIndex].hasMore = !!(
          nextPageToken && nextPageToken.trim()
        );
      }
    },

    appendThreadsForType: (state, action) => {
      const { typeName, threads, nextPageToken } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].threads.push(...threads);
        state.mails[mailIndex].nextPageToken = nextPageToken || null;

        state.mails[mailIndex].hasMore = !!(
          nextPageToken && nextPageToken.trim()
        );
      }
    },

    // Set loading state for a specific type
    setLoadingForType: (state, action) => {
      const { typeName, loading } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].loading = loading;
      }
    },

    // Set error for a specific type
    setErrorForType: (state, action) => {
      const { typeName, error } = action.payload;
      const mailIndex = state.mails.findIndex((m) => m.name === typeName);
      if (mailIndex !== -1) {
        state.mails[mailIndex].error = error;
      }
    },

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
        console.log(
          `[Redux] New column "${typeName}" added with infinity scroll support`
        );
      }
    },

    removeListType: (state, action) => {
      const typeName = action.payload;
      state.listTypes = state.listTypes.filter((t) => t !== typeName);
      state.mails = state.mails.filter((m) => m.name !== typeName);
    },

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

          state.mails[fromMailIndex].threads.splice(threadIndex, 1);

          state.mails[toMailIndex].threads.unshift(thread);
        }
      }
    },

    removeThreadFromType: (state, action) => {
      const { typeName, threadId } = action.payload;

      const upperTypeName = typeName.toUpperCase();
      const mailIndex = state.mails.findIndex((m) => m.name === upperTypeName);
      console.log(
        "In reducer - removeThreadFromType:",
        typeName,
        "=>",
        upperTypeName,
        threadId,
        "mailIndex:",
        mailIndex
      );
      if (mailIndex !== -1) {
        const filteredThreads = state.mails[mailIndex].threads.filter(
          (t) => t.id !== threadId
        );
        console.log(
          "Before filter:",
          state.mails[mailIndex].threads.length,
          "After filter:",
          filteredThreads.length
        );
        state.mails[mailIndex] = {
          ...state.mails[mailIndex],
          threads: filteredThreads,
        };
      }
    },

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
    setGoogleLabels: (state, action) => {
      state.googleLabel = action.payload;
    },
    updateListTypes: (state, action) => {
      state.listTypes = action.payload;
    },
    setIsRunFirstFetch: (state, action) => {
      state.isRunFirstFetch = action.payload;
    },
    setListTypes: (state, action) => {
      const newItems = action.payload.filter(
        (newItem) =>
          !state.listTypes.some(
            (existingItem) => existingItem.id === newItem.id
          )
      );
      state.listTypes = [...state.listTypes, ...newItems];

      // Add corresponding mail columns for new types
      newItems.forEach((item) => {
        if (!state.mails.some((m) => m.name === item.status)) {
          state.mails.push({
            name: item.status,
            nextPageToken: null,
            threads: [],
            loading: false,
            hasMore: true,
            error: null,
          });
        }
      });
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
  updateListTypes,
  moveThreadBetweenTypes,
  removeThreadFromType,
  resetAllTasks,
  setGoogleLabels,
  setListTypes,
  setIsRunFirstFetch,
} = taskSlice.actions;
