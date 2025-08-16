import { Dialog } from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(6px)",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  "& .MuiPaper-root": {
    width: "90%",
    maxWidth: "800px",
    border: `1px solid ${theme.palette.mode === "dark" ? "#444" : "#d32f2f"}`,
    borderRadius: 12,
    backgroundColor: theme.palette.mode === "dark" 
      ? "#111827" 
      : theme.palette.background.paper,
  },
}));

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ViewTicketModal({ 
  open, 
  onClose, 
  ticket 
}) {
  if (!ticket) return null;
  const API = import.meta.env.VITE_IMG_BASE_URL1;

  return (
    <StyledDialog open={open} onClose={onClose}>
      <div className="w-full p-6 bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-bold">Ticket Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Ticket ID</label>
              <p className="mt-1 font-medium">#{ticket.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Type</label>
              <p className="mt-1">{ticket.ticketType?.name || "N/A"}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Status</label>
              <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[ticket.status]}`}>
                {ticket.status}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1">{format(new Date(ticket.createdAt), "MMM dd, yyyy hh:mm a")}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {ticket.mobileNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                <p className="mt-1">{ticket.mobileNumber}</p>
              </div>
            )}
            
            {ticket.txnNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Transaction Number</label>
                <p className="mt-1">{ticket.txnNumber}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 whitespace-pre-line">{ticket.description}</p>
            </div>
            
            {ticket.comment && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Admin Comment</label>
                <p className="mt-1 whitespace-pre-line">{ticket.comment}</p>
              </div>
            )}
          </div>
        </div>
        
        {ticket.attachment && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-500">Attachment</label>
            <div className="mt-2 w-52">
              <img 
                src={`${API}/uploads/ticket_images/${ticket.attachment}`} 
                alt="Ticket attachment" 
                className="max-w-full h-auto rounded-lg border"
              />
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </StyledDialog>
  );
}