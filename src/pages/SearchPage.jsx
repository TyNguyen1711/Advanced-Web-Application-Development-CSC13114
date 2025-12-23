// import { useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Loader2, Mail, AlertCircle, RefreshCw } from "lucide-react";
// import Header from "../components/dashboard/Header";
// import EmailCardSearch from "../components/search/EmailCardSearch";
// import searchApi from "../services/searchApi";
// import {
//   setResultSearch,
//   appendResultSearch,
//   setNextPageToken,
//   setLoading,
//   setError,
//   setSearchTriggered,
// } from "../redux/searchSlice";

// const SearchPage = () => {
//   const dispatch = useDispatch();
//   const {
//     searchInput,
//     resultSearch,
//     nextPageToken,
//     isLoading,
//     error,
//     isSearchTriggered,
//     typeSearch,
//   } = useSelector((state) => state.search);

//   const loadMoreRef = useRef(null);
//   const observerRef = useRef(null);
//   const isLoadingRef = useRef(false);

//   useEffect(() => {
//     document.title = "Tìm kiếm Email - Email Dashboard";
//   }, []);

//   // Chỉ load dữ liệu khi isSearchTriggered = true
//   useEffect(() => {
//     if (isSearchTriggered && searchInput) {
//       handleInitialSearch();
//       // Reset trigger sau khi search
//       // dispatch(setSearchTriggered(false));
//     }
//   }, [isSearchTriggered]);

//   // Cập nhật isLoadingRef khi isLoading thay đổi
//   useEffect(() => {
//     isLoadingRef.current = isLoading;
//   }, [isLoading]);

//   // Infinity scroll với IntersectionObserver
//   useEffect(() => {
//     // Cleanup observer cũ
//     if (observerRef.current) {
//       observerRef.current.disconnect();
//       observerRef.current = null;
//     }

//     // Chỉ setup observer khi có loadMoreRef và nextPageToken
//     if (!loadMoreRef.current || !nextPageToken) {
//       return;
//     }

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         if (entry.isIntersecting && nextPageToken && !isLoadingRef.current) {
//           console.log("Intersection triggered, loading more...");
//           isLoadingRef.current = true;
//           handleLoadMore();
//         }
//       },
//       { threshold: 0.1, rootMargin: "100px" }
//     );

//     observerRef.current.observe(loadMoreRef.current);

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//         observerRef.current = null;
//       }
//     };
//   }, [nextPageToken]);

//   // Hàm tìm kiếm lần đầu
//   const handleInitialSearch = async () => {
//     // Xóa kết quả cũ trước khi search mới
//     dispatch(setResultSearch([]));
//     dispatch(setNextPageToken(""));
//     dispatch(setLoading(true));
//     dispatch(setError(null));

//     try {
//       const response = await searchApi.searchEmails(searchInput, null);

//       if (response.code === 200) {
//         dispatch(setResultSearch(response.data.threads || []));
//         dispatch(setNextPageToken(response.data.next_page_token || ""));
//       } else {
//         dispatch(setError(response.message || "Không thể tìm kiếm email"));
//       }
//     } catch (err) {
//       console.error("Search error:", err);
//       dispatch(setError("Đã xảy ra lỗi khi tìm kiếm"));
//     } finally {
//       dispatch(setLoading(false));
//       dispatch(setSearchTriggered(false));
//     }
//   };

//   // Hàm load thêm kết quả
//   const handleLoadMore = async () => {
//     if (!nextPageToken || isLoading) {
//       isLoadingRef.current = false; // Reset ref nếu không thể load
//       return;
//     }

//     dispatch(setLoading(true));
//     dispatch(setError(null));

//     try {
//       const response = await searchApi.searchEmails(searchInput, nextPageToken);
//       console.log("Load more response:", response);
//       if (response.code === 200) {
//         dispatch(appendResultSearch(response.data.threads || []));
//         dispatch(setNextPageToken(response.data.next_page_token || ""));
//       } else {
//         dispatch(setError(response.message || "Không thể tải thêm kết quả"));
//       }
//     } catch (err) {
//       console.error("Load more error:", err);
//       dispatch(setError("Đã xảy ra lỗi khi tải thêm"));
//     } finally {
//       dispatch(setLoading(false));
//       isLoadingRef.current = false; // ✅ Reset ref sau khi load xong
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Header />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Thông báo lỗi */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}

//         {/* Đang tải lần đầu hoặc đang chuẩn bị search */}
//         {(isLoading || isSearchTriggered) && resultSearch.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//             <p className="text-gray-600 text-lg mt-4">Đang tìm kiếm email...</p>
//           </div>
//         )}

//         {/* Không có từ khóa tìm kiếm - chỉ hiển thị khi không đang loading */}
//         {!searchInput && !isLoading && !isSearchTriggered && (
//           <div className="text-center py-20">
//             <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//             <h3 className="text-2xl font-semibold text-gray-700 mb-3">
//               Bắt đầu tìm kiếm email
//             </h3>
//             <p className="text-gray-500 text-lg">
//               Sử dụng thanh tìm kiếm ở trên để tìm email của bạn
//             </p>
//           </div>
//         )}

//         {/* Không tìm thấy kết quả - chỉ hiển thị sau khi search xong và không có trigger */}
//         {searchInput &&
//           !isLoading &&
//           !isSearchTriggered &&
//           resultSearch.length === 0 &&
//           !error && (
//             <div className="text-center py-20">
//               <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//               <h3 className="text-2xl font-semibold text-gray-700 mb-3">
//                 Không tìm thấy kết quả
//               </h3>
//               <p className="text-gray-500 text-lg mb-6">
//                 Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
//               </p>
//               <button
//                 onClick={handleInitialSearch}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//               >
//                 <RefreshCw className="w-5 h-5" />
//                 Thử lại
//               </button>
//             </div>
//           )}

//         {/* Hiển thị kết quả */}
//         {resultSearch.length > 0 && (
//           <div className="space-y-6">
//             {/* Header kết quả */}
//             <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">
//                   Kết quả tìm kiếm
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Tìm thấy {resultSearch.length} email cho "{searchInput}"
//                 </p>
//               </div>
//             </div>

//             {/* Grid hiển thị email cards */}
//             <div className="space-y-4">
//               {resultSearch.map((thread) => (
//                 <EmailCardSearch key={thread.id} thread={thread} />
//               ))}
//             </div>

//             {/* Infinity scroll trigger - luôn render để observer có thể theo dõi */}
//             {nextPageToken && (
//               <div ref={loadMoreRef} className="h-4">
//                 {/* Loading spinner khi đang tải thêm */}
//                 {isLoading && (
//                   <div className="flex flex-col items-center justify-center py-8">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//                     <p className="text-sm text-gray-500 mt-4">
//                       Đang tải thêm...
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Thông báo hết kết quả */}
//             {!nextPageToken && !isLoading && (
//               <div className="text-center py-6">
//                 <p className="text-gray-500 text-sm">
//                   ✓ Đã hiển thị tất cả kết quả
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SearchPage;
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Loader2, Mail, AlertCircle, RefreshCw } from "lucide-react";
import Header from "../components/dashboard/Header";
import EmailCardSearch from "../components/search/EmailCardSearch";
import searchApi from "../services/searchApi";
import {
  setResultSearch,
  appendResultSearch,
  setNextPageToken,
  setLoading,
  setError,
  setSearchTriggered,
} from "../redux/searchSlice";

const SearchPage = () => {
  const dispatch = useDispatch();
  const {
    searchInput,
    resultSearch,
    nextPageToken,
    isLoading,
    error,
    isSearchTriggered,
    typeSearch,
  } = useSelector((state) => state.search);

  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const isLoadingRef = useRef(false);
  const isIndexingRef = useRef(false);

  useEffect(() => {
    document.title = "Tìm kiếm Email - Email Dashboard";
  }, []);

  useEffect(() => {
    if (isSearchTriggered && searchInput) {
      handleInitialSearch();
    }
  }, [isSearchTriggered]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!loadMoreRef.current || !nextPageToken) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && nextPageToken && !isLoadingRef.current) {
          console.log("Intersection triggered, loading more...");
          isLoadingRef.current = true;
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [nextPageToken]);

  const handleInitialSearch = async () => {
    dispatch(setResultSearch([]));
    dispatch(setNextPageToken(""));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      let response;

      if (typeSearch === "semantic") {
        // Gọi setIndex trước khi semantic search
        if (!isIndexingRef.current) {
          isIndexingRef.current = true;
          try {
            await searchApi.setIndexForSemanticSearch();
            console.log("Semantic index created successfully");
          } catch (indexError) {
            console.error("Index creation error:", indexError);
            // Vẫn tiếp tục search nếu index đã tồn tại
          } finally {
            isIndexingRef.current = false;
          }
        }

        // Gọi semantic search
        response = await searchApi.semanticSearch(searchInput, null);

        if (response.code === 200) {
          // Map results từ semantic search về format giống fuzzy
          const threads =
            response.data.results?.map((result) => result.thread) || [];
          dispatch(setResultSearch(threads));
          dispatch(setNextPageToken(response.data.nextPageToken || ""));
        } else {
          dispatch(setError(response.message || "Không thể tìm kiếm email"));
        }
      } else {
        // Fuzzy search
        response = await searchApi.searchEmails(searchInput, null);

        if (response.code === 200) {
          dispatch(setResultSearch(response.data.threads || []));
          dispatch(setNextPageToken(response.data.next_page_token || ""));
        } else {
          dispatch(setError(response.message || "Không thể tìm kiếm email"));
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      dispatch(setError("Đã xảy ra lỗi khi tìm kiếm"));
    } finally {
      dispatch(setLoading(false));
      dispatch(setSearchTriggered(false));
    }
  };

  const handleLoadMore = async () => {
    if (!nextPageToken || isLoading) {
      isLoadingRef.current = false;
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      let response;

      if (typeSearch === "semantic") {
        response = await searchApi.semanticSearch(searchInput, nextPageToken);
        console.log("Load more semantic response:", response);

        if (response.code === 200) {
          const threads =
            response.data.results?.map((result) => result.thread) || [];
          dispatch(appendResultSearch(threads));
          dispatch(setNextPageToken(response.data.nextPageToken || ""));
        } else {
          dispatch(setError(response.message || "Không thể tải thêm kết quả"));
        }
      } else {
        response = await searchApi.searchEmails(searchInput, nextPageToken);
        console.log("Load more fuzzy response:", response);

        if (response.code === 200) {
          dispatch(appendResultSearch(response.data.threads || []));
          dispatch(setNextPageToken(response.data.next_page_token || ""));
        } else {
          dispatch(setError(response.message || "Không thể tải thêm kết quả"));
        }
      }
    } catch (err) {
      console.error("Load more error:", err);
      dispatch(setError("Đã xảy ra lỗi khi tải thêm"));
    } finally {
      dispatch(setLoading(false));
      isLoadingRef.current = false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {(isLoading || isSearchTriggered) && resultSearch.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-600 text-lg mt-4">
              Đang tìm kiếm email (
              {typeSearch === "semantic" ? "Semantic" : "Fuzzy"})...
            </p>
          </div>
        )}

        {!searchInput && !isLoading && !isSearchTriggered && (
          <div className="text-center py-20">
            <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              Bắt đầu tìm kiếm email
            </h3>
            <p className="text-gray-500 text-lg">
              Sử dụng thanh tìm kiếm ở trên để tìm email của bạn
            </p>
          </div>
        )}

        {searchInput &&
          !isLoading &&
          !isSearchTriggered &&
          resultSearch.length === 0 &&
          !error && (
            <div className="text-center py-20">
              <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-500 text-lg mb-6">
                Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
              </p>
              <button
                onClick={handleInitialSearch}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Thử lại
              </button>
            </div>
          )}

        {resultSearch.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Kết quả tìm kiếm (
                  {typeSearch === "semantic" ? "Semantic" : "Fuzzy"})
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tìm thấy {resultSearch.length} email cho "{searchInput}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {resultSearch.map((thread) => (
                <EmailCardSearch key={thread.id} thread={thread} />
              ))}
            </div>

            {nextPageToken && (
              <div ref={loadMoreRef} className="h-4">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <p className="text-sm text-gray-500 mt-4">
                      Đang tải thêm...
                    </p>
                  </div>
                )}
              </div>
            )}

            {!nextPageToken && !isLoading && (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">
                  ✓ Đã hiển thị tất cả kết quả
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
