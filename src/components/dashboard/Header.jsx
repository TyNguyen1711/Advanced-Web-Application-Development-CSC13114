import { useSelector, useDispatch } from "react-redux";
import { Mail, Plus, Image as ImageIcon, LogOut } from "lucide-react";
import authApi from "../../services/authApi";
import { userManager } from "../../services/apiClient";
import { useLocation, useNavigate } from "react-router-dom";

import { useState } from "react";
const Header = ({ setIsMobileSidebarOpen, handleCompose }) => {
  const navigate = useNavigate();
  const [activeTabId, setActiveTabId] = useState(0);
  const location = useLocation();
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
      <div className="px-4 lg:px-10 py-3 flex items-center justify-between gap-4">
        {/* Left: Mobile menu + Logo */}
        <div className="flex items-center gap-4">
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
              <p className="text-xs text-gray-500">Professional Email Client</p>
            </div>
          </div>
        </div>

        {/* Center: Navigation buttons */}
        <div className="hidden md:flex items-center gap-2">
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
        <div className="flex items-center gap-2">
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
      <div
        onClick={() => navigate("/")}
        className="md:hidden px-4 pb-3 flex gap-2 border-t border-gray-100 pt-3"
      >
        <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm shadow-sm">
          Gmail
        </button>
        <button
          onClick={() => {
            setActiveTabId("kanpan");
            navigate("/kanpan");
          }}
          className="flex-1 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
        >
          Kanpan
        </button>
      </div>
    </header>
  );
};
export default Header;
