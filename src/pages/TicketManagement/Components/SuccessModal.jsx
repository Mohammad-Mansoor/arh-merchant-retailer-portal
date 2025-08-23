import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { t } from "i18next";
import { useEffect, useState } from "react";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#4CAF50"}`,
    borderRadius: 12,
    backgroundColor: theme.palette.mode === "dark" 
      ? "#111827" 
      : theme.palette.background.paper,
  },
}));

export default function TicketSuccessModal({ 
  open, 
  onClose, 
  payload 
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (open) {
      setTimeout(() => setVisible(true), 100);
      timer = setTimeout(() => onClose(), 5000);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="w-full p-4 text-center bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="w-full px-6 pt-6 flex items-center justify-center">
          <svg 
            className="checkmark" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 52 52"
            width="80"
            height="80"
          >
            <circle 
              cx="26" 
              cy="26" 
              r="25" 
              fill="none"
              stroke="#4CAF50"
              strokeWidth="2"
            />
            <path 
              fill="none" 
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
              stroke="#4CAF50"
              strokeWidth="3"
            />
          </svg>
        </div>

        <h1 className="text-[24px] dark:text-white mt-6">
          {t("ticketCS")}
        </h1>
        
        <div className="mt-4 w-full rounded-md dark:text-white bg-gray-100 dark:bg-gray-800 p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">{t("ticketID")}</span>
              <span className="font-bold">#{payload?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("type:")}</span>
              <span>{payload?.ticketType?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("Status:")}</span>
              <span className="capitalize">{payload?.status || "Pending"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">{t("createdAt:")}</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="w-full flex items-center justify-center mt-6">
          <button
            onClick={onClose}
            className="w-full max-w-xs py-2 px-4 rounded-md text-white bg-[#4CAF50] hover:bg-[#388E3C] transition"
          >
            {t("continue")}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}