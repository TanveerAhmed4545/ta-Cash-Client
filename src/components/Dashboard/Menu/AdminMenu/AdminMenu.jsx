import { FaUsersCog } from "react-icons/fa";
import MenuItem from "../MenuItem/MenuItem";

const AdminMenu = () => {
  return (
    <>
      <MenuItem
        label={"User Management"}
        address={"user-Management"}
        icon={FaUsersCog}
      ></MenuItem>
    </>
  );
};

export default AdminMenu;
