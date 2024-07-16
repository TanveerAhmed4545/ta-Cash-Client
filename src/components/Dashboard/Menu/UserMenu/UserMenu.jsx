import { MdOutlineSendToMobile } from "react-icons/md";
import MenuItem from "../MenuItem/MenuItem";

const UserMenu = () => {
  return (
    <>
      <MenuItem
        label={"Send Money"}
        address={"send-Money"}
        icon={MdOutlineSendToMobile}
      ></MenuItem>
    </>
  );
};

export default UserMenu;
