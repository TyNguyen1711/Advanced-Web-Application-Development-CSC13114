// import React, { useState } from "react";
// import {
//   Mail,
//   Star,
//   MoreVertical,
//   Reply,
//   Forward,
//   Archive,
//   Trash2,
//   Tag,
//   AlertCircle,
//   X,
//   Paperclip,
//   Image,
//   FileText,
// } from "lucide-react";
// import { userManager } from "../../services/apiClient";

// const EmailDetail = ({ thread, onSendReply }) => {
//   const [showActions, setShowActions] = useState(null);
//   const [showReplyBox, setShowReplyBox] = useState(false);
//   const [replyText, setReplyText] = useState("");
//   const [replyAttachments, setReplyAttachments] = useState([]);
//   const [expandedMessages, setExpandedMessages] = useState(new Set());
//   const [messages, setMessages] = useState([]);

//   React.useEffect(() => {
//     if (thread?.messages) {
//       setMessages(thread.messages);
//       if (thread.messages.length > 0) {
//         setExpandedMessages(new Set([0]));
//       }
//     }
//   }, [thread?.id]);

//   if (!thread) {
//     return (
//       <div className="flex-1 flex items-center justify-center bg-white">
//         <div className="text-center">
//           <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-600">
//             No email selected
//           </h3>
//         </div>
//       </div>
//     );
//   }

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files);
//     const newAttachments = files.map((file) => ({
//       name: file.name,
//       size: `${(file.size / 1024).toFixed(0)} KB`,
//       type: file.type,
//       file: file,
//     }));
//     setReplyAttachments([...replyAttachments, ...newAttachments]);
//   };

//   const handleRemoveAttachment = (index) => {
//     setReplyAttachments(replyAttachments.filter((_, i) => i !== index));
//   };

//   const handleSendReply = () => {
//     if (!replyText.trim()) {
//       alert("Please enter a message");
//       return;
//     }

//     const newReply = {
//       id: Date.now(),
//       from: userManager.user?.email || "me@example.com",
//       to: messages[0].from,
//       subject: `Re: ${thread.subject}`,
//       bodyData: replyText,
//       date: new Date().toISOString(),
//       snippet: replyText.substring(0, 100),
//       isReply: true,
//     };

//     setMessages([...messages, newReply]);

//     if (onSendReply) {
//       onSendReply(newReply);
//     }

//     setReplyText("");
//     setReplyAttachments([]);
//     setShowReplyBox(false);

//     alert("Reply sent successfully! 📧");
//   };

//   const toggleMessageExpand = (index) => {
//     const newExpanded = new Set(expandedMessages);
//     if (newExpanded.has(index)) {
//       newExpanded.delete(index);
//     } else {
//       newExpanded.add(index);
//     }
//     setExpandedMessages(newExpanded);
//   };

//   const toggleMessageStar = (index) => {
//     const updatedMessages = [...messages];
//     updatedMessages[index].starred = !updatedMessages[index].starred;
//     setMessages(updatedMessages);
//   };

//   // Helper function to parse email with name
//   const parseEmail = (emailString) => {
//     if (!emailString) return { name: "", email: "" };

//     // Format: "Name <email@domain.com>" or just "email@domain.com"
//     const match = emailString.match(/^(.+?)\s*<(.+?)>$/);
//     if (match) {
//       return { name: match[1].trim(), email: match[2].trim() };
//     }
//     return { name: emailString, email: emailString };
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;

//     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//   };

//   // Decode base64 email body
//   const decodeEmailBody = (bodyData) => {
//     if (!bodyData) return "No content";

//     try {
//       // Nếu bodyData đã là HTML thuần, return luôn
//       if (bodyData.includes("<") && bodyData.includes(">")) {
//         return bodyData;
//       }

//       // Decode base64url (Gmail format)
//       // Replace URL-safe characters
//       const base64 = bodyData.replace(/-/g, "+").replace(/_/g, "/");

//       // Decode base64
//       const decoded = atob(base64);

//       // Convert to UTF-8
//       const utf8Decoded = decodeURIComponent(escape(decoded));

//       return utf8Decoded;
//     } catch (error) {
//       console.error("Error decoding email body:", error);
//       // Nếu decode fail, return original
//       return bodyData;
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-white">
//       {/* Subject Header */}
//       <div className=" bg-white sticky top-0 z-10 px-6 mt-6 ml-14">
//         <h1 className="text-2xl font-semibol text-gray-900">
//           {thread.messages[0].subject}
//         </h1>
//       </div>

//       <div className="flex-1 overflow-y-auto bg-white">
//         <div className="max-w-5xl mx-auto px-4 lg:px-6 pb-4 pt-2">
//           {/* Thread Messages */}
//           <div className="space-y-0">
//             {messages.map((message, index) => {
//               const isExpanded = expandedMessages.has(index);
//               const fromParsed = parseEmail(message.from);
//               const toParsed = parseEmail(message.to);
//               const isFromMe =
//                 message.from.includes(userManager.user?.email) ||
//                 message.isReply;
//               const canCollapse = messages.length > 1;

//               return (
//                 <div
//                   key={message.id || index}
//                   className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors"
//                 >
//                   {/* Message Header */}
//                   <div
//                     className={`flex items-start gap-4 ${
//                       canCollapse ? "cursor-pointer" : ""
//                     }`}
//                     onClick={() => canCollapse && toggleMessageExpand(index)}
//                   >
//                     {/* Avatar */}
//                     <div
//                       className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold text-sm ${
//                         isFromMe
//                           ? "bg-gradient-to-br from-green-500 to-emerald-600"
//                           : "bg-gradient-to-br from-blue-500 to-indigo-600"
//                       }`}
//                     >
//                       {fromParsed.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")
//                         .substring(0, 2)
//                         .toUpperCase()}
//                     </div>

//                     {/* Message Info */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 mb-1 flex-wrap">
//                         <span className="font-semibold text-gray-900">
//                           {fromParsed.name}
//                         </span>
//                         {message.isReply && (
//                           <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
//                             Replied
//                           </span>
//                         )}
//                         {isFromMe && (
//                           <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
//                             You
//                           </span>
//                         )}
//                       </div>

//                       <div className="text-sm text-gray-600 mb-2">
//                         to{" "}
//                         {message.to.includes(userManager.user?.email) ? (
//                           <span className="font-medium">me</span>
//                         ) : (
//                           toParsed.name
//                         )}
//                       </div>

//                       {!isExpanded && (
//                         <p className="text-sm text-gray-600 line-clamp-2">
//                           {message.snippet ||
//                             decodeEmailBody(message.bodyData)
//                               .replace(/<[^>]*>/g, "")
//                               .substring(0, 200) ||
//                             "No content"}
//                         </p>
//                       )}
//                     </div>

//                     {/* Top Right Actions */}
//                     <div
//                       className="flex items-center gap-1 flex-shrink-0 ml-auto"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
//                         {formatDate(message.date)}
//                       </span>

//                       <button
//                         onClick={() => toggleMessageStar(index)}
//                         className="p-2 hover:bg-gray-200 rounded-full transition-colors"
//                         title="Star"
//                       >
//                         <Star
//                           className={`w-5 h-5 ${
//                             message.starred
//                               ? "fill-yellow-400 text-yellow-400"
//                               : "text-gray-500"
//                           }`}
//                         />
//                       </button>

//                       {/* More Menu */}
//                       <div className="relative">
//                         <button
//                           onClick={() =>
//                             setShowActions(showActions === index ? null : index)
//                           }
//                           className="p-2 hover:bg-gray-200 rounded-full transition-colors"
//                           title="More"
//                         >
//                           <MoreVertical className="w-5 h-5 text-gray-500" />
//                         </button>

//                         {showActions === index && (
//                           <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
//                             <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
//                               <Archive className="w-4 h-4" />
//                               Archive
//                             </button>
//                             <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
//                               <Trash2 className="w-4 h-4" />
//                               Delete
//                             </button>
//                             <div className="border-t border-gray-200 my-1"></div>
//                             <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
//                               <Mail className="w-4 h-4" />
//                               Mark as unread
//                             </button>
//                             <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
//                               <Tag className="w-4 h-4" />
//                               Add label
//                             </button>
//                             <button className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700">
//                               <AlertCircle className="w-4 h-4" />
//                               Mark as spam
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expanded Message Body */}
//                   {isExpanded && (
//                     <div className="ml-14 mt-4">
//                       <div className="prose prose-sm max-w-none mb-4">
//                         <div
//                           className="text-gray-800 leading-relaxed text-[15px]"
//                           dangerouslySetInnerHTML={{
//                             __html: decodeEmailBody(
//                               message.bodyData ||
//                                 message.snippet ||
//                                 "No content"
//                             ),
//                           }}
//                         />
//                       </div>

//                       {/* Attachments Display */}
//                       {message.parts && message.parts.length > 0 && (
//                         <div className="mt-4 pt-4 border-t border-gray-200">
//                           <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                             <Paperclip className="w-4 h-4" />
//                             {message.parts.length}{" "}
//                             {message.parts.length === 1
//                               ? "Attachment"
//                               : "Attachments"}
//                           </div>
//                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                             {message.parts.map((part, idx) => {
//                               const isImage =
//                                 part.mimeType?.startsWith("image/");
//                               const isPdf = part.mimeType === "application/pdf";
//                               const isXml = part.mimeType === "text/xml";
//                               const sizeKB = part.bodySize
//                                 ? (part.bodySize / 1024).toFixed(1)
//                                 : "0";

//                               return (
//                                 <div
//                                   key={part.partId || idx}
//                                   className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
//                                 >
//                                   <div
//                                     className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
//                                       isImage
//                                         ? "bg-purple-100"
//                                         : isPdf
//                                         ? "bg-red-100"
//                                         : "bg-blue-100"
//                                     }`}
//                                   >
//                                     {isImage ? (
//                                       <Image
//                                         className={`w-5 h-5 ${
//                                           isImage
//                                             ? "text-purple-600"
//                                             : "text-blue-600"
//                                         }`}
//                                       />
//                                     ) : (
//                                       <FileText
//                                         className={`w-5 h-5 ${
//                                           isPdf
//                                             ? "text-red-600"
//                                             : "text-blue-600"
//                                         }`}
//                                       />
//                                     )}
//                                   </div>
//                                   <div className="flex-1 min-w-0">
//                                     <div className="text-sm font-semibold text-gray-900 truncate">
//                                       {part.filename || `Attachment ${idx + 1}`}
//                                     </div>
//                                     <div className="text-xs text-gray-500">
//                                       {sizeKB} KB • {part.mimeType}
//                                     </div>
//                                   </div>
//                                   <button
//                                     className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
//                                     title="Download"
//                                   >
//                                     <svg
//                                       className="w-4 h-4 text-gray-600"
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth={2}
//                                         d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                       />
//                                     </svg>
//                                   </button>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}

//                       {/* Reply/Forward Actions - Only for last message */}
//                       {index === messages.length - 1 && (
//                         <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
//                           <button
//                             onClick={() => setShowReplyBox(!showReplyBox)}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
//                           >
//                             <Reply className="w-4 h-4" />
//                             Reply
//                           </button>
//                           <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
//                             <Forward className="w-4 h-4" />
//                             Forward
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Inline Quick Reply Box */}
//           {showReplyBox && (
//             <div className="mt-6 border border-gray-300 rounded-lg shadow-sm overflow-hidden">
//               <div className="px-6 py-4 bg-gray-50 border-b border-gray-300">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-semibold text-gray-800">
//                     Reply to {parseEmail(messages[0].from).name}
//                   </span>
//                   <button
//                     onClick={() => {
//                       setShowReplyBox(false);
//                       setReplyText("");
//                       setReplyAttachments([]);
//                     }}
//                     className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
//                   >
//                     <X className="w-4 h-4 text-gray-600" />
//                   </button>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <textarea
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   placeholder="Type your reply..."
//                   className="w-full min-h-[150px] outline-none text-[15px] text-gray-900 resize-none leading-relaxed border border-gray-300 rounded-lg p-3"
//                   autoFocus
//                 />

//                 {replyAttachments.length > 0 && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="text-sm font-semibold text-gray-700 mb-3">
//                       Attachments ({replyAttachments.length})
//                     </div>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                       {replyAttachments.map((file, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
//                         >
//                           <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//                             {file.type.startsWith("image/") ? (
//                               <Image className="w-4 h-4 text-blue-600" />
//                             ) : (
//                               <FileText className="w-4 h-4 text-blue-600" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="text-sm font-semibold text-gray-900 truncate">
//                               {file.name}
//                             </div>
//                             <div className="text-xs text-gray-500">
//                               {file.size}
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => handleRemoveAttachment(idx)}
//                             className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
//                           >
//                             <X className="w-4 h-4 text-gray-600" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="px-6 pb-6 flex items-center justify-between gap-3">
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={handleSendReply}
//                     className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
//                   >
//                     Send
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowReplyBox(false);
//                       setReplyText("");
//                       setReplyAttachments([]);
//                     }}
//                     className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
//                     <Paperclip className="w-5 h-5 text-gray-600" />
//                     <input
//                       type="file"
//                       multiple
//                       onChange={handleFileSelect}
//                       className="hidden"
//                     />
//                   </label>
//                   <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
//                     <Image className="w-5 h-5 text-gray-600" />
//                     <input
//                       type="file"
//                       accept="image/*"
//                       multiple
//                       onChange={handleFileSelect}
//                       className="hidden"
//                     />
//                   </label>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailDetail;
import React, { useState } from "react";
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
  X,
  Paperclip,
  Image,
  FileText,
} from "lucide-react";
import { userManager } from "../../services/apiClient";

const EmailDetail = ({ thread, onSendReply }) => {
  const [showActions, setShowActions] = useState(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState(new Set());
  const [messages, setMessages] = useState([]);

  React.useEffect(() => {
    if (thread?.messages) {
      setMessages(thread.messages);
      if (thread.messages.length > 0) {
        setExpandedMessages(new Set([0]));
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(0)} KB`,
      type: file.type,
      file: file,
    }));
    setReplyAttachments([...replyAttachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (index) => {
    setReplyAttachments(replyAttachments.filter((_, i) => i !== index));
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      alert("Please enter a message");
      return;
    }

    const newReply = {
      id: Date.now(),
      from: userManager.user?.email || "me@example.com",
      to: messages[0].from,
      subject: `Re: ${thread.subject}`,
      bodyData: replyText,
      date: new Date().toISOString(),
      snippet: replyText.substring(0, 100),
      isReply: true,
    };

    setMessages([...messages, newReply]);

    if (onSendReply) {
      onSendReply(newReply);
    }

    setReplyText("");
    setReplyAttachments([]);
    setShowReplyBox(false);

    alert("Reply sent successfully! 📧");
  };

  const toggleMessageExpand = (index) => {
    const newExpanded = new Set(expandedMessages);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedMessages(newExpanded);
  };

  const toggleMessageStar = (index) => {
    const updatedMessages = [...messages];
    updatedMessages[index].starred = !updatedMessages[index].starred;
    setMessages(updatedMessages);
  };

  // Helper function to parse email with name
  const parseEmail = (emailString) => {
    if (!emailString) return { name: "", email: "" };

    // Format: "Name <email@domain.com>" or just "email@domain.com"
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

  // Decode base64 email body
  const decodeEmailBody = (bodyData) => {
    if (!bodyData) return "No content";

    try {
      // Nếu bodyData đã là HTML thuần, return luôn
      if (bodyData.includes("<") && bodyData.includes(">")) {
        return bodyData;
      }

      // Decode base64url (Gmail format)
      // Replace URL-safe characters
      const base64 = bodyData.replace(/-/g, "+").replace(/_/g, "/");

      // Decode base64
      const decoded = atob(base64);

      // Convert to UTF-8
      const utf8Decoded = decodeURIComponent(escape(decoded));

      return utf8Decoded;
    } catch (error) {
      console.error("Error decoding email body:", error);
      // Nếu decode fail, return original
      return bodyData;
    }
  };

  // Get email body content from message
  const getEmailBodyContent = (message) => {
    // Nếu có bodyData hoặc alternateParts, decode và show
    if (message.bodyData || message.alternateParts) {
      return decodeEmailBody(
        message.bodyData || message.snippet || "No content"
      );
    }

    // Nếu có parts, xử lý parts
    if (message.parts && message.parts.length > 0) {
      // Tìm part có mimeType text/html (ưu tiên)
      const htmlPart = message.parts.find(
        (part) => part.mimeType === "text/html" && !part.attachmentId
      );

      if (htmlPart && htmlPart.bodyData) {
        return decodeEmailBody(htmlPart.bodyData);
      }

      // Nếu không có text/html, tìm text/plain
      const textPart = message.parts.find(
        (part) => part.mimeType === "text/plain" && !part.attachmentId
      );

      if (textPart && textPart.bodyData) {
        const plainText = decodeEmailBody(textPart.bodyData);
        // Convert plain text to HTML with line breaks
        return plainText.replace(/\n/g, "<br>");
      }

      // Nếu có multipart/alternative, đệ quy tìm trong parts con
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

  // Get attachments from message parts
  const getAttachments = (message) => {
    if (!message.parts || message.parts.length === 0) {
      return [];
    }

    // Filter parts that have attachmentId
    return message.parts.filter((part) => part.attachmentId);
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Subject Header */}
      <div className=" bg-white sticky top-0 z-10 px-6 mt-6 ml-14">
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

              return (
                <div
                  key={message.id || index}
                  className="border-b border-gray-200 py-4 hover:bg-gray-50 transition-colors"
                >
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
                            message.starred
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      </button>

                      {/* More Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActions(showActions === index ? null : index)
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
                              const isPdf = part.mimeType === "application/pdf";
                              const sizeKB = part.bodySize
                                ? (part.bodySize / 1024).toFixed(1)
                                : "0";

                              return (
                                <div
                                  key={part.partId || idx}
                                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
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
                                      {part.filename || `Attachment ${idx + 1}`}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {sizeKB} KB • {part.mimeType}
                                    </div>
                                  </div>
                                  <button
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

                      {/* Reply/Forward Actions - Only for last message */}
                      {index === messages.length - 1 && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => setShowReplyBox(!showReplyBox)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <Reply className="w-4 h-4" />
                            Reply
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                            <Forward className="w-4 h-4" />
                            Forward
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline Quick Reply Box */}
          {showReplyBox && (
            <div className="mt-6 border border-gray-300 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">
                    Reply to {parseEmail(messages[0].from).name}
                  </span>
                  <button
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyText("");
                      setReplyAttachments([]);
                    }}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full min-h-[150px] outline-none text-[15px] text-gray-900 resize-none leading-relaxed border border-gray-300 rounded-lg p-3"
                  autoFocus
                />

                {replyAttachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Attachments ({replyAttachments.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {replyAttachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            {file.type.startsWith("image/") ? (
                              <Image className="w-4 h-4 text-blue-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 truncate">
                              {file.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {file.size}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveAttachment(idx)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-6 pb-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendReply}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setShowReplyBox(false);
                      setReplyText("");
                      setReplyAttachments([]);
                    }}
                    className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  <label className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    <Image className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
