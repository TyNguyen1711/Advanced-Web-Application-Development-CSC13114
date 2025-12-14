import React from "react";
import { X, Clock, Mail } from "lucide-react";
import EmailCard from "../dashboard/EmailCard";

export default function SnoozeModal({
  isOpen,
  onClose,
  snoozeEmails,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl min-h-[80vh] max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Snoozed Emails</h2>
              <p className="text-sm text-white/80">
                {loading ? "Loading..." : `${snoozeEmails.length} emails`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto h-[calc(90vh-88px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : snoozeEmails.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Snoozed Emails
              </h3>
              <p className="text-gray-500">
                You don't have any snoozed emails at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {snoozeEmails.map((thread) => {
                const lastMessage = thread.messages[thread.messages.length - 1];
                return (
                  <div
                    key={thread.id}
                    className="transform transition-transform hover:scale-[1.02]"
                  >
                    <EmailCard
                      threadId={thread.id}
                      item={lastMessage}
                      thread={thread}
                      isDragging={false}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && snoozeEmails.length > 0 && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
