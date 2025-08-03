// ActivateProductModal.tsx
import React, { useState } from "react";
import { Autocomplete, Dialog, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
  },
  "& .MuiPaper-root": {
    width: "90%", // default for small screens
    maxWidth: "100%",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    padding: theme.spacing(2),

    // ✅ Responsive width per breakpoint
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
export default function EditAgentProfile({ open, onClose }) {
  const [amount, setAmount] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTransferSuccess, setIsTransferSuccess] = useState(false);
  const [isError, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [payload, setPayload] = useState({
    agentId: "",
    amount: null,
    comission_rate: null,
    total_amount: null,
  });
  const agents = [
    { id: 1, name: "Ahmad Faheem" },
    { id: 2, name: "Rahmat Gul" },
    { id: 3, name: "Nasir Hakimi" },
    { id: 4, name: "Farhad Omar" },
    { id: 5, name: "Bilal Sadiqi" },
  ];

  const handlePayloadChange = (field, value) => {
    setPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const closeSuccessModal = () => setIsTransferSuccess(false);
  const closeErrorModal = () => setIsError(false);

  const onTransfer = async () => {
    try {
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
        <div className="w-full bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
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
        <h3 className="my-3">Create Agent</h3>
        <div className="w-full flex items-center justify-center">
          <div className="w-[120px] h-[120px] rounded-full border border-red-500 mb-4"></div>
        </div>
        <div className="w-full grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-6">
            <TextField
              sx={redFocusStyles}
              variant="outlined"
              label="Agent Name"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField sx={redFocusStyles} variant="outlined" label="Email" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              sx={redFocusStyles}
              variant="outlined"
              label="Phone Number"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={agents}
              getOptionLabel={(u) => u.name}
              onChange={(e, newValue) =>
                handlePayloadChange("agentId", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country"
                  sx={redFocusStyles}
                  // error={
                  //   formik.touched.customer_id && !!formik.errors.customer_id
                  // }
                  // helperText={
                  //   formik.touched.customer_id && formik.errors.customer_id
                  // }
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={agents}
              getOptionLabel={(u) => u.name}
              onChange={(e, newValue) =>
                handlePayloadChange("agentId", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Province"
                  sx={redFocusStyles}
                  // error={
                  //   formik.touched.customer_id && !!formik.errors.customer_id
                  // }
                  // helperText={
                  //   formik.touched.customer_id && formik.errors.customer_id
                  // }
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={agents}
              getOptionLabel={(u) => u.name}
              onChange={(e, newValue) =>
                handlePayloadChange("agentId", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="District"
                  sx={redFocusStyles}
                  required
                />
              )}
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <TextField
              sx={redFocusStyles}
              variant="outlined"
              label="Full Address"
            />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Autocomplete
              options={agents}
              getOptionLabel={(u) => u.name}
              onChange={(e, newValue) =>
                handlePayloadChange("agentId", newValue)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Language"
                  sx={redFocusStyles}
                  // error={
                  //   formik.touched.customer_id && !!formik.errors.customer_id
                  // }
                  // helperText={
                  //   formik.touched.customer_id && formik.errors.customer_id
                  // }
                  required
                />
              )}
            />
          </div>
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
            {loading ? "Loading..." : "Transfer"}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
