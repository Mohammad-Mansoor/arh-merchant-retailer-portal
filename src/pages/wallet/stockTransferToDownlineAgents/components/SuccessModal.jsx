// ActivateProductModal.tsx
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";

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

export default function SuccessModal({ open, onClose, payload }) {
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
      <div className=" w-full p-4 text-center bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
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
          <h1
            className="text-[24px] dark:text-white
          "
          >
            Stock Transfered Successfully
          </h1>
        </div>
        <div className="flex items-center justify-center px-1 flex-col gap-1 py-1 mt-4 w-full rounded-md dark:text-white bg-[#F3F4F6] bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
          <div className="w-full p-3">
            <div className="flex items-center justify-between">
              <h3>Amount</h3>
              <h3>{payload?.amount}</h3>
            </div>
            <div className="flex items-center justify-between">
              <h3>Commission Rate</h3>
              <h3>{payload.comission_rate + " %"}</h3>
            </div>
            <div className="flex items-center justify-between">
              <h3>Total Amount</h3>
              <h3>{`${payload?.total_amount} AFG`}</h3>
            </div>
            <div className="flex items-center justify-between">
              <h3>Date</h3>
              <h3>{new Date().toLocaleDateString()}</h3>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-3 bg-[#CD0C02]"
          >
            Go Back
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
