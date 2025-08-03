// ActivateProductModal.tsx
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    // padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
  },
}));

export default function ErrorModal({
  open,
  onClose,
  children,
  title,
  error,
  onRetry,
}) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="pt-6 px-4 w-full text-center bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="w-full flex items-center justify-center">
          <img
            src="/images/error.png"
            alt=""
            className="w-[100px] h-[100px] object-cover"
          />
        </div>

        <div className="flex items-center justify-center mt-5">
          <h1 className="text-[24px]">{title}</h1>
        </div>
        <div className="mt-3 w-full">{children}</div>
        <div className="flex items-center justify-center flex-col gap-1 py-3 mt-4 w-full rounded-md bg-[#CD0C021A]">
          <h3 className="text-[16px]">{error}</h3>
        </div>
        <div className="w-full flex items-center justify-center flex-col">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-3 bg-[#CD0C02]"
          >
            Retry
          </button>
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-1 bg-black"
          >
            Go Back
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
