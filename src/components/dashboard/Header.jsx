// import { useSelector, useDispatch } from "react-redux";
// import { Mail, Plus, Image as ImageIcon, LogOut, Search } from "lucide-react";
// import authApi from "../../services/authApi";
// import { userManager } from "../../services/apiClient";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   setSearchInput,
//   setSearchTriggered,
//   clearResultOnly,
//   setLoading,
// } from "../../redux/searchSlice";
// import { useState, useEffect, useRef } from "react";
// import searchApi from "../../services/searchApi";

// const Header = ({ setIsMobileSidebarOpen, handleCompose }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const searchQuery = useSelector((state) => state.search.searchInput);
//   const [activeTabId, setActiveTabId] = useState(0);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [searchType, setSearchType] = useState("fuzzy");
//   const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false);
//   const location = useLocation();
//   const searchTimeoutRef = useRef(null);
//   const searchContainerRef = useRef(null);
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await authApi.getProfile();
//         userManager.user = userData.data;
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };
//     fetchUser();
//   }, []);

//   const tabs = [
//     { id: 0, name: "Gmail", href: "/", current: true },
//     { id: 1, name: "Kanpan", href: "/kanpan", current: false },
//   ];

//   const searchTypeOptions = [
//     { value: "fuzzy", label: "Fuzzy" },
//     { value: "semantic", label: "Semantic" },
//   ];

//   const fetchSuggestions = async (query) => {
//     setIsLoading(true);
//     try {
//       const response = await searchApi.autoSuggestions(query);

//       setSuggestions(response.data.suggestions || []);
//       setShowSuggestions(true);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (searchQuery.trim().length > 0 && isSearchFocused) {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//       searchTimeoutRef.current = setTimeout(() => {
//         fetchSuggestions(searchQuery);
//       }, 500);
//     } else {
//       setSuggestions([]);
//       setShowSuggestions(false);
//     }

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchQuery, isSearchFocused]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         searchContainerRef.current &&
//         !searchContainerRef.current.contains(event.target)
//       ) {
//         setShowSuggestions(false);
//         setIsSearchFocused(false);
//       }

//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowSearchTypeDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       dispatch(clearResultOnly());
//       dispatch(setLoading(true));
//       dispatch(setSearchTriggered(true));
//       console.log("Search type:", searchType);
//       navigate("/search");
//     }
//     setShowSuggestions(false);
//     setIsSearchFocused(false);
//   };

//   const handleSuggestionClick = (suggestion) => {
//     dispatch(setSearchInput(suggestion.text));
//     dispatch(clearResultOnly());
//     dispatch(setLoading(true));
//     dispatch(setSearchTriggered(true));
//     setShowSuggestions(false);
//     setIsSearchFocused(false);
//     if (suggestion.text.trim()) {
//       navigate("/search");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const userId = userManager.user?.id;
//       if (userId) {
//         await authApi.logout(userId);
//       }
//       userManager.user = null;
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout error:", error);
//       userManager.user = null;
//       navigate("/login");
//     }
//   };

//   return (
//     <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
//       <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 gap-4">
//           <div className="flex items-center gap-3 flex-shrink-0">
//             <button
//               onClick={() => setIsMobileSidebarOpen(true)}
//               className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Mail className="w-6 h-6 text-gray-700" />
//             </button>
//             <div className="hidden lg:flex items-center gap-2">
//               <Mail className="w-8 h-8 text-blue-600" />
//               <span className="text-xl font-bold text-gray-800">MailBox</span>
//             </div>
//           </div>

//           <div className="hidden lg:flex flex-1 max-w-2xl gap-2">
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() =>
//                   setShowSearchTypeDropdown(!showSearchTypeDropdown)
//                 }
//                 className="h-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-white"
//               >
//                 <span className="text-sm font-medium text-gray-700">
//                   {
//                     searchTypeOptions.find((opt) => opt.value === searchType)
//                       ?.label
//                   }
//                 </span>
//                 <svg
//                   className={`w-4 h-4 text-gray-500 transition-transform ${
//                     showSearchTypeDropdown ? "rotate-180" : ""
//                   }`}
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </button>

//               {showSearchTypeDropdown && (
//                 <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//                   {searchTypeOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       onClick={() => {
//                         setSearchType(option.value);
//                         setShowSearchTypeDropdown(false);
//                       }}
//                       className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
//                         searchType === option.value
//                           ? "bg-blue-50 text-blue-600"
//                           : "text-gray-700"
//                       }`}
//                     >
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex-1" ref={searchContainerRef}>
//               <form onSubmit={handleSearch} className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => dispatch(setSearchInput(e.target.value))}
//                   onFocus={() => {
//                     setIsSearchFocused(true);
//                     if (suggestions.length > 0) {
//                       setShowSuggestions(true);
//                     }
//                   }}
//                   onBlur={() => {
//                     setTimeout(() => setIsSearchFocused(false), 200);
//                   }}
//                   placeholder="Tìm kiếm email..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 />
//                 {showSuggestions && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
//                     {isLoading ? (
//                       <div className="px-4 py-3 text-gray-500 text-sm">
//                         Đang tìm kiếm...
//                       </div>
//                     ) : (
//                       <>
//                         <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0">
//                           Gợi ý tìm kiếm
//                         </div>
//                         {suggestions?.map((suggestion) => (
//                           <button
//                             key={suggestion.id}
//                             onClick={() => handleSuggestionClick(suggestion)}
//                             className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
//                           >
//                             <div className="text-sm text-gray-800">
//                               {suggestion.text}
//                             </div>
//                           </button>
//                         ))}
//                       </>
//                     )}
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>

//           <div className="hidden lg:flex gap-2 flex-shrink-0">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   setActiveTabId(tab.id);
//                   navigate(tab.href);
//                 }}
//                 className={`px-5 py-2 ${
//                   location.pathname === tab.href
//                     ? "bg-blue-600 text-white"
//                     : "text-gray-700 hover:bg-gray-100"
//                 } rounded-lg font-medium transition-colors shadow-sm`}
//               >
//                 {tab.name}
//               </button>
//             ))}
//           </div>

//           <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
//             <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
//               <div className="flex items-center gap-2">
//                 <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
//                   {userManager.user?.username?.charAt(0).toUpperCase() || "U"}
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-800">
//                     {userManager.user?.username || "User"}
//                   </span>
//                   <span className="text-xs text-gray-500">
//                     {userManager.user?.email || "user@example.com"}
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleLogout}
//                 className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
//                 title="Đăng xuất"
//               >
//                 <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
//               </button>
//             </div>
//           </div>

//           <div className="flex lg:hidden items-center gap-2">
//             <button
//               onClick={handleCompose}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             >
//               <Plus className="w-6 h-6 text-gray-700" />
//             </button>
//             <button
//               onClick={handleLogout}
//               className="p-2 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <LogOut className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>
//         </div>

//         <div className="lg:hidden pb-3 space-y-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => dispatch(setSearchInput(e.target.value))}
//               onFocus={() => setIsSearchFocused(true)}
//               onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
//               placeholder="Tìm kiếm..."
//               className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             />
//           </div>

//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 setActiveTabId(0);
//                 navigate("/");
//               }}
//               className={`flex-1 py-2 ${
//                 location.pathname === "/"
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//               } rounded-lg font-medium text-sm shadow-sm transition-colors`}
//             >
//               Gmail
//             </button>
//             <button
//               onClick={() => {
//                 setActiveTabId(1);
//                 navigate("/kanpan");
//               }}
//               className={`flex-1 py-2 ${
//                 location.pathname === "/kanpan"
//                   ? "bg-blue-600 text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//               } rounded-lg font-medium text-sm transition-colors shadow-sm`}
//             >
//               Kanpan
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useSelector, useDispatch } from "react-redux";
import { Mail, Plus, Image as ImageIcon, LogOut, Search } from "lucide-react";
import authApi from "../../services/authApi";
import { userManager } from "../../services/apiClient";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setSearchInput,
  setSearchTriggered,
  clearResultOnly,
  setLoading,
  setTypeSearch,
} from "../../redux/searchSlice";
import { useState, useEffect, useRef } from "react";
import searchApi from "../../services/searchApi";

const Header = ({ setIsMobileSidebarOpen, handleCompose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchInput);
  const [activeTabId, setActiveTabId] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchType, setSearchType] = useState("fuzzy");
  const [showSearchTypeDropdown, setShowSearchTypeDropdown] = useState(false);
  const location = useLocation();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authApi.getProfile();
        userManager.user = userData.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const tabs = [
    { id: 0, name: "Gmail", href: "/", current: true },
    { id: 1, name: "Kanpan", href: "/kanpan", current: false },
  ];

  const searchTypeOptions = [
    { value: "fuzzy", label: "Fuzzy" },
    { value: "semantic", label: "Semantic" },
  ];

  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      const response = await searchApi.autoSuggestions(query);
      setSuggestions(response.data.suggestions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0 && isSearchFocused) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 500);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isSearchFocused]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setIsSearchFocused(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSearchTypeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(clearResultOnly());
      dispatch(setLoading(true));
      dispatch(setTypeSearch(searchType));
      dispatch(setSearchTriggered(true));
      navigate("/search");
    }
    setShowSuggestions(false);
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (suggestion) => {
    dispatch(setSearchInput(suggestion.text));
    dispatch(clearResultOnly());
    dispatch(setLoading(true));
    dispatch(setTypeSearch(searchType));
    dispatch(setSearchTriggered(true));
    setShowSuggestions(false);
    setIsSearchFocused(false);
    if (suggestion.text.trim()) {
      navigate("/search");
    }
  };

  const handleLogout = async () => {
    try {
      const userId = userManager.user?.id;
      if (userId) {
        await authApi.logout(userId);
      }
      userManager.user = null;
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      userManager.user = null;
      navigate("/login");
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Mail className="w-6 h-6 text-gray-700" />
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <Mail className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">MailBox</span>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-2xl gap-2">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  setShowSearchTypeDropdown(!showSearchTypeDropdown)
                }
                className="h-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-white"
              >
                <span className="text-sm font-medium text-gray-700">
                  {
                    searchTypeOptions.find((opt) => opt.value === searchType)
                      ?.label
                  }
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    showSearchTypeDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {showSearchTypeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {searchTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSearchType(option.value);
                        setShowSearchTypeDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        searchType === option.value
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1" ref={searchContainerRef}>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchInput(e.target.value))}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setIsSearchFocused(false), 200);
                  }}
                  placeholder="Tìm kiếm email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        Đang tìm kiếm...
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0">
                          Gợi ý tìm kiếm
                        </div>
                        {suggestions?.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                          >
                            <div className="text-sm text-gray-800">
                              {suggestion.text}
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="hidden lg:flex gap-2 flex-shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  navigate(tab.href);
                }}
                className={`px-5 py-2 ${
                  location.pathname === tab.href
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                } rounded-lg font-medium transition-colors shadow-sm`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-medium">
                  {userManager.user?.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {userManager.user?.username || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userManager.user?.email || "user@example.com"}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={handleCompose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="lg:hidden pb-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchInput(e.target.value))}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTabId(0);
                navigate("/");
              }}
              className={`flex-1 py-2 ${
                location.pathname === "/"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } rounded-lg font-medium text-sm shadow-sm transition-colors`}
            >
              Gmail
            </button>
            <button
              onClick={() => {
                setActiveTabId(1);
                navigate("/kanpan");
              }}
              className={`flex-1 py-2 ${
                location.pathname === "/kanpan"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } rounded-lg font-medium text-sm transition-colors shadow-sm`}
            >
              Kanpan
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
