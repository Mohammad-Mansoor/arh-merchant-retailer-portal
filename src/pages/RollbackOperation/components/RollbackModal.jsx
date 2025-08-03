// ActivateProductModal.tsx
import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    width: "30%",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    backgroundColor:
      theme.palette.mode === "dark"
        ? "#111827"
        : theme.palette.background.paper,
  },
}));

export default function RollbackModal({ open, onClose }) {
  const [amount, setAmount] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [isError, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const closeSuccessModal = () => setIsTransferSuccess(false);
  const closeErrorModal = () => setIsError(false);

  const onTransfer = async () => {
    try {
      console.log(amount);
      // if (!amount) {
      //   setErrorMessage("Please Enter the Transfer Amount");
      //   return;
      // }
      // if (isNaN(amount) === true) {
      //   setErrorMessage("Amount Must be a Number");
      //   return;
      // }
      const payload = {
        available_amount: false,
        amount,
      };

      setLoading(true);
      console.log("this is payload: ", payload);
      setTimeout(() => {
        setIsTransferSuccess(true);
        setLoading(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finally block is running");
    }
  };
  return (
    <StyledDialog
      open={open}
      onClose={() => {
        setErrorMessage("");
        setAmount(null);
        setLoading(false);
        onClose();
      }}
    >
      <SuccessModal
        open={isTransferSuccess}
        onClose={closeSuccessModal}
        amount={amount}
      />
      <ErrorModal
        open={isError}
        onClose={closeErrorModal}
        title={"Failed To Transfer Amount"}
        error={errorMessage}
        onRetry={onTransfer}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h3>Amount</h3>
            <h3>{amount}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>Date</h3>
            <h3>{"2024/08/22"}</h3>
          </div>
        </div>
      </ErrorModal>
      <div className="px-5 py-3">
        <h3 className="my-3 text-[20px] font-bold">Rollback Ticket</h3>
        <div className="flex items-start justify-center flex-col">
          <label htmlFor="" className="my-2">
            Enter Transaction ID
          </label>

          <input
            placeholder="001252220100"
            // onChange={(e) => setAmount(e.target.value)}
            type="text"
            className="w-full border border-[#D0D5DD] rounded-[10px] py-2 px-3 focus:border-red-500 outline-none transition-all duration-300"
          />
          {/* {errorMessage && (
            <p className="text-[14px] text-red-500 my-1">{errorMessage}</p>
          )} */}
        </div>

        <div className="w-full flex items-center justify-center mt-7 gap-3">
          <button
            onClick={() => {
              setErrorMessage("");
              setAmount(null);
              setLoading(false);
              onClose();
            }}
            className="py-2 px-6 border border-gray-400 rounded-md w-[30%] "
          >
            Close
          </button>
          <button
            onClick={onTransfer}
            className="text-white bg-[#CD0C02] w-[70%] py-2 px-6 border border-gray-400 rounded-md "
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
