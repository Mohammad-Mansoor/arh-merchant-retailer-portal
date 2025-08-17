import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
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

export default function ErrorModal({
  open,
  onClose,
  children,
  title,
  error,
  onRetry,
}) {
  const { t } = useTranslation();

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="pt-6 px-4 w-full text-center">
        <div className="w-full flex items-center justify-center">
          <img
            src="/images/error.png"
            alt={t("errorModal.errorImageAlt")}
            className="w-[100px] h-[100px] object-cover"
          />
        </div>

        <div className="flex items-center justify-center mt-5">
          <h1 className="text-[24px]">
            {title || t("errorModal.defaultTitle")}
          </h1>
        </div>
        
        <div className="mt-3 w-full">{children}</div>
        
        <div className="flex items-center justify-center flex-col gap-1 p-3 mt-4 w-full rounded-md bg-[#CD0C021A]">
          <h3 className="text-[14px]">{error || t("errorModal.defaultError")}</h3>
        </div>
        
        <div className="w-full flex items-center justify-center flex-col">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-3 bg-[#CD0C02] hover:bg-[#a80101] transition-colors"
            >
              {t("errorModal.retry")}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center text-white py-2 px-4 rounded-md mt-1 bg-black hover:bg-gray-800 transition-colors"
          >
            {t("errorModal.goBack")}
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}