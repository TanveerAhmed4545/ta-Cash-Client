import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../Provider/AuthProvider";

const CashIn = () => {
  //   const navigate = useNavigate();
  const [agentEmail, setAgentEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [agents, setAgents] = useState([]);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const userEmail = user?.email;
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await axiosSecure.get("/UsersData");
        const filteredAgents = data.filter(
          (u) =>
            u.role === "agent" &&
            u.status === "approved" &&
            u.email !== user?.email
        );
        setAgents(filteredAgents.map((u) => u.email));
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, [axiosSecure, user.email]);

  const handleCashInRequest = async () => {
    if (!amount || !agentEmail) {
      toast.error("Please enter amount and select an agent.");
      return;
    }

    try {
      const { data } = await axiosSecure.post("/cashInRequest", {
        userEmail,
        agentEmail,
        amount,
      });

      toast.success(data.message);

      setAgentEmail("");
      setAmount("");
    } catch (error) {
      toast.error(`Error: ${error.response.data.message}`);
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <h2 className="text-lg md:text-3xl font-semibold text-center my-6">
        Cash In
      </h2>
      <div className="my-5">
        <select
          className="select select-bordered mb-3 w-full"
          value={agentEmail}
          onChange={(e) => setAgentEmail(e.target.value)}
        >
          <option value="">Select Agent Email</option>
          {agents.map((email) => (
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
        <button
          className="btn bg-blue-500 text-white"
          onClick={handleCashInRequest}
        >
          Send Cash-In Request
        </button>
      </div>
    </div>
  );
};

export default CashIn;
