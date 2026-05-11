import { FaUsersCog } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import MenuItem from "../MenuItem/MenuItem";

const AdminMenu = () => {
 return (
 <>
 <MenuItem
 label={"User Management"}
 address={"user-Management"}
 icon={FaUsersCog}
 ></MenuItem>
 <MenuItem
 label={"All Transactions"}
 address={"allTransactions"}
 icon={GrTransaction}
 ></MenuItem>
 <MenuItem
 label={"Manage Requests"}
 address={"manage-transactions"}
 icon={GrTransaction}
 ></MenuItem>
 <MenuItem
 label={"Analytics"}
 address={"admin-analytics"}
 icon={GrTransaction}
 ></MenuItem>
 <MenuItem
 label={"Audit Logs"}
 address={"audit-logs"}
 icon={FaUsersCog}
 ></MenuItem>
 <MenuItem
 label={"System Settings"}
 address={"system-settings"}
 icon={FaUsersCog}
 ></MenuItem>
 </>
 );
};

export default AdminMenu;
