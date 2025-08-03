import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Avatar, Card, Button } from "@mui/material";

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

const LabelValue = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="font-medium text-gray-800 dark:text-white">{value}</div>
  </div>
);

const AgentProfile = () => {
  return (
    <div className="w-full px-5 py-4 min-h-screen h-auto bg-[linear-gradient(135deg,_#EFF2FF_0%,_#FAF5FF_50%,_#FCF3FB_100%)] dark:bg-[linear-gradient(135deg,_#1e293b_0%,_#334155_50%,_#0f172a_100%)]">
      <div className="max-w-5xl mx-auto space-y-6  px-6 py-6 rounded-2xl border border-[#E4E7EC]">
        <Card
          className="p-4 rounded-2xl border border-slate-200 "
          style={{ boxShadow: "none" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar sx={{ width: 64, height: 64, bgcolor: "#c58b8b" }}>
                {data.name[0]}
              </Avatar>
              <div>
                <div className="text-lg font-semibold text-gray-800 dark:text-white">
                  {data.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {data.id} | {data.location}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1 px-3 text-sm">
              <Pencil className="w-4 h-4" /> Edit
            </Button>
          </div>
        </Card>

        <SectionCard title="Personal Information">
          <LabelValue label="First Name" value="Karim" />
          <LabelValue label="Last Name" value="Sadiq" />
          <LabelValue label="Email address" value={data.email} />
          <LabelValue label="Phone" value={data.phone} />
        </SectionCard>

        <SectionCard title="Address">
          <LabelValue label="Country" value={data.address.country} />
          <LabelValue label="Province" value={data.address.province} />
          <LabelValue label="District" value={data.address.district} />
          <LabelValue label="Full Address" value={data.address.fullAddress} />
        </SectionCard>
      </div>
    </div>
  );
};

export default AgentProfile;
