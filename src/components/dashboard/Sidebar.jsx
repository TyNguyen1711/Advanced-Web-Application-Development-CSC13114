import { ChevronLeft, Image as ImageIcon, LogOut } from "lucide-react";
import authApi from "../../services/authApi";
import { userManager } from "../../services/apiClient";
import { useNavigate } from "react-router-dom";

// Sidebar Component
const Sidebar = ({
  selectedMailbox,
  onSelectMailbox,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
  onCompose,
  mockMailboxes,
}) => {
  const navigate = useNavigate();

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
    <div
      className={`${
        isMobileSidebarOpen ? "fixed inset-0 z-50 bg-white" : "hidden lg:block"
      } lg:relative w-full lg:w-64 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col`}
    >
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="lg:hidden flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Mailboxes</h2>
          <button
            onClick={onCloseMobileSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={onCompose}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]"
        >
          <span className="text-lg mr-1">✍️</span>
          Compose
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2">
        {mockMailboxes.map((mailbox) => {
          const Icon = mailbox.icon;
          const isActive = selectedMailbox === mailbox.id;
          return (
            <button
              key={mailbox.id}
              onClick={() => {
                onSelectMailbox(mailbox.id);
                onCloseMobileSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              />
              <span
                className={`flex-1 text-left font-medium ${
                  isActive ? "text-blue-700" : ""
                }`}
              >
                {mailbox.name}
              </span>
              {mailbox.unread > 0 && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {mailbox.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
