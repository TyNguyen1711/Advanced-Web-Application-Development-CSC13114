import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchSlice",
  initialState: {
    searchInput: "",
    typeSearch: "FUZZY",
    resultSearch: [],
    nextPageToken: "",
    isLoading: false,
    error: null,
    isSearchTriggered: false,
  },
  reducers: {
    setSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },

    setTypeSearch: (state, action) => {
      state.typeSearch = action.payload;
    },

    setResultSearch: (state, action) => {
      state.resultSearch = action.payload;
    },

    appendResultSearch: (state, action) => {
      // Lọc các thread trùng lặp dựa trên id
      const existingIds = new Set(
        state.resultSearch.map((thread) => thread.id)
      );
      const newThreads = action.payload.filter(
        (thread) => !existingIds.has(thread.id)
      );
      state.resultSearch = [...state.resultSearch, ...newThreads];
    },

    clearResultSearch: (state) => {
      state.resultSearch = [];
      state.nextPageToken = "";
    },

    setNextPageToken: (state, action) => {
      state.nextPageToken = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    setSearchTriggered: (state, action) => {
      state.isSearchTriggered = action.payload;
    },

    resetSearch: (state) => {
      state.searchInput = "";
      state.typeSearch = "FUZZY";
      state.resultSearch = [];
      state.nextPageToken = "";
      state.isLoading = false;
      state.error = null;
      state.isSearchTriggered = false;
    },

    clearResultOnly: (state) => {
      state.resultSearch = [];
      state.nextPageToken = "";
      state.isSearchTriggered = false;
      state.error = null;
    },
  },
});

export default searchSlice.reducer;
export const {
  setSearchInput,
  setTypeSearch,
  setResultSearch,
  appendResultSearch,
  clearResultSearch,
  setNextPageToken,
  setLoading,
  setError,
  setSearchTriggered,
  resetSearch,
  clearResultOnly,
} = searchSlice.actions;
