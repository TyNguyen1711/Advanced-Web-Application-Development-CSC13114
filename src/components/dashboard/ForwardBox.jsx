import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  X,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Trash2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import emailApi from "../../services/emailApi";
import { setAllThreadsState } from "../../redux/threadSlice";
import Swal from "sweetalert2";

const ForwardBox = ({ thread, forwardingMessage, onSend, onCancel }) => {
  const dispatch = useDispatch();
  const allThreadsState = useSelector((state) => state.threads.allThreadsState);

  const [toTags, setToTags] = useState([]);
  const [ccTags, setCcTags] = useState([]);
  const [bccTags, setBccTags] = useState([]);
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const toInputRef = useRef(null);
  const ccInputRef = useRef(null);
  const bccInputRef = useRef(null);
  const bodyRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (toInputRef.current) {
      toInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (forwardingMessage) {
      const forwardedContent = generateForwardedContent(forwardingMessage);
      setBodyText(forwardedContent);

      if (bodyRef.current) {
        bodyRef.current.innerHTML = forwardedContent;
      }

      const getAttachments = (message) => {
        if (!message.parts || message.parts.length === 0) {
          return [];
        }
        return message.parts.filter((part) => part.attachmentId);
      };

      const messageAttachments = getAttachments(forwardingMessage);

      if (messageAttachments.length > 0) {
        const formattedAttachments = messageAttachments.map((part, index) => ({
          id: Date.now() + index,
          name: part.filename || `attachment_${index}`,
          size: part.bodySize || 0,
          type: part.mimeType || "application/octet-stream",
          mimeType: part.mimeType || "application/octet-stream",
          attachmentId: part.attachmentId,
          partId: part.partId,
        }));
        setAttachments(formattedAttachments);
        console.log("Loaded attachments from message:", formattedAttachments);
      }
    }
  }, [forwardingMessage]);

  const generateForwardedContent = (message) => {
    const fromParsed = parseEmail(message.from);
    const date = new Date(message.date).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const originalBody = getEmailBodyContent(message);

    return `<div><br></div><div><br></div><div>---------- Forwarded message ---------</div><div>From: <strong>${fromParsed.name}</strong> &lt;${fromParsed.email}&gt;</div><div>Date: ${date}</div><div>Subject: ${message.subject}</div><div>To: ${message.to}</div><div><br></div><div>${originalBody}</div>`;
  };

  const parseEmail = (emailString) => {
    if (!emailString) return { name: "", email: "" };
    const match = emailString.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      return { name: match[1].trim(), email: match[2].trim() };
    }
    return { name: emailString, email: emailString };
  };

  const decodeEmailBody = (bodyData) => {
    if (!bodyData) return "No content";

    try {
      if (bodyData.includes("<") && bodyData.includes(">")) {
        return bodyData;
      }

      const base64Pattern = /^[A-Za-z0-9+/\-_]+={0,2}$/;
      if (!base64Pattern.test(bodyData.trim())) {
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

  const handleAddTag = (type, value) => {
    const email = value.trim();
    if (!email) return;

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    if (type === "to") {
      if (!toTags.includes(email)) {
        setToTags([...toTags, email]);
      }
      setToInput("");
    } else if (type === "cc") {
      if (!ccTags.includes(email)) {
        setCcTags([...ccTags, email]);
      }
      setCcInput("");
    } else if (type === "bcc") {
      if (!bccTags.includes(email)) {
        setBccTags([...bccTags, email]);
      }
      setBccInput("");
    }
  };

  const handleRemoveTag = (type, email) => {
    if (type === "to") {
      setToTags(toTags.filter((t) => t !== email));
    } else if (type === "cc") {
      setCcTags(ccTags.filter((t) => t !== email));
    } else if (type === "bcc") {
      setBccTags(bccTags.filter((t) => t !== email));
    }
  };

  const handleKeyDown = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "to") {
        handleAddTag("to", toInput);
      } else if (type === "cc") {
        handleAddTag("cc", ccInput);
      } else if (type === "bcc") {
        handleAddTag("bcc", bccInput);
      }
    } else if (e.key === "Backspace") {
      if (type === "to" && toInput === "" && toTags.length > 0) {
        setToTags(toTags.slice(0, -1));
      } else if (type === "cc" && ccInput === "" && ccTags.length > 0) {
        setCcTags(ccTags.slice(0, -1));
      } else if (type === "bcc" && bccInput === "" && bccTags.length > 0) {
        setBccTags(bccTags.slice(0, -1));
      }
    }
  };
  function base64urlToBase64String(b64url) {
    const padded = b64url + "=".repeat((4 - (b64url.length % 4)) % 4);

    const decodedBytes = Uint8Array.from(
      atob(padded.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    return btoa(String.fromCharCode(...decodedBytes));
  }
  const handleSend = async () => {
    if (toTags.length === 0) {
      alert("Please enter at least one recipient");
      return;
    }

    if (!forwardingMessage || !forwardingMessage.id) {
      alert("Invalid message to forward");
      return;
    }

    setIsSending(true);

    try {
      const originalAttachments = attachments.filter((att) => att.attachmentId);

      const originalAttachmentsWithData = await Promise.all(
        originalAttachments.map(async (att) => {
          try {
            const response = await emailApi.getAttachment(
              forwardingMessage.id,
              att.attachmentId
            );
            console.log(`Attachment data for ${att.name}:`, response);

            return {
              filename: att.name,
              content_type: att.mimeType,
              data: base64urlToBase64String(response.data?.data) || "",
            };
          } catch (error) {
            console.error(`Error fetching attachment ${att.name}:`, error);

            return {
              filename: att.name,
              content_type: att.mimeType,
              attachment_id: att.attachmentId,
            };
          }
        })
      );

      const newAttachments = attachments
        .filter((att) => att.data && !att.attachmentId)
        .map((att) => ({
          filename: att.name,
          content_type: att.mimeType,
          data: att.data,
        }));

      const allAttachments = [
        ...originalAttachmentsWithData,
        ...newAttachments,
      ];

      const originalSubject =
        forwardingMessage?.subject || thread?.subject || "";
      const finalSubject = originalSubject
        ? `Fwd: ${originalSubject}`
        : "Fwd: (no subject)";

      const fullHtmlBody = bodyRef.current
        ? bodyRef.current.innerHTML
        : bodyText;

      const forwardData = {
        thread_id: thread.id,
        google_message_id: forwardingMessage.id,
        to: toTags,
        cc: ccTags.length > 0 ? ccTags : [],
        bcc: bccTags.length > 0 ? bccTags : [],
        subject: finalSubject,
        body: fullHtmlBody,
        html: true,
        attachments: allAttachments.length > 0 ? allAttachments : [],
      };

      const response = await emailApi.forwardEmail(forwardData);

      if (response?.data) {
        const updatedThread = response.data;
        const updatedThreads = allThreadsState.map((t) =>
          t.id === updatedThread.id ? updatedThread : t
        );
        dispatch(setAllThreadsState(updatedThreads));

        Swal.fire({
          icon: "success",
          title: "Email forwarded!",
          text: "Your email has been forwarded successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        onSend();
        onCancel();
      }
    } catch (error) {
      console.error("Error forwarding email:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to forward",
        text: "Failed to forward email. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Data = event.target.result.split(",")[1]; // Remove data:mime;base64, prefix
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            mimeType: file.type,
            data: base64Data, // Base64 encoded data
            file: file,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newAttachments = await Promise.all(filePromises);
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed bottom-0 right-8 w-[700px] bg-white rounded-t-lg shadow-2xl border border-gray-300 z-50 flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 rounded-t-lg border-b border-gray-300 flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900">Forward</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3">
          {/* To Field with Tags */}
          <div className="flex items-start border-b border-gray-200 pb-2">
            <label className="text-sm text-gray-600 w-12 flex-shrink-0 pt-2">
              To
            </label>
            <div className="flex-1 flex flex-wrap gap-1 px-2 py-1">
              {toTags.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                >
                  {email}
                  <button
                    onClick={() => handleRemoveTag("to", email)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                ref={toInputRef}
                type="text"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, "to")}
                onBlur={() => {
                  if (toInput.trim()) {
                    handleAddTag("to", toInput);
                  }
                }}
                placeholder={toTags.length === 0 ? "Recipients" : ""}
                className="flex-1 min-w-[200px] text-sm outline-none py-1"
              />
            </div>
            <div className="flex items-center gap-1 ml-2 pt-2">
              {!showCc && (
                <button
                  onClick={() => {
                    setShowCc(true);
                    setTimeout(() => ccInputRef.current?.focus(), 0);
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 hover:bg-gray-100 rounded"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  onClick={() => {
                    setShowBcc(true);
                    setTimeout(() => bccInputRef.current?.focus(), 0);
                  }}
                  className="text-xs text-gray-600 hover:text-gray-900 px-2 py-1 hover:bg-gray-100 rounded"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>
          {/* Cc Field with Tags */}
          {showCc && (
            <div className="flex items-start border-b border-gray-200 pb-2">
              <label className="text-sm text-gray-600 w-12 flex-shrink-0 pt-2">
                Cc
              </label>
              <div className="flex-1 flex flex-wrap gap-1 px-2 py-1">
                {ccTags.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {email}
                    <button
                      onClick={() => handleRemoveTag("cc", email)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={ccInputRef}
                  type="text"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "cc")}
                  onBlur={() => {
                    if (ccInput.trim()) {
                      handleAddTag("cc", ccInput);
                    }
                  }}
                  placeholder={ccTags.length === 0 ? "Recipients" : ""}
                  className="flex-1 min-w-[200px] text-sm outline-none py-1"
                />
              </div>
              <button
                onClick={() => {
                  setShowCc(false);
                  setCcTags([]);
                  setCcInput("");
                }}
                className="p-1 hover:bg-gray-100 rounded ml-2 mt-2"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
          {/* Bcc Field with Tags */}
          {showBcc && (
            <div className="flex items-start border-b border-gray-200 pb-2">
              <label className="text-sm text-gray-600 w-12 flex-shrink-0 pt-2">
                Bcc
              </label>
              <div className="flex-1 flex flex-wrap gap-1 px-2 py-1">
                {bccTags.map((email) => (
                  <span
                    key={email}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {email}
                    <button
                      onClick={() => handleRemoveTag("bcc", email)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  ref={bccInputRef}
                  type="text"
                  value={bccInput}
                  onChange={(e) => setBccInput(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "bcc")}
                  onBlur={() => {
                    if (bccInput.trim()) {
                      handleAddTag("bcc", bccInput);
                    }
                  }}
                  placeholder={bccTags.length === 0 ? "Recipients" : ""}
                  className="flex-1 min-w-[200px] text-sm outline-none py-1"
                />
              </div>
              <button
                onClick={() => {
                  setShowBcc(false);
                  setBccTags([]);
                  setBccInput("");
                }}
                className="p-1 hover:bg-gray-100 rounded ml-2 mt-2"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          <div
            ref={bodyRef}
            contentEditable={true}
            className="w-full min-h-[400px] text-sm outline-none px-3 py-2 border-t border-gray-200"
            style={{
              fontFamily: "Arial, sans-serif",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
            suppressContentEditableWarning={true}
          />

          {/* Attachments Display */}
          {attachments.length > 0 && (
            <div className="border-t border-gray-200 pt-3 space-y-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Paperclip className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 truncate">
                        {att.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(att.size)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors ml-2"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSend}
            disabled={isSending || toTags.length === 0}
            className={`px-6 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${
              isSending || toTags.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Send"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Attach files"
          >
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Insert emoji"
          >
            <Smile className="w-5 h-5 text-gray-600" />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Discard draft"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Loading Overlay */}
      {isSending && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Forwarding Email...
              </h3>
              <p className="text-sm text-gray-600">
                Please wait while we forward your message
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForwardBox;
