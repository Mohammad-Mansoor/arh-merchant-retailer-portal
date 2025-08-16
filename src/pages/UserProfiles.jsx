import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Avatar, Card, Button } from "@mui/material";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
// const data = {
//   id: "ARH00001",
//   name: "Karim Sadiq",
//   location: "Kabul, Afghanistan",
//   email: "karimSadiq@gmail.com",
//   phone: "+93 700 000 000",
//   address: {
//     country: "Afghanistan",
//     province: "Kabul",
//     district: "Kabul",
//     fullAddress: "Shahrnaw_kabul_afghanistan",
//   },
// };

// const SectionCard = ({ title, onEdit, children }) => (
//   <Card
//     className="p-4 rounded-2xl border border-slate-200 shadow-sm"
//     style={{ boxShadow: "none" }}
//   >
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
//         {title}
//       </h2>
//       <Button
//         variant="outline"
//         size="sm"
//         className="gap-1 px-3 text-sm"
//         onClick={onEdit}
//       >
//         <Pencil className="w-4 h-4" /> Edit
//       </Button>
//     </div>
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
//       {children}
//     </div>
//   </Card>
// );

// const LabelValue = ({ label, value }) => (
//   <div>
//     <div className="text-xs text-gray-500 mb-1">{label}</div>
//     <div className="font-medium text-gray-800 dark:text-white">{value}</div>
//   </div>
// );

const UserProfiles = () => {
  return (
     <>
     <div className="p-8">
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6 ">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
      </div>
    </>
    // <div
    //   style={{
    //     background:
    //       "linear-gradient(135deg, #EFF2FF 0%, #FAF5FF 50%, #FCF3FB 100%) ",
    //   }}
    //   className="p-4 sm:p-6 md:p-10 bg-[#f9f9fb] dark:bg-slate-900 min-h-screen"
    // >
    //   <div className="max-w-5xl mx-auto space-y-6 bg-white px-6 py-6 rounded-2xl border border-[#E4E7EC]">
    //     <Card
    //       className="p-4 rounded-2xl border border-slate-200 "
    //       style={{ boxShadow: "none" }}
    //     >
    //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    //         <div className="flex items-center gap-4">
    //           <Avatar sx={{ width: 64, height: 64, bgcolor: "#c58b8b" }}>
    //             {data.name[0]}
    //           </Avatar>
    //           <div>
    //             <div className="text-lg font-semibold text-gray-800 dark:text-white">
    //               {data.name}
    //             </div>
    //             <div className="text-sm text-gray-600 dark:text-gray-400">
    //               {data.id} | {data.location}
    //             </div>
    //           </div>
    //         </div>
    //         <Button variant="outline" size="sm" className="gap-1 px-3 text-sm">
    //           <Pencil className="w-4 h-4" /> Edit
    //         </Button>
    //       </div>
    //     </Card>

    //     <SectionCard title="Personal Information">
    //       <LabelValue label="First Name" value="Karim" />
    //       <LabelValue label="Last Name" value="Sadiq" />
    //       <LabelValue label="Email address" value={data.email} />
    //       <LabelValue label="Phone" value={data.phone} />
    //     </SectionCard>

    //     <SectionCard title="Address">
    //       <LabelValue label="Country" value={data.address.country} />
    //       <LabelValue label="Province" value={data.address.province} />
    //       <LabelValue label="District" value={data.address.district} />
    //       <LabelValue label="Full Address" value={data.address.fullAddress} />
    //     </SectionCard>
    //   </div>
    // </div>
  );
};

export default UserProfiles;
