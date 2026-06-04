import {
  BarChart3,
  IdCard,
  LayoutDashboard,
  Users
} from "lucide-react";

const admin = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: Users,
    label: "Clients",
    href: "/admin/customers",
  },
    {
    icon: IdCard,
    label: "Employés",
    href: "/admin/employees",
  },
  {
    icon: BarChart3,
    label: "Transactions",
    href: "/admin/transactions",
  },
];

const links = {
  admin,
};

export default links;
