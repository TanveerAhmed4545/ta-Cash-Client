import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../Provider/AuthProvider";

const AgentTransactions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  //   console.log(user.email);
  const { data: history = [] } = useQuery({
    queryKey: ["agentTransactionsHistory", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/${user.email}`);
      return res.data;
    },
  });
  return (
    <div>
      <h2 className="text-3xl font-semibold text-center my-6">
        User Transactions :{history.length}
      </h2>

      <div className="overflow-x-auto min-h-[60vh]">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-[#e5ebee]">
              <th>#</th>
              <th>Transaction Id</th>
              {/* <th>Sender Name</th> */}
              <th>Sender Email</th>
              <th>Recipient Email</th>
              <th>Send Price</th>
              <th>Receiving price</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={item._id} className="bg-base-200">
                <th>{idx + 1}</th>
                <td>{item._id}</td>
                {/* <td>{item.userName}</td> */}
                <td>{item.userEmail}</td>
                <td>{item.recipientEmail}</td>
                <td>${item.amount}</td>
                <td>${item.totalAmount}</td>
                <td>{item.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentTransactions;
