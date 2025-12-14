# Kanban Board - Hướng Dẫn Sử Dụng

## Cấu Trúc Redux Store Mới

### State Structure

```javascript
{
  tasks: {
    // Danh sách các loại list type
    listTypes: ["INBOX", "TODO", "DONE"],

    // Danh sách mails cho mỗi type
    mails: [
      {
        name: "INBOX",              // Tên type (uppercase)
        nextPageToken: "abc123",    // Token cho pagination
        threads: [...],             // Array các thread/email
        loading: false,             // Trạng thái loading
        hasMore: true,              // Còn data để load không
        error: null                 // Error message nếu có
      },
      {
        name: "TODO",
        nextPageToken: null,
        threads: [...],
        loading: false,
        hasMore: false,
        error: null
      },
      // ...
    ]
  }
}
```

## Các Actions Có Sẵn

### 1. `setThreadsForType` - Set threads cho một type (replace toàn bộ)

```javascript
import { setThreadsForType } from './redux/taskSlice';

dispatch(setThreadsForType({
  typeName: "INBOX",
  threads: [...],
  nextPageToken: "abc123"
}));
```

### 2. `appendThreadsForType` - Thêm threads (dùng cho infinity scroll)

```javascript
import { appendThreadsForType } from './redux/taskSlice';

dispatch(appendThreadsForType({
  typeName: "TODO",
  threads: [...],
  nextPageToken: "xyz789"
}));
```

### 3. `setLoadingForType` - Set loading state

```javascript
import { setLoadingForType } from "./redux/taskSlice";

dispatch(
  setLoadingForType({
    typeName: "DONE",
    loading: true,
  })
);
```

### 4. `setErrorForType` - Set error

```javascript
import { setErrorForType } from "./redux/taskSlice";

dispatch(
  setErrorForType({
    typeName: "INBOX",
    error: "Failed to load emails",
  })
);
```

### 5. `addNewListType` - Thêm type mới

```javascript
import { addNewListType } from "./redux/taskSlice";

dispatch(
  addNewListType({
    typeName: "URGENT",
    icon: AlertCircle,
    color: "#dc2626",
  })
);
```

### 6. `removeListType` - Xóa type

```javascript
import { removeListType } from "./redux/taskSlice";

dispatch(removeListType("URGENT"));
```

### 7. `moveThreadBetweenTypes` - Di chuyển thread giữa các types

```javascript
import { moveThreadBetweenTypes } from "./redux/taskSlice";

dispatch(
  moveThreadBetweenTypes({
    fromType: "INBOX",
    toType: "DONE",
    threadId: "thread-123",
  })
);
```

### 8. `updateThreadInType` - Update thread cụ thể

```javascript
import { updateThreadInType } from "./redux/taskSlice";

dispatch(
  updateThreadInType({
    typeName: "TODO",
    threadId: "thread-123",
    updatedThread: {
      /* updated data */
    },
  })
);
```

### 9. `resetAllTasks` - Reset tất cả

```javascript
import { resetAllTasks } from "./redux/taskSlice";

dispatch(resetAllTasks());
```

## Infinity Scroll

Infinity scroll được tự động kích hoạt khi user scroll đến cuối danh sách trong mỗi column. Nó sẽ:

1. Kiểm tra `hasMore` và `loading` state
2. Nếu `hasMore = true` và `loading = false`, gọi API với `nextPageToken`
3. Append data mới vào danh sách hiện tại

**Không cần làm gì thêm!** Infinity scroll đã được tích hợp sẵn trong `Column` component.

## Cách Thêm Type Mới

### Cách 1: Sử dụng Helper Function (Khuyến nghị)

```javascript
import { useDispatch } from "react-redux";
import { addNewKanbanType, AVAILABLE_TYPES } from "./utils/kanbanHelpers";

function MyComponent() {
  const dispatch = useDispatch();

  const handleAddUrgentColumn = () => {
    addNewKanbanType(dispatch, "URGENT", AVAILABLE_TYPES.URGENT);
  };

  return <button onClick={handleAddUrgentColumn}>Add Urgent Column</button>;
}
```

### Cách 2: Direct Dispatch

```javascript
import { useDispatch } from "react-redux";
import { addNewListType } from "./redux/taskSlice";
import { AlertCircle } from "lucide-react";

function MyComponent() {
  const dispatch = useDispatch();

  const handleAddCustomColumn = () => {
    dispatch(
      addNewListType({
        typeName: "CUSTOM_TYPE",
        icon: AlertCircle,
        color: "#9333ea", // purple-600
      })
    );
  };

  return <button onClick={handleAddCustomColumn}>Add Custom Column</button>;
}
```

### Các Type Có Sẵn

File `utils/kanbanHelpers.js` cung cấp sẵn các type sau:

- **URGENT** - 🔴 Emails khẩn cấp
- **ARCHIVED** - 📦 Emails đã lưu trữ
- **STARRED** - ⭐ Emails quan trọng
- **TRASH** - 🗑️ Thùng rác

## API Integration

### taskApi

```javascript
// Get tasks cho INBOX với pagination
await taskApi.getTaskInbox(pageToken);

// Get tasks theo status với pagination
await taskApi.getTaskOfStatus("TODO", pageToken);

// Generic function cho bất kỳ type nào
await taskApi.getTasksByType("URGENT", pageToken);

// Update status
await taskApi.updateStatusTask({
  thread_id: "123",
  send_at: "2025-12-14T10:00:00Z",
  status: "DONE",
});
```

## Custom Hook

### useFetchTask

```javascript
import useGetAllTasks from "./hooks/useFetchTask";

function MyComponent() {
  const {
    fetchAllTasks, // Fetch tất cả types
    fetchTasksForType, // Fetch một type cụ thể
    refreshTasksForType, // Refresh một type
    loading,
    error,
  } = useGetAllTasks();

  useEffect(() => {
    fetchAllTasks();
  }, []);

  // Load more cho infinity scroll
  const handleLoadMore = (typeName, pageToken) => {
    fetchTasksForType(typeName, pageToken);
  };

  // Refresh
  const handleRefresh = (typeName) => {
    refreshTasksForType(typeName);
  };
}
```

## Ví Dụ Thực Tế

### 1. Thêm Button "Add Column" vào KanpanPage

```jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewKanbanType,
  AVAILABLE_TYPES,
  getAvailableTypesToAdd,
} from "../utils/kanbanHelpers";

function AddColumnButton() {
  const dispatch = useDispatch();
  const listTypes = useSelector((state) => state.tasks.listTypes);
  const availableTypes = getAvailableTypesToAdd(listTypes);

  const [showMenu, setShowMenu] = useState(false);

  const handleAddType = (typeKey) => {
    addNewKanbanType(dispatch, typeKey, AVAILABLE_TYPES[typeKey]);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        + Add Column
      </button>

      {showMenu && (
        <div className="absolute mt-2 bg-white shadow-lg rounded">
          {availableTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => handleAddType(type.name)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100"
            >
              {type.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Xóa Column

```jsx
import { removeListType } from "../redux/taskSlice";

function RemoveColumnButton({ typeName }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    if (window.confirm(`Remove ${typeName} column?`)) {
      dispatch(removeListType(typeName));
    }
  };

  return <button onClick={handleRemove}>Remove</button>;
}
```

## Lưu Ý

1. **Type Names**: Luôn sử dụng UPPERCASE cho type names (VD: "INBOX", "TODO", "URGENT")

2. **Pagination**: Backend cần trả về `nextPageToken` trong response để infinity scroll hoạt động:

   ```json
   {
     "mailTasks": [...],
     "nextPageToken": "abc123"
   }
   ```

3. **Icons**: Sử dụng icons từ `lucide-react` hoặc custom icons

4. **Colors**: Sử dụng hex colors (VD: "#ef4444")

5. **Thread Structure**: Mỗi thread cần có:
   ```javascript
   {
     id: "thread-123",
     messages: [
       {
         // ... message data
         summary: "Email summary" // Thêm vào last message
       }
     ]
   }
   ```

## Troubleshooting

### Infinity Scroll không hoạt động

- Kiểm tra `nextPageToken` có được trả về từ API không
- Kiểm tra `hasMore` state trong Redux
- Kiểm tra console có error không

### Type mới không hiển thị

- Kiểm tra đã dispatch `addNewListType` chưa
- Kiểm tra icon và color có hợp lệ không
- Kiểm tra Redux DevTools để xem state

### Drag & Drop không hoạt động

- Kiểm tra `moveThreadBetweenTypes` action
- Kiểm tra API endpoint `/tasks/update-task-status`
- Kiểm tra thread có `id` hợp lệ không

## Support

Nếu cần thêm tính năng hoặc có vấn đề, vui lòng tạo issue hoặc liên hệ team.
