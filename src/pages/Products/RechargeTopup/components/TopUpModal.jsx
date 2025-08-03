// ActivateProductModal.tsx
import React, { useState } from "react";
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import PhoneInput from "./NumberInput";
import { useMutation } from "@tanstack/react-query";
import { recharge } from "../../../../services/product_management_service.js";
import { toast } from "react-toastify";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  width: "100%",
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

export default function TopUpModal({ open, onClose }) {
  const [amount, setAmount] = useState(null);
  const [phone, setPhone] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState(false);

  const closeSuccessModal = () => setIsTransferSuccess(false);
  const closeErrorModal = () => setIsError(false);
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => recharge(payload),
    onSuccess: () => {
      toast.success("Recharge Successfuly done!");
      setIsTransferSuccess(true);
    },
    onError: (error) => {
      console.log("create agent error:", error);
      const message =
        error?.response?.data?.error || "Failed to activate the product!";
      setIsError(true);
      toast.error(message);
      setErrorMessage(message);
    },
  });
  const onTransfer = async () => {
    try {
      console.log(amount);
      if (!phone) {
        setPhoneErrorMessage("Please Enter the Mobile Number");
        return;
      }
      if (isNaN(phone) === true) {
        setPhoneErrorMessage("Mobile Number Must be a Number");
        return;
      }
      if (!amount) {
        setErrorMessage("Please Enter the Transfer Amount");
        return;
      }
      if (isNaN(amount) === true) {
        setErrorMessage("Amount Must be a Number");
        return;
      }

      const payload = {
        mobileNumber: phone,
        amount,
      };

      mutate(payload);
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finally block is running");
    }
  };
  const setPhoneNumber = (e) => {
    setPhone(e);
  };
  return (
    <StyledDialog
      open={open}
      onClose={() => {
        setErrorMessage("");
        setAmount(null);
        setLoading(false);
        setPhoneErrorMessage("");
        setPhone("");
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
        title={"Failed To Recharge"}
        error={errorMessage}
        onRetry={onTransfer}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h3>Reciever</h3>
            <h3>{phone}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>Amount</h3>
            <h3>{amount} AF</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>Date</h3>
            <h3>{new Date().toLocaleDateString()}</h3>
          </div>
        </div>
      </ErrorModal>
      <div className="px-5 py-3">
        <h3 className="my-3">Enter the Number you want to TopUp</h3>

        <div className="flex items-start justify-center flex-col">
          {/* <label htmlFor="" className="my-2">
            Enter Number
          </label> */}

          <PhoneInput getInputValue={setPhoneNumber} />
          {phoneErrorMessage && (
            <p className="text-[14px] text-red-500 my-1">{phoneErrorMessage}</p>
          )}
        </div>
        <div className="flex items-start justify-center flex-col">
          <label htmlFor="" className="my-2">
            Enter Amount
          </label>

          <input
            placeholder="Enter Topup Amount"
            onChange={(e) => setAmount(e.target.value)}
            type="text"
            className="w-full border border-[#D0D5DD] rounded-[10px] py-2 px-3 focus:border-red-500 outline-none transition-all duration-300"
          />
          {errorMessage && (
            <p className="text-[14px] text-red-500 my-1">{errorMessage}</p>
          )}
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
            {isPending ? "Loading..." : "Recharge"}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
