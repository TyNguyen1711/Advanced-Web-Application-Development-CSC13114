/**
 * Kanban Helpers
 *
 * File này chứa các helper functions để làm việc với Kanban board
 * và demo cách thêm type mới vào Redux store
 */

import { AlertCircle, Archive, Star, Trash2 } from "lucide-react";
import { addNewListType } from "../redux/taskSlice";

/**
 * Ví dụ các type có thể thêm vào Kanban board
 */
export const AVAILABLE_TYPES = {
  URGENT: {
    name: "URGENT",
    title: "URGENT",
    icon: AlertCircle,
    color: "#dc2626", // red-600
  },
  ARCHIVED: {
    name: "ARCHIVED",
    title: "ARCHIVED",
    icon: Archive,
    color: "#6b7280", // gray-500
  },
  STARRED: {
    name: "STARRED",
    title: "STARRED",
    icon: Star,
    color: "#eab308", // yellow-500
  },
  TRASH: {
    name: "TRASH",
    title: "TRASH",
    icon: Trash2,
    color: "#991b1b", // red-800
  },
};

/**
 * Thêm một type mới vào Kanban board
 *
 * @param {Function} dispatch - Redux dispatch function
 * @param {string} typeName - Tên của type (VD: "URGENT", "STARRED")
 * @param {Object} config - Configuration cho type mới (icon, color)
 *
 * @example
 * // Trong component:
 * import { useDispatch } from 'react-redux';
 * import { addNewKanbanType, AVAILABLE_TYPES } from '../utils/kanbanHelpers';
 *
 * const dispatch = useDispatch();
 *
 * // Thêm type "URGENT"
 * addNewKanbanType(dispatch, "URGENT", AVAILABLE_TYPES.URGENT);
 *
 * // Hoặc thêm custom type
 * addNewKanbanType(dispatch, "CUSTOM", {
 *   name: "CUSTOM",
 *   title: "Custom Column",
 *   icon: YourIcon,
 *   color: "#123456"
 * });
 */
export const addNewKanbanType = (dispatch, typeName, config = {}) => {
  // Kiểm tra config
  const typeConfig = config.name ? config : AVAILABLE_TYPES[typeName];

  if (!typeConfig) {
    console.error(`Type "${typeName}" not found in AVAILABLE_TYPES`);
    return;
  }

  // Dispatch action để thêm type mới
  dispatch(
    addNewListType({
      typeName: typeConfig.name,
      icon: typeConfig.icon,
      color: typeConfig.color,
    })
  );

  console.log(`✅ Added new type: ${typeConfig.name}`);
};

/**
 * Cách sử dụng trong component:
 *
 * 1. Import cần thiết:
 * ```javascript
 * import { useDispatch } from 'react-redux';
 * import { addNewKanbanType, AVAILABLE_TYPES } from '../utils/kanbanHelpers';
 * ```
 *
 * 2. Trong component:
 * ```javascript
 * const dispatch = useDispatch();
 *
 * const handleAddUrgentColumn = () => {
 *   addNewKanbanType(dispatch, "URGENT", AVAILABLE_TYPES.URGENT);
 * };
 * ```
 *
 * 3. Thêm button trong UI:
 * ```jsx
 * <button onClick={handleAddUrgentColumn}>
 *   Add Urgent Column
 * </button>
 * ```
 */

/**
 * Lấy danh sách các type có sẵn để thêm
 * (không bao gồm các type đã được thêm vào board)
 *
 * @param {Array} existingTypes - Mảng các type name đã tồn tại
 * @returns {Array} Mảng các type có thể thêm
 */
export const getAvailableTypesToAdd = (existingTypes = []) => {
  return Object.values(AVAILABLE_TYPES).filter(
    (type) => !existingTypes.includes(type.name)
  );
};

/**
 * Validate xem có thể thêm type mới không
 *
 * @param {Array} existingTypes - Mảng các type name đã tồn tại
 * @param {string} typeName - Type name muốn thêm
 * @returns {boolean}
 */
export const canAddType = (existingTypes, typeName) => {
  return !existingTypes.includes(typeName);
};
