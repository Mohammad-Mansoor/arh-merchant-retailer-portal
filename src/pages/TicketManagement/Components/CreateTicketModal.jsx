import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTicket, getTicketTypes } from "../../../services/ticketService";
import { useSelector } from "react-redux";
import TicketSuccessModal from "./SuccessModal";
import TicketErrorModal from "./ErrorModal";

export default function MerchantCreateTicketModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    ticketTypeId: "",
    mobileNumber: "",
    txnNumber: "",
    description: "",
    attachment: null,
  });
  const userInfo = useSelector((state) => state.auth.user); 
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [createdTicket, setCreatedTicket] = useState(null);
  
const { data: ticketTypes = [] } = useQuery({
  queryKey: ["ticketTypes"],
  queryFn: getTicketTypes
});


  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (response) => {
      setCreatedTicket(response.data);
      setIsSuccess(true);
      onSuccess();
    },
    onError: (error) => {
      console.error("Ticket creation failed:", error);
      setErrorMessage(error.response?.data?.message || "Failed to create ticket. Please try again.");
      setIsError(true);
    },
  });

  useEffect(() => {
    if (formData.ticketTypeId && ticketTypes) {
      const type = ticketTypes.find(t => t.id === parseInt(formData.ticketTypeId));
      setSelectedTicketType(type);
    } else {
      setSelectedTicketType(null);
    }
  }, [formData.ticketTypeId, ticketTypes]);

   useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsError(false);
      setErrorMessage("");
      setCreatedTicket(null);
    }
  }, [open]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, attachment: file }));
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.ticketTypeId) {
      errors.ticketTypeId = "Ticket type is required";
    }
    
    if (!formData.description) {
      errors.description = "Description is required";
    }
    

    if (selectedTicketType) {
      const typeName = selectedTicketType.name.toLowerCase();
      
      if (typeName.includes("mistaken") || typeName.includes("recharge")) {
        if (!formData.mobileNumber) {
          errors.mobileNumber = "Mobile number is required";
        }
        
        if (!formData.txnNumber) {
          errors.txnNumber = "Transaction number is required";
        }
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const form = new FormData();
    form.append("agentId", userInfo?.id); 
    form.append("ticketTypeId", formData.ticketTypeId);
    form.append("description", formData.description);
    
    if (formData.mobileNumber) form.append("mobileNumber", formData.mobileNumber);
    if (formData.txnNumber) form.append("txnNumber", formData.txnNumber);
    if (formData.attachment) form.append("attachment", formData.attachment);
    
    mutation.mutate(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <TicketSuccessModal
        open={isSuccess}
        onClose={() => {
          setIsSuccess(false);
          onClose();
        }}
        payload={createdTicket}
      />
      
      <TicketErrorModal
        open={isError}
        onClose={() => setIsError(false)}
        error={errorMessage}
        onRetry={() => mutation.mutate(form)}
      />
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center pb-4 border-b">
            <h3 className="text-xl font-semibold">Create New Ticket</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ticket Type *
              </label>
              <select
                name="ticketTypeId"
                value={formData.ticketTypeId}
                onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              >
                <option value="">Select a ticket type</option>
                {ticketTypes?.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {validationErrors.ticketTypeId && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.ticketTypeId}</p>
              )}
            </div>
            
            {selectedTicketType && (
              <>
                {(selectedTicketType.name.toLowerCase().includes("mistaken") || 
                  selectedTicketType.name.toLowerCase().includes("recharge")) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mobile Number *
                      </label>
                      <input
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      />
                      {validationErrors.mobileNumber && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.mobileNumber}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Transaction Number *
                      </label>
                      <input
                        type="text"
                        name="txnNumber"
                        value={formData.txnNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      />
                      {validationErrors.txnNumber && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.txnNumber}</p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              ></textarea>
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Attachment
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="py-2 px-3 border border-gray-300 rounded-md text-sm"
                />
                {filePreview && (
                  <div className="ml-4">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {mutation.isLoading ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}