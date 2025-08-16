import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";

import {
  Wallet,
  UserCog,
  FileBarChart2,
  GraduationCap,
  Headphones,
  Ticket,
} from "lucide-react";
export const navItems = [
 
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <Wallet />,
    name: "Stock",
    subItems: [
      { name: "MyWallet", path: "/manage-wallet", pro: false },
      // {
      //   name: "Transfer From Commission to Primary",
      //   path: "/comission-to-primary",
      //   pro: false,
      // },
      {
        name: "PurchaseStock",
        path: "/purchase-stock",
        pro: false,
      },
      //  {
      //   name: "Orders",
      //   path: "/orders",
      //   pro: false,
      // },
        {
        name: "StockTransfer",
        path: "/stock-transfer-downline",
        pro: false,
      },
          {
        name: "RequestReverse",
        path: "/request-reverse",
        pro: false,
      },
    ],
  },
  {
    icon: <UserCog />,
    name: "MerchantManagement",
    subItems: [
      {
        name: "ManageAgent",
        path: "/manage-agent",
        pro: false,
      },
    ],
  },
   {
    icon: <Ticket />,
    name: "TicketManagement",
    path: "/ticket-management",
  },
    {
    icon: <FileBarChart2 />,
    name: "Statement",
    path: "/statment",
  },
  {
    icon: <Wallet />,
    name: "Products",
    subItems: [
      { name: "ProductList", path: "/product-list", pro: false },
      {
        name: "Recharge",
        path: "/recharge",
        pro: false,
      },
    ],
  },
  // {
  //   icon: <Undo2Icon />,
  //   name: "Rollback Operation",
  //   path: "/rollback-operation",
  // },
  // {
  //   icon: <FileBarChart2 />,
  //   name: "Reports",
  //   subItems: [
  //     {
  //       name: "Product Activation Report",
  //       path: "/transaction-report",
  //       pro: false,
  //     },
  //     {
  //       name: "Stock out & in Report",
  //       path: "/stock-out-in-report",
  //       pro: false,
  //     },
  //     {
  //       name: "Downline Stock In & Out Report",
  //       path: "/downline-report",
  //       pro: false,
  //     },
  //     {
  //       name: "Downline Product Activation Report",
  //       path: "/downline-product-activation",
  //       pro: false,
  //     },
  //     {
  //       name: "Downline Recharge Report",
  //       path: "/downline-recharge-report",
  //       pro: false,
  //     },
  //     {
  //       name: "Rollback Report",
  //       path: "/rollback-report",
  //       pro: false,
  //     },
  //     {
  //       name: "Topup Recharge Report",
  //       path: "/topup-report",
  //       pro: false,
  //     },
  //   ],
  // },

  // {
  //   icon: <CalenderIcon />,
  //   name: "Calendar",
  //   path: "/calendar",
  // },

  // {
  //   name: "Forms",
  //   icon: <ListIcon />,
  //   subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  // },
  // {
  //   name: "Tables",
  //   icon: <TableIcon />,
  //   subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  // },
  // {
  //   name: "Pages",
  //   icon: <PageIcon />,
  //   subItems: [
  //     { name: "Blank Page", path: "/blank", pro: false },
  //     { name: "404 Error", path: "/error-404", pro: false },
  //   ],
  // },
];

export const othersItems = [
  {
    icon: <UserCircleIcon />,
    name: "UserProfile",
    path: "/profile",
  },
  {
    icon: <Headphones />,
    name: "ContactUs",
    path: "/contact-us",
  },
  {
    icon: <GraduationCap />,
    name: "Tutorial",
    path: "/toturial",
  },
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];
