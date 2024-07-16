import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useAuth } from "../../../Provider/AuthProvider";

const SendMoney = () => {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [users, setUsers] = useState([]);
  const axiosPublic = useAxiosPublic();
  const { user, getToken } = useAuth();
  const userEmail = user.email;
  const userName = user.name;
  const type = "Send Money";
  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosPublic.get("/UsersData");
        // Filter out  user's email
        const filteredUsers = data.filter(
          (u) => u.role === "user" && u.email !== user?.email
        );
        setUsers(filteredUsers.map((u) => u.email));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [axiosPublic, user.email]);

  const handleSendMoney = async () => {
    if (amount < 50) {
      toast.error("Minimum transaction amount is 50 Taka.");
      return;
    }

    try {
      const token = await getToken();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosPublic.post(
        "/sendMoney",
        {
          recipientEmail,
          amount,
          pin,
        },
        config
      );

      toast.success(data.message);
      console.log(data.result.modifiedCount);
      if (data.result.modifiedCount > 0) {
        const history = {
          recipientEmail,
          amount,
          userEmail,
          userName,
          type,
        };
        console.table(history);
        const res = await axiosPublic.post("/historyData", history, config);
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
  return (
    <div className="flex flex-col min-h-screen">
      <div className="my-5">
        <select
          className="select select-bordered mb-3 w-full"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        >
          <option value="">Select Recipient Email</option>
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
          Send Money
        </button>
      </div>
    </div>
  );
};

export default SendMoney;
