import React, { useState } from "react";
import { Dialog, Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { transferToPrimaryWallet } from "../../../../services/transfer_comission_to_primary_service";
import { useSelector } from "react-redux";
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
  },
}));

export default function TransferModal({ open, onClose, onTransferSuccess }) {
  const { t } = useTranslation();
  const userInfo = useSelector((state) => state.auth.user);
  const [amount, setAmount] = useState("");
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [transferAll, setTransferAll] = useState(false);

  const closeSuccessModal = () => {
    setIsTransferSuccess(false);
    handleClose(); 
  };

  const closeErrorModal = () => setFailed(false);

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (payload) => transferToPrimaryWallet(userInfo?.id, payload),
    onSuccess: () => {
      setIsTransferSuccess(true);
      onTransferSuccess?.();
    },
    onError: (error) => {
      console.log("Transfer error:", error);
      const message =
        error?.response?.data?.error || t("transferModal.errors.transferFailed");
      setErrorMessage(message);
      setFailed(true);
    },
  });

  const handleClose = () => {
    setAmount("");
    setErrorMessage("");
    setTransferAll(false);
    onClose();
  };

  const handleTransfer = () => {
    setErrorMessage("");

    if (!transferAll && (!amount || isNaN(amount))) {
      setErrorMessage(
        !amount 
          ? t("transferModal.errors.amountRequired")
          : t("transferModal.errors.amountNumber")
      );
      return;
    }

    const payload = {
      available_amount: transferAll,
      amount: transferAll ? 0 : Number(amount),
    };

    mutate(payload);
  };

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <SuccessModal
        open={isTransferSuccess}
        onClose={closeSuccessModal}
        amount={transferAll ? t("transferModal.allAvailable") : amount}
      />

      <ErrorModal
        open={failed}
        onClose={closeErrorModal}
        title={t("transferModal.errors.transferFailedTitle")}
        error={errorMessage}
        onRetry={handleTransfer}
      >
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h3>{t("transferModal.amount")}</h3>
            <h3>{transferAll ? t("transferModal.allAvailable") : amount}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>{t("transferModal.date")}</h3>
            <h3>{new Date().toLocaleDateString()}</h3>
          </div>
        </div>
      </ErrorModal>

      <div className="px-5 py-3">
        <h3 className="my-3 text-[16px] font-semibold">
          {t("transferModal.title")}
        </h3>

        <div className="flex flex-col">
          <label className="my-2 font-medium">
            {t("transferModal.enterAmount")}
          </label>

          <input
            disabled={transferAll}
            onChange={(e) => {
              setErrorMessage("");
              setAmount(e.target.value);
            }}
            value={amount}
            type="text"
            placeholder={t("transferModal.amountPlaceholder")}
            className={`w-full border rounded-md py-2 px-3 transition-all duration-300 outline-none ${
              transferAll
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "border-[#D0D5DD] focus:border-red-500"
            }`}
          />

          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={transferAll}
                onChange={(e) => {
                  setTransferAll(e.target.checked);
                  if (e.target.checked) {
                    setAmount("");
                    setErrorMessage("");
                  }
                }}
                sx={{
                  color: "#CD0C02",
                  "&.Mui-checked": {
                    color: "#CD0C02",
                  },
                }}
              />
            }
            label={t("transferModal.transferAll")}
            className="mt-4 text-sm font-medium"
          />
        </div>

        <div className="w-full flex justify-end mt-6 gap-3">
          <button
            onClick={handleClose}
            className="py-2 px-6 border border-gray-400 rounded-md w-[30%] text-sm"
          >
            {t("transferModal.cancel")}
          </button>
          <button
            onClick={handleTransfer}
            className={`text-white w-[70%] py-2 px-6 rounded-md text-sm ${
              loading
                ? "bg-[#9b150d] cursor-not-allowed"
                : "bg-[#CD0C02] hover:bg-[#b01001]"
            }`}
            disabled={loading}
          >
            {loading ? t("transferModal.transferring") : t("transferModal.transfer")}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}