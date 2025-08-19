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
  //  {
  //   icon: <Ticket />,
  //   name: "TicketManagement",
  //   path: "/ticket-management",
  // },
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
  
];

export const othersItems = [
  {
    icon: <UserCircleIcon />,
    name: "UserProfile",
    path: "/profile",
  },
  {
    icon: <Headphones />,
  name: "Support",
    path: "/ticket-management",
  },
  // {
  //   icon: <GraduationCap />,
  //   name: "Tutorial",
  //   path: "/toturial",
  // },
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
