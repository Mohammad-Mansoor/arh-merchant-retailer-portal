// ReverseStockSuccessModal.jsx
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

export default function ReverseStockSuccessModal({ 
  open, 
  onClose, 
  payload 
}) {
  const [visible, setVisible] = useState(false);
  const {t} = useTranslation();
  useEffect(() => {
    let timer;
    if (open) {
      setTimeout(() => setVisible(true), 100);
      timer = setTimeout(() => onClose(), 15000);
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="w-full p-4 text-center bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="w-full px-6 pt-6 flex items-center justify-center relative z-10">
          <div className="success-animation">
            <svg 
              className="checkmark" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 52 52"
            >
              <circle 
                className="checkmark__circle" 
                cx="26" 
                cy="26" 
                r="25" 
                fill="none"
                stroke="#4CAF50"
              />
              <path 
                className="checkmark__check" 
                fill="none" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                stroke="#4CAF50"
                strokeWidth="3"
              />
            </svg>
            
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-10">
          <h1 className="text-[24px] dark:text-white">
            {t("reverseStockRS")}
          </h1>
        </div>
        
        <div className="flex items-center justify-center px-1 flex-col gap-1 py-1 mt-4 w-full rounded-md dark:text-white bg-[#F3F4F6] dark:bg-gray-800">
          <div className="w-full p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("retailer")}</h3>
              <h3>{payload?.reversedFrom?.username || "N/A"}</h3>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("amount")}</h3>
              <h3>{payload?.amount ? `${parseFloat(payload.amount).toFixed(2)} AFG` : "N/A"}</h3>
            </div>
            {payload?.comment && (
              <div className="flex items-start justify-between">
                <h3 className="font-medium">{t("comment")}</h3>
                <p className="text-right max-w-[70%]">{payload.comment}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("status")}</h3>
              <h3 className="text-green-600 font-medium">{t("processing")}</h3>
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