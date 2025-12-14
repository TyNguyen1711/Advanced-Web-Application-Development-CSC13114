import { Sparkles, ExternalLink, MoreHorizontal } from "lucide-react";
import EmailModal from "../modal/EmailModal";
import { useState } from "react";

const EmailCardSearch = ({ thread }) => {
  const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);

  const item = thread?.messages[thread.messages.length - 1];

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl p-5 cursor-pointer
          shadow-sm hover:shadow-xl hover:shadow-black/10 transition-all duration-300 ease-out
          border border-gray-100 hover:border-gray-200"
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-lg"
            style={{ backgroundColor: "#c0c0c0" }}
          >
            {item.from?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {item.from}
              </h4>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {item.date}
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
            {item.summary || item.snippet}
          </p>
        </div>

        <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => setIsOpenEmailModal(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors"
          >
            <span>Open Mail</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-gray-300" />
        </div>
      </div>

      {isOpenEmailModal && (
        <EmailModal
          thread={thread}
          isOpen={isOpenEmailModal}
          setIsOpen={setIsOpenEmailModal}
        />
      )}
    </>
  );
};

export default EmailCardSearch;
