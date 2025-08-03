import { useEffect, useState } from "react";
import { WifiOff, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NetworkListener = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineModal, setShowOfflineModal] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineModal(false); // Auto-close modal on reconnection
      toast.success("You're back online 🚀", {
        position: "bottom-right",
        theme: "colored",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineModal(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Modal */}
      {showOfflineModal && !isOnline && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 bg-white/70 backdrop-blur-xs transition-all">
          <div className="relative bg-white dark:bg-gray-900 text-center rounded-2xl shadow-xl max-w-sm w-full p-6 border border-red-200 dark:border-red-400">
            <button
              onClick={() => setShowOfflineModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center space-y-4">
              <WifiOff className="w-10 h-10 text-red-500" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                No Internet Connection
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Please check your network. Some features may not work.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer autoClose={3000} pauseOnFocusLoss={false} />
    </>
  );
};

export default NetworkListener;
