import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { FiX } from "react-icons/fi";
import { useAuth } from "@context/index";
import UserService from "@services/users-service";
import reverseStockService from "@services/reverseStockService";
import { toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

const CreateReverseStockDialog = ({ open, handleClose, refreshData, currentUser }) => {
  const [formData, setFormData] = useState({
    reversedFrom: "",
    amount: "",
    comment: "",
    attachment: null,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const { getCurrentUser } = useAuth();

  const getFileColor = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "#f44336";
    if (["pdf"].includes(ext)) return "#ff5722";
    if (["doc", "docx"].includes(ext)) return "#2196f3";
    if (["xls", "xlsx"].includes(ext)) return "#4caf50";
    return "#9e9e9e";
  };

  const fetchUsers = async () => {
    try {
      const userId = await getCurrentUser();
      const res = await UserService.getAllUsers();
      // Filter to show only agents/merchants that the current user can reverse from
      const filteredUsers = res.data.filter(user => 
        user.user_type === "agent" && user.id !== userId
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, attachment: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview({
          name: file.name,
          url: reader.result,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setFormData({ ...formData, attachment: null });
    setFilePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.reversedFrom || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    try {
      setLoading(true);
      const formPayload = new FormData();
      formPayload.append("reversedFrom", formData.reversedFrom);
      formPayload.append("amount", formData.amount);
      formPayload.append("comment", formData.comment || "");
      if (formData.attachment) {
        formPayload.append("attachment", formData.attachment);
      }
      formPayload.append("type", "backoffice");

      await reverseStockService.createReverseStockByBackoffice(formPayload);
      
      toast.success("Reverse stock created successfully!");
      refreshData();
      handleClose();
      resetForm();
    } catch (error) {
      console.error("Error creating reverse stock:", error);
      toast.error("Failed to create reverse stock");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      reversedFrom: "",
      amount: "",
      comment: "",
      attachment: null,
    });
    setFilePreview(null);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Create New Reverse Stock
        </Typography>
        <Button onClick={handleClose} sx={{ minWidth: "auto", p: 0.5 }}>
          <FiX size={24} />
        </Button>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" required>
              <InputLabel id="reversed-from-label">Reverse From</InputLabel>
              <Select
                labelId="reversed-from-label"
                id="reversedFrom"
                name="reversedFrom"
                value={formData.reversedFrom}
                onChange={handleChange}
                label="Reverse From"
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount (AFN)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              inputProps={{ min: 0, step: "0.01" }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box
              sx={{
                border: "1px dashed #e0e0e0",
                borderRadius: 1,
                p: 3,
                textAlign: "center",
                backgroundColor: "#fafafa",
              }}
            >
              {filePreview ? (
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      mb: 1,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <DescriptionIcon
                        sx={{
                          color: getFileColor(filePreview.name),
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">{filePreview.name}</Typography>
                    </Box>
                    <Button
                      size="small"
                      onClick={handleRemoveFile}
                      color="error"
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#1976d2", mb: 1 }} />
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Drag & drop files here or
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    />
                  </Button>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    Supported formats: JPG, PNG, PDF, DOC (max 1 file)
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="inherit"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || !formData.reversedFrom || !formData.amount}
        >
          {loading ? <CircularProgress size={24} /> : "Create Reverse Stock"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateReverseStockDialog;