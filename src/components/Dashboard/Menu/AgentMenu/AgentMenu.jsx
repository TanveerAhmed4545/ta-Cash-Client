import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrTransaction } from "react-icons/gr";
import MenuItem from "../MenuItem/MenuItem";

const AgentMenu = () => {
  return (
    <>
      <MenuItem
        label={"Transfer Management"}
        address={"transferManagement"}
        icon={FaMoneyBillTransfer}
      ></MenuItem>
      <MenuItem
        label={"Agent Transactions"}
        address={"agentTransactions"}
        icon={GrTransaction}
      ></MenuItem>
      <MenuItem
        label={"Request Cash-In"}
        address={"requestCashIn"}
        icon={FaMoneyBillTransfer}
      ></MenuItem>
    </>
  );
};

export default AgentMenu;
