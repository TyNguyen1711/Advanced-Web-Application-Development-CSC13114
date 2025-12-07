// import React, { useState } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   closestCorners,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   useDroppable,
// } from "@dnd-kit/core";
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
//   useSortable,
// } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import {
//   Mail,
//   Clock,
//   CheckCircle2,
//   Sparkles,
//   ExternalLink,
//   Bell,
//   MoreHorizontal,
// } from "lucide-react";

// // Initial data
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

// // Email Card Component
// function EmailCard({ item, isDragging, isOverlay }) {
//   return (
//     <div
//       className={`
//         group relative bg-white rounded-2xl p-5
//         transition-all duration-300 ease-out
//         ${isDragging ? "opacity-40 scale-[0.98]" : ""}
//         ${
//           isOverlay
//             ? "shadow-2xl shadow-black/20 rotate-[2deg] scale-105"
//             : "shadow-sm hover:shadow-xl hover:shadow-black/10"
//         }
//         border border-gray-100 hover:border-gray-200
//       `}
//     >
//       {/* Header */}
//       <div className="flex items-start gap-3 mb-4">
//         <div
//           className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-lg"
//           style={{ backgroundColor: item.avatarBg }}
//         >
//           {item.avatar}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between gap-2">
//             <h4 className="font-semibold text-gray-900 text-sm truncate">
//               {item.sender}
//             </h4>
//             <span className="text-xs text-gray-400 whitespace-nowrap">
//               {item.time}
//             </span>
//           </div>
//           <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-1">
//             {item.subject}
//           </p>
//         </div>
//       </div>

//       {/* AI Summary */}
//       <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
//         <div className="flex items-center gap-2 mb-2">
//           <Sparkles className="w-3.5 h-3.5 text-violet-500" />
//           <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
//             AI Summary
//           </span>
//         </div>
//         <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
//           {item.summary}
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
//         <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-amber-500 transition-colors">
//           <Bell className="w-3.5 h-3.5" />
//           <span>Snooze</span>
//         </button>
//         <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors">
//           <span>Open Mail</span>
//           <ExternalLink className="w-3.5 h-3.5" />
//         </button>
//       </div>

//       {/* Drag Handle Indicator */}
//       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
//         <MoreHorizontal className="w-4 h-4 text-gray-300" />
//       </div>
//     </div>
//   );
// }

// // Sortable Email Card Wrapper
// function SortableEmailCard({ item }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: item.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <EmailCard item={item} isDragging={isDragging} />
//     </div>
//   );
// }

// // Column Component
// function Column({ column, children }) {
//   const { setNodeRef, isOver } = useDroppable({ id: column.id });
//   const Icon = column.icon;

//   return (
//     <div className="flex flex-col min-w-[380px] max-w-[380px]">
//       {/* Column Header */}
//       <div className="flex items-center justify-between mb-4 px-1">
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

//       {/* Cards Container */}
//       <div
//         ref={setNodeRef}
//         className={`
//           flex-1 rounded-2xl p-3 space-y-3 min-h-[500px]
//           transition-all duration-300 ease-out
//           ${
//             isOver
//               ? "bg-blue-50 ring-2 ring-blue-200 ring-inset"
//               : "bg-gray-50/50"
//           }
//         `}
//       >
//         <SortableContext
//           items={column.items.map((i) => i.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           {children}
//         </SortableContext>
//       </div>
//     </div>
//   );
// }

// // Main Kanban Board Component
// export default function EmailKanbanBoard() {
//   const [columns, setColumns] = useState(initialData);
//   const [activeId, setActiveId] = useState(null);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 8,
//       },
//     }),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const findColumn = (id) => {
//     if (id in columns) return id;
//     for (const [columnId, column] of Object.entries(columns)) {
//       if (column.items.find((item) => item.id === id)) {
//         return columnId;
//       }
//     }
//     return null;
//   };

//   const findItem = (id) => {
//     for (const column of Object.values(columns)) {
//       const item = column.items.find((i) => i.id === id);
//       if (item) return item;
//     }
//     return null;
//   };

//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragOver = (event) => {
//     const { active, over } = event;
//     if (!over) return;

//     const activeColumn = findColumn(active.id);
//     const overColumn = findColumn(over.id);

//     if (!activeColumn || !overColumn || activeColumn === overColumn) return;

//     setColumns((prev) => {
//       const activeItems = [...prev[activeColumn].items];
//       const overItems = [...prev[overColumn].items];
//       const activeIndex = activeItems.findIndex((i) => i.id === active.id);
//       const overIndex =
//         over.id in prev
//           ? overItems.length
//           : overItems.findIndex((i) => i.id === over.id);

//       const [movedItem] = activeItems.splice(activeIndex, 1);
//       overItems.splice(overIndex, 0, movedItem);

//       return {
//         ...prev,
//         [activeColumn]: { ...prev[activeColumn], items: activeItems },
//         [overColumn]: { ...prev[overColumn], items: overItems },
//       };
//     });
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     setActiveId(null);

//     if (!over) return;

//     const activeColumn = findColumn(active.id);
//     const overColumn = findColumn(over.id);

//     if (!activeColumn || !overColumn) return;

//     if (activeColumn === overColumn) {
//       const column = columns[activeColumn];
//       const oldIndex = column.items.findIndex((i) => i.id === active.id);
//       const newIndex = column.items.findIndex((i) => i.id === over.id);

//       if (oldIndex !== newIndex) {
//         setColumns((prev) => ({
//           ...prev,
//           [activeColumn]: {
//             ...prev[activeColumn],
//             items: arrayMove(prev[activeColumn].items, oldIndex, newIndex),
//           },
//         }));
//       }
//     }
//   };

//   const activeItem = activeId ? findItem(activeId) : null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100">
//       {/* Background Pattern */}
//       <div className="fixed inset-0 opacity-30 pointer-events-none">
//         <div
//           className="absolute inset-0"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)`,
//             backgroundSize: "32px 32px",
//           }}
//         />
//       </div>

//       {/* Header */}
//       <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
//         <div className="max-w-7xl mx-auto px-6 py-4">
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
//       </header>

//       {/* Kanban Board */}
//       <main className="relative z-10 p-6">
//         <div className="max-w-7xl mx-auto">
//           <DndContext
//             sensors={sensors}
//             collisionDetection={closestCorners}
//             onDragStart={handleDragStart}
//             onDragOver={handleDragOver}
//             onDragEnd={handleDragEnd}
//           >
//             <div className="flex gap-6 overflow-x-auto pb-6">
//               {Object.values(columns).map((column) => (
//                 <Column key={column.id} column={column}>
//                   {column.items.map((item) => (
//                     <SortableEmailCard key={item.id} item={item} />
//                   ))}
//                 </Column>
//               ))}
//             </div>

//             <DragOverlay
//               dropAnimation={{
//                 duration: 300,
//                 easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
//               }}
//             >
//               {activeItem ? <EmailCard item={activeItem} isOverlay /> : null}
//             </DragOverlay>
//           </DndContext>
//         </div>
//       </main>
//     </div>
//   );
// }

// import React, { useState, useRef } from "react";
// import {
//   Mail,
//   Clock,
//   CheckCircle2,
//   Sparkles,
//   ExternalLink,
//   Bell,
//   MoreHorizontal,
// } from "lucide-react";

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

// function EmailCard({ item, isDragging, isGhost, style }) {
//   return (
//     <div
//       className={`
//         group relative bg-white rounded-2xl p-5
//         cursor-grab active:cursor-grabbing
//         ${isDragging && !isGhost ? "opacity-0 scale-95" : ""}
//         ${
//           isGhost
//             ? "shadow-2xl shadow-black/30 rotate-2 scale-105 pointer-events-none"
//             : "shadow-sm hover:shadow-xl hover:shadow-black/10 transition-all duration-300 ease-out"
//         }
//         border border-gray-100 hover:border-gray-200
//       `}
//       style={
//         isGhost
//           ? {
//               width: "100%",
//               opacity: 0.95,
//               willChange: "transform",
//               pointerEvents: "none",
//             }
//           : style
//       }
//     >
//       <div className="flex items-start gap-3 mb-4">
//         <div
//           className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-lg"
//           style={{ backgroundColor: item.avatarBg }}
//         >
//           {item.avatar}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between gap-2">
//             <h4 className="font-semibold text-gray-900 text-sm truncate">
//               {item.sender}
//             </h4>
//             <span className="text-xs text-gray-400 whitespace-nowrap">
//               {item.time}
//             </span>
//           </div>
//           <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-1">
//             {item.subject}
//           </p>
//         </div>
//       </div>

//       <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
//         <div className="flex items-center gap-2 mb-2">
//           <Sparkles className="w-3.5 h-3.5 text-violet-500" />
//           <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
//             AI Summary
//           </span>
//         </div>
//         <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
//           {item.summary}
//         </p>
//       </div>

//       <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
//         <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-amber-500 transition-colors">
//           <Bell className="w-3.5 h-3.5" />
//           <span>Snooze</span>
//         </button>
//         <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors">
//           <span>Open Mail</span>
//           <ExternalLink className="w-3.5 h-3.5" />
//         </button>
//       </div>

//       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
//         <MoreHorizontal className="w-4 h-4 text-gray-300" />
//       </div>
//     </div>
//   );
// }

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
//     <div className="flex flex-col min-w-[380px] max-w-[380px]">
//       <div className="flex items-center justify-between mb-4 px-1">
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
//           flex-1 rounded-2xl p-3 space-y-3 min-h-[500px]
//           transition-all duration-300 ease-out
//           ${
//             isDragOver
//               ? "bg-blue-50 ring-2 ring-blue-200 ring-inset"
//               : "bg-gray-50/50"
//           }
//         `}
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
//       className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
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

//       <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
//         <div className="max-w-7xl mx-auto px-6 py-4">
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
//       </header>

//       <main className="relative z-10 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex gap-6 overflow-x-auto pb-6">
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
import React, { useState, useRef } from "react";
import {
  Mail,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Bell,
  MoreHorizontal,
} from "lucide-react";

const initialData = {
  inbox: {
    id: "inbox",
    title: "INBOX",
    icon: Mail,
    color: "#ef4444",
    items: [
      {
        id: "1",
        sender: "Google Cloud Platform",
        time: "10:30 AM",
        subject: "Invoice for October 2023 is available",
        summary:
          "Hóa đơn dịch vụ Cloud tháng 10. Tổng tiền: $150.00. Cần thanh toán trước ngày 25/11 để tránh gián đoạn dịch vụ.",
        avatar: "G",
        avatarBg: "#4285f4",
      },
      {
        id: "2",
        sender: "Nguyễn Văn A (Team Lead)",
        time: "09:15 AM",
        subject: "Re: Cập nhật tiến độ dự án Mobile App",
        summary:
          "Yêu cầu gọi lại bản thiết kế UI mới nhất trước 4h chiều nay để review với khách hàng. Nhắc nhở team fix lỗi API đăng nhập.",
        avatar: "A",
        avatarBg: "#ef4444",
      },
      {
        id: "3",
        sender: "Trần Thị B (HR)",
        time: "08:45 AM",
        subject: "Thông báo: Họp team building tháng 11",
        summary:
          "Sự kiện team building dự kiến tổ chức vào cuối tháng 11. Địa điểm: Resort Vũng Tàu. Thời gian: 2 ngày 1 đêm.",
        avatar: "B",
        avatarBg: "#8b5cf6",
      },
    ],
  },
  todo: {
    id: "todo",
    title: "TO DO",
    icon: Clock,
    color: "#f59e0b",
    items: [
      {
        id: "4",
        sender: "GitHub",
        time: "Yesterday",
        subject: "Security alert: New sign-in from Windows device",
        summary:
          "Phát hiện đăng nhập mới từ thiết bị Windows tại TP.HCM. Nếu không phải bạn, vui lòng thay đổi mật khẩu ngay.",
        avatar: "G",
        avatarBg: "#171717",
      },
    ],
  },
  done: {
    id: "done",
    title: "DONE",
    icon: CheckCircle2,
    color: "#22c55e",
    items: [
      {
        id: "5",
        sender: "Netflix",
        time: "2 days ago",
        subject: "New releases this week - Don't miss out!",
        summary:
          "Discover exciting new movies and TV shows added to Netflix this week. Including action, drama and comedy series.",
        avatar: "N",
        avatarBg: "#e50914",
      },
    ],
  },
};

function EmailCard({ item, isDragging, isGhost, style }) {
  return (
    <div
      className={`
        group relative bg-white rounded-2xl p-5
        cursor-grab active:cursor-grabbing
        ${isDragging && !isGhost ? "opacity-0 scale-95" : ""}
        ${
          isGhost
            ? "shadow-2xl shadow-black/30 rotate-2 scale-105 pointer-events-none"
            : "shadow-sm hover:shadow-xl hover:shadow-black/10 transition-all duration-300 ease-out"
        }
        border border-gray-100 hover:border-gray-200
      `}
      style={
        isGhost
          ? {
              width: "100%",
              opacity: 0.95,
              willChange: "transform",
              pointerEvents: "none",
            }
          : style
      }
    >
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-lg"
          style={{ backgroundColor: item.avatarBg }}
        >
          {item.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {item.sender}
            </h4>
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {item.time}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-1">
            {item.subject}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">
            AI Summary
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {item.summary}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-amber-500 transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <span>Snooze</span>
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors">
          <span>Open Mail</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-4 h-4 text-gray-300" />
      </div>
    </div>
  );
}

function DraggableItem({
  item,
  columnId,
  index,
  onDragStart,
  isDragging,
  transform,
}) {
  const itemRef = useRef(null);

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={(e) =>
        onDragStart(e, item, columnId, index, itemRef.current)
      }
      data-item-id={item.id}
      style={{
        transform: transform ? `translate3d(0, ${transform}px, 0)` : "none",
        transition: isDragging
          ? "none"
          : "transform 300ms cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <EmailCard item={item} isDragging={isDragging} />
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
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
          flex-1 rounded-2xl p-3 space-y-3 overflow-y-auto
          transition-all duration-300 ease-out
          ${
            isDragOver
              ? "bg-blue-50 ring-2 ring-blue-200 ring-inset"
              : "bg-gray-50/50"
          }
        `}
        onDragOver={(e) => onDragOver(e, column.id, columnRef.current)}
        onDragEnter={(e) => onDragEnter(e, column.id)}
        onDrop={(e) => onDrop(e, column.id)}
      >
        {column.items.map((item, index) => (
          <DraggableItem
            key={item.id}
            item={item}
            columnId={column.id}
            index={index}
            onDragStart={onDragStart}
            isDragging={item.isDragging}
            transform={transforms[column.id]?.[index] || 0}
          />
        ))}
      </div>
    </div>
  );
}

export default function EmailKanbanBoard() {
  const [columns, setColumns] = useState(initialData);
  const [draggedItem, setDraggedItem] = useState(null);
  const ghostPositionRef = useRef({ x: 0, y: 0 });
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [transforms, setTransforms] = useState({});
  const cardWidth = useRef(0);
  const cardHeight = useRef(0);
  const ghostWrapperRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleDragStart = (e, item, columnId, index, element) => {
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

    setDraggedItem({ item, sourceColumn: columnId, sourceIndex: index });

    setColumns((prev) => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        items: prev[columnId].items.map((i, idx) =>
          idx === index ? { ...i, isDragging: true } : i
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

    items.forEach((item, i) => {
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
      columns[draggedItem.sourceColumn].items.forEach((item, i) => {
        if (i > draggedItem.sourceIndex) {
          newTransforms[draggedItem.sourceColumn][i] = -itemHeight;
        } else {
          newTransforms[draggedItem.sourceColumn][i] = 0;
        }
      });
    }

    setTransforms(newTransforms);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    e.stopPropagation();

    document.removeEventListener("dragover", handleDocumentDragOver);
    document.removeEventListener("drag", handleDocumentDrag);

    if (!draggedItem) return;

    const { item, sourceColumn, sourceIndex } = draggedItem;
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
      const cleanItem = { ...item };
      delete cleanItem.isDragging;

      const finalIndex =
        sourceColumn === targetColumnId && insertIndex > sourceIndex
          ? insertIndex - 1
          : insertIndex;

      targetItems.splice(finalIndex, 0, cleanItem);

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
          items: prev[draggedItem.sourceColumn].items.map((i) => {
            const clean = { ...i };
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

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100"
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

      <header className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0">
        <div className="w-full max-w-[1408px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Email Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage your inbox with AI-powered insights
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-6 h-[calc(100vh-88px)]">
        <div className="w-full max-w-[1500px] mx-auto h-full">
          <div className="grid grid-cols-3 gap-6 h-full">
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
          <EmailCard item={draggedItem.item} isGhost={true} />
        </div>
      )}
    </div>
  );
}
