import Favorites from "./favorites";
import Invoices from "./invoices";
import Orders from "./orders";
import Profile from "./profile";
import Settings from "./settings";
import Transactions from "./transactions";

interface MainContentProps {
  activeTab: string;
  emuted?: boolean;
  isloading?: boolean;
  theme: string;
}

export default function MainContent({
  activeTab,
  emuted = true,
  isloading = true,
  theme,
}: MainContentProps) {
  switch (activeTab) {
    case "profile":
      return <Profile emuted={emuted} />;
    case "orders":
      return <Orders emuted={emuted} />;
    case "favorites":
      return <Favorites emuted={emuted} />;
    case "settings":
      return <Settings emuted={emuted} theme={theme} />;
    case "invoices":
      return <Invoices />;
    case "transactions":
      return <Transactions />;
  }
}
