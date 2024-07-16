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
    </>
  );
};

export default AdminMenu;
