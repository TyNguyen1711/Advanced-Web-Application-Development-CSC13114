// import { useEffect, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Loader2, Mail, AlertCircle, RefreshCw } from "lucide-react";
// import Header from "../components/dashboard/Header";
// import EmailCardSearch from "../components/search/EmailCardSearch";
// import {
//   setResultSearch,
//   appendResultSearch,
//   setNextPageToken,
//   setLoading,
//   setError,
// } from "../redux/searchSlice";

// // Mock data cho API
// const mockEmailThreads = {
//   page1: [
//     {
//       id: "19b1ac927912d218",
//       messages: [
//         {
//           id: "19b1ac927912d218",
//           threadId: "19b1ac927912d218",
//           labelIds: ["UNREAD", "IMPORTANT", "CATEGORY_PERSONAL", "INBOX"],
//           from: '"Nguyễn Quốc Vinh" <vinh6473@gmail.com>',
//           to: "vinh nguyen <vinh01515@gmail.com>",
//           subject: "Orange - Sản phẩm mới",
//           date: "Sun, 14 Dec 2025 09:57:07 +0700",
//           snippet: "Sản phẩm cam mới, hãy thử ngay!",
//         },
//       ],
//     },
//     {
//       id: "19b1ac927912d219",
//       messages: [
//         {
//           id: "19b1ac927912d219",
//           threadId: "19b1ac927912d219",
//           labelIds: ["CATEGORY_UPDATES", "INBOX"],
//           from: '"Trần Văn A" <trana@example.com>',
//           to: "vinh nguyen <vinh01515@gmail.com>",
//           subject: "Cập nhật hệ thống",
//           date: "Sat, 13 Dec 2025 15:30:00 +0700",
//           snippet:
//             "Hệ thống sẽ được nâng cấp vào cuối tuần này. Vui lòng lưu ý...",
//         },
//       ],
//     },
//     {
//       id: "19b1ac927912d220",
//       messages: [
//         {
//           id: "19b1ac927912d220",
//           threadId: "19b1ac927912d220",
//           labelIds: ["IMPORTANT", "INBOX"],
//           from: '"Phòng Nhân Sự" <hr@company.com>',
//           to: "vinh nguyen <vinh01515@gmail.com>",
//           subject: "Thông báo họp team",
//           date: "Fri, 12 Dec 2025 10:00:00 +0700",
//           snippet:
//             "Cuộc họp team sẽ diễn ra vào thứ Hai tuần tới lúc 9:00 AM...",
//         },
//       ],
//     },
//   ],
//   page2: [
//     {
//       id: "19b1ac927912d221",
//       messages: [
//         {
//           id: "19b1ac927912d221",
//           threadId: "19b1ac927912d221",
//           labelIds: ["CATEGORY_PROMOTIONS", "INBOX"],
//           from: '"Shopee Vietnam" <noreply@shopee.vn>',
//           to: "vinh nguyen <vinh01515@gmail.com>",
//           subject: "🎉 Flash Sale 12.12 - Giảm đến 50%",
//           date: "Thu, 11 Dec 2025 08:00:00 +0700",
//           snippet:
//             "Đừng bỏ lỡ cơ hội mua sắm với giá ưu đãi tốt nhất trong năm!",
//         },
//       ],
//     },
//     {
//       id: "19b1ac927912d222",
//       messages: [
//         {
//           id: "19b1ac927912d222",
//           threadId: "19b1ac927912d222",
//           labelIds: ["UNREAD", "INBOX"],
//           from: '"GitHub" <noreply@github.com>',
//           to: "vinh nguyen <vinh01515@gmail.com>",
//           subject: "Your weekly digest of activity on GitHub",
//           date: "Wed, 10 Dec 2025 20:00:00 +0700",
//           snippet: "Here's what happened in your repositories this week...",
//         },
//       ],
//     },
//     {
//       id: "19b1ac927912d223",
//       messages: [
//         {
//           id: "19b1ac927912d223",
//           threadId: "19b1ac927912d223",
//           labelIds: ["CATEGORY_SOCIAL", "INBOX"],
//           from: '"Facebook" <notification@facebookmail.com>',
//           to: "vinh nguyen <vinh01515@gmail.com>",
//           subject: "Bạn có 3 thông báo mới",
//           date: "Wed, 10 Dec 2025 14:30:00 +0700",
//           snippet: "Nguyễn Văn B đã bình luận về bài viết của bạn...",
//         },
//       ],
//     },
//   ],
// };

// // Hàm giả lập API
// const mockSearchAPI = (pageToken = null) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       if (!pageToken) {
//         // Lần 1: Trả về page 1 với nextPageToken
//         resolve({
//           code: 200,
//           message: "Success",
//           data: {
//             threads: mockEmailThreads.page1,
//             nextPageToken: "page2_token_12345",
//           },
//         });
//       } else {
//         // Lần 2: Trả về page 2 không có nextPageToken
//         resolve({
//           code: 200,
//           message: "Success",
//           data: {
//             threads: mockEmailThreads.page2,
//             nextPageToken: "",
//           },
//         });
//       }
//     }, 10000); // Giả lập delay 1 giây
//   });
// };

// const SearchPage = () => {
//   const dispatch = useDispatch();
//   const { searchInput, resultSearch, nextPageToken, isLoading, error } =
//     useSelector((state) => state.search);

//   const loadMoreRef = useRef(null);
//   const observerRef = useRef(null);
//   const isLoadingRef = useRef(false);

//   useEffect(() => {
//     document.title = "Tìm kiếm Email - Email Dashboard";
//   }, []);

//   // Tự động load dữ liệu khi có searchInput
//   useEffect(() => {
//     if (searchInput && resultSearch.length === 0) {
//       handleInitialSearch();
//     }
//   }, [searchInput]);

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
//     dispatch(setLoading(true));
//     dispatch(setError(null));

//     try {
//       const response = await mockSearchAPI();

//       if (response.code === 200) {
//         dispatch(setResultSearch(response.data.threads));
//         dispatch(setNextPageToken(response.data.nextPageToken));
//       } else {
//         dispatch(setError("Không thể tìm kiếm email"));
//       }
//     } catch (err) {
//       dispatch(setError("Đã xảy ra lỗi khi tìm kiếm"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   // Hàm load thêm kết quả
//   const handleLoadMore = async () => {
//     if (!nextPageToken || isLoading) return;

//     dispatch(setLoading(true));
//     dispatch(setError(null));

//     try {
//       const response = await mockSearchAPI(nextPageToken);

//       if (response.code === 200) {
//         dispatch(appendResultSearch(response.data.threads));
//         dispatch(setNextPageToken(response.data.nextPageToken));
//       } else {
//         dispatch(setError("Không thể tải thêm kết quả"));
//       }
//     } catch (err) {
//       dispatch(setError("Đã xảy ra lỗi khi tải thêm"));
//     } finally {
//       dispatch(setLoading(false));
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

//         {/* Đang tải lần đầu */}
//         {isLoading && resultSearch.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-20">
//             <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
//             <p className="text-gray-600 text-lg">Đang tìm kiếm email...</p>
//           </div>
//         )}

//         {/* Không có từ khóa tìm kiếm */}
//         {!searchInput && !isLoading && (
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

//         {/* Không tìm thấy kết quả */}
//         {searchInput && !isLoading && resultSearch.length === 0 && !error && (
//           <div className="text-center py-20">
//             <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//             <h3 className="text-2xl font-semibold text-gray-700 mb-3">
//               Không tìm thấy kết quả
//             </h3>
//             <p className="text-gray-500 text-lg mb-6">
//               Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
//             </p>
//             <button
//               onClick={handleInitialSearch}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Thử lại
//             </button>
//           </div>
//         )}

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

//             {/* Loading spinner khi đang tải thêm */}
//             {isLoading && resultSearch.length > 0 && (
//               <div className="text-center py-8">
//                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
//                 <p className="text-sm text-gray-500 mt-4">Loading more...</p>
//               </div>
//             )}

//             {/* Infinity scroll trigger - hidden element */}
//             {nextPageToken && !isLoading && (
//               <div ref={loadMoreRef} className="h-4" />
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
  } = useSelector((state) => state.search);

  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    document.title = "Tìm kiếm Email - Email Dashboard";
  }, []);

  // Chỉ load dữ liệu khi isSearchTriggered = true
  useEffect(() => {
    if (isSearchTriggered && searchInput) {
      handleInitialSearch();
      // Reset trigger sau khi search
      // dispatch(setSearchTriggered(false));
    }
  }, [isSearchTriggered]);

  // Cập nhật isLoadingRef khi isLoading thay đổi
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Infinity scroll với IntersectionObserver
  useEffect(() => {
    // Cleanup observer cũ
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Chỉ setup observer khi có loadMoreRef và nextPageToken
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

  // Hàm tìm kiếm lần đầu
  const handleInitialSearch = async () => {
    // Xóa kết quả cũ trước khi search mới
    dispatch(setResultSearch([]));
    dispatch(setNextPageToken(""));
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await searchApi.searchEmails(searchInput, null);

      if (response.code === 200) {
        dispatch(setResultSearch(response.data.threads || []));
        dispatch(setNextPageToken(response.data.next_page_token || ""));
      } else {
        dispatch(setError(response.message || "Không thể tìm kiếm email"));
      }
    } catch (err) {
      console.error("Search error:", err);
      dispatch(setError("Đã xảy ra lỗi khi tìm kiếm"));
    } finally {
      dispatch(setLoading(false));
      dispatch(setSearchTriggered(false)); // ✅ Reset trigger SAU KHI search xong
    }
  };

  // Hàm load thêm kết quả
  const handleLoadMore = async () => {
    if (!nextPageToken || isLoading) {
      isLoadingRef.current = false; // Reset ref nếu không thể load
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await searchApi.searchEmails(searchInput, nextPageToken);
      console.log("Load more response:", response);
      if (response.code === 200) {
        dispatch(appendResultSearch(response.data.threads || []));
        dispatch(setNextPageToken(response.data.next_page_token || ""));
      } else {
        dispatch(setError(response.message || "Không thể tải thêm kết quả"));
      }
    } catch (err) {
      console.error("Load more error:", err);
      dispatch(setError("Đã xảy ra lỗi khi tải thêm"));
    } finally {
      dispatch(setLoading(false));
      isLoadingRef.current = false; // ✅ Reset ref sau khi load xong
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Đang tải lần đầu hoặc đang chuẩn bị search */}
        {(isLoading || isSearchTriggered) && resultSearch.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-gray-600 text-lg mt-4">Đang tìm kiếm email...</p>
          </div>
        )}

        {/* Không có từ khóa tìm kiếm - chỉ hiển thị khi không đang loading */}
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

        {/* Không tìm thấy kết quả - chỉ hiển thị sau khi search xong và không có trigger */}
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

        {/* Hiển thị kết quả */}
        {resultSearch.length > 0 && (
          <div className="space-y-6">
            {/* Header kết quả */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Kết quả tìm kiếm
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tìm thấy {resultSearch.length} email cho "{searchInput}"
                </p>
              </div>
            </div>

            {/* Grid hiển thị email cards */}
            <div className="space-y-4">
              {resultSearch.map((thread) => (
                <EmailCardSearch key={thread.id} thread={thread} />
              ))}
            </div>

            {/* Infinity scroll trigger - luôn render để observer có thể theo dõi */}
            {nextPageToken && (
              <div ref={loadMoreRef} className="h-4">
                {/* Loading spinner khi đang tải thêm */}
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

            {/* Thông báo hết kết quả */}
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
