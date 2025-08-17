import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  IconButton,
  Box,
  Grid,
  Typography,
  Chip,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import MDBox from "@components/MDBox";
import MDTypography from "@components/MDTypography";
import MDAlert from "@components/MDAlert";
import DashboardLayout from "@components/DashboardLayout";
import DataTable from "@components/Table";
import MDButton from "@components/MDButton";
import { FiPlusCircle } from "react-icons/fi";
import CloseIcon from "@mui/icons-material/Close";
import { usePermissions } from "@context/permissionContext";
import CreateReverseStockDialog from "./components/CreateReverseStockDialog";
import reverseStockService from "@services/reverseStockService";
import UserService from "@services/users-service";
import { formatDate } from "@utils/formatDate";
import StatusChip from "@components/StatusChip";
import { useAuth } from "@context/index";
import { toast } from "react-toastify";
import {
  CheckCircle, 
  Close,       
  Visibility,  
  Description as DescriptionIcon,
} from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";

function ReverseStockManagement() {
  const { getCurrentUser } = useAuth();
  const allowedRoles = ["Admin", "officer", "manager"];
  const role = allowedRoles.includes(localStorage.getItem("role"))
    ? localStorage.getItem("role")
    : null;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [notification, setNotification] = useState({ value: false, text: "" });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reverseStocks, setReverseStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionStockId, setRejectionStockId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { canRead, canWrite } = usePermissions();
  const [success, setSuccess] = useState(false);
  const [users, setUsers] = useState({});
  const [viewStockId, setViewStockId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [getRequests, setGetRequests] = useState(false);
  const navigate = useNavigate();
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const getFileColor = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "#f44336";
    if (["pdf"].includes(ext)) return "#ff5722";
    if (["doc", "docx"].includes(ext)) return "#2196f3";
    if (["xls", "xlsx"].includes(ext)) return "#4caf50";
    return "#9e9e9e";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i]);
  };

  const fetchReverseStocks = async () => {
    try {
      setGetRequests(true);
      setLoading(true);
      let res;
      
      if (userTypeFilter === "merchant") {
        res = await reverseStockService.getReverseStocksForMerchant(page, limit, search);
      } else if (userTypeFilter === "retailer") {
        res = await reverseStockService.getReverseStocksForRetailer(page, limit, search);
      } else {
        res = await reverseStockService.getAllReverseStocksForAdmin(page, limit, search);
      }
      
      setReverseStocks(res.data || []);
      setTotal(res?.meta?.total || res?.data?.length || 0);
    } catch (error) {
      console.error("Error fetching reverse stocks:", error);
      toast.error("Failed to load reverse stocks");
    } finally {
      setGetRequests(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchReverseStocks();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, page, limit, userTypeFilter]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userId = await getCurrentUser();
        const userRes = await UserService.getUser(userId);
        setCurrentUser(userRes.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, [getCurrentUser]);

  const fetchStockDetails = async (id) => {
    try {
      // Since we don't have a specific endpoint for single reverse stock,
      // we'll filter from the existing data
      const stock = reverseStocks.find(rs => rs.id === id);
      if (stock) {
        setViewDetails(stock);
      } else {
        toast.error("Reverse stock details not found");
      }
    } catch (error) {
      console.error("Error fetching stock details:", error);
      toast.error("Failed to load reverse stock details");
    }
  };

  useEffect(() => {
    if (viewStockId) {
      fetchStockDetails(viewStockId);
    }
  }, [viewStockId]);

  const ViewDetailsModal = ({ open, onClose, stock }) => {
    if (!stock) return null;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: 600 }}>
          Reverse Stock Details
        </DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Box mb={2}>
                <Typography variant="subtitle2">ID</Typography>
                <Typography>{stock.id}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Requested By</Typography>
                <Typography>
                  {users[stock.requestedBy]?.username ||
                    `User ${stock.requestedBy}`}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Reversed From</Typography>
                <Typography>
                  {users[stock.reversedFrom]?.username ||
                    `User ${stock.reversedFrom}`}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Amount</Typography>
                <Typography>{stock.amount} AFN</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Type</Typography>
                <Typography>{stock.type}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Status</Typography>
                <StatusChip status={stock.status} />
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2">Created At</Typography>
                <Typography>{formatDate(stock.createdAt)}</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {stock.status !== "under_process" && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Action Details
                  </Typography>
                  
                  {stock.reversedBy && (
                    <Box mb={2}>
                      <Typography variant="subtitle2">
                        {stock.status === "reversed" ? "Reversed By" : "Rejected By"}
                      </Typography>
                      <Typography>
                        {users[stock.reversedBy]?.username ||
                          `User ${stock.reversedBy}`}
                      </Typography>
                    </Box>
                  )}

                  {stock.comment && (
                    <Box mb={2}>
                      <Typography variant="subtitle2">Comment</Typography>
                      <Typography sx={{ whiteSpace: "pre-wrap" }}>
                        {stock.comment}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Grid>
            
            {stock.attachment && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Attachment
                </Typography>
                <Card sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <DescriptionIcon sx={{ color: getFileColor(stock.attachment), mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {stock.attachment}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatFileSize(0)} {/* Size not available in response */}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      const baseUrl = import.meta.env.VITE_API_BASE_URL1 || window.location.origin;
                      const fileUrl = `${baseUrl}/uploads/reverseStock_images/${stock.attachment}`;
                      window.open(fileUrl, "_blank");
                    }}
                    sx={{ ml: 2 }}
                  >
                    View
                  </Button>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleReject = async (formData) => {
    try {
      await reverseStockService.rejectReverseStock(rejectionStockId, formData);
      setSuccess(true);
      toast.success("Reverse stock rejected successfully!");
      fetchReverseStocks();
    } catch (error) {
      setNotification({
        value: true,
        text: "Rejection failed. Please try again.",
      });
    }
    setRejectionStockId(null);
  };

  const ConfirmationModal = ({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    confirmColor = "error",
    stockDetails = null,
    showNoteField = false,
    showAttachmentField = false,
  }) => {
    const [note, setNote] = useState("");
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
      setFiles([...e.target.files]);
    };

    const handleRemoveFile = (index) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      setFiles(newFiles);
    };

    const handleConfirm = () => {
      const formData = new FormData();
      if (showNoteField) formData.append("comment", note);
      if (showAttachmentField) {
        files.forEach((file) => formData.append("attachment", file));
      }
      onConfirm(formData);
    };

    const getDetailItem = (label, value) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          "& > *": {
            fontSize: "14px",
          },
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {label}:
        </Typography>
        <Typography variant="body2" fontWeight="500">
          {value}
        </Typography>
      </Box>
    );

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        hideBackdrop
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            p: 3,
            position: "relative",
          },
        }}
      >
        <IconButton
          onClick={onCancel}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#888",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle
          sx={{
            fontSize: "20px",
            fontWeight: "600",
            color: "#1D1D1D",
            textAlign: "center",
            pb: 1,
          }}
        >
          {title}
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#1D1D1D",
              mb: 3,
            }}
          >
            {message}
          </Typography>

          {stockDetails && (
            <Card
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #eee",
                borderRadius: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                Reverse Stock Details
              </Typography>

              {getDetailItem("ID", stockDetails.id)}
              {getDetailItem("Requested By", stockDetails.requestedByUsername)}
              {getDetailItem("Reversed From", stockDetails.reversedFromUsername)}
              {getDetailItem("Amount", `${stockDetails.amount} AFN`)}
              {getDetailItem("Type", stockDetails.type)}
              {getDetailItem(
                "Status",
                <StatusChip status={stockDetails.status} />
              )}
              {getDetailItem("Created At", stockDetails.createdAt)}
            </Card>
          )}

          {showNoteField && (
            <TextField
              fullWidth
              label="Comment (Required)"
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
          )}

          {showAttachmentField && (
            <Box
              sx={{
                mt: 2,
                border: "1px dashed #e0e0e0",
                borderRadius: 2,
                p: 2,
                backgroundColor: "#fafafa",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 48, color: "#1976d2", mb: 1 }}
                />
                <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                  Drag & drop files here or
                </Typography>

                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1565c0" },
                    mb: 1,
                  }}
                >
                  Browse Files
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>

                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ mb: 1 }}
                >
                  Supported formats: JPG, PNG, PDF (max 1 file)
                </Typography>
              </Box>

              {files.length > 0 && (
                <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Selected File:
                  </Typography>
                  <Box>
                    {files.map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1,
                          mb: 1,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1,
                          "&:hover": { backgroundColor: "#eeeeee" },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <DescriptionIcon
                            sx={{
                              color: getFileColor(file.name),
                              mr: 1,
                              fontSize: 20,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="caption"
                            sx={{ mr: 1, color: "#757575" }}
                          >
                            {formatFileSize(file.size)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFile(index)}
                            sx={{ color: "#f44336" }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            px: 3,
            pb: 0,
          }}
        >
          <Button
            onClick={onCancel}
            variant="outlined"
            sx={{
              borderColor: "#1e1e1e",
              color: "#1e1e1e",
              px: 3,
              minWidth: 120,
              "&:hover": {
                borderColor: "#000",
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={showNoteField && !note}
            sx={{
              backgroundColor:
                confirmColor === "error"
                  ? "#d32f2f"
                  : confirmColor === "warning"
                  ? "#ed6c02"
                  : confirmColor === "success"
                  ? "#2e7d32"
                  : "#1976d2",
              color: "#fff",
              px: 3,
              minWidth: 120,
              "&:hover": {
                backgroundColor:
                  confirmColor === "error"
                    ? "#b71c1c"
                    : confirmColor === "warning"
                    ? "#e65100"
                    : confirmColor === "success"
                    ? "#1b5e20"
                    : "#1565c0",
              },
            }}
          >
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userIds = [
        ...new Set(
          reverseStocks.flatMap((stock) => [
            stock.requestedBy,
            stock.reversedFrom,
            stock.reversedBy,
          ])
        ),
      ];

      const usersData = {};
      for (const id of userIds) {
        if (id) {
          try {
            const res = await UserService.getUser(id);
            usersData[id] = res.data;
          } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
          }
        }
      }
      setUsers(usersData);
    };

    if (reverseStocks.length > 0) {
      fetchUserDetails();
    }
  }, [reverseStocks]);

  const dataTableData = {
    columns: [
      { Header: "ID", accessor: "id" },
      { Header: "Requested By", accessor: "requestedBy" },
      { Header: "Reversed From", accessor: "reversedFrom" },
      { Header: "Amount (AFN)", accessor: "amount" },
      { Header: "Type", accessor: "type" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => <StatusChip status={value} />,
      },
      { Header: "Created At", accessor: "createdAt" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => {
          const stock = row.original;
          return (
            <MDBox display="flex" gap={1} alignItems="center">
              {stock.status === "under_process" && (
                (role === "Admin" || role === "manager") && (
                  <Tooltip title="Approve Reverse Stock" arrow>
                    <IconButton
                      onClick={() => {
                        // Handle approval logic
                        toast.info("Approval functionality would be implemented here");
                      }}
                      sx={{ 
                        color: "success.main",
                        '&:hover': { 
                          backgroundColor: 'rgba(46, 125, 50, 0.08)' 
                        } 
                      }}
                    >
                      <CheckCircle fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              )}

              {stock.status === "under_process" && (
                (role === "Admin" || role === "manager") && (
                  <Tooltip title="Reject Request" arrow>
                    <IconButton
                      onClick={() => setRejectionStockId(stock.id)}
                      sx={{ 
                        color: "error.main",
                        '&:hover': { 
                          backgroundColor: 'rgba(211, 47, 47, 0.08)' 
                        } 
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )
              )}

              <Tooltip title="View Details" arrow>
                <IconButton
                  onClick={() => setViewStockId(stock.id)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(2, 136, 209, 0.08)' 
                    } 
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
            </MDBox>
          );
        },
      }
    ],
    rows: reverseStocks.map((stock) => ({
      id: stock.id,
      requestedBy: users[stock.requestedBy]?.username || `User ${stock.requestedBy}`,
      reversedFrom: users[stock.reversedFrom]?.username || `User ${stock.reversedFrom}`,
      amount: `${stock.amount} AFN`,
      type: stock.type,
      status: stock.status,
      createdAt: formatDate(stock.createdAt),
      actions: true,
    })),
  };

  const filteredRows = reverseStocks.filter((stock) => {
    const requestedBy = users[stock.requestedBy]?.username || `User ${stock.requestedBy}`;
    const reversedFrom = users[stock.reversedFrom]?.username || `User ${stock.reversedFrom}`;
    const searchText = search.toLowerCase();
    return (
      stock.id.toString().includes(searchText) ||
      requestedBy.toLowerCase().includes(searchText) ||
      reversedFrom.toLowerCase().includes(searchText) ||
      stock.amount.toString().includes(searchText) ||
      (stock.type || "").toLowerCase().includes(searchText) ||
      (stock.status || "").toLowerCase().includes(searchText) ||
      formatDate(stock.createdAt).toLowerCase().includes(searchText)
    );
  });

  const dataTableDataFiltered = {
    ...dataTableData,
    rows: filteredRows.map((stock) => ({
      id: stock.id,
      requestedBy: users[stock.requestedBy]?.username || `User ${stock.requestedBy}`,
      reversedFrom: users[stock.reversedFrom]?.username || `User ${stock.reversedFrom}`,
      amount: `${stock.amount} AFN`,
      type: stock.type,
      status: stock.status,
      createdAt: formatDate(stock.createdAt),
      actions: true,
    })),
  };

  return (
    <DashboardLayout>
      <ConfirmationModal
        open={!!rejectionStockId}
        title="Confirm Rejection"
        message="Are you sure you want to reject this reverse stock request?"
        onConfirm={handleReject}
        onCancel={() => setRejectionStockId(null)}
        confirmButtonText="Reject"
        confirmColor="error"
        stockDetails={
          rejectionStockId
            ? (() => {
                const stock = reverseStocks.find(rs => rs.id === rejectionStockId);
                return stock ? {
                  ...stock,
                  requestedByUsername: users[stock.requestedBy]?.username || `User ${stock.requestedBy}`,
                  reversedFromUsername: users[stock.reversedFrom]?.username || `User ${stock.reversedFrom}`,
                  createdAt: formatDate(stock.createdAt)
                } : null
              })()
            : null
        }
        showNoteField={true}
        showAttachmentField={true}
      />
      
      <ViewDetailsModal
        open={!!viewStockId}
        onClose={() => setViewStockId(null)}
        stock={viewDetails}
      />
      
      <CreateReverseStockDialog
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
        refreshData={fetchReverseStocks}
        currentUser={currentUser}
      />

      {notification.value && (
        <MDAlert color="info" my="20px">
          <MDTypography variant="body2" color="white">
            {notification.text}
          </MDTypography>
        </MDAlert>
      )}
      
      <MDBox pt={1} pb={3}>
        <Grid container justifyContent="space-between" spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Search Reverse Stocks..."
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Filter by User Type"
              variant="outlined"
              fullWidth
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Reverse Stocks</option>
              <option value="merchant">Merchant Requests</option>
              <option value="retailer">Retailer Requests</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <MDBox>
              {(role === "Admin" || role === "manager") && (
                <MDButton
                  variant="gradient"
                  color="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  startIcon={<FiPlusCircle />}
                >
                  New Reverse Stock
                </MDButton>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      <DataTable
        table={dataTableDataFiltered}
        isLoading={loading || getRequests}
        totalRows={total}
        currentPage={page - 1}
        pageSize={limit}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        showTotalEntries={true}
      />
    </DashboardLayout>
  );
}

export default ReverseStockManagement;