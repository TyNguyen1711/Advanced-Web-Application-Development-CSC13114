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
import Header from "../components/dashboard/Header";

// EmailDashboard.jsx
const EmailDashboard = () => {
  const dispatch = useDispatch();
  const allThreadsState = useSelector((state) => state.threads.allThreadsState);
  const nextPageToken = useSelector((state) => state.threads.nextPageToken);

  const [selectedMailbox, setSelectedMailbox] = useState("inbox");
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showEmailList, setShowEmailList] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeMode, setComposeMode] = useState({ type: "new", email: null });
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useAuthTokens();
  useFetchThreads();

  useEffect(() => {
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

    if (currentThreads.length > 0) {
      setSelectedThread(currentThreads[0]);
      setSelectedThreadId(currentThreads[0].id);
    } else {
      setSelectedThread(null);
      setSelectedThreadId("");
    }

    setShowEmailList(true);
  }, [selectedMailbox]);

  useEffect(() => {
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
      const lastMessage = thread.messages?.[thread.messages.length - 1];
      const isUnread = lastMessage?.labelIds?.includes("UNREAD");

      const labels =
        thread?.messages?.flatMap((msg) => msg.labelIds || []) || [];
      const uniqueLabels = [...new Set(labels)];

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
  const handleMoreLoading = async () => {
    if (!nextPageToken || isLoadingMore) return;
    setIsLoadingMore(true);
    const response = await emailApi.getThreads(nextPageToken);
    dispatch(appendThreads(response.data.threads));
    dispatch(setNextPageToken(response.data.nextPageToken || ""));
    setIsLoadingMore(false);
  };
  const currentThreads = allThreadsState.filter((thread) => {
    const labels = thread?.messages?.flatMap((msg) => msg.labelIds || []) || [];
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

  const handleToggleStar = async (messageId, data) => {
    const updatedThreads = allThreadsState.map((thread) => {
      const hasMessage = thread.messages.some((msg) => msg.id === messageId);

      if (hasMessage) {
        return {
          ...thread,
          messages: thread.messages.map((msg) => {
            if (msg.id === messageId) {
              let newLabelIds = [...(msg.labelIds || [])];

              if (data.add.includes("STARRED")) {
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
      const thread = allThreadsState.find((t) => t.id === threadId);
      if (!thread) return;

      const updatedThreads = allThreadsState.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            messages: t.messages.map((msg) => {
              let newLabelIds = [...(msg.labelIds || [])];

              if (!newLabelIds.includes("TRASH")) {
                newLabelIds.push("TRASH");
              }

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
    const updatedThreads = allThreadsState.map((thread) => {
      if (threadIds.includes(thread.id)) {
        return {
          ...thread,
          messages: thread.messages.map((msg, index) => {
            if (index === thread.messages.length - 1) {
              let newLabelIds = [...(msg.labelIds || [])];
              if (read) {
                newLabelIds = newLabelIds.filter((l) => l !== "UNREAD");
              } else {
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
      <Header
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        handleCompose={handleCompose}
      />

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
