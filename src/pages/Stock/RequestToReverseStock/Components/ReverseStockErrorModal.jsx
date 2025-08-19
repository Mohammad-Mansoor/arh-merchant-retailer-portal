// ReverseStockErrorModal.jsx
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    backgroundColor: theme.palette.mode === "dark" 
      ? "#111827" 
      : theme.palette.background.paper,
  },
}));

export default function ReverseStockErrorModal({
  open,
  onClose,
  title,
  error,
  onRetry,
  payload
}) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="pt-6 px-4 w-full text-center bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="w-full flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center mt-5">
          <h1 className="text-[24px] font-medium">{title}</h1>
        </div>
        
        <div className="mt-3 w-full">
          <div className="w-full bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)] p-4 rounded-lg">
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Retailer</h3>
                <h3>{payload?.reversedFrom?.username || "N/A"}</h3>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Amount</h3>
                <h3>{payload?.amount ? `${parseFloat(payload.amount).toFixed(2)} AFG` : "N/A"}</h3>
              </div>
              {payload?.comment && (
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">Comment</h3>
                  <p className="text-right max-w-[70%]">{payload.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex p-4 justify-center flex-col gap-1 py-3 mt-4 w-full rounded-md bg-red-50 dark:bg-red-900/30">
          <h3 className="text-red-600 dark:text-red-300 font-medium">{error}</h3>
          <p className="text-sm mt-2">Please check the details and try again</p>
        </div>
        
        <div className="w-full flex items-center justify-center flex-col space-y-2 p-4">
          <button
            onClick={onRetry}
            className="w-full py-2 px-4 rounded-md text-white bg-[#CD0C02] hover:bg-[#B71C1C] transition"
          >
            Retry Request
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-md text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}