import React, { useState, useRef, useEffect } from "react";
import {
  Mail,
  Star,
  Archive,
  Trash2,
  Search,
  RefreshCw,
  Check,
  MoreVertical,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import emailApi from "../../services/emailApi";

const EmailList = ({
  threads,
  selectedThreadId,
  setSelectedThreadId,
  onToggleStar,
  onDeleteThread,
  onArchiveThread,
  onMarkAsRead,
  onBulkMarkAsRead,
  handleMoreLoading,
  isMoreLoading,
  isInboxPage,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreads, setSelectedThreads] = useState([]);
  const loadMoreRef = useRef(null);

  const handleSelectThread = (threadId) => {
    setSelectedThreads((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedThreads([]);
    } else {
      setSelectedThreads(threads.map((t) => t.id));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkDelete = () => {
    if (selectedThreads.length > 0) {
      selectedThreads.forEach((id) => onDeleteThread(id));
      setSelectedThreads([]);
      setSelectAll(false);
    }
  };

  const handleBulkArchive = () => {
    if (selectedThreads.length > 0) {
      selectedThreads.forEach((id) => onArchiveThread(id));
      setSelectedThreads([]);
      setSelectAll(false);
    }
  };

  const handleBulkMarkAsRead = () => {
    if (selectedThreads.length > 0 && onBulkMarkAsRead) {
      onBulkMarkAsRead(selectedThreads, true); // true = mark as read
      setSelectedThreads([]);
      setSelectAll(false);
    }
  };

  const handleBulkMarkAsUnread = () => {
    if (selectedThreads.length > 0 && onBulkMarkAsRead) {
      onBulkMarkAsRead(selectedThreads, false); // false = mark as unread
      setSelectedThreads([]);
      setSelectAll(false);
    }
  };

  const handleSelectedThread = async (thread) => {
    setSelectedThreadId(thread.id);
    const lastMessage = thread.messages?.[thread.messages.length - 1];
    if (lastMessage?.labelIds?.includes("UNREAD")) {
      const data = {
        email_id: lastMessage.id,
        add: [],
        remove: ["UNREAD"],
      };
      onMarkAsRead(thread.id, true, data);
      // onMarkAsRead(lastMessage.id, true, data);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        // Chỉ load thêm khi là Inbox page
        if (firstEntry.isIntersecting && !isMoreLoading && isInboxPage) {
          handleMoreLoading();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isMoreLoading, handleMoreLoading, isInboxPage]);

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
            />
          </div>
        </div>

        <div className="px-4 pb-3 flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Check
              className={`w-4 h-4 ${
                selectAll ? "text-blue-600" : "text-gray-400"
              }`}
            />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>

          {selectedThreads.length > 0 && (
            <>
              <button
                onClick={handleBulkArchive}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Archive className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleBulkDelete}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Delete selected"
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleBulkMarkAsUnread}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Mark as unread"
              >
                <Mail className="w-4 h-4 text-gray-600" />
              </button>
            </>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto">
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          <div className="text-xs text-gray-500 font-medium">
            1-{threads.length} of {threads.length}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.map((thread) => {
          const isSelected = selectedThreadId === thread.id;
          const isChecked = selectedThreads.includes(thread.id);

          // Get first message for display
          const firstMessage = thread.messages?.[0] || {};
          const lastMessage =
            thread.messages?.[thread.messages.length - 1] || {};
          const messageCount = thread.messages?.length || 0;

          // Check UNREAD on last message
          const isUnread = lastMessage.labelIds?.includes("UNREAD");
          // Check if ANY message in the thread has STARRED label
          const isStarred =
            thread.messages?.some((msg) => msg.labelIds?.includes("STARRED")) ||
            false;

          return (
            <div
              key={thread.id}
              onClick={() => handleSelectedThread(thread)}
              className={`border-b border-gray-100 p-4 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent ${
                isSelected
                  ? "bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-l-blue-600"
                  : ""
              } ${isUnread ? "bg-blue-50/30" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-start gap-3 pt-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      e.stopPropagation(); // Thêm vào onChange
                      handleSelectThread(thread.id);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      // Check if any message in thread has STARRED label
                      const hasStarred = thread.messages?.some((msg) =>
                        msg.labelIds?.includes("STARRED")
                      );

                      if (hasStarred) {
                        // Remove STARRED from ALL messages in the thread
                        const promises = thread.messages.map((msg) => {
                          const data = {
                            email_id: msg.id, // Use message id, not thread id
                            add: [],
                            remove: ["STARRED"],
                          };
                          return onToggleStar(msg.id, data);
                        });

                        await Promise.all(promises);
                      } else {
                        // Add STARRED to the last message only
                        const lastMessage =
                          thread.messages[thread.messages.length - 1];
                        const data = {
                          email_id: lastMessage.id, // Use message id, not thread id
                          add: ["STARRED"],
                          remove: [],
                        };
                        await onToggleStar(lastMessage.id, data);
                      }
                    }}
                    className="transition-colors"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        isStarred
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-semibold text-sm truncate ${
                        isUnread ? "text-gray-900" : "text-gray-700"
                      }`}
                    >
                      {firstMessage.from?.split("<")[0]?.trim() || "Unknown"}
                    </span>
                    {messageCount > 1 && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        ({messageCount})
                      </span>
                    )}
                    <span className="text-xs text-gray-500 ml-auto flex-shrink-0">
                      {new Date(firstMessage.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div
                    className={`text-sm mb-1 truncate ${
                      isUnread ? "font-semibold text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {firstMessage.subject || "(No Subject)"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {firstMessage.snippet || ""}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading indicator for infinite scroll */}
        {threads.length > 0 && (
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {isMoreLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Đang tải...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailList;
