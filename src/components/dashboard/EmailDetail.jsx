import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail,
  Star,
  MoreVertical,
  Reply,
  Forward,
  Archive,
  Trash2,
  Tag,
  AlertCircle,
  Paperclip,
  Image,
  FileText,
  Loader2,
} from "lucide-react";
import { userManager } from "../../services/apiClient";
import ReplyBox from "./ReplyBox";
import ForwardBox from "./ForwardBox";
import emailApi from "../../services/emailApi";
import { setAllThreadsState } from "../../redux/threadSlice";
import Swal from "sweetalert2";

const EmailDetail = ({ thread, onSendReply, onMarkAsUnread }) => {
  const dispatch = useDispatch();
  const allThreadsState = useSelector((state) => state.threads.allThreadsState);

  const [showActions, setShowActions] = useState(null);
  const [replyingToIndex, setReplyingToIndex] = useState(null);
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [messages, setMessages] = useState([]);
  const [isSendingReply, setIsSendingReply] = useState(false);

  React.useEffect(() => {
    if (thread?.messages) {
      setMessages(thread.messages);
      if (thread.messages.length > 0) {
        setExpandedMessages(new Set([thread.messages.length - 1]));
        setReplyingToIndex(null);
        setForwardingMessage(null);
      }
    }
  }, [thread?.id]);

  if (!thread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">
            No email selected
          </h3>
        </div>
      </div>
    );
  }

  const handleSendReply = async (data) => {
    if (replyingToIndex === null || isSendingReply) return;

    setIsSendingReply(true);
    try {
      const response = await emailApi.replyEmail(data);

      if (response?.data) {
        const updatedThread = response.data;
        const updatedThreads = allThreadsState.map((t) =>
          t.id === updatedThread.id ? updatedThread : t
        );
        dispatch(setAllThreadsState(updatedThreads));
        setMessages(updatedThread.messages);
        setExpandedMessages(new Set([updatedThread.messages.length - 1]));
        Swal.fire({
          icon: "success",
          title: "Reply sent!",
          text: "Your reply has been sent successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setReplyingToIndex(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to send",
        text: "Failed to send reply. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleSendForward = async () => {
    setForwardingMessage(null);
  };

  const toggleMessageExpand = (index) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
      if (replyingToIndex === index) {
        setReplyingToIndex(null);
      }
    } else {
      newExpanded.add(index);
    }
    setExpandedMessages(newExpanded);
  };

  const toggleMessageStar = async (index) => {
    setMessages((prevMessages) => {
      const message = prevMessages[index];
      const isStarred = message.labelIds?.includes("STARRED");

      const data = {
        email_id: message.id,
        add: isStarred ? [] : ["STARRED"],
        remove: isStarred ? ["STARRED"] : [],
      };

      const updatedMessages = [...prevMessages];
      if (isStarred) {
        updatedMessages[index] = {
          ...updatedMessages[index],
          labelIds: updatedMessages[index].labelIds.filter(
            (l) => l !== "STARRED"
          ),
        };
      } else {
        updatedMessages[index] = {
          ...updatedMessages[index],
          labelIds: [...(updatedMessages[index].labelIds || []), "STARRED"],
        };
      }

      const updatedThreads = allThreadsState.map((t) => {
        if (t.id === thread.id) {
          return {
            ...t,
            messages: updatedMessages,
          };
        }
        return t;
      });
      dispatch(setAllThreadsState(updatedThreads));

      emailApi.modifyEmail(data).catch((error) => {
        setMessages(prevMessages);
      });

      return updatedMessages;
    });
  };

  const handleReplyClick = (index) => {
    setReplyingToIndex(index);
    setForwardingMessage(null);
  };

  const handleForwardClick = (message) => {
    setForwardingMessage(message);
    setReplyingToIndex(null);
  };

  const handleCancelReply = () => {
    setReplyingToIndex(null);
  };

  const handleCancelForward = () => {
    setForwardingMessage(null);
  };

  const handleDownloadAttachment = async (messageId, attachment) => {
    try {
      Swal.fire({
        title: "Downloading...",
        text: `Downloading ${attachment.filename}`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await emailApi.getAttachment(
        messageId,
        attachment.attachmentId
      );

      if (response?.data?.data) {
        const base64Data = response.data.data
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: attachment.mimeType });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = attachment.filename || "attachment";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        Swal.close();
      } else {
        throw new Error("No attachment data received");
      }
    } catch (error) {
      console.error("Error downloading attachment:", error);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to download the attachment. Please try again.",
      });
    }
  };

  const parseEmail = (emailString) => {
    if (!emailString) return { name: "", email: "" };
    const match = emailString.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      return { name: match[1].trim(), email: match[2].trim() };
    }
    return { name: emailString, email: emailString };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const decodeEmailBody = (bodyData) => {
    if (!bodyData) return "No content";

    try {
      // If already HTML or plain text, return as is
      if (bodyData.includes("<") && bodyData.includes(">")) {
        return bodyData;
      }

      // Check if it's a valid base64 string
      const base64Pattern = /^[A-Za-z0-9+/\-_]+={0,2}$/;
      if (!base64Pattern.test(bodyData.trim())) {
        // Not base64, return as plain text
        return bodyData;
      }

      // Convert URL-safe base64 to standard base64
      const base64 = bodyData.replace(/-/g, "+").replace(/_/g, "/");

      // Add padding if needed
      const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

      // Decode base64
      const decoded = atob(paddedBase64);

      // Convert to UTF-8
      const utf8Decoded = decodeURIComponent(
        decoded
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return utf8Decoded;
    } catch (error) {
      console.error(
        "Error decoding email body:",
        error,
        "Data:",
        bodyData?.substring(0, 100)
      );
      // Return original data if decoding fails
      return bodyData || "Unable to decode content";
    }
  };

  const getEmailBodyContent = (message) => {
    if (message.bodyData || message.alternateParts) {
      return decodeEmailBody(
        message.bodyData || message.snippet || "No content"
      );
    }

    if (message.parts && message.parts.length > 0) {
      const htmlPart = message.parts.find(
        (part) => part.mimeType === "text/html" && !part.attachmentId
      );

      if (htmlPart && htmlPart.bodyData) {
        return decodeEmailBody(htmlPart.bodyData);
      }

      const textPart = message.parts.find(
        (part) => part.mimeType === "text/plain" && !part.attachmentId
      );

      if (textPart && textPart.bodyData) {
        const plainText = decodeEmailBody(textPart.bodyData);
        return plainText.replace(/\n/g, "<br>");
      }

      const multipartPart = message.parts.find(
        (part) => part.mimeType === "multipart/alternative" && part.parts
      );

      if (multipartPart && multipartPart.parts) {
        const nestedHtmlPart = multipartPart.parts.find(
          (p) => p.mimeType === "text/html" && !p.attachmentId
        );

        if (nestedHtmlPart && nestedHtmlPart.bodyData) {
          return decodeEmailBody(nestedHtmlPart.bodyData);
        }

        const nestedTextPart = multipartPart.parts.find(
          (p) => p.mimeType === "text/plain" && !p.attachmentId
        );

        if (nestedTextPart && nestedTextPart.bodyData) {
          const plainText = decodeEmailBody(nestedTextPart.bodyData);
          return plainText.replace(/\n/g, "<br>");
        }
      }
    }

    return message.snippet || "No content";
  };

  const getAttachments = (message) => {
    if (!message.parts || message.parts.length === 0) {
      return [];
    }
    return message.parts.filter((part) => part.attachmentId);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Subject Header */}
      <div className="bg-white sticky top-0 z-10 px-6 mt-6 ml-14">
        <h1 className="text-2xl font-semibol text-gray-900">
          {thread.messages[0].subject}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 pb-4 pt-2">
          {/* Thread Messages */}
          <div className="space-y-0">
            {messages.map((message, index) => {
              const isExpanded = expandedMessages.has(index);
              const fromParsed = parseEmail(message.from);
              const toParsed = parseEmail(message.to);
              const isFromMe =
                message.from.includes(userManager.user?.email) ||
                message.isReply;
              const canCollapse = messages.length > 1;
              const attachments = getAttachments(message);
              const isLastMessage = index === messages.length - 1;
              const showReplyBox = replyingToIndex === index;

              return (
                <div key={message.id || index}>
                  <div className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors">
                    {/* Message Header */}
                    <div
                      className={`flex items-start gap-4 ${
                        canCollapse ? "cursor-pointer" : ""
                      }`}
                      onClick={() => canCollapse && toggleMessageExpand(index)}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm ${
                          isFromMe
                            ? "bg-gradient-to-br from-green-500 to-emerald-600"
                            : "bg-gradient-to-br from-blue-500 to-indigo-600"
                        }`}
                      >
                        {fromParsed.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>

                      {/* Message Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {fromParsed.name}
                          </span>
                          {message.isReply && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                              Replied
                            </span>
                          )}
                          {isFromMe && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                              You
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 mb-2">
                          to{" "}
                          {message.to.includes(userManager.user?.email) ? (
                            <span className="font-medium">me</span>
                          ) : (
                            toParsed.name
                          )}
                        </div>

                        {!isExpanded && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {message.snippet ||
                              getEmailBodyContent(message)
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 200) ||
                              "No content"}
                          </p>
                        )}
                      </div>

                      {/* Top Right Actions */}
                      <div
                        className="flex items-center gap-1 flex-shrink-0 ml-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                          {formatDate(message.date)}
                        </span>

                        <button
                          onClick={() => toggleMessageStar(index)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          title="Star"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              message.labelIds?.includes("STARRED")
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        </button>

                        {/* More Menu */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActions(
                                showActions === index ? null : index
                              )
                            }
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            title="More"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-500" />
                          </button>

                          {showActions === index && (
                            <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                                <Archive className="w-4 h-4" />
                                Archive
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                              <div className="border-t border-gray-200 my-1"></div>
                              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                                <Mail className="w-4 h-4" />
                                Mark as unread
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                                <Tag className="w-4 h-4" />
                                Add label
                              </button>
                              <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
                                <AlertCircle className="w-4 h-4" />
                                Mark as spam
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Message Body */}
                    {isExpanded && (
                      <div className="ml-14 mt-4">
                        <div className="prose prose-sm max-w-none mb-4">
                          <div
                            className="text-gray-800 leading-relaxed text-[15px]"
                            dangerouslySetInnerHTML={{
                              __html: getEmailBodyContent(message),
                            }}
                          />
                        </div>

                        {/* Attachments Display */}
                        {attachments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <Paperclip className="w-4 h-4" />
                              {attachments.length}{" "}
                              {attachments.length === 1
                                ? "Attachment"
                                : "Attachments"}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {attachments.map((part, idx) => {
                                const isImage =
                                  part.mimeType?.startsWith("image/");
                                const isPdf =
                                  part.mimeType === "application/pdf";
                                const sizeKB = part.bodySize
                                  ? (part.bodySize / 1024).toFixed(1)
                                  : "0";

                                return (
                                  <div
                                    key={part.partId || idx}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                  >
                                    <div
                                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        isImage
                                          ? "bg-purple-100"
                                          : isPdf
                                          ? "bg-red-100"
                                          : "bg-blue-100"
                                      }`}
                                    >
                                      {isImage ? (
                                        <Image
                                          className={`w-5 h-5 ${
                                            isImage
                                              ? "text-purple-600"
                                              : "text-blue-600"
                                          }`}
                                        />
                                      ) : (
                                        <FileText
                                          className={`w-5 h-5 ${
                                            isPdf
                                              ? "text-red-600"
                                              : "text-blue-600"
                                          }`}
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-gray-900 truncate">
                                        {part.filename ||
                                          `Attachment ${idx + 1}`}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {sizeKB} KB • {part.mimeType}
                                      </div>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownloadAttachment(
                                          message.id,
                                          part
                                        );
                                      }}
                                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                                      title="Download"
                                    >
                                      <svg
                                        className="w-4 h-4 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Reply/Forward Actions */}
                        {isExpanded && (isLastMessage || !showReplyBox) && (
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleReplyClick(index)}
                              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                                showReplyBox
                                  ? "bg-blue-100 text-blue-700"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <Reply className="w-4 h-4" />
                              Reply
                            </button>
                            <button
                              onClick={() => handleForwardClick(message)}
                              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Forward className="w-4 h-4" />
                              Forward
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reply Box - Show below the message being replied to */}
                  {showReplyBox && (
                    <ReplyBox
                      thread={thread}
                      replyingToIndex={replyingToIndex}
                      recipientName={fromParsed.name}
                      recipientEmail={fromParsed.email}
                      onSend={handleSendReply}
                      onCancel={handleCancelReply}
                      isLoading={isSendingReply}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Forward Box - Floating at bottom right */}
      {forwardingMessage && (
        <ForwardBox
          thread={thread}
          forwardingMessage={forwardingMessage}
          onSend={handleSendForward}
          onCancel={handleCancelForward}
        />
      )}

      {/* Loading Overlay */}
      {isSendingReply && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Sending Reply...
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we send your message
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetail;
