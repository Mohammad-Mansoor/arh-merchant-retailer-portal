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
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
  },
}));



export default function SuccessModal({ open, onClose, amount, onSuccess}) {
  const handleClose = () => {
    onClose();
    onSuccess(); 
  };
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className=" w-full text-center">
        <div className="w-full flex items-center justify-center">
          <img src="/images/check.png" alt="" />
        </div>

        <div className="flex items-center justify-center mt-10">
          <h1 className="text-[24px]">Recharge Successfully Done</h1>
        </div>
        <div className="flex items-center justify-center flex-col gap-1 py-1 mt-4 w-full rounded-md bg-[#F3F4F6]">
          <h3 className="text-[16px] font-semibold">Recharge Amount</h3>
          <p>{amount} AFG</p>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            onClick={handleClose}

            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-3 bg-[#CD0C02]"
          >
            Go Back
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
