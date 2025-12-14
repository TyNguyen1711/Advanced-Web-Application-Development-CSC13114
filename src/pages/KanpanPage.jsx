// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { Mail, Clock, CheckCircle2, MoreHorizontal, Bell } from "lucide-react";
// import EmailCard from "../components/dashboard/EmailCard";
// import Header from "../components/dashboard/Header";
// import { useSelector, useDispatch } from "react-redux";
// import useGetAllTasks from "../hooks/useFetchTask";
// import taskApi from "../services/taskApi";
// import SnoozeModal from "../components/modal/SnoozeModal";
// import { moveThreadBetweenTypes } from "../redux/taskSlice";

// function DraggableItem({
//   thread,
//   columnId,
//   index,
//   onDragStart,
//   isDragging,
//   transform,
// }) {
//   const itemRef = useRef(null);

//   // Lấy message cuối cùng để hiển thị
//   const lastMessage = thread.messages[thread.messages.length - 1];

//   return (
//     <div
//       ref={itemRef}
//       draggable
//       onDragStart={(e) =>
//         onDragStart(e, thread, columnId, index, itemRef.current)
//       }
//       data-item-id={thread.id}
//       style={{
//         transform: transform ? `translate3d(0, ${transform}px, 0)` : "none",
//         transition:
//           isDragging || transform === 0
//             ? "none"
//             : "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
//         opacity: isDragging ? 0.3 : 1,
//       }}
//     >
//       <EmailCard
//         threadId={thread.id}
//         item={lastMessage}
//         thread={thread}
//         isDragging={isDragging}
//       />
//     </div>
//   );
// }

// function Column({
//   column,
//   onDragStart,
//   onDragEnter,
//   onDragOver,
//   onDrop,
//   isDragOver,
//   draggedOverIndex,
//   transforms,
//   onLoadMore,
// }) {
//   const Icon = column.icon;
//   const columnRef = useRef(null);
//   const loadMoreRef = useRef(null);
//   const observerRef = useRef(null);
//   const isLoadingRef = useRef(false);

//   // Sync loading state to ref - QUAN TRỌNG: phải sync cả true và false
//   useEffect(() => {
//     isLoadingRef.current = column.loading;
//     if (!column.loading) {
//       console.log(
//         `✅ ${column.name} loading done, isLoadingRef reset to false`
//       );
//     }
//   }, [column.loading, column.name]);

//   // Intersection Observer cho infinity scroll
//   useEffect(() => {
//     // Cleanup observer cũ nếu có
//     if (observerRef.current) {
//       observerRef.current.disconnect();
//       observerRef.current = null;
//     }

//     // Chỉ setup observer khi có element và có nextPageToken
//     if (!loadMoreRef.current || !column.nextPageToken) {
//       return;
//     }

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         // Chỉ load khi: intersecting, có nextPageToken, và không đang loading
//         if (
//           entry.isIntersecting &&
//           column.nextPageToken &&
//           !isLoadingRef.current
//         ) {
//           console.log(
//             `🔄 Intersection triggered for ${column.name}, token:`,
//             column.nextPageToken
//           );
//           isLoadingRef.current = true;
//           onLoadMore(column.name);
//         }
//       },
//       { threshold: 0.1, rootMargin: "100px" }
//     );

//     observerRef.current.observe(loadMoreRef.current);

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//         observerRef.current = null;
//       }
//     };
//   }, [column.nextPageToken, column.name, onLoadMore]);

//   return (
//     <div className="flex flex-col h-full min-h-0">
//       <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
//         <div className="flex items-center gap-3">
//           <div
//             className="w-8 h-8 rounded-lg flex items-center justify-center"
//             style={{ backgroundColor: `${column.color}15` }}
//           >
//             <Icon className="w-4 h-4" style={{ color: column.color }} />
//           </div>
//           <h3 className="font-bold text-gray-800 text-sm tracking-wide">
//             {column.title}
//           </h3>
//           <span
//             className="text-xs font-bold px-2 py-0.5 rounded-full"
//             style={{
//               backgroundColor: `${column.color}15`,
//               color: column.color,
//             }}
//           >
//             {column.items.length}
//           </span>
//         </div>
//         <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//           <MoreHorizontal className="w-4 h-4 text-gray-400" />
//         </button>
//       </div>

//       <div
//         ref={columnRef}
//         className={`
//           flex-1 min-h-0 rounded-2xl p-3 space-y-3
//           overflow-y-scroll overflow-x-hidden
//           transition-all duration-300 ease-out
//           scrollbar-always
//           ${
//             isDragOver
//               ? "bg-blue-50 ring-2 ring-blue-200 ring-inset"
//               : "bg-gray-50/50"
//           }
//         `}
//         style={{
//           scrollbarGutter: "stable",
//         }}
//         onDragOver={(e) => onDragOver(e, column.id, columnRef.current)}
//         onDragEnter={(e) => onDragEnter(e, column.id)}
//         onDrop={(e) => onDrop(e, column.id)}
//       >
//         {column.items.map((thread, index) => (
//           <DraggableItem
//             key={thread.id}
//             thread={thread}
//             columnId={column.id}
//             index={index}
//             onDragStart={onDragStart}
//             isDragging={thread.isDragging}
//             transform={transforms[column.id]?.[index] || 0}
//           />
//         ))}

//         {/* Loading indicator cho infinity scroll */}
//         {column.loading && (
//           <div className="text-center py-4">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
//             <p className="text-xs text-gray-500 mt-2">Loading more...</p>
//           </div>
//         )}

//         {/* Load more trigger - chỉ hiển thị khi có nextPageToken */}
//         {column.nextPageToken && !column.loading && (
//           <div ref={loadMoreRef} className="h-4" />
//         )}

//         {/* No more items message - chỉ hiển thị khi không còn nextPageToken */}
//         {!column.nextPageToken && column.items.length > 0 && (
//           <div className="text-center py-2 text-xs text-gray-400">
//             ✓ All items loaded
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function EmailKanbanBoard() {
//   const dispatch = useDispatch();
//   const [draggedItem, setDraggedItem] = useState(null);
//   const ghostPositionRef = useRef({ x: 0, y: 0 });
//   const [dragOverColumn, setDragOverColumn] = useState(null);
//   const [dragOverIndex, setDragOverIndex] = useState(null);
//   const [transforms, setTransforms] = useState({});
//   const cardWidth = useRef(0);
//   const cardHeight = useRef(0);
//   const ghostWrapperRef = useRef(null);
//   const dragOffset = useRef({ x: 0, y: 0 });

//   // Lấy data từ Redux store với cấu trúc mới
//   const listTypes = useSelector((state) => state.tasks.listTypes);
//   const mails = useSelector((state) => state.tasks.mails);

//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const { fetchAllTasks, fetchTasksForType, loading, error } = useGetAllTasks();

//   // Snooze modal state
//   const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
//   const [snoozeEmails, setSnoozeEmails] = useState([]);
//   const [loadingSnooze, setLoadingSnooze] = useState(false);

//   // Icon mapping cho các types
//   const iconMapping = {
//     INBOX: { icon: Mail, color: "#ef4444" },
//     TODO: { icon: Clock, color: "#f59e0b" },
//     DONE: { icon: CheckCircle2, color: "#22c55e" },
//   };

//   // Tạo columns từ Redux state
//   const [localColumns, setLocalColumns] = useState([]);

//   // Sync Redux state với local state
//   useEffect(() => {
//     const updatedColumns = mails.map((mail) => {
//       const iconConfig = iconMapping[mail.name] || {
//         icon: Mail,
//         color: "#6b7280",
//       };
//       return {
//         id: mail.name.toLowerCase(),
//         name: mail.name,
//         title: mail.name.replace(/_/g, " "),
//         icon: iconConfig.icon,
//         color: iconConfig.color,
//         items: mail.threads,
//         nextPageToken: mail.nextPageToken,
//         loading: mail.loading,
//         hasMore: mail.hasMore,
//         error: mail.error,
//       };
//     });
//     setLocalColumns(updatedColumns);
//   }, [mails]);

//   const columns = localColumns;

//   // Load tất cả tasks khi component mount
//   useEffect(() => {
//     fetchAllTasks();
//   }, []);

//   // Handler cho infinity scroll - load more items
//   const handleLoadMore = useCallback(
//     (typeName) => {
//       const mail = mails.find((m) => m.name === typeName);
//       // Chỉ gọi API khi:
//       // 1. Mail tồn tại
//       // 2. nextPageToken không null/undefined/empty
//       // 3. Không đang loading
//       if (
//         mail &&
//         mail.nextPageToken &&
//         mail.nextPageToken.trim() &&
//         !mail.loading
//       ) {
//         console.log(
//           `🔄 Loading more for ${typeName} with token:`,
//           mail.nextPageToken
//         );
//         fetchTasksForType(typeName, mail.nextPageToken);
//       } else {
//         console.log(`⛔ Cannot load more for ${typeName}:`, {
//           hasNextPageToken: !!mail?.nextPageToken,
//           isLoading: mail?.loading,
//         });
//       }
//     },
//     [mails, fetchTasksForType]
//   );

//   const handleOpenSnoozeModal = async () => {
//     setIsSnoozeModalOpen(true);
//     setLoadingSnooze(true);
//     try {
//       const response = await taskApi.getTaskSnooze();
//       // Helper function to add summary to last message of each thread
//       const snoozeThreads = response.mailTasks.map((task) => {
//         const thread = task.thread;
//         if (thread.messages && thread.messages.length > 0) {
//           const lastMessageIndex = thread.messages.length - 1;
//           thread.messages[lastMessageIndex] = {
//             ...thread.messages[lastMessageIndex],
//             summary: task.summary || "No summary available",
//           };
//         }
//         return thread;
//       });
//       setSnoozeEmails(snoozeThreads);
//     } catch (err) {
//       console.error("Failed to fetch snooze emails:", err);
//       setSnoozeEmails([]);
//     } finally {
//       setLoadingSnooze(false);
//     }
//   };

//   const handleDragStart = (e, thread, columnId, index, element) => {
//     const rect = element.getBoundingClientRect();
//     cardWidth.current = rect.width;
//     cardHeight.current = rect.height;

//     dragOffset.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     ghostPositionRef.current = {
//       x: e.clientX - dragOffset.current.x,
//       y: e.clientY - dragOffset.current.y,
//     };

//     if (ghostWrapperRef.current) {
//       ghostWrapperRef.current.style.transform = `translate3d(${ghostPositionRef.current.x}px, ${ghostPositionRef.current.y}px, 0)`;
//       ghostWrapperRef.current.style.width = `${cardWidth.current}px`;
//     }

//     e.dataTransfer.effectAllowed = "move";

//     const img = new Image();
//     img.src =
//       "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//     e.dataTransfer.setDragImage(img, 0, 0);

//     setDraggedItem({ thread, sourceColumn: columnId, sourceIndex: index });

//     // Mark as dragging - update local columns
//     setLocalColumns((prev) =>
//       prev.map((col) => {
//         if (col.id === columnId) {
//           return {
//             ...col,
//             items: col.items.map((t, idx) =>
//               idx === index ? { ...t, isDragging: true } : t
//             ),
//           };
//         }
//         return col;
//       })
//     );

//     document.addEventListener("dragover", handleDocumentDragOver);
//     document.addEventListener("drag", handleDocumentDrag);
//   };

//   const handleDocumentDrag = (e) => {
//     if (e.clientX === 0 && e.clientY === 0) return;

//     const newX = e.clientX - dragOffset.current.x;
//     const newY = e.clientY - dragOffset.current.y;
//     ghostPositionRef.current = { x: newX, y: newY };

//     if (ghostWrapperRef.current) {
//       ghostWrapperRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
//     }
//   };

//   const handleDocumentDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDragEnter = (e, columnId) => {
//     e.preventDefault();
//     setDragOverColumn(columnId);
//   };

//   const handleDragOver = (e, columnId, columnElement) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!draggedItem || !columnElement) return;

//     const columnRect = columnElement.getBoundingClientRect();
//     const mouseY = e.clientY - columnRect.top - 12;

//     // Tìm column từ array
//     const currentColumn = columns.find((col) => col.id === columnId);
//     if (!currentColumn) return;

//     const items = currentColumn.items;
//     let insertIndex = items.length;

//     let accumulatedHeight = 0;
//     for (let i = 0; i < items.length; i++) {
//       const itemHeight = cardHeight.current + 12;

//       if (mouseY < accumulatedHeight + itemHeight / 2) {
//         insertIndex = i;
//         break;
//       }
//       accumulatedHeight += itemHeight;
//     }

//     if (
//       columnId === draggedItem.sourceColumn &&
//       insertIndex === draggedItem.sourceIndex
//     ) {
//       setDragOverIndex(null);
//       setTransforms({});
//       return;
//     }

//     setDragOverIndex(insertIndex);

//     const newTransforms = {};
//     newTransforms[columnId] = {};

//     const itemHeight = cardHeight.current + 12;

//     items.forEach((thread, i) => {
//       if (columnId === draggedItem.sourceColumn) {
//         if (i === draggedItem.sourceIndex) {
//           newTransforms[columnId][i] = 0;
//         } else if (insertIndex <= draggedItem.sourceIndex) {
//           if (i >= insertIndex && i < draggedItem.sourceIndex) {
//             newTransforms[columnId][i] = itemHeight;
//           } else {
//             newTransforms[columnId][i] = 0;
//           }
//         } else {
//           if (i > draggedItem.sourceIndex && i < insertIndex) {
//             newTransforms[columnId][i] = -itemHeight;
//           } else {
//             newTransforms[columnId][i] = 0;
//           }
//         }
//       } else {
//         if (i >= insertIndex) {
//           newTransforms[columnId][i] = itemHeight;
//         } else {
//           newTransforms[columnId][i] = 0;
//         }
//       }
//     });

//     if (columnId !== draggedItem.sourceColumn) {
//       newTransforms[draggedItem.sourceColumn] = {};
//       const sourceColumn = columns.find(
//         (col) => col.id === draggedItem.sourceColumn
//       );
//       if (sourceColumn) {
//         sourceColumn.items.forEach((thread, i) => {
//           if (i > draggedItem.sourceIndex) {
//             newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
//           } else {
//             newTransforms[draggedItem.sourceColumn][i] = 0;
//           }
//         });
//       }
//     }

//     setTransforms(newTransforms);
//   };

//   const handleDrop = async (e, targetColumnId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     document.removeEventListener("dragover", handleDocumentDragOver);
//     document.removeEventListener("drag", handleDocumentDrag);

//     if (!draggedItem) return;

//     const { thread, sourceColumn, sourceIndex } = draggedItem;

//     // Tìm target column name (uppercase)
//     const targetColumn = columns.find((col) => col.id === targetColumnId);
//     const sourceCol = columns.find((col) => col.id === sourceColumn);

//     if (!targetColumn || !sourceCol) return;

//     // Move thread trong Redux
//     if (sourceCol.name !== targetColumn.name) {
//       dispatch(
//         moveThreadBetweenTypes({
//           fromType: sourceCol.name,
//           toType: targetColumn.name,
//           threadId: thread.id,
//         })
//       );
//     }

//     // Prepare data for API
//     const updateData = {
//       thread_id: thread.id,
//       send_at: new Date(
//         thread.messages[thread.messages.length - 1].date
//       ).toISOString(),
//       status: targetColumn.name, // Sử dụng name thay vì id uppercase
//     };

//     // If moving to SNOOZED column, add default snooze time (1 hour)
//     if (targetColumn.name === "SNOOZED") {
//       updateData.snooze_time_in_seconds = 3600; // Default 1 hour
//     }

//     try {
//       await taskApi.updateStatusTask(updateData);
//     } catch (err) {
//       console.error("Failed to update task status:", err);
//       // Optionally: rollback the Redux state change
//     }

//     setDraggedItem(null);
//     setDragOverColumn(null);
//     setDragOverIndex(null);
//     setTransforms({});
//   };

//   const handleDragEnd = () => {
//     document.removeEventListener("dragover", handleDocumentDragOver);
//     document.removeEventListener("drag", handleDocumentDrag);

//     if (ghostWrapperRef.current) {
//       ghostWrapperRef.current.style.transform =
//         "translate3d(-9999px, -9999px, 0)";
//     }

//     // Clean isDragging state
//     if (draggedItem) {
//       setLocalColumns((prev) =>
//         prev.map((col) => {
//           if (col.id === draggedItem.sourceColumn) {
//             return {
//               ...col,
//               items: col.items.map((t) => {
//                 const clean = { ...t };
//                 delete clean.isDragging;
//                 return clean;
//               }),
//             };
//           }
//           return col;
//         })
//       );
//     }

//     setDraggedItem(null);
//     setDragOverColumn(null);
//     setDragOverIndex(null);
//     setTransforms({});
//   };

//   return loading ? (
//     <p>loading...</p>
//   ) : error ? (
//     <p>Error: {error}</p>
//   ) : (
//     <div
//       className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
//       onDragEnd={handleDragEnd}
//     >
//       <div className="fixed inset-0 opacity-30 pointer-events-none">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
//             backgroundSize: "32px 32px",
//           }}
//         />
//       </div>

//       <Header setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
//       <main className="relative z-10 px-6 py-3 h-[calc(100vh-96px)]">
//         <div className="w-full max-w-[98%] mx-auto h-full">
//           {/* Snooze Button */}
//           <div className="mb-2 flex justify-end">
//             <button
//               onClick={handleOpenSnoozeModal}
//               className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
//             >
//               <Bell className="w-5 h-5 group-hover:animate-bounce" />
//               <span> Snoozed Emails</span>
//             </button>
//           </div>
//           <div
//             className="gap-6 h-full overflow-hidden"
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
//             }}
//           >
//             {columns.map((column) => (
//               <Column
//                 key={column.id}
//                 column={column}
//                 onDragStart={handleDragStart}
//                 onDragEnter={handleDragEnter}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//                 isDragOver={dragOverColumn === column.id}
//                 draggedOverIndex={dragOverIndex}
//                 transforms={transforms}
//                 onLoadMore={handleLoadMore}
//               />
//             ))}
//           </div>
//         </div>
//       </main>

//       {draggedItem && (
//         <div
//           ref={ghostWrapperRef}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             transform: `translate3d(${ghostPositionRef.current.x}px, ${ghostPositionRef.current.y}px, 0)`,
//             pointerEvents: "none",
//             zIndex: 10000,
//             width: `${cardWidth.current}px`,
//           }}
//         >
//           <EmailCard
//             threadId={draggedItem.thread.id}
//             item={
//               draggedItem.thread.messages[
//                 draggedItem.thread.messages.length - 1
//               ]
//             }
//             thread={draggedItem.thread}
//             isGhost={true}
//           />
//         </div>
//       )}

//       {/* Snooze Modal */}
//       <SnoozeModal
//         isOpen={isSnoozeModalOpen}
//         onClose={() => setIsSnoozeModalOpen(false)}
//         snoozeEmails={snoozeEmails}
//         loading={loadingSnooze}
//       />
//     </div>
//   );
// }
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   Mail,
//   Clock,
//   CheckCircle2,
//   MoreHorizontal,
//   Bell,
//   User,
//   Filter,
//   X,
//   Paperclip,
//   MailOpen,
// } from "lucide-react";
// import EmailCard from "../components/dashboard/EmailCard";
// import Header from "../components/dashboard/Header";
// import { useSelector, useDispatch } from "react-redux";
// import useGetAllTasks from "../hooks/useFetchTask";
// import taskApi from "../services/taskApi";
// import SnoozeModal from "../components/modal/SnoozeModal";
// import { moveThreadBetweenTypes } from "../redux/taskSlice";

// function DraggableItem({
//   thread,
//   columnId,
//   index,
//   onDragStart,
//   isDragging,
//   transform,
// }) {
//   const itemRef = useRef(null);
//   const lastMessage = thread.messages[thread.messages.length - 1];

//   return (
//     <div
//       ref={itemRef}
//       draggable
//       onDragStart={(e) =>
//         onDragStart(e, thread, columnId, index, itemRef.current)
//       }
//       data-item-id={thread.id}
//       style={{
//         transform: transform ? `translate3d(0, ${transform}px, 0)` : "none",
//         transition:
//           isDragging || transform === 0
//             ? "none"
//             : "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
//         opacity: isDragging ? 0.3 : 1,
//       }}
//     >
//       <EmailCard
//         threadId={thread.id}
//         item={lastMessage}
//         thread={thread}
//         isDragging={isDragging}
//       />
//     </div>
//   );
// }

// function Column({
//   column,
//   onDragStart,
//   onDragEnter,
//   onDragOver,
//   onDrop,
//   isDragOver,
//   draggedOverIndex,
//   transforms,
//   onLoadMore,
//   sortConfig,
//   onSortChange,
//   filterConfig,
//   onFilterChange,
// }) {
//   const Icon = column.icon;
//   const columnRef = useRef(null);
//   const loadMoreRef = useRef(null);
//   const observerRef = useRef(null);
//   const isLoadingRef = useRef(false);
//   const [showFilterMenu, setShowFilterMenu] = useState(false);

//   useEffect(() => {
//     isLoadingRef.current = column.loading;
//     if (!column.loading) {
//       console.log(
//         `✅ ${column.name} loading done, isLoadingRef reset to false`
//       );
//     }
//   }, [column.loading, column.name]);

//   useEffect(() => {
//     if (observerRef.current) {
//       observerRef.current.disconnect();
//       observerRef.current = null;
//     }

//     if (!loadMoreRef.current || !column.nextPageToken) {
//       return;
//     }

//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         const entry = entries[0];
//         if (
//           entry.isIntersecting &&
//           column.nextPageToken &&
//           !isLoadingRef.current
//         ) {
//           console.log(
//             `🔄 Intersection triggered for ${column.name}, token:`,
//             column.nextPageToken
//           );
//           isLoadingRef.current = true;
//           onLoadMore(column.name);
//         }
//       },
//       { threshold: 0.1, rootMargin: "100px" }
//     );

//     observerRef.current.observe(loadMoreRef.current);

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//         observerRef.current = null;
//       }
//     };
//   }, [column.nextPageToken, column.name, onLoadMore]);

//   const currentSort = sortConfig[column.id];
//   const currentFilter = filterConfig[column.id];
//   const hasActiveFilters =
//     currentFilter?.onlyUnread || currentFilter?.hasAttachment;

//   return (
//     <div className="flex flex-col h-full min-h-0">
//       <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
//         <div className="flex items-center gap-3">
//           <div
//             className="w-8 h-8 rounded-lg flex items-center justify-center"
//             style={{ backgroundColor: `${column.color}15` }}
//           >
//             <Icon className="w-4 h-4" style={{ color: column.color }} />
//           </div>
//           <h3 className="font-bold text-gray-800 text-sm tracking-wide">
//             {column.title}
//           </h3>
//           <span
//             className="text-xs font-bold px-2 py-0.5 rounded-full"
//             style={{
//               backgroundColor: `${column.color}15`,
//               color: column.color,
//             }}
//           >
//             {column.items.length}
//           </span>
//         </div>
//         <div className="flex items-center gap-1">
//           {/* Sort by Time */}
//           <button
//             onClick={() => onSortChange(column.id, "time")}
//             className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
//               currentSort === "time" ? "bg-blue-50" : ""
//             }`}
//             title="Sort by time"
//           >
//             <Clock
//               className={`w-4 h-4 ${
//                 currentSort === "time" ? "text-blue-600" : "text-gray-400"
//               }`}
//             />
//           </button>

//           {/* Sort by Sender */}
//           <button
//             onClick={() => onSortChange(column.id, "sender")}
//             className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
//               currentSort === "sender" ? "bg-blue-50" : ""
//             }`}
//             title="Sort by sender"
//           >
//             <User
//               className={`w-4 h-4 ${
//                 currentSort === "sender" ? "text-blue-600" : "text-gray-400"
//               }`}
//             />
//           </button>

//           {/* Filter Button */}
//           <div className="relative">
//             <button
//               onClick={() => setShowFilterMenu(!showFilterMenu)}
//               className={`p-2 hover:bg-gray-100 rounded-lg transition-colors relative ${
//                 hasActiveFilters ? "bg-green-50" : ""
//               }`}
//               title="Filter"
//             >
//               <Filter
//                 className={`w-4 h-4 ${
//                   hasActiveFilters ? "text-green-600" : "text-gray-400"
//                 }`}
//               />
//               {hasActiveFilters && (
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
//               )}
//             </button>

//             {/* Filter Dropdown */}
//             {showFilterMenu && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-3">
//                 <div className="space-y-3">
//                   <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
//                     <input
//                       type="checkbox"
//                       checked={currentFilter?.onlyUnread || false}
//                       onChange={(e) =>
//                         onFilterChange(
//                           column.id,
//                           "onlyUnread",
//                           e.target.checked
//                         )
//                       }
//                       className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                     />
//                     <MailOpen className="w-4 h-4 text-gray-600" />
//                     <span className="text-sm text-gray-700">Only Unread</span>
//                   </label>

//                   <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
//                     <input
//                       type="checkbox"
//                       checked={currentFilter?.hasAttachment || false}
//                       onChange={(e) =>
//                         onFilterChange(
//                           column.id,
//                           "hasAttachment",
//                           e.target.checked
//                         )
//                       }
//                       className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
//                     />
//                     <Paperclip className="w-4 h-4 text-gray-600" />
//                     <span className="text-sm text-gray-700">
//                       Has Attachment
//                     </span>
//                   </label>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Clear Filters Button */}
//           {hasActiveFilters && (
//             <button
//               onClick={() => onFilterChange(column.id, "clear")}
//               className="p-2 hover:bg-red-50 rounded-lg transition-colors"
//               title="Clear filters"
//             >
//               <X className="w-4 h-4 text-red-500" />
//             </button>
//           )}

//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <MoreHorizontal className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>
//       </div>

//       <div
//         ref={columnRef}
//         className={`
//           flex-1 min-h-0 rounded-2xl p-3 space-y-3
//           overflow-y-scroll overflow-x-hidden
//           transition-all duration-300 ease-out
//           scrollbar-always
//           ${
//             isDragOver
//               ? "bg-blue-50 ring-2 ring-blue-200 ring-inset"
//               : "bg-gray-50/50"
//           }
//         `}
//         style={{
//           scrollbarGutter: "stable",
//         }}
//         onDragOver={(e) => onDragOver(e, column.id, columnRef.current)}
//         onDragEnter={(e) => onDragEnter(e, column.id)}
//         onDrop={(e) => onDrop(e, column.id)}
//       >
//         {column.items.map((thread, index) => (
//           <DraggableItem
//             key={thread.id}
//             thread={thread}
//             columnId={column.id}
//             index={index}
//             onDragStart={onDragStart}
//             isDragging={thread.isDragging}
//             transform={transforms[column.id]?.[index] || 0}
//           />
//         ))}

//         {column.loading && (
//           <div className="text-center py-4">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
//             <p className="text-xs text-gray-500 mt-2">Loading more...</p>
//           </div>
//         )}

//         {column.nextPageToken && !column.loading && (
//           <div ref={loadMoreRef} className="h-4" />
//         )}

//         {!column.nextPageToken && column.items.length > 0 && (
//           <div className="text-center py-2 text-xs text-gray-400">
//             ✓ All items loaded
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function EmailKanbanBoard() {
//   const dispatch = useDispatch();
//   const [draggedItem, setDraggedItem] = useState(null);
//   const ghostPositionRef = useRef({ x: 0, y: 0 });
//   const [dragOverColumn, setDragOverColumn] = useState(null);
//   const [dragOverIndex, setDragOverIndex] = useState(null);
//   const [transforms, setTransforms] = useState({});
//   const cardWidth = useRef(0);
//   const cardHeight = useRef(0);
//   const ghostWrapperRef = useRef(null);
//   const dragOffset = useRef({ x: 0, y: 0 });

//   const listTypes = useSelector((state) => state.tasks.listTypes);
//   const mails = useSelector((state) => state.tasks.mails);

//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   const { fetchAllTasks, fetchTasksForType, loading, error } = useGetAllTasks();

//   const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
//   const [snoozeEmails, setSnoozeEmails] = useState([]);
//   const [loadingSnooze, setLoadingSnooze] = useState(false);

//   // Sort and Filter states
//   const [sortConfig, setSortConfig] = useState({});
//   const [filterConfig, setFilterConfig] = useState({});

//   const iconMapping = {
//     INBOX: { icon: Mail, color: "#ef4444" },
//     TODO: { icon: Clock, color: "#f59e0b" },
//     DONE: { icon: CheckCircle2, color: "#22c55e" },
//   };

//   const [localColumns, setLocalColumns] = useState([]);

//   const getAttachments = (message) => {
//     if (!message.parts || message.parts.length === 0) {
//       return [];
//     }
//     return message.parts.filter((part) => part.attachmentId);
//   };

//   const isUnread = (message) => {
//     return message.labelIds && message.labelIds.includes("UNREAD");
//   };

//   // Apply sorting and filtering
//   const getProcessedColumns = useCallback(() => {
//     return localColumns.map((column) => {
//       let processedItems = [...column.items];

//       // Apply filters
//       const filter = filterConfig[column.id];
//       if (filter) {
//         if (filter.onlyUnread) {
//           processedItems = processedItems.filter((thread) => {
//             const lastMessage = thread.messages[thread.messages.length - 1];
//             return isUnread(lastMessage);
//           });
//         }
//         if (filter.hasAttachment) {
//           processedItems = processedItems.filter((thread) => {
//             const lastMessage = thread.messages[thread.messages.length - 1];
//             return getAttachments(lastMessage).length > 0;
//           });
//         }
//       }

//       // Apply sorting
//       const sort = sortConfig[column.id];
//       if (sort === "time") {
//         processedItems.sort((a, b) => {
//           const dateA = new Date(a.messages[a.messages.length - 1].date);
//           const dateB = new Date(b.messages[b.messages.length - 1].date);
//           return dateB - dateA;
//         });
//       } else if (sort === "sender") {
//         processedItems.sort((a, b) => {
//           const senderA = (
//             a.messages[a.messages.length - 1].from || ""
//           ).toLowerCase();
//           const senderB = (
//             b.messages[b.messages.length - 1].from || ""
//           ).toLowerCase();
//           return senderA.localeCompare(senderB);
//         });
//       }

//       return {
//         ...column,
//         items: processedItems,
//       };
//     });
//   }, [localColumns, sortConfig, filterConfig]);

//   useEffect(() => {
//     const updatedColumns = mails.map((mail) => {
//       const iconConfig = iconMapping[mail.name] || {
//         icon: Mail,
//         color: "#6b7280",
//       };
//       return {
//         id: mail.name.toLowerCase(),
//         name: mail.name,
//         title: mail.name.replace(/_/g, " "),
//         icon: iconConfig.icon,
//         color: iconConfig.color,
//         items: mail.threads,
//         nextPageToken: mail.nextPageToken,
//         loading: mail.loading,
//         hasMore: mail.hasMore,
//         error: mail.error,
//       };
//     });
//     setLocalColumns(updatedColumns);
//   }, [mails]);

//   const columns = getProcessedColumns();

//   useEffect(() => {
//     fetchAllTasks();
//   }, []);

//   const handleLoadMore = useCallback(
//     (typeName) => {
//       const mail = mails.find((m) => m.name === typeName);
//       if (
//         mail &&
//         mail.nextPageToken &&
//         mail.nextPageToken.trim() &&
//         !mail.loading
//       ) {
//         console.log(
//           `🔄 Loading more for ${typeName} with token:`,
//           mail.nextPageToken
//         );
//         fetchTasksForType(typeName, mail.nextPageToken);
//       } else {
//         console.log(`⛔ Cannot load more for ${typeName}:`, {
//           hasNextPageToken: !!mail?.nextPageToken,
//           isLoading: mail?.loading,
//         });
//       }
//     },
//     [mails, fetchTasksForType]
//   );

//   const handleOpenSnoozeModal = async () => {
//     setIsSnoozeModalOpen(true);
//     setLoadingSnooze(true);
//     try {
//       const response = await taskApi.getTaskSnooze();
//       const snoozeThreads = response.mailTasks.map((task) => {
//         const thread = task.thread;
//         if (thread.messages && thread.messages.length > 0) {
//           const lastMessageIndex = thread.messages.length - 1;
//           thread.messages[lastMessageIndex] = {
//             ...thread.messages[lastMessageIndex],
//             summary: task.summary || "No summary available",
//           };
//         }
//         return thread;
//       });
//       setSnoozeEmails(snoozeThreads);
//     } catch (err) {
//       console.error("Failed to fetch snooze emails:", err);
//       setSnoozeEmails([]);
//     } finally {
//       setLoadingSnooze(false);
//     }
//   };

//   const handleSortChange = (columnId, sortType) => {
//     setSortConfig((prev) => ({
//       ...prev,
//       [columnId]: prev[columnId] === sortType ? null : sortType,
//     }));
//   };

//   const handleFilterChange = (columnId, filterType, value) => {
//     if (filterType === "clear") {
//       setFilterConfig((prev) => ({
//         ...prev,
//         [columnId]: {},
//       }));
//     } else {
//       setFilterConfig((prev) => ({
//         ...prev,
//         [columnId]: {
//           ...prev[columnId],
//           [filterType]: value,
//         },
//       }));
//     }
//   };

//   const handleDragStart = (e, thread, columnId, index, element) => {
//     const rect = element.getBoundingClientRect();
//     cardWidth.current = rect.width;
//     cardHeight.current = rect.height;

//     dragOffset.current = {
//       x: e.clientX - rect.left,
//       y: e.clientY - rect.top,
//     };

//     ghostPositionRef.current = {
//       x: e.clientX - dragOffset.current.x,
//       y: e.clientY - dragOffset.current.y,
//     };

//     if (ghostWrapperRef.current) {
//       ghostWrapperRef.current.style.transform = `translate3d(${ghostPositionRef.current.x}px, ${ghostPositionRef.current.y}px, 0)`;
//       ghostWrapperRef.current.style.width = `${cardWidth.current}px`;
//     }

//     e.dataTransfer.effectAllowed = "move";

//     const img = new Image();
//     img.src =
//       "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//     e.dataTransfer.setDragImage(img, 0, 0);

//     setDraggedItem({ thread, sourceColumn: columnId, sourceIndex: index });

//     setLocalColumns((prev) =>
//       prev.map((col) => {
//         if (col.id === columnId) {
//           return {
//             ...col,
//             items: col.items.map((t, idx) =>
//               idx === index ? { ...t, isDragging: true } : t
//             ),
//           };
//         }
//         return col;
//       })
//     );

//     document.addEventListener("dragover", handleDocumentDragOver);
//     document.addEventListener("drag", handleDocumentDrag);
//   };

//   const handleDocumentDrag = (e) => {
//     if (e.clientX === 0 && e.clientY === 0) return;

//     const newX = e.clientX - dragOffset.current.x;
//     const newY = e.clientY - dragOffset.current.y;
//     ghostPositionRef.current = { x: newX, y: newY };

//     if (ghostWrapperRef.current) {
//       ghostWrapperRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
//     }
//   };

//   const handleDocumentDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleDragEnter = (e, columnId) => {
//     e.preventDefault();
//     setDragOverColumn(columnId);
//   };

//   const handleDragOver = (e, columnId, columnElement) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!draggedItem || !columnElement) return;

//     const columnRect = columnElement.getBoundingClientRect();
//     const mouseY = e.clientY - columnRect.top - 12;

//     const currentColumn = columns.find((col) => col.id === columnId);
//     if (!currentColumn) return;

//     const items = currentColumn.items;
//     let insertIndex = items.length;

//     let accumulatedHeight = 0;
//     for (let i = 0; i < items.length; i++) {
//       const itemHeight = cardHeight.current + 12;

//       if (mouseY < accumulatedHeight + itemHeight / 2) {
//         insertIndex = i;
//         break;
//       }
//       accumulatedHeight += itemHeight;
//     }

//     if (
//       columnId === draggedItem.sourceColumn &&
//       insertIndex === draggedItem.sourceIndex
//     ) {
//       setDragOverIndex(null);
//       setTransforms({});
//       return;
//     }

//     setDragOverIndex(insertIndex);

//     const newTransforms = {};
//     newTransforms[columnId] = {};

//     const itemHeight = cardHeight.current + 12;

//     items.forEach((thread, i) => {
//       if (columnId === draggedItem.sourceColumn) {
//         if (i === draggedItem.sourceIndex) {
//           newTransforms[columnId][i] = 0;
//         } else if (insertIndex <= draggedItem.sourceIndex) {
//           if (i >= insertIndex && i < draggedItem.sourceIndex) {
//             newTransforms[columnId][i] = itemHeight;
//           } else {
//             newTransforms[columnId][i] = 0;
//           }
//         } else {
//           if (i > draggedItem.sourceIndex && i < insertIndex) {
//             newTransforms[columnId][i] = -itemHeight;
//           } else {
//             newTransforms[columnId][i] = 0;
//           }
//         }
//       } else {
//         if (i >= insertIndex) {
//           newTransforms[columnId][i] = itemHeight;
//         } else {
//           newTransforms[columnId][i] = 0;
//         }
//       }
//     });

//     if (columnId !== draggedItem.sourceColumn) {
//       newTransforms[draggedItem.sourceColumn] = {};
//       const sourceColumn = columns.find(
//         (col) => col.id === draggedItem.sourceColumn
//       );
//       if (sourceColumn) {
//         sourceColumn.items.forEach((thread, i) => {
//           if (i > draggedItem.sourceIndex) {
//             newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
//           } else {
//             newTransforms[draggedItem.sourceColumn][i] = 0;
//           }
//         });
//       }
//     }

//     setTransforms(newTransforms);
//   };

//   const handleDrop = async (e, targetColumnId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     document.removeEventListener("dragover", handleDocumentDragOver);
//     document.removeEventListener("drag", handleDocumentDrag);

//     if (!draggedItem) return;

//     const { thread, sourceColumn, sourceIndex } = draggedItem;

//     const targetColumn = columns.find((col) => col.id === targetColumnId);
//     const sourceCol = columns.find((col) => col.id === sourceColumn);

//     if (!targetColumn || !sourceCol) return;

//     if (sourceCol.name !== targetColumn.name) {
//       dispatch(
//         moveThreadBetweenTypes({
//           fromType: sourceCol.name,
//           toType: targetColumn.name,
//           threadId: thread.id,
//         })
//       );
//     }

//     const updateData = {
//       thread_id: thread.id,
//       send_at: new Date(
//         thread.messages[thread.messages.length - 1].date
//       ).toISOString(),
//       status: targetColumn.name,
//     };

//     if (targetColumn.name === "SNOOZED") {
//       updateData.snooze_time_in_seconds = 3600;
//     }

//     try {
//       await taskApi.updateStatusTask(updateData);
//     } catch (err) {
//       console.error("Failed to update task status:", err);
//     }

//     setDraggedItem(null);
//     setDragOverColumn(null);
//     setDragOverIndex(null);
//     setTransforms({});
//   };

//   const handleDragEnd = () => {
//     document.removeEventListener("dragover", handleDocumentDragOver);
//     document.removeEventListener("drag", handleDocumentDrag);

//     if (ghostWrapperRef.current) {
//       ghostWrapperRef.current.style.transform =
//         "translate3d(-9999px, -9999px, 0)";
//     }

//     if (draggedItem) {
//       setLocalColumns((prev) =>
//         prev.map((col) => {
//           if (col.id === draggedItem.sourceColumn) {
//             return {
//               ...col,
//               items: col.items.map((t) => {
//                 const clean = { ...t };
//                 delete clean.isDragging;
//                 return clean;
//               }),
//             };
//           }
//           return col;
//         })
//       );
//     }

//     setDraggedItem(null);
//     setDragOverColumn(null);
//     setDragOverIndex(null);
//     setTransforms({});
//   };

//   return loading ? (
//     <p>loading...</p>
//   ) : error ? (
//     <p>Error: {error}</p>
//   ) : (
//     <div
//       className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
//       onDragEnd={handleDragEnd}
//     >
//       <div className="fixed inset-0 opacity-30 pointer-events-none">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
//             backgroundSize: "32px 32px",
//           }}
//         />
//       </div>

//       <Header setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
//       <main className="relative z-10 px-6 py-3 h-[calc(100vh-96px)]">
//         <div className="w-full max-w-[98%] mx-auto h-full">
//           <div className="mb-2 flex justify-end">
//             <button
//               onClick={handleOpenSnoozeModal}
//               className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
//             >
//               <Bell className="w-5 h-5 group-hover:animate-bounce" />
//               <span> Snoozed Emails</span>
//             </button>
//           </div>
//           <div
//             className="gap-6 h-full overflow-hidden"
//             style={{
//               display: "grid",
//               gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
//             }}
//           >
//             {columns.map((column) => (
//               <Column
//                 key={column.id}
//                 column={column}
//                 onDragStart={handleDragStart}
//                 onDragEnter={handleDragEnter}
//                 onDragOver={handleDragOver}
//                 onDrop={handleDrop}
//                 isDragOver={dragOverColumn === column.id}
//                 draggedOverIndex={dragOverIndex}
//                 transforms={transforms}
//                 onLoadMore={handleLoadMore}
//                 sortConfig={sortConfig}
//                 onSortChange={handleSortChange}
//                 filterConfig={filterConfig}
//                 onFilterChange={handleFilterChange}
//               />
//             ))}
//           </div>
//         </div>
//       </main>

//       {draggedItem && (
//         <div
//           ref={ghostWrapperRef}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             transform: `translate3d(${ghostPositionRef.current.x}px, ${ghostPositionRef.current.y}px, 0)`,
//             pointerEvents: "none",
//             zIndex: 10000,
//             width: `${cardWidth.current}px`,
//           }}
//         >
//           <EmailCard
//             threadId={draggedItem.thread.id}
//             item={
//               draggedItem.thread.messages[
//                 draggedItem.thread.messages.length - 1
//               ]
//             }
//             thread={draggedItem.thread}
//             isGhost={true}
//           />
//         </div>
//       )}

//       <SnoozeModal
//         isOpen={isSnoozeModalOpen}
//         onClose={() => setIsSnoozeModalOpen(false)}
//         snoozeEmails={snoozeEmails}
//         loading={loadingSnooze}
//       />
//     </div>
//   );
// }

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Mail,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Bell,
  User,
  Filter,
  X,
  Paperclip,
  MailOpen,
} from "lucide-react";
import EmailCard from "../components/dashboard/EmailCard";
import Header from "../components/dashboard/Header";
import { useSelector, useDispatch } from "react-redux";
import useGetAllTasks from "../hooks/useFetchTask";
import taskApi from "../services/taskApi";
import SnoozeModal from "../components/modal/SnoozeModal";
import { moveThreadBetweenTypes } from "../redux/taskSlice";

function DraggableItem({
  thread,
  columnId,
  index,
  onDragStart,
  isDragging,
  transform,
}) {
  const itemRef = useRef(null);
  const lastMessage = thread.messages[thread.messages.length - 1];

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={(e) =>
        onDragStart(e, thread, columnId, index, itemRef.current)
      }
      data-item-id={thread.id}
      style={{
        transform: transform ? `translate3d(0, ${transform}px, 0)` : "none",
        transition:
          isDragging || transform === 0
            ? "none"
            : "transform 250ms cubic-bezier(0.2, 0, 0, 1)",
        opacity: isDragging ? 0.3 : 1,
      }}
    >
      <EmailCard
        threadId={thread.id}
        item={lastMessage}
        thread={thread}
        isDragging={isDragging}
      />
    </div>
  );
}

function Column({
  column,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  isDragOver,
  draggedOverIndex,
  transforms,
  onLoadMore,
  sortConfig,
  onSortChange,
  filterConfig,
  onFilterChange,
}) {
  const Icon = column.icon;
  const columnRef = useRef(null);
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const isLoadingRef = useRef(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  useEffect(() => {
    isLoadingRef.current = column.loading;
    if (!column.loading) {
      console.log(
        `✅ ${column.name} loading done, isLoadingRef reset to false`
      );
    }
  }, [column.loading, column.name]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!loadMoreRef.current || !column.nextPageToken) {
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          column.nextPageToken &&
          !isLoadingRef.current
        ) {
          console.log(
            `🔄 Intersection triggered for ${column.name}, token:`,
            column.nextPageToken
          );
          isLoadingRef.current = true;
          onLoadMore(column.name);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [column.nextPageToken, column.name, onLoadMore]);

  const currentSort = sortConfig[column.id];
  const currentFilter = filterConfig[column.id];
  const hasActiveFilters =
    currentFilter?.onlyUnread || currentFilter?.hasAttachment;

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-4 px-1 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${column.color}15` }}
          >
            <Icon className="w-4 h-4" style={{ color: column.color }} />
          </div>
          <h3 className="font-bold text-gray-800 text-sm tracking-wide">
            {column.title}
          </h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${column.color}15`,
              color: column.color,
            }}
          >
            {column.items.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* Sort by Time */}
          <button
            onClick={() => onSortChange(column.id, "time")}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
              currentSort?.type === "time" ? "bg-blue-50" : ""
            }`}
            title={`Sort by time ${
              currentSort?.type === "time"
                ? currentSort.direction === "asc"
                  ? "(oldest first)"
                  : "(newest first)"
                : ""
            }`}
          >
            <Clock
              className={`w-4 h-4 ${
                currentSort?.type === "time" ? "text-blue-600" : "text-gray-400"
              }`}
            />
            {currentSort?.type === "time" && (
              <span className="absolute -top-1 -right-1 text-xs">
                {currentSort.direction === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>

          {/* Sort by Sender */}
          <button
            onClick={() => onSortChange(column.id, "sender")}
            className={`p-2 hover:bg-gray-100 rounded-lg transition-colors relative ${
              currentSort?.type === "sender" ? "bg-blue-50" : ""
            }`}
            title={`Sort by sender ${
              currentSort?.type === "sender"
                ? currentSort.direction === "asc"
                  ? "(A-Z)"
                  : "(Z-A)"
                : ""
            }`}
          >
            <User
              className={`w-4 h-4 ${
                currentSort?.type === "sender"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />
            {currentSort?.type === "sender" && (
              <span className="absolute -top-1 -right-1 text-xs">
                {currentSort.direction === "asc" ? "↑" : "↓"}
              </span>
            )}
          </button>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 hover:bg-gray-100 rounded-lg transition-colors relative ${
                hasActiveFilters ? "bg-green-50" : ""
              }`}
              title="Filter"
            >
              <Filter
                className={`w-4 h-4 ${
                  hasActiveFilters ? "text-green-600" : "text-gray-400"
                }`}
              />
              {hasActiveFilters && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-3">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={currentFilter?.onlyUnread || false}
                      onChange={(e) =>
                        onFilterChange(
                          column.id,
                          "onlyUnread",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <MailOpen className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">Only Unread</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={currentFilter?.hasAttachment || false}
                      onChange={(e) =>
                        onFilterChange(
                          column.id,
                          "hasAttachment",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <Paperclip className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      Has Attachment
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={() => onFilterChange(column.id, "clear")}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear filters"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          )}

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div
        ref={columnRef}
        className={`
          flex-1 min-h-0 rounded-2xl p-3 space-y-3
          overflow-y-scroll overflow-x-hidden
          transition-all duration-300 ease-out
          scrollbar-always
          ${
            isDragOver
              ? "bg-blue-50 ring-2 ring-blue-200 ring-inset"
              : "bg-gray-50/50"
          }
        `}
        style={{
          scrollbarGutter: "stable",
        }}
        onDragOver={(e) => onDragOver(e, column.id, columnRef.current)}
        onDragEnter={(e) => onDragEnter(e, column.id)}
        onDrop={(e) => onDrop(e, column.id)}
      >
        {column.items.map((thread, index) => (
          <DraggableItem
            key={thread.id}
            thread={thread}
            columnId={column.id}
            index={index}
            onDragStart={onDragStart}
            isDragging={thread.isDragging}
            transform={transforms[column.id]?.[index] || 0}
          />
        ))}

        {column.loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
            <p className="text-xs text-gray-500 mt-2">Loading more...</p>
          </div>
        )}

        {column.nextPageToken && !column.loading && (
          <div ref={loadMoreRef} className="h-4" />
        )}

        {!column.nextPageToken && column.items.length > 0 && (
          <div className="text-center py-2 text-xs text-gray-400">
            ✓ All items loaded
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmailKanbanBoard() {
  const dispatch = useDispatch();
  const [draggedItem, setDraggedItem] = useState(null);
  const ghostPositionRef = useRef({ x: 0, y: 0 });
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [transforms, setTransforms] = useState({});
  const cardWidth = useRef(0);
  const cardHeight = useRef(0);
  const ghostWrapperRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const listTypes = useSelector((state) => state.tasks.listTypes);
  const mails = useSelector((state) => state.tasks.mails);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { fetchAllTasks, fetchTasksForType, loading, error } = useGetAllTasks();

  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [snoozeEmails, setSnoozeEmails] = useState([]);
  const [loadingSnooze, setLoadingSnooze] = useState(false);

  // Sort and Filter states
  const [sortConfig, setSortConfig] = useState({});
  const [filterConfig, setFilterConfig] = useState({});

  const iconMapping = {
    INBOX: { icon: Mail, color: "#ef4444" },
    TODO: { icon: Clock, color: "#f59e0b" },
    DONE: { icon: CheckCircle2, color: "#22c55e" },
  };

  const [localColumns, setLocalColumns] = useState([]);

  const getAttachments = (message) => {
    if (!message.parts || message.parts.length === 0) {
      return [];
    }
    return message.parts.filter((part) => part.attachmentId);
  };

  const isUnread = (message) => {
    return message.labelIds && message.labelIds.includes("UNREAD");
  };

  // Apply sorting and filtering
  const getProcessedColumns = useCallback(() => {
    return localColumns.map((column) => {
      let processedItems = [...column.items];

      // Apply filters
      const filter = filterConfig[column.id];
      if (filter) {
        if (filter.onlyUnread) {
          processedItems = processedItems.filter((thread) => {
            const lastMessage = thread.messages[thread.messages.length - 1];
            return isUnread(lastMessage);
          });
        }
        if (filter.hasAttachment) {
          processedItems = processedItems.filter((thread) => {
            const lastMessage = thread.messages[thread.messages.length - 1];
            return getAttachments(lastMessage).length > 0;
          });
        }
      }

      // Apply sorting
      const sort = sortConfig[column.id];
      if (sort?.type === "time") {
        processedItems.sort((a, b) => {
          const dateA = new Date(a.messages[a.messages.length - 1].date);
          const dateB = new Date(b.messages[b.messages.length - 1].date);
          return sort.direction === "asc" ? dateA - dateB : dateB - dateA;
        });
      } else if (sort?.type === "sender") {
        processedItems.sort((a, b) => {
          const senderA = (
            a.messages[a.messages.length - 1].from || ""
          ).toLowerCase();
          const senderB = (
            b.messages[b.messages.length - 1].from || ""
          ).toLowerCase();
          return sort.direction === "asc"
            ? senderA.localeCompare(senderB)
            : senderB.localeCompare(senderA);
        });
      }

      return {
        ...column,
        items: processedItems,
      };
    });
  }, [localColumns, sortConfig, filterConfig]);

  useEffect(() => {
    const updatedColumns = mails.map((mail) => {
      const iconConfig = iconMapping[mail.name] || {
        icon: Mail,
        color: "#6b7280",
      };
      return {
        id: mail.name.toLowerCase(),
        name: mail.name,
        title: mail.name.replace(/_/g, " "),
        icon: iconConfig.icon,
        color: iconConfig.color,
        items: mail.threads,
        nextPageToken: mail.nextPageToken,
        loading: mail.loading,
        hasMore: mail.hasMore,
        error: mail.error,
      };
    });
    setLocalColumns(updatedColumns);
  }, [mails]);

  const columns = getProcessedColumns();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleLoadMore = useCallback(
    (typeName) => {
      const mail = mails.find((m) => m.name === typeName);
      if (
        mail &&
        mail.nextPageToken &&
        mail.nextPageToken.trim() &&
        !mail.loading
      ) {
        console.log(
          `🔄 Loading more for ${typeName} with token:`,
          mail.nextPageToken
        );
        fetchTasksForType(typeName, mail.nextPageToken);
      } else {
        console.log(`⛔ Cannot load more for ${typeName}:`, {
          hasNextPageToken: !!mail?.nextPageToken,
          isLoading: mail?.loading,
        });
      }
    },
    [mails, fetchTasksForType]
  );

  const handleOpenSnoozeModal = async () => {
    setIsSnoozeModalOpen(true);
    setLoadingSnooze(true);
    try {
      const response = await taskApi.getTaskSnooze();
      const snoozeThreads = response.mailTasks.map((task) => {
        const thread = task.thread;
        if (thread.messages && thread.messages.length > 0) {
          const lastMessageIndex = thread.messages.length - 1;
          thread.messages[lastMessageIndex] = {
            ...thread.messages[lastMessageIndex],
            summary: task.summary || "No summary available",
          };
        }
        return thread;
      });
      setSnoozeEmails(snoozeThreads);
    } catch (err) {
      console.error("Failed to fetch snooze emails:", err);
      setSnoozeEmails([]);
    } finally {
      setLoadingSnooze(false);
    }
  };

  const handleSortChange = (columnId, sortType) => {
    setSortConfig((prev) => {
      const current = prev[columnId];
      let newValue = null;

      if (!current || current.type !== sortType) {
        // Chưa có sort hoặc đang sort type khác -> sort tăng dần
        newValue = { type: sortType, direction: "asc" };
      } else if (current.direction === "asc") {
        // Đang sort tăng dần -> chuyển sang giảm dần
        newValue = { type: sortType, direction: "desc" };
      } else {
        // Đang sort giảm dần -> về mặc định (null)
        newValue = null;
      }

      return {
        ...prev,
        [columnId]: newValue,
      };
    });
  };

  const handleFilterChange = (columnId, filterType, value) => {
    if (filterType === "clear") {
      setFilterConfig((prev) => ({
        ...prev,
        [columnId]: {},
      }));
    } else {
      setFilterConfig((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          [filterType]: value,
        },
      }));
    }
  };

  const handleDragStart = (e, thread, columnId, index, element) => {
    const rect = element.getBoundingClientRect();
    cardWidth.current = rect.width;
    cardHeight.current = rect.height;

    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    ghostPositionRef.current = {
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    };

    if (ghostWrapperRef.current) {
      ghostWrapperRef.current.style.transform = `translate3d(${ghostPositionRef.current.x}px, ${ghostPositionRef.current.y}px, 0)`;
      ghostWrapperRef.current.style.width = `${cardWidth.current}px`;
    }

    e.dataTransfer.effectAllowed = "move";

    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);

    setDraggedItem({ thread, sourceColumn: columnId, sourceIndex: index });

    setLocalColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            items: col.items.map((t, idx) =>
              idx === index ? { ...t, isDragging: true } : t
            ),
          };
        }
        return col;
      })
    );

    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("drag", handleDocumentDrag);
  };

  const handleDocumentDrag = (e) => {
    if (e.clientX === 0 && e.clientY === 0) return;

    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;
    ghostPositionRef.current = { x: newX, y: newY };

    if (ghostWrapperRef.current) {
      ghostWrapperRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    }
  };

  const handleDocumentDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragOver = (e, columnId, columnElement) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem || !columnElement) return;

    const columnRect = columnElement.getBoundingClientRect();
    const mouseY = e.clientY - columnRect.top - 12;

    const currentColumn = columns.find((col) => col.id === columnId);
    if (!currentColumn) return;

    const items = currentColumn.items;
    let insertIndex = items.length;

    let accumulatedHeight = 0;
    for (let i = 0; i < items.length; i++) {
      const itemHeight = cardHeight.current + 12;

      if (mouseY < accumulatedHeight + itemHeight / 2) {
        insertIndex = i;
        break;
      }
      accumulatedHeight += itemHeight;
    }

    if (
      columnId === draggedItem.sourceColumn &&
      insertIndex === draggedItem.sourceIndex
    ) {
      setDragOverIndex(null);
      setTransforms({});
      return;
    }

    setDragOverIndex(insertIndex);

    const newTransforms = {};
    newTransforms[columnId] = {};

    const itemHeight = cardHeight.current + 12;

    items.forEach((thread, i) => {
      if (columnId === draggedItem.sourceColumn) {
        if (i === draggedItem.sourceIndex) {
          newTransforms[columnId][i] = 0;
        } else if (insertIndex <= draggedItem.sourceIndex) {
          if (i >= insertIndex && i < draggedItem.sourceIndex) {
            newTransforms[columnId][i] = itemHeight;
          } else {
            newTransforms[columnId][i] = 0;
          }
        } else {
          if (i > draggedItem.sourceIndex && i < insertIndex) {
            newTransforms[columnId][i] = -itemHeight;
          } else {
            newTransforms[columnId][i] = 0;
          }
        }
      } else {
        if (i >= insertIndex) {
          newTransforms[columnId][i] = itemHeight;
        } else {
          newTransforms[columnId][i] = 0;
        }
      }
    });

    if (columnId !== draggedItem.sourceColumn) {
      newTransforms[draggedItem.sourceColumn] = {};
      const sourceColumn = columns.find(
        (col) => col.id === draggedItem.sourceColumn
      );
      if (sourceColumn) {
        sourceColumn.items.forEach((thread, i) => {
          if (i > draggedItem.sourceIndex) {
            newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
          } else {
            newTransforms[draggedItem.sourceColumn][i] = 0;
          }
        });
      }
    }

    setTransforms(newTransforms);
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    e.stopPropagation();

    document.removeEventListener("dragover", handleDocumentDragOver);
    document.removeEventListener("drag", handleDocumentDrag);

    if (!draggedItem) return;

    const { thread, sourceColumn, sourceIndex } = draggedItem;

    const targetColumn = columns.find((col) => col.id === targetColumnId);
    const sourceCol = columns.find((col) => col.id === sourceColumn);

    if (!targetColumn || !sourceCol) return;

    // Tính toán vị trí insert chính xác dựa trên dragOverIndex
    const insertIndex =
      dragOverIndex !== null ? dragOverIndex : targetColumn.items.length;

    if (sourceCol.name !== targetColumn.name) {
      // Di chuyển giữa các column khác nhau
      dispatch(
        moveThreadBetweenTypes({
          fromType: sourceCol.name,
          toType: targetColumn.name,
          threadId: thread.id,
          insertIndex: insertIndex, // Truyền vị trí insert vào Redux nếu cần
        })
      );

      // Cập nhật localColumns để đảm bảo vị trí đúng
      setLocalColumns((prev) => {
        const newColumns = prev.map((col) => ({
          ...col,
          items: [...col.items],
        }));
        const sourceColData = newColumns.find((col) => col.id === sourceColumn);
        const targetColData = newColumns.find(
          (col) => col.id === targetColumnId
        );

        if (sourceColData && targetColData) {
          // Xóa từ source
          const itemIdx = sourceColData.items.findIndex(
            (t) => t.id === thread.id
          );
          if (itemIdx > -1) {
            const [movedItem] = sourceColData.items.splice(itemIdx, 1);
            // Thêm vào target tại vị trí chính xác
            targetColData.items.splice(insertIndex, 0, movedItem);
          }
        }

        return newColumns;
      });
    } else {
      // Di chuyển trong cùng column
      setLocalColumns((prev) => {
        const newColumns = prev.map((col) => {
          if (col.id === sourceColumn) {
            const newItems = [...col.items];
            const [movedItem] = newItems.splice(sourceIndex, 1);

            // Tính lại insert index nếu di chuyển xuống trong cùng column
            let finalInsertIndex = insertIndex;
            if (insertIndex > sourceIndex) {
              finalInsertIndex = insertIndex - 1;
            }

            newItems.splice(finalInsertIndex, 0, movedItem);
            return { ...col, items: newItems };
          }
          return col;
        });
        return newColumns;
      });
    }

    const updateData = {
      thread_id: thread.id,
      send_at: new Date(
        thread.messages[thread.messages.length - 1].date
      ).toISOString(),
      status: targetColumn.name,
    };

    if (targetColumn.name === "SNOOZED") {
      updateData.snooze_time_in_seconds = 3600;
    }

    try {
      await taskApi.updateStatusTask(updateData);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }

    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
    setTransforms({});
  };

  const handleDragEnd = () => {
    document.removeEventListener("dragover", handleDocumentDragOver);
    document.removeEventListener("drag", handleDocumentDrag);

    if (ghostWrapperRef.current) {
      ghostWrapperRef.current.style.transform =
        "translate3d(-9999px, -9999px, 0)";
    }

    if (draggedItem) {
      setLocalColumns((prev) =>
        prev.map((col) => {
          if (col.id === draggedItem.sourceColumn) {
            return {
              ...col,
              items: col.items.map((t) => {
                const clean = { ...t };
                delete clean.isDragging;
                return clean;
              }),
            };
          }
          return col;
        })
      );
    }

    setDraggedItem(null);
    setDragOverColumn(null);
    setDragOverIndex(null);
    setTransforms({});
  };

  return loading ? (
    <p>loading...</p>
  ) : error ? (
    <p>Error: {error}</p>
  ) : (
    <div
      className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
      onDragEnd={handleDragEnd}
    >
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <Header setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
      <main className="relative z-10 px-6 py-3 h-[calc(100vh-96px)]">
        <div className="w-full max-w-[98%] mx-auto h-full">
          <div className="mb-2 flex justify-end">
            <button
              onClick={handleOpenSnoozeModal}
              className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Bell className="w-5 h-5 group-hover:animate-bounce" />
              <span> Snoozed Emails</span>
            </button>
          </div>
          <div
            className="gap-6 h-full overflow-hidden"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
            }}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={dragOverColumn === column.id}
                draggedOverIndex={dragOverIndex}
                transforms={transforms}
                onLoadMore={handleLoadMore}
                sortConfig={sortConfig}
                onSortChange={handleSortChange}
                filterConfig={filterConfig}
                onFilterChange={handleFilterChange}
              />
            ))}
          </div>
        </div>
      </main>

      {draggedItem && (
        <div
          ref={ghostWrapperRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            transform: `translate3d(${ghostPositionRef.current.x}px, ${ghostPositionRef.current.y}px, 0)`,
            pointerEvents: "none",
            zIndex: 10000,
            width: `${cardWidth.current}px`,
          }}
        >
          <EmailCard
            threadId={draggedItem.thread.id}
            item={
              draggedItem.thread.messages[
                draggedItem.thread.messages.length - 1
              ]
            }
            thread={draggedItem.thread}
            isGhost={true}
          />
        </div>
      )}

      <SnoozeModal
        isOpen={isSnoozeModalOpen}
        onClose={() => setIsSnoozeModalOpen(false)}
        snoozeEmails={snoozeEmails}
        loading={loadingSnooze}
      />
    </div>
  );
}
