// ActivateProductModal.tsx
import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled Dialog with blur
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
  },
  "& .MuiPaper-root": {
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
  },
}));

export default function SuccessModal({
  open,
  onClose,
  refetch,
  closeCreateAgentModal,
}) {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className=" w-full p-4 text-center dark:text-white bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="w-full flex items-center justify-center">
          <img src="/images/check.png" alt="" />
        </div>

        <div className="flex items-center justify-center mt-10">
          <h1 className="text-[24px]">Agent Created Successfully</h1>
        </div>
        <div className="flex items-center justify-center flex-col gap-1 py-1 mt-4 w-full rounded-md bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
          <div
            className="dark:text-white"
            style={{
              width: "90%",
              margin: "0 auto",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                margin: 0,
                fontWeight: 400,

                textAlign: "center",
              }}
            >
              Credentials have been generated and sent via SMS/email
            </p>
            <p
              className="dark:text-white"
              style={{
                fontSize: "14px",
                margin: 0,
                fontWeight: 400,

                textAlign: "center",
              }}
            >
              The agent must log in using the default password and will be
              required to reset it upon first login for security reasons
            </p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => {
              // refetch();
              onClose();
              closeCreateAgentModal();
            }}
            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-3 bg-[#CD0C02]"
          >
            Go Back
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}
