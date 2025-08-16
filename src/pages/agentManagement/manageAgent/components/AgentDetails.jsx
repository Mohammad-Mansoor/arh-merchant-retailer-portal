import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "@mui/material";
import { Pencil } from "lucide-react";
import { getAgentById } from "../../../../services/agent_management_service.js";
import CircularProgress from "@mui/material/CircularProgress";


const getTranslatedValue = (value) => {
  if (!value) return "-";
  if (typeof value === 'string') return value;
  
  // Get current language from localStorage or default to 'en'
  const lang = localStorage.getItem('i18nextLng') || 'en';
  return value[lang] || value.en || value.dr || value.ps || "-";
};
const SectionCard = ({ title, onEdit, children }) => (
  <Card
    className="p-4 rounded-2xl border border-slate-200 shadow-sm"
    style={{ boxShadow: "none" }}
  >
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
        {title}
      </h2>
      <Button
        variant="outline"
        size="sm"
        className="gap-1 px-3 text-sm"
        onClick={onEdit}
      >
        <Pencil className="w-4 h-4" /> Edit
      </Button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
      {children}
    </div>
  </Card>
);
// const LabelValue = ({ label, value }) => {
//   // Handle translation objects
//   const getDisplayValue = (val) => {
//     if (!val) return "-";
//     if (typeof val === 'object') {
//       // Get current language from localStorage or default to 'en'
//       const lang = localStorage.getItem('i18nextLng') || 'en';
//       return val[lang] || val.en || JSON.stringify(val);
//     }
//     return val;
//   };

//   return (
//     <div>
//       <div className="text-xs text-gray-500 mb-1">{label}</div>
//       <div className="font-medium text-gray-800 dark:text-white">
//         {getDisplayValue(value)}
//       </div>
//     </div>
//   );
// };
const LabelValue = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="font-medium text-gray-800 dark:text-white">
      {getTranslatedValue(value)}
    </div>
  </div>
);

const AgentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;
useEffect(() => {
  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const response = await getAgentById(id);
      console.log("this is single agent data", response);
      setAgentData(response); // Use the response directly
      setLoading(false);
    } catch (error) {
      console.error("Error fetching agent:", error);
      setLoading(false);
    }
  };

  fetchAgentData();
}, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!agentData) {
    return <div className="text-center py-10">Agent not found</div>;
  }

  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      <div className="max-w-5xl mx-auto space-y-6 px-6 py-6 rounded-2xl border border-[#E4E7EC]">
        <Card className="p-4 rounded-2xl border border-slate-200" style={{ boxShadow: "none" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={`${IMG_BASE_URL}${agentData?.user?.profile_picture}`}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {agentData.user?.username}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
          {agentData.user?.id} | {getTranslatedValue(agentData.districtDetails?.districtName)}
        </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 px-3 text-sm"
              onClick={() => navigate(`/edit-agent/${id}`)}
            >
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </div>
        </Card>

        <SectionCard title="Personal Information">
          <LabelValue label="Username" value={agentData.user?.username} />
          <LabelValue label="Email address" value={agentData.user?.email} />
          <LabelValue label="Phone" value={agentData.user?.mobileNumber} />
          <LabelValue
            label="Alternative Contact"
            value={agentData.alternativeContact}
          />
        </SectionCard>

       <SectionCard title="Address">
  <LabelValue 
    label="Country" 
    value={agentData.countryDetails?.countryName} 
  />
  <LabelValue 
    label="Province" 
    value={agentData.provinceDetails?.provinceName} 
  />
  <LabelValue 
    label="District" 
    value={agentData.districtDetails?.districtName} 
  />
  <LabelValue label="Full Address" value={agentData.address} />
</SectionCard>

       <SectionCard title="Account Information">
  <LabelValue 
    label="Account Type" 
    value={agentData.accountType} 
  />
  <LabelValue 
    label="Registration Type" 
    value={agentData.registrationType} 
  />
  <LabelValue 
    label="Message Language" 
    value={agentData.messageLanguage} 
  />
  <LabelValue 
    label="Status" 
    value={agentData.user?.status} 
  />
</SectionCard>
      </div>
    </div>
  );
};

export default AgentProfile;