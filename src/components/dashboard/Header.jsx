import { useSelector, useDispatch } from "react-redux";
import { Mail, Plus, Image as ImageIcon, LogOut, Search } from "lucide-react";
import authApi from "../../services/authApi";
import { userManager } from "../../services/apiClient";
import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
const Header = ({ setIsMobileSidebarOpen, handleCompose }) => {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);
  const tabs = [
    {
      id: 0,
      name: "Gmail",
      href: "/",
      current: true,
    },

    {
      id: 1,
      name: "Kanpan",
      href: "/kanpan",
      current: false,
    },
  ];

  // Mock API để lấy gợi ý
  const fetchSuggestions = async (query) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock data - gợi ý dựa trên query
      const mockSuggestions = [
        {
          id: 1,
          subject: `${query} - Hợp đồng mới từ công ty ABC`,
          from: "abc@company.com",
        },
        {
          id: 2,
          subject: `Re: ${query} - Báo cáo tháng 12`,
          from: "manager@company.com",
        },
        {
          id: 3,
          subject: `${query} - Thông báo họp team`,
          from: "hr@company.com",
        },
        {
          id: 4,
          subject: `Fwd: ${query} - Tài liệu quan trọng`,
          from: "support@company.com",
        },
        {
          id: 5,
          subject: `${query} - Lịch nghỉ lễ 2025`,
          from: "admin@company.com",
        },
      ];

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search - gọi API sau 5s
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Clear timeout cũ
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set timeout mới - 5 giây
      searchTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 5000);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Đóng suggestions khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm ở đây
    console.log("Searching for:", searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log("Selected suggestion:", suggestion);
    setSearchQuery(suggestion.subject);
    setShowSuggestions(false);
    // Có thể navigate đến email chi tiết hoặc xử lý khác
  };

  const handleLogout = async () => {
    try {
      const userId = userManager.user?.id;
      if (userId) {
        await authApi.logout(userId);
      }
      // Clear user data
      userManager.user = null;
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if API fails
      userManager.user = null;
      navigate("/login");
    }
  };
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-20">
      <div className="px-4 lg:px-10 py-3 grid grid-cols-4 items-center gap-4">
        {/* Left: Mobile menu + Logo + Search */}
        <div className="flex items-center gap-4 justify-start col-span-2">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Mail className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MailBox
              </h1>
            </div>
          </div>

          {/* Search Box - Desktop */}
          <div
            className="hidden lg:flex flex-1 max-w-3xl ml-10"
            ref={searchContainerRef}
          >
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                placeholder="Tìm kiếm email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Đang tìm kiếm...</span>
                    </div>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 font-medium">
                        Gợi ý tìm kiếm
                      </div>
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.subject}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Từ: {suggestion.from}
                              </p>
                            </div>
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

        {/* Center: Navigation buttons */}
        <div className="hidden md:flex items-center gap-2 justify-center">
          {tabs.map((tab, index) => (
            <button
              key={index}
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

        {/* Right: User info + Logout */}
        <div className="flex items-center gap-2 justify-end">
          {/* Mobile compose button */}
          <button
            onClick={handleCompose}
            className="lg:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* User dropdown button */}
          <div className="hidden sm:flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {userManager.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col min-w-0 max-w-[140px]">
              <span className="text-sm font-medium text-gray-900 truncate">
                {userManager.user?.username || "User"}
              </span>
              <span className="text-xs text-gray-500 truncate">
                {userManager.user?.email || "user@example.com"}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden px-4 pb-3 space-y-3 border-t border-gray-100 pt-3">
        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </form>

        {/* Navigation buttons */}
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
    </header>
  );
};
export default Header;
