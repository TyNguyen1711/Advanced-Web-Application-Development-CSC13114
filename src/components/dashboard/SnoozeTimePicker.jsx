import React, { useState } from "react";
import { Clock, X } from "lucide-react";

export default function SnoozeTimePicker({
  isOpen,
  onClose,
  onSnooze,
  emailSubject,
}) {
  console.log("SnoozeTimePicker rendered with isOpen:", emailSubject);
  if (!isOpen) return null;

  const [days, setDays] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleNumberInput = (value, setter, max) => {
    if (value === "") {
      setter("");
      return;
    }
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= max) {
      setter(value);
    }
  };

  const handleSnoozeSubmit = () => {
    const d = days === "" ? 0 : parseInt(days);
    const h = hours === "" ? 0 : parseInt(hours);
    const m = minutes === "" ? 0 : parseInt(minutes);

    if (d === 0 && h === 0 && m === 0) {
      alert("Vui lòng nhập ít nhất 1 giá trị lớn hơn 0");
      return;
    }

    const totalSeconds = d * 24 * 60 * 60 + h * 60 * 60 + m * 60;

    onSnooze({
      snooze_time_in_seconds: totalSeconds,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Snooze email</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Choose when to see this again
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Email Preview */}
        {emailSubject && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-600 truncate">
              <span className="font-medium">Subject:</span> {emailSubject}
            </p>
          </div>
        )}

        <div className="p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">Snooze for:</p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={days}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setDays, 365)
                  }
                  placeholder="0"
                  min="0"
                  max="365"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                />
              </div>
              <span className="text-gray-600 font-medium w-16">ngày</span>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={hours}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setHours, 23)
                  }
                  placeholder="0"
                  min="0"
                  max="23"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                />
              </div>
              <span className="text-gray-600 font-medium w-16">giờ</span>
            </div>

            {/* Minutes */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) =>
                    handleNumberInput(e.target.value, setMinutes, 59)
                  }
                  placeholder="0"
                  min="0"
                  max="59"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                />
              </div>
              <span className="text-gray-600 font-medium w-16">phút</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSnoozeSubmit}
            className="w-full mt-6 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
