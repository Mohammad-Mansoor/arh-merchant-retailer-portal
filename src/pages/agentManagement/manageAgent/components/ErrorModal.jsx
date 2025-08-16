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

export default function CreateAgentErrorModal({
  open,
  onClose,
  error,
  onRetry,
  payload
}) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="w-full p-4 text-center bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-red-600" 
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

        <div className="flex items-center justify-center mt-4">
          <h1 className="text-[24px] font-medium">Agent Creation Failed</h1>
        </div>
        
        <div className="mt-2 w-full">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
        
        {payload && (
          <div className="mt-4 w-full rounded-md bg-gray-100 dark:bg-gray-800 p-4">
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="font-medium">Agent Name:</span>
                <span>{payload?.username || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{payload?.mobileNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{payload?.email || "N/A"}</span>
              </div>
            </div>
          </div>
        )}
        
        <div className="w-full flex items-center justify-center flex-col space-y-2 p-4">
          <button
            onClick={onRetry}
            className="w-full py-2 px-4 rounded-md text-white bg-[#CD0C02] hover:bg-[#B71C1C] transition"
          >
            Retry
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