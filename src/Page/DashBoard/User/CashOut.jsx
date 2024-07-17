import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useStatus from "../../../hooks/useStatus";

const CashOut = () => {
  const navigate = useNavigate();
  const [status, isLoading] = useStatus();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [users, setUsers] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const userEmail = user?.email;
  const userName = user?.name;

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosSecure.get("/UsersData");
        // Filter out  user's email
        const filteredUsers = data.filter(
          (u) =>
            u.role === "agent" &&
            u.status === "approved" &&
            u.email !== user?.email
        );
        setUsers(filteredUsers.map((u) => u.email));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [axiosSecure, user.email]);

  const handleSendMoney = async () => {
    if (!amount || !pin) {
      toast.error("Please enter amount and PIN.");
      return;
    }

    try {
      const { data } = await axiosSecure.post("/cashOut", {
        recipientEmail,
        amount,
        pin,
      });

      toast.success(data.message);
      //   console.log(data.result.modifiedCount);
      if (data.result.modifiedCount > 0) {
        const totalAmount = data?.totalAmountToDeduct;
        const type = "Cash Out";
        const history = {
          recipientEmail,
          amount,
          userEmail,
          userName,
          type,
          totalAmount,
        };
        // console.table(history);
        const res = await axiosSecure.post("/historyData", history);
        if (res.data?.historyResult?.insertedId) {
          navigate("/dashboard/userTransactions");
        }
      }

      // Reset form fields after successful transaction
      setRecipientEmail("");
      setAmount("");
      setPin("");
    } catch (error) {
      toast.error(`Error: ${error.response.data.message}`);
    }
  };
  if (isLoading) return <div>Loading .....</div>;
  return (
    <>
      {status === "approved" ? (
        <div className="flex flex-col min-h-screen">
          <h2 className="text-lg md:text-3xl font-semibold text-center my-6">
            Cash Out
          </h2>
          <div className="my-5">
            <select
              className="select select-bordered mb-3 w-full"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            >
              <option value="">Select Agent Email</option>
              {users.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered mb-3 w-full"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <input
              className="input input-bordered mb-3 w-full"
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              className="btn bg-blue-500 text-white"
              onClick={handleSendMoney}
            >
              Cash Out
            </button>
          </div>
        </div>
      ) : (
        <h2>Please Wait For Admin Approved</h2>
      )}
    </>
  );
};

export default CashOut;
