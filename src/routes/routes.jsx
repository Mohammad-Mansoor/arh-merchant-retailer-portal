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
  Undo2Icon,
  FileBarChart2,
  Package,
  GraduationCap,
  Headphones,
} from "lucide-react";

export const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  },
  {
    icon: <Wallet />,
    name: "Wallet",
    subItems: [
      { name: "Manage Wallet", path: "/manage-wallet", pro: false },
      {
        name: "Transfer From Commission to Primary",
        path: "/comission-to-primary",
        pro: false,
      },
      {
        name: "Stock Transfer to Downline Agents",
        path: "/stock-transfer-downline",
        pro: false,
      },
    ],
  },
  {
    icon: <UserCog />,
    name: "Agent Management",
    subItems: [
      {
        name: "Manage Agent",
        path: "/manage-agent",
        pro: false,
      },
    ],
  },
  {
    icon: <Wallet />,
    name: "Product Page",
    subItems: [
      { name: "Product List", path: "/product-list", pro: false },
      {
        name: "Recharge/Topup",
        path: "/recharge",
        pro: false,
      },
    ],
  },

  {
    icon: <Undo2Icon />,
    name: "Rollback Operation",
    path: "/rollback-operation",
  },
  {
    icon: <FileBarChart2 />,
    name: "Reports",
    subItems: [
      {
        name: "Product Activation Report",
        path: "/transaction-report",
        pro: false,
      },
      {
        name: "Stock out & in Report",
        path: "/stock-out-in-report",
        pro: false,
      },
      {
        name: "Downline Stock In & Out Report",
        path: "/downline-report",
        pro: false,
      },
      {
        name: "Downline Product Activation Report",
        path: "/downline-product-activation",
        pro: false,
      },
      {
        name: "Downline Recharge Report",
        path: "/downline-recharge-report",
        pro: false,
      },
      {
        name: "Rollback Report",
        path: "/rollback-report",
        pro: false,
      },
      {
        name: "Topup Recharge Report",
        path: "/topup-report",
        pro: false,
      },
    ],
  },

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
    name: "User Profile",
    path: "/profile",
  },
  {
    icon: <Headphones />,
    name: "Contact Us",
    path: "/contact-us",
  },
  {
    icon: <GraduationCap />,
    name: "Toturial",
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
