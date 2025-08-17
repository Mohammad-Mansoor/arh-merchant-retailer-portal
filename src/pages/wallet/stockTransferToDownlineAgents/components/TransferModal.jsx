import React, { useEffect, useState } from "react";
import { Autocomplete, Dialog, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import {
  getChildAgents,
  getSinglAgentDetails,
  transferStockToDownlineAgent,
} from "../../../../services/stockTransferToDownlineAgentsService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
  },
  "& .MuiPaper-root": {
    width: "90%", 
    maxWidth: "100%",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("md")]: {
      width: "600px",
    },
    [theme.breakpoints.up("lg")]: {
      width: "700px",
    },
  },
}));

const redFocusStyles = {
  width: "100%",
  borderRadius: "20px",
  "& .MuiOutlinedInput-root": {
    paddingY: "0 !important",
    height: "46px",
    "& .MuiAutocomplete-input": { padding: "0 !important" },
    "&.Mui-focused fieldset": { borderColor: "#CD0C02 !important" },
    "&:hover fieldset": { borderColor: "#ff6666" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#CD0C02 !important" },
  "& .MuiAutocomplete-popupIndicator.Mui-focused": { color: "#CD0C02" },
  "& .MuiAutocomplete-inputRoot": {
    paddingTop: "0 !important",
    paddingBottom: "0 !important",
  },
};

export default function TransferModal({ open, onClose }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(null);
  const [childAgents, setChildAgents] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState({ search: "" });
  const [payload, setPayload] = useState({
    agentId: "",
    amount: null,
    comission_rate: "",
    total_amount: null,
  });

  const {
    data: agents,
    isLoading,
    isError: fetchError,
    error,
  } = useQuery({
    queryKey: ["childAgents", filter],
    queryFn: () => getChildAgents(filter),
  });

  const { data } = useQuery({
    queryKey: ["agentDetails", payload.agentId],
    queryFn: () => getSinglAgentDetails(payload.agentId),
    enabled: !!payload.agentId,
  });

  const getAgentDetails = async () => {
    try {
      const res = await getSinglAgentDetails(payload.agentId);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const get = async () => {
      if (payload?.agentId) {
        const res = await getAgentDetails();
        handlePayloadChange("comission_rate", res.data.commission_rate);
      }
    };
    get();
  }, [payload.agentId]);

  const handlePayloadChange = (field, value) => {
    setPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setPayload({
      agentId: "",
      amount: null,
      comission_rate: "",
      total_amount: null,
    });
    setValidationErrors({});
  };

  const closeSuccessModal = () => {
    setIsTransferSuccess(false);
    handleClose(); 
  };

  const closeErrorModal = () => setIsError(false);

  const checkValidation = () => {
    const errors = {};
    if (!payload.agentId) {
      errors.agentId = t("transferModal2.errors.agentRequired");
    }
    if (!payload.amount) {
      errors.amount = t("transferModal2.errors.amountRequired");
    }
    if (payload.amount <= 0) {
      errors.amount = t("transferModal.errors.amountPositive");
    }
    if (!payload.comission_rate) {
      errors.comission_rate = t("transferModal2.errors.commissionRequired");
    }
    if (payload.comission_rate < 0 || payload.comission_rate > 100) {
      errors.comission_rate = t("transferModal2.errors.commissionRange");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClose = () => {
    setAmount("");
    setErrorMessage("");
    onClose();
  };

  const { mutate, isPending: loading } = useMutation({
    mutationFn: (payload) => transferStockToDownlineAgent(payload),
    onSuccess: () => {
      toast.success(t("transferModal2.successMessage"));
      setIsTransferSuccess(true);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.error || t("transferModal2.errorMessage");
      setIsError(true);
      toast.error(message);
      setErrorMessage(message);
    },
  });

  const onTransfer = async () => {
    if (!checkValidation()) {
      return;
    }
    mutate(payload);
  };

  useEffect(() => {
    if (!payload.comission_rate && amount)
      handlePayloadChange("total_amount", 0);
    if (!payload.comission_rate || !payload.amount) return;
    const totalAmount =
      (Number(payload.amount) * (100 + Number(payload.comission_rate))) / 100;
    handlePayloadChange("total_amount", parseFloat(totalAmount).toFixed(2));
  }, [payload.comission_rate, payload.amount]);

  return (
    <StyledDialog open={open} onClose={handleClose}>
      <SuccessModal
        open={isTransferSuccess}
        onClose={closeSuccessModal}
        amount={amount}
        payload={payload}
      />
      <ErrorModal
        open={isError}
        onClose={closeErrorModal}
        title={t("transferModal2.errorTitle")}
        error={errorMessage}
        onRetry={onTransfer}
      >
        <div className="w-full bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
          <div className="flex items-center justify-between">
            <h3>{t("transferModal2.amount")}</h3>
            <h3>{payload?.amount}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>{t("transferModal2.commissionRate")}</h3>
            <h3>{payload.comission_rate + " %"}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>{t("transferModal2.totalAmount")}</h3>
            <h3>{`${payload?.total_amount} ${t("common3.currency")}`}</h3>
          </div>
          <div className="flex items-center justify-between">
            <h3>{t("transferModal2.date")}</h3>
            <h3>{new Date().toLocaleDateString()}</h3>
          </div>
        </div>
      </ErrorModal>
      <div className="px-5 py-3">
        <h3 className="my-3">{t("transferModal2.title")}</h3>

        <div className="w-full grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={agents?.data || []}
              getOptionLabel={(u) => u.username}
              onChange={(e, newValue) => {
                if (newValue) delete validationErrors.agentId;
                handlePayloadChange("agentId", newValue?.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("transferModal2.agentLabel")}
                  sx={redFocusStyles}
                  error={Boolean(validationErrors.agentId)}
                  helperText={
                    validationErrors.agentId && validationErrors.agentId
                  }
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              sx={redFocusStyles}
              variant="outlined"
              label={t("transferModal2.amountLabel")}
              required
              onChange={(e) => {
                const value = e.target.value;
                if (value) delete validationErrors.amount;
                handlePayloadChange("amount", value);
              }}
              error={Boolean(validationErrors.amount)}
              helperText={validationErrors.amount && validationErrors.amount}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              sx={redFocusStyles}
              value={payload?.comission_rate}
              variant="outlined"
              label={t("transferModal2.commissionLabel")}
              onChange={(e) => {
                const value = e.target.value;
                if (!value) handlePayloadChange("total_amount", null);
                if (value) delete validationErrors.comission_rate;
                handlePayloadChange("comission_rate", value);
              }}
              InputLabelProps={{
                shrink: payload.comission_rate,
              }}
              error={Boolean(validationErrors.comission_rate)}
              helperText={
                validationErrors.comission_rate &&
                validationErrors.comission_rate
              }
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              sx={redFocusStyles}
              variant="outlined"
              label={t("transferModal2.totalAmountLabel")}
              disabled={true}
              value={payload.total_amount || ""}
              InputLabelProps={{
                shrink: payload.comission_rate && payload.amount,
              }}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center mt-7 gap-3">
          <button
            onClick={() => {
              setErrorMessage("");
              setAmount(null);
              resetForm();
              onClose();
            }}
            className="py-2 px-6 border border-gray-400 rounded-md w-[30%] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {t("transferModal2.closeButton")}
          </button>
          <button
            onClick={onTransfer}
            disabled={loading}
            className="text-white bg-[#CD0C02] hover:bg-[#a80101] w-[70%] py-2 px-6 rounded-md transition-colors disabled:opacity-70"
          >
            {loading ? t("transferModal2.loading") : t("transferModal2.transferButton")}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}