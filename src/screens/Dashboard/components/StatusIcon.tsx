/* --- Begin src/screens/Dashboard/components/StatusIcon.tsx --- */
import type { ParentComponent } from "solid-js";

interface StatusIconProps {
  status: string;
}

const StatusIcon: ParentComponent<StatusIconProps> = (props) => {
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
      case "SENT":
        return "bg-green-100 text-green-800 border-green-200";
      case "UNPAID":
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OVERDUE":
        return "bg-red-100 text-red-800 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div
      class={`flex items-center justify-center border-1 rounded-md max-w-30 text-sm ${getStatusColor(props.status)}`}
    >
      {props.children}
    </div>
  );
};

export default StatusIcon;
