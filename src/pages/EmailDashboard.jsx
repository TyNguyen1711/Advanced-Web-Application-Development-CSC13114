import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Mail,
  Star,
  Send,
  FileText,
  Archive,
  Trash2,
  Plus,
  MoreVertical,
  Paperclip,
  Inbox,
  X,
  Bold,
  Italic,
  Underline,
  Link2,
  Image as ImageIcon,
  Smile,
  Clock,
} from "lucide-react";
import ComposeModal from "../components/modal/ComposeModal";
import EmailDetail from "../components/dashboard/EmailDetail";
import EmailList from "../components/dashboard/EmailList";
import Sidebar from "../components/dashboard/Sidebar";
import emailApi from "../services/emailApi";
import Swal from "sweetalert2";
import useAuthTokens from "../hooks/useAuthTokens";
import useFetchThreads from "../hooks/useFetchThreads";
import {
  setAllThreadsState,
  setNextPageToken,
  appendThreads,
} from "../redux/threadSlice";

// Compose Modal Component

const handleSchedule = () => {
  alert("Email scheduled for later! ⏰");
  onClose();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-lg font-semibold text-gray-900">
            {forward ? "Forward Message" : replyTo ? "Reply" : "New Message"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {/* To Field */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-700 w-12">
                To:
              </label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Recipients"
                className="flex-1 outline-none text-sm text-gray-900"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCc(!showCc)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Cc
                </button>
                <button
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Bcc
                </button>
              </div>
            </div>

            {/* Cc Field */}
            {showCc && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <label className="text-sm font-medium text-gray-700 w-12">
                  Cc:
                </label>
                <input
                  type="email"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="Carbon copy"
                  className="flex-1 outline-none text-sm text-gray-900"
                />
              </div>
            )}

            {/* Bcc Field */}
            {showBcc && (
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <label className="text-sm font-medium text-gray-700 w-12">
                  Bcc:
                </label>
                <input
                  type="email"
                  placeholder="Blind carbon copy"
                  className="flex-1 outline-none text-sm text-gray-900"
                />
              </div>
            )}

            {/* Subject Field */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
              <label className="text-sm font-medium text-gray-700 w-12">
                Subject:
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 outline-none text-sm text-gray-900"
              />
            </div>

            {/* Original Message Quote (for replies/forwards) */}
            {replyTo && (
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                <div className="text-xs text-gray-500 mb-2">
                  On {replyTo.date} at {replyTo.timestamp}, {replyTo.from}{" "}
                  wrote:
                </div>
                <div
                  className="text-sm text-gray-700 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: replyTo.body }}
                />
              </div>
            )}

            {/* Body Field */}
            <div className="min-h-[300px]">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your message..."
                className="w-full h-full min-h-[300px] outline-none text-sm text-gray-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Bold className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Italic className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Underline className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Link2 className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Paperclip className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ImageIcon className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
            <button
              onClick={handleSchedule}
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              Schedule
            </button>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// EmailDashboard.jsx
const EmailDashboard = () => {
  const dispatch = useDispatch();
  const allThreadsState = useSelector((state) => state.threads.allThreadsState);
  const nextPageToken = useSelector((state) => state.threads.nextPageToken);

  const [selectedMailbox, setSelectedMailbox] = useState("inbox");
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  // const [reset, setReset] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showEmailList, setShowEmailList] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState({ type: "new", email: null });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use custom hooks
  useAuthTokens();
  useFetchThreads();

  // Reset selected thread when mailbox changes
  useEffect(() => {
    // Filter threads for current mailbox
    const currentThreads = allThreadsState.filter((thread) => {
      const labels =
        thread?.messages?.flatMap((msg) => msg.labelIds || []) || [];
      const uniqueLabels = [...new Set(labels)];

      switch (selectedMailbox) {
        case "inbox":
          return uniqueLabels.includes("INBOX");
        case "starred":
          return uniqueLabels.includes("STARRED");
        case "sent":
          return uniqueLabels.includes("SENT");
        case "drafts":
          return uniqueLabels.includes("DRAFT");
        case "archive":
          return (
            !uniqueLabels.includes("INBOX") && !uniqueLabels.includes("TRASH")
          );
        case "trash":
          return uniqueLabels.includes("TRASH");
        default:
          return uniqueLabels.includes("INBOX");
      }
    });

    // Reset to first thread or null if no threads
    if (currentThreads.length > 0) {
      setSelectedThread(currentThreads[0]);
      setSelectedThreadId(currentThreads[0].id);
    } else {
      setSelectedThread(null);
      setSelectedThreadId("");
    }

    // Show email list on mobile when changing mailbox
    setShowEmailList(true);
  }, [selectedMailbox]); // Remove allThreadsState from dependencies

  // Separate effect to update selectedThread when allThreadsState changes
  useEffect(() => {
    // Only update if we have a selectedThreadId
    if (selectedThreadId && allThreadsState.length > 0) {
      const updatedThread = allThreadsState.find(
        (t) => t.id === selectedThreadId
      );
      if (updatedThread) {
        setSelectedThread(updatedThread);
      }
    }
  }, [allThreadsState, selectedThreadId]);

  // Calculate unread count for each mailbox dynamically
  const calculateUnreadCounts = () => {
    const counts = {
      inbox: 0,
      starred: 0,
      sent: 0,
      drafts: 0,
      archive: 0,
      trash: 0,
    };

    allThreadsState.forEach((thread) => {
      // Check if the LAST message in thread is unread
      const lastMessage = thread.messages?.[thread.messages.length - 1];
      const isUnread = lastMessage?.labelIds?.includes("UNREAD");

      // Get all unique labels from all messages in thread
      const labels =
        thread?.messages?.flatMap((msg) => msg.labelIds || []) || [];
      const uniqueLabels = [...new Set(labels)];

      // Count unread threads for each mailbox
      if (isUnread) {
        if (uniqueLabels.includes("INBOX")) {
          counts.inbox++;
        }
        if (uniqueLabels.includes("STARRED")) {
          counts.starred++;
        }
        if (uniqueLabels.includes("SENT")) {
          counts.sent++;
        }
        if (uniqueLabels.includes("DRAFT")) {
          counts.drafts++;
        }
        if (
          !uniqueLabels.includes("INBOX") &&
          !uniqueLabels.includes("TRASH")
        ) {
          counts.archive++;
        }
        if (uniqueLabels.includes("TRASH")) {
          counts.trash++;
        }
      }
    });

    return counts;
  };

  const unreadCounts = calculateUnreadCounts();

  // Create mailboxes with dynamic unread counts
  const mailboxes = [
    {
      id: "inbox",
      name: "Inbox",
      icon: Inbox,
      unread: unreadCounts.inbox,
      color: "blue",
    },
    {
      id: "starred",
      name: "Starred",
      icon: Star,
      unread: unreadCounts.starred,
      color: "yellow",
    },
    {
      id: "sent",
      name: "Sent",
      icon: Send,
      unread: unreadCounts.sent,
      color: "green",
    },
    {
      id: "drafts",
      name: "Drafts",
      icon: FileText,
      unread: unreadCounts.drafts,
      color: "gray",
    },
    {
      id: "archive",
      name: "Archive",
      icon: Archive,
      unread: unreadCounts.archive,
      color: "purple",
    },
    {
      id: "trash",
      name: "Trash",
      icon: Trash2,
      unread: unreadCounts.trash,
      color: "red",
    },
  ];

  useEffect(() => {
    const getThreadById = async () => {
      const response = await emailApi.getThreadById(selectedThreadId);

      setSelectedThread(response?.data);
    };
    getThreadById();
  }, [selectedThreadId]);
  // Filter threads by mailbox based on labelIds
  const handleMoreLoading = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    const response = await emailApi.getThreads(nextPageToken);
    dispatch(appendThreads(response.data.threads));
    dispatch(setNextPageToken(response.data.nextPageToken || ""));
    setIsLoadingMore(false);
  };
  const currentThreads = allThreadsState.filter((thread) => {
    // Lấy tất cả labels từ tất cả messages trong thread
    const labels = thread?.messages?.flatMap((msg) => msg.labelIds || []) || [];
    const uniqueLabels = [...new Set(labels)]; // Loại bỏ trùng lặp

    switch (selectedMailbox) {
      case "inbox":
        return uniqueLabels.includes("INBOX");
      case "starred":
        return uniqueLabels.includes("STARRED");
      case "sent":
        return uniqueLabels.includes("SENT");
      case "drafts":
        return uniqueLabels.includes("DRAFT");
      case "archive":
        return (
          !uniqueLabels.includes("INBOX") && !uniqueLabels.includes("TRASH")
        );
      case "trash":
        return uniqueLabels.includes("TRASH");
      default:
        return uniqueLabels.includes("INBOX");
    }
  });

  const handleToggleStar = async (messageId, data) => {
    // Update Redux state immediately (optimistic update)
    const updatedThreads = allThreadsState.map((thread) => {
      // Check if this thread contains the message
      const hasMessage = thread.messages.some((msg) => msg.id === messageId);

      if (hasMessage) {
        return {
          ...thread,
          messages: thread.messages.map((msg) => {
            if (msg.id === messageId) {
              // Update this specific message's labels
              let newLabelIds = [...(msg.labelIds || [])];

              if (data.add.includes("STARRED")) {
                // Add STARRED if not already there
                if (!newLabelIds.includes("STARRED")) {
                  newLabelIds.push("STARRED");
                }
              }

              if (data.remove.includes("STARRED")) {
                // Remove STARRED
                newLabelIds = newLabelIds.filter((l) => l !== "STARRED");
              }

              return {
                ...msg,
                labelIds: newLabelIds,
              };
            }
            return msg;
          }),
        };
      }
      return thread;
    });

    dispatch(setAllThreadsState(updatedThreads));

    // Then call API
    await emailApi.modifyEmail(data);
  };

  const handleCloseDetail = () => {
    setShowEmailList(true);
    setSelectedThread(null);
  };

  const handleDeleteThread = async (threadId) => {
    if (confirm("Are you sure you want to delete this email?")) {
      // Find the thread to get its messages
      const thread = allThreadsState.find((t) => t.id === threadId);
      if (!thread) return;

      // Update Redux state immediately (optimistic update)
      const updatedThreads = allThreadsState.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map((msg) => {
              let newLabelIds = [...(msg.labelIds || [])];
              // Add TRASH label if not already there
              if (!newLabelIds.includes("TRASH")) {
                newLabelIds.push("TRASH");
              }
              // Remove INBOX, STARRED, UNREAD labels
              newLabelIds = newLabelIds.filter(
                (label) => !["INBOX", "STARRED", "UNREAD"].includes(label)
              );
              return {
                ...msg,
                labelIds: newLabelIds,
              };
            }),
          };
        }
        return t;
      });

      dispatch(setAllThreadsState(updatedThreads));

      // Close detail view if this thread is selected
      if (selectedThread?.id === threadId) {
        setSelectedThread(null);
        setShowEmailList(true);
      }

      // Call API for each message in the thread
      try {
        await Promise.all(
          thread.messages.map((message) => {
            const data = {
              email_id: message.id,
              add: ["TRASH"],
              remove: ["INBOX", "STARRED", "UNREAD"],
            };
            return emailApi.modifyEmail(data);
          })
        );
        alert("Email moved to trash! 🗑️");
      } catch (error) {
        console.error("Error deleting thread:", error);
        alert("Failed to delete email. Please try again.");
      }
    }
  };

  const handleArchiveThread = (threadId) => {
    const updatedThreads = allThreadsState.map((t) =>
      t.id === threadId
        ? {
            ...t,
            labelIds: (t.labelIds || []).filter((l) => l !== "INBOX"),
          }
        : t
    );
    dispatch(setAllThreadsState(updatedThreads));
    if (selectedThread?.id === threadId) {
      setSelectedThread(null);
      setShowEmailList(true);
    }
    alert("Email archived! 📦");
  };

  const handleMarkAsRead = async (threadId, read, data) => {
    const updatedThreads = allThreadsState.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            messages: thread.messages.map((msg, index) => {
              if (index === thread.messages.length - 1) {
                let newLabelIds = [...(msg.labelIds || [])];
                if (read) {
                  // Mark as read: remove UNREAD
                  newLabelIds = newLabelIds.filter((l) => l !== "UNREAD");
                } else {
                  // Mark as unread: add UNREAD if not already there
                  if (!newLabelIds.includes("UNREAD")) {
                    newLabelIds.push("UNREAD");
                  }
                }
                return {
                  ...msg,
                  labelIds: newLabelIds,
                };
              }
              return msg;
            }),
          }
        : thread
    );
    dispatch(setAllThreadsState(updatedThreads));

    await emailApi.modifyEmail(data);
  };

  const handleBulkMarkAsRead = async (threadIds, read) => {
    // Update all threads at once
    const updatedThreads = allThreadsState.map((thread) => {
      if (threadIds.includes(thread.id)) {
        return {
          ...thread,
          messages: thread.messages.map((msg, index) => {
            if (index === thread.messages.length - 1) {
              let newLabelIds = [...(msg.labelIds || [])];
              if (read) {
                // Mark as read: remove UNREAD
                newLabelIds = newLabelIds.filter((l) => l !== "UNREAD");
              } else {
                // Mark as unread: add UNREAD if not already there
                if (!newLabelIds.includes("UNREAD")) {
                  newLabelIds.push("UNREAD");
                }
              }
              return {
                ...msg,
                labelIds: newLabelIds,
              };
            }
            return msg;
          }),
        };
      }
      return thread;
    });

    dispatch(setAllThreadsState(updatedThreads));

    // Call API for each thread
    try {
      await Promise.all(
        threadIds.map((threadId) => {
          const thread = allThreadsState.find((t) => t.id === threadId);
          const lastMessage = thread?.messages?.[thread.messages.length - 1];
          if (!lastMessage) return Promise.resolve();

          const data = {
            email_id: lastMessage.id,
            add: read ? [] : ["UNREAD"],
            remove: read ? ["UNREAD"] : [],
          };
          return emailApi.modifyEmail(data);
        })
      );
    } catch (error) {
      console.error("Error in bulk mark as read/unread:", error);
    }
  };

  const handleMarkAsUnread = (threadId) => {
    const thread = allThreadsState.find((t) => t.id === threadId);
    const lastMessage = thread?.messages?.[thread.messages.length - 1];
    if (!lastMessage) return;

    const data = {
      email_id: lastMessage.id,
      add: ["UNREAD"],
      remove: [],
    };
    handleMarkAsRead(threadId, false, data);
    alert("Marked as unread! 📧");
  };

  const handleCompose = () => {
    setComposeMode({ type: "new", email: null });
    setIsComposeOpen(true);
  };

  const handleReply = (message) => {
    setComposeMode({ type: "reply", email: message, replyAll: false });
    setIsComposeOpen(true);
  };

  const handleForward = (message) => {
    setComposeMode({ type: "forward", email: message });
    setIsComposeOpen(true);
  };

  const handleSendEmail = async (newMessage) => {
    const response = await emailApi.sendEmail(newMessage);

    if (response.code == 202) {
      Swal.fire("Thành công !", response.data, "success");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="px-4 lg:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Mail className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MailBox
              </h1>
              <p className="text-xs text-gray-500">Professional Email Client</p>
            </div>
          </div>

          <button
            onClick={handleCompose}
            className="ml-auto lg:hidden px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedMailbox={selectedMailbox}
          onSelectMailbox={setSelectedMailbox}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
          onCompose={handleCompose}
          mockMailboxes={mailboxes}
        />

        <div
          className={`${
            showEmailList ? "flex" : "hidden lg:flex"
          } flex-col w-full lg:w-96 xl:w-[480px]`}
        >
          <EmailList
            threads={currentThreads}
            selectedThreadId={selectedThreadId}
            setSelectedThreadId={setSelectedThreadId}
            onToggleStar={handleToggleStar}
            onDeleteThread={handleDeleteThread}
            onArchiveThread={handleArchiveThread}
            onMarkAsRead={handleMarkAsRead}
            onBulkMarkAsRead={handleBulkMarkAsRead}
            handleMoreLoading={handleMoreLoading}
            isMoreLoading={isLoadingMore}
            hasMore={!!nextPageToken}
            isInboxPage={selectedMailbox == "inbox" ? true : false}
          />
        </div>

        <div className={`${!showEmailList ? "flex" : "hidden lg:flex"} flex-1`}>
          <EmailDetail
            thread={selectedThread}
            onClose={handleCloseDetail}
            onReply={handleReply}
            onForward={handleForward}
            onDelete={handleDeleteThread}
            onArchive={handleArchiveThread}
            onToggleStar={handleToggleStar}
            onMarkAsUnread={handleMarkAsUnread}
            onSendReply={handleSendEmail}
          />
        </div>
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        replyTo={composeMode.type !== "new" ? composeMode.email : null}
        replyAll={composeMode.replyAll}
        forward={composeMode.type === "forward"}
        onSend={handleSendEmail}
      />
    </div>
  );
};

export default EmailDashboard;
