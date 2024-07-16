import { GrTransaction } from "react-icons/gr";
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
      <MenuItem
        label={"User Transactions"}
        address={"userTransactions"}
        icon={GrTransaction}
      ></MenuItem>
    </>
  );
};

export default UserMenu;
