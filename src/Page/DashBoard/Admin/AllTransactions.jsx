import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../Provider/AuthProvider";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AllTransactions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: history = [] } = useQuery({
    queryKey: ["allHistory", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/allHistory`);
      return res.data;
    },
  });
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
         <div>
           <h2 className="text-2xl font-bold text-gray-900">User Transactions</h2>
           <p className="text-sm text-gray-500 mt-1">Total {history.length} transactions recorded</p>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-xl">#</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction Id</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sender</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recipient</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-xl">Type</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, idx) => (
              <tr key={item._id} className="border-b border-gray-50 last:border-0 hover:bg-green-50/30 transition-colors">
                <th className="py-4 px-4 font-medium text-gray-400">{idx + 1}</th>
                <td className="py-4 px-4">
                  <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{item._id.substring(0, 10)}...</span>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-gray-800">{item.userName || "Unknown"}</p>
                  <p className="text-xs text-gray-500">{item.userEmail}</p>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{item.recipientEmail}</td>
                <td className="py-4 px-4 text-sm font-bold text-[#1A3626]">${item.amount}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-[#ecfdf5] text-[#1A3626] rounded-full text-xs font-bold capitalize">{item.type}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTransactions;
