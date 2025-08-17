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
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
    overflow: "visible",
  },
}));

export default function SuccessModal({ open, onClose, amount }) {
  const { t } = useTranslation();
  const [stars] = useState(Array(15).fill(0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (open) {
      setTimeout(() => setVisible(true), 100);
      
      timer = setTimeout(() => {
        onClose();
      }, 15000); 
    } else {
      setVisible(false);
    }
    
    return () => clearTimeout(timer);
  }, [open, onClose]);

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="w-[400px] text-center relative overflow-visible">
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
              />
              <path 
                className="checkmark__check" 
                fill="none" 
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>
            
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
            <div className="confetti"></div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-10">
          <h1 className="text-[24px] mb-4 font-bold">
            {t("successModal.title")}
          </h1>
        </div>
        
        <div className="flex items-center justify-center flex-col gap-1 py-3 mt-4 w-full rounded-md bg-gradient-to-r from-[#fef2f2] to-[#fff7ed] dark:from-gray-800 dark:to-gray-900 border border-[#fecaca] dark:border-gray-700">
          <h3 className="text-[16px] font-semibold">
            {t("successModal.transferredAmount")}
          </h3>
          <p className="text-xl font-bold text-[#CD0C02]">
            {amount} {t("common3.currency")}
          </p>
        </div>
        
        <div className="w-full flex items-center justify-center mt-6">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center text-white py-3 px-6 rounded-md bg-[#CD0C02] hover:bg-[#a80101] transition-colors shadow-lg hover:shadow-red-300/30"
          >
            {t("successModal.goBack")}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}