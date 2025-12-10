// import React, { useState, useRef } from "react";
// import { Mail, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";
// import EmailCard from "../components/dashboard/EmailCard";
// import Header from "../components/dashboard/Header";
// import { useSelector } from "react-redux";
// const emailTasksInbox = [
//   {
//     threadId: "thread-1",
//     messages: [
//       {
//         messageId: "1",
//         from: "Google Cloud Platform",
//         to: "user@example.com",
//         subject: "Invoice for October 2023 is available",
//         summary:
//           "Hóa đơn dịch vụ Cloud tháng 10. Tổng tiền: $150.00. Cần thanh toán trước ngày 25/11 để tránh gián đoạn dịch vụ.",
//       },
//     ],
//   },
//   {
//     threadId: "thread-2",
//     messages: [
//       {
//         messageId: "2",
//         from: "Nguyễn Văn A (Team Lead)",
//         to: "user@example.com",
//         subject: "Re: Cập nhật tiến độ dự án Mobile App",
//         summary:
//           "Yêu cầu gọi lại bản thiết kế UI mới nhất trước 4h chiều nay để review với khách hàng. Nhắc nhở team fix lỗi API đăng nhập.",
//       },
//     ],
//   },
//   {
//     threadId: "thread-3",
//     messages: [
//       {
//         messageId: "3",
//         from: "Trần Thị B (HR)",
//         to: "user@example.com",
//         subject: "Thông báo: Họp team building tháng 11",
//         summary:
//           "Sự kiện team building dự kiến tổ chức vào cuối tháng 11. Địa điểm: Resort Vũng Tàu. Thời gian: 2 ngày 1 đêm.",
//       },
//     ],
//   },
// ];

// // Danh sách email trong Todo
// const emailTasksTodo = [
//   {
//     threadId: "thread-4",
//     messages: [
//       {
//         messageId: "4",
//         from: "GitHub",
//         to: "user@example.com",
//         subject: "Security alert: New sign-in from Windows device",
//         summary:
//           "Phát hiện đăng nhập mới từ thiết bị Windows tại TP.HCM. Nếu không phải bạn, vui lòng thay đổi mật khẩu ngay.",
//       },
//     ],
//   },
// ];

// // Danh sách email trong Done
// const emailTasksDone = [
//   {
//     threadId: "thread-5",
//     messages: [
//       {
//         messageId: "5",
//         from: "Netflix",
//         to: "user@example.com",
//         subject: "New releases this week - Don't miss out!",
//         summary:
//           "Discover exciting new movies and TV shows added to Netflix this week. Including action, drama and comedy series.",
//       },
//     ],
//   },
// ];
// const initialData = {
//   inbox: {
//     id: "inbox",
//     title: "INBOX",
//     icon: Mail,
//     color: "#ef4444",
//     items: [
//       {
//         id: "1",
//         sender: "Google Cloud Platform",
//         time: "10:30 AM",
//         subject: "Invoice for October 2023 is available",
//         summary:
//           "Hóa đơn dịch vụ Cloud tháng 10. Tổng tiền: $150.00. Cần thanh toán trước ngày 25/11 để tránh gián đoạn dịch vụ.",
//         avatar: "G",
//         avatarBg: "#4285f4",
//       },
//       {
//         id: "2",
//         sender: "Nguyễn Văn A (Team Lead)",
//         time: "09:15 AM",
//         subject: "Re: Cập nhật tiến độ dự án Mobile App",
//         summary:
//           "Yêu cầu gọi lại bản thiết kế UI mới nhất trước 4h chiều nay để review với khách hàng. Nhắc nhở team fix lỗi API đăng nhập.",
//         avatar: "A",
//         avatarBg: "#ef4444",
//       },
//       {
//         id: "3",
//         sender: "Trần Thị B (HR)",
//         time: "08:45 AM",
//         subject: "Thông báo: Họp team building tháng 11",
//         summary:
//           "Sự kiện team building dự kiến tổ chức vào cuối tháng 11. Địa điểm: Resort Vũng Tàu. Thời gian: 2 ngày 1 đêm.",
//         avatar: "B",
//         avatarBg: "#8b5cf6",
//       },
//     ],
//   },
//   todo: {
//     id: "todo",
//     title: "TO DO",
//     icon: Clock,
//     color: "#f59e0b",
//     items: [
//       {
//         id: "4",
//         sender: "GitHub",
//         time: "Yesterday",
//         subject: "Security alert: New sign-in from Windows device",
//         summary:
//           "Phát hiện đăng nhập mới từ thiết bị Windows tại TP.HCM. Nếu không phải bạn, vui lòng thay đổi mật khẩu ngay.",
//         avatar: "G",
//         avatarBg: "#171717",
//       },
//     ],
//   },
//   done: {
//     id: "done",
//     title: "DONE",
//     icon: CheckCircle2,
//     color: "#22c55e",
//     items: [
//       {
//         id: "5",
//         sender: "Netflix",
//         time: "2 days ago",
//         subject: "New releases this week - Don't miss out!",
//         summary:
//           "Discover exciting new movies and TV shows added to Netflix this week. Including action, drama and comedy series.",
//         avatar: "N",
//         avatarBg: "#e50914",
//       },
//     ],
//   },
// };

// function DraggableItem({
//   item,
//   columnId,
//   index,
//   onDragStart,
//   isDragging,
//   transform,
// }) {
//   const itemRef = useRef(null);

//   return (
//     <div
//       ref={itemRef}
//       draggable
//       onDragStart={(e) =>
//         onDragStart(e, item, columnId, index, itemRef.current)
//       }
//       data-item-id={item.id}
//       style={{
//         transform: transform ? `translate3d(0, ${transform}px, 0)` : "none",
//         transition: isDragging
//           ? "none"
//           : "transform 300ms cubic-bezier(0.2, 0, 0, 1)",
//       }}
//     >
//       <EmailCard item={item} isDragging={isDragging} />
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
// }) {
//   const Icon = column.icon;
//   const columnRef = useRef(null);

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
//         {column.items.map((item, index) => (
//           <DraggableItem
//             key={item.id}
//             item={item}
//             columnId={column.id}
//             index={index}
//             onDragStart={onDragStart}
//             isDragging={item.isDragging}
//             transform={transforms[column.id]?.[index] || 0}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function EmailKanbanBoard() {
//   const [columns, setColumns] = useState(initialData);
//   const [draggedItem, setDraggedItem] = useState(null);
//   const ghostPositionRef = useRef({ x: 0, y: 0 });
//   const [dragOverColumn, setDragOverColumn] = useState(null);
//   const [dragOverIndex, setDragOverIndex] = useState(null);
//   const [transforms, setTransforms] = useState({});
//   const cardWidth = useRef(0);
//   const cardHeight = useRef(0);
//   const ghostWrapperRef = useRef(null);
//   const dragOffset = useRef({ x: 0, y: 0 });
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   // const emailTasksInbox = useSelector((state) => state.tasks.emailTasksInbox);
//   // const emailTasksTodo = useSelector((state) => state.tasks.emailTasksTodo);
//   // const emailTasksDone = useSelector((state) => state.tasks.emailTasksDone);

//   const handleDragStart = (e, item, columnId, index, element) => {
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

//     setDraggedItem({ item, sourceColumn: columnId, sourceIndex: index });

//     setColumns((prev) => ({
//       ...prev,
//       [columnId]: {
//         ...prev[columnId],
//         items: prev[columnId].items.map((i, idx) =>
//           idx === index ? { ...i, isDragging: true } : i
//         ),
//       },
//     }));

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

//     const items = columns[columnId].items;
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

//     items.forEach((item, i) => {
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
//       columns[draggedItem.sourceColumn].items.forEach((item, i) => {
//         if (i > draggedItem.sourceIndex) {
//           newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
//         } else {
//           newTransforms[draggedItem.sourceColumn][i] = 0;
//         }
//       });
//     }

//     setTransforms(newTransforms);
//   };

//   const handleDrop = (e, targetColumnId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     document.removeEventListener("dragover", handleDocumentDragOver);
//     document.removeEventListener("drag", handleDocumentDrag);

//     if (!draggedItem) return;

//     const { item, sourceColumn, sourceIndex } = draggedItem;
//     const insertIndex =
//       dragOverIndex !== null
//         ? dragOverIndex
//         : columns[targetColumnId].items.length;

//     setColumns((prev) => {
//       const newColumns = { ...prev };

//       const sourceItems = [...newColumns[sourceColumn].items];
//       sourceItems.splice(sourceIndex, 1);

//       const targetItems =
//         sourceColumn === targetColumnId
//           ? sourceItems
//           : [...newColumns[targetColumnId].items];
//       const cleanItem = { ...item };
//       delete cleanItem.isDragging;

//       const finalIndex =
//         sourceColumn === targetColumnId && insertIndex > sourceIndex
//           ? insertIndex - 1
//           : insertIndex;

//       targetItems.splice(finalIndex, 0, cleanItem);

//       newColumns[sourceColumn] = {
//         ...newColumns[sourceColumn],
//         items: sourceItems,
//       };

//       newColumns[targetColumnId] = {
//         ...newColumns[targetColumnId],
//         items: targetItems,
//       };

//       return newColumns;
//     });

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
//       setColumns((prev) => ({
//         ...prev,
//         [draggedItem.sourceColumn]: {
//           ...prev[draggedItem.sourceColumn],
//           items: prev[draggedItem.sourceColumn].items.map((i) => {
//             const clean = { ...i };
//             delete clean.isDragging;
//             return clean;
//           }),
//         },
//       }));
//     }

//     setDraggedItem(null);
//     setDragOverColumn(null);
//     setDragOverIndex(null);
//     setTransforms({});
//   };

//   return (
//     <div
//       className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
//       onDragEnd={handleDragEnd}
//     >
//       <style jsx>{`
//         /* Custom scrollbar styles */
//         .scrollbar-always::-webkit-scrollbar {
//           width: 8px;
//         }

//         .scrollbar-always::-webkit-scrollbar-track {
//           background: rgba(0, 0, 0, 0.05);
//           border-radius: 10px;
//           margin: 8px 0;
//         }

//         .scrollbar-always::-webkit-scrollbar-thumb {
//           background: linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%);
//           border-radius: 10px;
//           transition: background 0.2s ease;
//         }

//         .scrollbar-always::-webkit-scrollbar-thumb:hover {
//           background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
//         }

//         .scrollbar-always::-webkit-scrollbar-thumb:active {
//           background: linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%);
//         }

//         /* Firefox scrollbar */
//         .scrollbar-always {
//           scrollbar-width: thin;
//           scrollbar-color: #a78bfa rgba(0, 0, 0, 0.05);
//         }
//       `}</style>

//       <div className="fixed inset-0 opacity-30 pointer-events-none">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
//             backgroundSize: "32px 32px",
//           }}
//         />
//       </div>

//       {/* <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
//         <div className="w-full max-w-[1408px] mx-auto px-6 py-4">
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
//               <Mail className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 Email Dashboard
//               </h1>
//               <p className="text-sm text-gray-500">
//                 Manage your inbox with AI-powered insights
//               </p>
//             </div>
//           </div>
//         </div>
//       </header> */}

//       <Header setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
//       <main className="relative z-10 p-6 h-[calc(100vh-96px)]">
//         <div className="w-full max-w-[98%] mx-auto h-full">
//           <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">
//             {Object.values(columns).map((column) => (
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
//           <EmailCard item={draggedItem.item} isGhost={true} />
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState, useRef } from "react";
// import { Mail, Clock, CheckCircle2, MoreHorizontal } from "lucide-react";
// import EmailCard from "../components/dashboard/EmailCard";
// import Header from "../components/dashboard/Header";
// import { useSelector } from "react-redux";
// const emailTasksInbox = [
//   {
//     threadId: "thread-1",
//     messages: [
//       {
//         messageId: "1",
//         from: "Google Cloud Platform",
//         to: "user@example.com",
//         subject: "Invoice for October 2023 is available",
//         summary:
//           "Hóa đơn dịch vụ Cloud tháng 10. Tổng tiền: $150.00. Cần thanh toán trước ngày 25/11 để tránh gián đoạn dịch vụ.",
//       },
//     ],
//   },
//   {
//     threadId: "thread-2",
//     messages: [
//       {
//         messageId: "2",
//         from: "Nguyễn Văn A (Team Lead)",
//         to: "user@example.com",
//         subject: "Re: Cập nhật tiến độ dự án Mobile App",
//         summary:
//           "Yêu cầu gọi lại bản thiết kế UI mới nhất trước 4h chiều nay để review với khách hàng. Nhắc nhở team fix lỗi API đăng nhập.",
//       },
//     ],
//   },
//   {
//     threadId: "thread-3",
//     messages: [
//       {
//         messageId: "3",
//         from: "Trần Thị B (HR)",
//         to: "user@example.com",
//         subject: "Thông báo: Họp team building tháng 11",
//         summary:
//           "Sự kiện team building dự kiến tổ chức vào cuối tháng 11. Địa điểm: Resort Vũng Tàu. Thời gian: 2 ngày 1 đêm.",
//       },
//     ],
//   },
// ];

// // Danh sách email trong Todo
// const emailTasksTodo = [
//   {
//     threadId: "thread-4",
//     messages: [
//       {
//         messageId: "4",
//         from: "GitHub",
//         to: "user@example.com",
//         subject: "Security alert: New sign-in from Windows device",
//         summary:
//           "Phát hiện đăng nhập mới từ thiết bị Windows tại TP.HCM. Nếu không phải bạn, vui lòng thay đổi mật khẩu ngay.",
//       },
//     ],
//   },
// ];

// // Danh sách email trong Done
// const emailTasksDone = [
//   {
//     threadId: "thread-5",
//     messages: [
//       {
//         messageId: "5",
//         from: "Netflix",
//         to: "user@example.com",
//         subject: "New releases this week - Don't miss out!",
//         summary:
//           "Discover exciting new movies and TV shows added to Netflix this week. Including action, drama and comedy series.",
//       },
//     ],
//   },
// ];
// const initialData = {
//   inbox: {
//     id: "inbox",
//     title: "INBOX",
//     icon: Mail,
//     color: "#ef4444",
//     items: emailTasksInbox,
//   },
//   todo: {
//     id: "todo",
//     title: "TO DO",
//     icon: Clock,
//     color: "#f59e0b",
//     items: emailTasksTodo,
//   },
//   done: {
//     id: "done",
//     title: "DONE",
//     icon: CheckCircle2,
//     color: "#22c55e",
//     items: emailTasksDone,
//   },
// };

// function DraggableItem({
//   item,
//   columnId,
//   index,
//   onDragStart,
//   isDragging,
//   transform,
// }) {
//   const itemRef = useRef(null);

//   return (
//     <div
//       ref={itemRef}
//       draggable
//       onDragStart={(e) =>
//         onDragStart(e, item, columnId, index, itemRef.current)
//       }
//       data-item-id={item.id}
//       style={{
//         transform: transform ? `translate3d(0, ${transform}px, 0)` : "none",
//         transition: isDragging
//           ? "none"
//           : "transform 300ms cubic-bezier(0.2, 0, 0, 1)",
//       }}
//     >
//       <EmailCard item={item} isDragging={isDragging} />
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
// }) {
//   const Icon = column.icon;
//   const columnRef = useRef(null);

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
//         {column.items.map((item, index) => (
//           <DraggableItem
//             key={item.id}
//             item={item}
//             columnId={column.id}
//             index={index}
//             onDragStart={onDragStart}
//             isDragging={item.isDragging}
//             transform={transforms[column.id]?.[index] || 0}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function EmailKanbanBoard() {
//   const [columns, setColumns] = useState(initialData);
//   const [draggedItem, setDraggedItem] = useState(null);
//   const ghostPositionRef = useRef({ x: 0, y: 0 });
//   const [dragOverColumn, setDragOverColumn] = useState(null);
//   const [dragOverIndex, setDragOverIndex] = useState(null);
//   const [transforms, setTransforms] = useState({});
//   const cardWidth = useRef(0);
//   const cardHeight = useRef(0);
//   const ghostWrapperRef = useRef(null);
//   const dragOffset = useRef({ x: 0, y: 0 });
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
//   // const emailTasksInbox = useSelector((state) => state.tasks.emailTasksInbox);
//   // const emailTasksTodo = useSelector((state) => state.tasks.emailTasksTodo);
//   // const emailTasksDone = useSelector((state) => state.tasks.emailTasksDone);

//   const handleDragStart = (e, item, columnId, index, element) => {
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

//     setDraggedItem({ item, sourceColumn: columnId, sourceIndex: index });

//     setColumns((prev) => ({
//       ...prev,
//       [columnId]: {
//         ...prev[columnId],
//         items: prev[columnId].items.map((i, idx) =>
//           idx === index ? { ...i, isDragging: true } : i
//         ),
//       },
//     }));

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

//     const items = columns[columnId].items;
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

//     items.forEach((item, i) => {
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
//       columns[draggedItem.sourceColumn].items.forEach((item, i) => {
//         if (i > draggedItem.sourceIndex) {
//           newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
//         } else {
//           newTransforms[draggedItem.sourceColumn][i] = 0;
//         }
//       });
//     }

//     setTransforms(newTransforms);
//   };

//   const handleDrop = (e, targetColumnId) => {
//     e.preventDefault();
//     e.stopPropagation();

//     document.removeEventListener("dragover", handleDocumentDragOver);
//     document.removeEventListener("drag", handleDocumentDrag);

//     if (!draggedItem) return;

//     const { item, sourceColumn, sourceIndex } = draggedItem;
//     const insertIndex =
//       dragOverIndex !== null
//         ? dragOverIndex
//         : columns[targetColumnId].items.length;

//     setColumns((prev) => {
//       const newColumns = { ...prev };

//       const sourceItems = [...newColumns[sourceColumn].items];
//       sourceItems.splice(sourceIndex, 1);

//       const targetItems =
//         sourceColumn === targetColumnId
//           ? sourceItems
//           : [...newColumns[targetColumnId].items];
//       const cleanItem = { ...item };
//       delete cleanItem.isDragging;

//       const finalIndex =
//         sourceColumn === targetColumnId && insertIndex > sourceIndex
//           ? insertIndex - 1
//           : insertIndex;

//       targetItems.splice(finalIndex, 0, cleanItem);

//       newColumns[sourceColumn] = {
//         ...newColumns[sourceColumn],
//         items: sourceItems,
//       };

//       newColumns[targetColumnId] = {
//         ...newColumns[targetColumnId],
//         items: targetItems,
//       };

//       return newColumns;
//     });

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
//       setColumns((prev) => ({
//         ...prev,
//         [draggedItem.sourceColumn]: {
//           ...prev[draggedItem.sourceColumn],
//           items: prev[draggedItem.sourceColumn].items.map((i) => {
//             const clean = { ...i };
//             delete clean.isDragging;
//             return clean;
//           }),
//         },
//       }));
//     }

//     setDraggedItem(null);
//     setDragOverColumn(null);
//     setDragOverIndex(null);
//     setTransforms({});
//   };

//   return (
//     <div
//       className="h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
//       onDragEnd={handleDragEnd}
//     >
//       <style jsx>{`
//         /* Custom scrollbar styles */

//       `}</style>

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
//       <main className="relative z-10 p-6 h-[calc(100vh-96px)]">
//         <div className="w-full max-w-[98%] mx-auto h-full">
//           <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">
//             {Object.values(columns).map((column) => (
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
//           <EmailCard item={draggedItem.item} isGhost={true} />
//         </div>
//       )}
//     </div>
//   );
// }

// const emailTasksInbox = [
//   {
//     threadId: "thread-1",
//     messages: [
//       {
//         messageId: "1",
//         from: "Google Cloud Platform aaa",
//         to: "user@example.com",
//         subject: "Invoice for October 2023 is available",
//         summary:
//           "Hóa đơn dịch vụ Cloud tháng 10. Tổng tiền: $150.00. Cần thanh toán trước ngày 25/11 để tránh gián đoạn dịch vụ.",
//         date: "10:30 AM",
//       },
//       {
//         messageId: "10",
//         from: "Google Cloud Platform bbb",
//         to: "user@example.com",
//         subject: "Invoice for October 2023 is available",
//         summary:
//           "Hóa đơn dịch vụ Cloud tháng 10. Tổng tiền: $150.00. Cần thanh toán trước ngày 25/11 để tránh gián đoạn dịch vụ.",
//         date: "10:30 AM",
//       },
//     ],
//   },
//   {
//     threadId: "thread-2",
//     messages: [
//       {
//         messageId: "2",
//         from: "Nguyễn Văn A (Team Lead)",
//         to: "user@example.com",
//         subject: "Re: Cập nhật tiến độ dự án Mobile App",
//         summary:
//           "Yêu cầu gọi lại bản thiết kế UI mới nhất trước 4h chiều nay để review với khách hàng. Nhắc nhở team fix lỗi API đăng nhập.",
//         date: "9:15 AM",
//       },
//     ],
//   },
//   {
//     threadId: "thread-3",
//     messages: [
//       {
//         messageId: "3",
//         from: "Trần Thị B (HR)",
//         to: "user@example.com",
//         subject: "Thông báo: Họp team building tháng 11",
//         summary:
//           "Sự kiện team building dự kiến tổ chức vào cuối tháng 11. Địa điểm: Resort Vũng Tàu. Thời gian: 2 ngày 1 đêm.",
//         date: "Yesterday",
//       },
//     ],
//   },
// ];

// const emailTasksTodo = [
//   {
//     threadId: "thread-4",
//     messages: [
//       {
//         messageId: "4",
//         from: "GitHub",
//         to: "user@example.com",
//         subject: "Security alert: New sign-in from Windows device",
//         summary:
//           "Phát hiện đăng nhập mới từ thiết bị Windows tại TP.HCM. Nếu không phải bạn, vui lòng thay đổi mật khẩu ngay.",
//         date: "2 days ago",
//       },
//     ],
//   },
// ];

// const emailTasksDone = [
//   {
//     threadId: "thread-5",
//     messages: [
//       {
//         messageId: "5",
//         from: "Netflix",
//         to: "user@example.com",
//         subject: "New releases this week - Don't miss out!",
//         summary:
//           "Discover exciting new movies and TV shows added to Netflix this week. Including action, drama and comedy series.",
//         date: "3 days ago",
//       },
//     ],
//   },
// ];

import React, { useState, useRef, useEffect } from "react";
import { Mail, Clock, CheckCircle2, MoreHorizontal, Bell } from "lucide-react";
import EmailCard from "../components/dashboard/EmailCard";
import Header from "../components/dashboard/Header";
import { useSelector } from "react-redux";
import useGetAllTasks from "../hooks/useFetchTask";
import taskApi from "../services/taskApi";
import SnoozeModal from "../components/modal/SnoozeModal";

function DraggableItem({
  thread,
  columnId,
  index,
  onDragStart,
  isDragging,
  transform,
}) {
  const itemRef = useRef(null);

  // Lấy message cuối cùng để hiển thị
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
        transition: isDragging
          ? "none"
          : "transform 300ms cubic-bezier(0.2, 0, 0, 1)",
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
}) {
  const Icon = column.icon;
  const columnRef = useRef(null);

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
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
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
      </div>
    </div>
  );
}

export default function EmailKanbanBoard() {
  // const temp = useSelector((state) => state.threads.allThreadsState);

  const [draggedItem, setDraggedItem] = useState(null);
  const ghostPositionRef = useRef({ x: 0, y: 0 });
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [transforms, setTransforms] = useState({});
  const cardWidth = useRef(0);
  const cardHeight = useRef(0);
  const ghostWrapperRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const emailTasksInbox = useSelector((state) => state.tasks.emailTasksInbox);
  const emailTasksTodo = useSelector((state) => state.tasks.emailTasksTodo);
  const emailTasksDone = useSelector((state) => state.tasks.emailTasksDone);
  console.log("Inbox tasks:", emailTasksInbox);
  // const initialData = {
  //   inbox: {
  //     id: "inbox",
  //     title: "INBOX",
  //     icon: Mail,
  //     color: "#ef4444",
  //     items: emailTasksInbox,
  //   },
  //   todo: {
  //     id: "to-do",
  //     title: "TO DO",
  //     icon: Clock,
  //     color: "#f59e0b",
  //     items: emailTasksTodo,
  //   },
  //   done: {
  //     id: "done",
  //     title: "DONE",
  //     icon: CheckCircle2,
  //     color: "#22c55e",
  //     items: emailTasksDone,
  //   },
  // };
  const [columns, setColumns] = useState({
    inbox: {
      id: "inbox",
      title: "INBOX",
      icon: Mail,
      color: "#ef4444",
      items: [],
    },
    todo: {
      id: "todo",
      title: "TO DO",
      icon: Clock,
      color: "#f59e0b",
      items: [],
    },
    done: {
      id: "done",
      title: "DONE",
      icon: CheckCircle2,
      color: "#22c55e",
      items: [],
    },
  });

  // Chỉ load data từ Redux một lần khi component mount
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (
      !isInitializedRef.current &&
      (emailTasksInbox.length > 0 ||
        emailTasksTodo.length > 0 ||
        emailTasksDone.length > 0)
    ) {
      setColumns((prev) => ({
        ...prev,
        inbox: { ...prev.inbox, items: emailTasksInbox },
        todo: { ...prev.todo, items: emailTasksTodo },
        done: { ...prev.done, items: emailTasksDone },
      }));
      isInitializedRef.current = true;
    }
  }, [emailTasksInbox, emailTasksTodo, emailTasksDone]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { fetchAllTasks, loading, error } = useGetAllTasks();
  // const loading = false;
  // const error = false;

  // Snooze modal state
  const [isSnoozeModalOpen, setIsSnoozeModalOpen] = useState(false);
  const [snoozeEmails, setSnoozeEmails] = useState([]);
  const [loadingSnooze, setLoadingSnooze] = useState(false);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleOpenSnoozeModal = async () => {
    setIsSnoozeModalOpen(true);
    setLoadingSnooze(true);
    try {
      const response = await taskApi.getTaskSnooze();
      // Helper function to add summary to last message of each thread
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

    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map((t, idx) =>
          idx === index ? { ...t, isDragging: true } : t
        ),
      },
    }));

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

    const items = columns[columnId].items;
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
      columns[draggedItem.sourceColumn].items.forEach((thread, i) => {
        if (i > draggedItem.sourceIndex) {
          newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
        } else {
          newTransforms[draggedItem.sourceColumn][i] = 0;
        }
      });
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

    const insertIndex =
      dragOverIndex !== null
        ? dragOverIndex
        : columns[targetColumnId].items.length;

    setColumns((prev) => {
      const newColumns = { ...prev };

      const sourceItems = [...newColumns[sourceColumn].items];
      sourceItems.splice(sourceIndex, 1);

      const targetItems =
        sourceColumn === targetColumnId
          ? sourceItems
          : [...newColumns[targetColumnId].items];
      const cleanThread = { ...thread };
      delete cleanThread.isDragging;

      const finalIndex =
        sourceColumn === targetColumnId && insertIndex > sourceIndex
          ? insertIndex - 1
          : insertIndex;

      targetItems.splice(finalIndex, 0, cleanThread);

      newColumns[sourceColumn] = {
        ...newColumns[sourceColumn],
        items: sourceItems,
      };

      newColumns[targetColumnId] = {
        ...newColumns[targetColumnId],
        items: targetItems,
      };

      return newColumns;
    });

    // Prepare data for API
    const updateData = {
      thread_id: thread.id,
      send_at: new Date(
        thread.messages[thread.messages.length - 1].date
      ).toISOString(),
      status: targetColumnId.toUpperCase(),
    };

    // If moving to SNOOZED column, add default snooze time (1 hour)
    if (targetColumnId.toUpperCase() === "SNOOZED") {
      updateData.snooze_time_in_seconds = 3600; // Default 1 hour
    }

    await taskApi.updateStatusTask(updateData);
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
      setColumns((prev) => ({
        ...prev,
        [draggedItem.sourceColumn]: {
          ...prev[draggedItem.sourceColumn],
          items: prev[draggedItem.sourceColumn].items.map((t) => {
            const clean = { ...t };
            delete clean.isDragging;
            return clean;
          }),
        },
      }));
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
      <main className="relative z-10 p-6 h-[calc(100vh-96px)]">
        <div className="w-full max-w-[98%] mx-auto h-full">
          {/* Snooze Button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleOpenSnoozeModal}
              className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Bell className="w-5 h-5 group-hover:animate-bounce" />
              <span>View Snoozed Emails</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 h-full overflow-hidden">
            {Object.values(columns).map((column) => (
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

      {/* Snooze Modal */}
      <SnoozeModal
        isOpen={isSnoozeModalOpen}
        onClose={() => setIsSnoozeModalOpen(false)}
        snoozeEmails={snoozeEmails}
        loading={loadingSnooze}
      />
    </div>
  );
}
