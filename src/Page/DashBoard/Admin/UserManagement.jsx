import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaSearch, FaUserCheck, FaUserTie, FaUserSlash, FaTrash } from "react-icons/fa";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch } = useQuery({
    queryKey: ["manageUsers", search],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/UsersData", {
        params: { search },
      });
      return data;
    },
  });

  const updateUserRole = useMutation({
    mutationFn: async ({ email, role, status }) => {
      const { data } = await axiosSecure.patch(`/users/update/${email}`, {
        role,
        status,
      });
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success("User role updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (email) => {
      const { data } = await axiosSecure.delete(`/users/${email}`);
      return data;
    },
    onSuccess: () => {
      refetch();
      toast.success("User deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleRoleChange = (email, role, status) => {
    updateUserRole.mutate({ email, role, status });
  };

  const handleDelete = (email) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUser.mutate(email);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <div>
           <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
           <p className="text-sm text-gray-500 mt-1">Manage user roles and statuses</p>
         </div>
         
         <div className="flex items-center w-full md:w-auto max-w-sm bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 focus-within:ring-2 focus-within:ring-[#1A3626]/20 focus-within:border-[#1A3626] transition-all">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
            />
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-xl">#</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-green-50/30 transition-colors">
                <th className="py-4 px-4 font-medium text-gray-400">{idx + 1}</th>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.email}</p>
                </td>
                <td className="py-4 px-4">
                   <span className="px-3 py-1 bg-[#ecfdf5] text-[#1A3626] rounded-full text-xs font-bold capitalize">{item.role}</span>
                </td>
                <td className="py-4 px-4">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${item.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                     {item.status || "Pending"}
                   </span>
                </td>
                <td className="py-4 px-4">
                   <div className="flex items-center justify-center gap-2">
                     <button
                       className="p-2 bg-[#bbf7d0] hover:bg-[#86efac] text-[#1A3626] rounded-lg transition-colors tooltip"
                       title="Set as User"
                       onClick={() => handleRoleChange(item.email, "user", "approved")}
                       disabled={item.status === "approved" && item.role === "user"}
                     >
                       <FaUserCheck />
                     </button>
                     <button
                       className="p-2 bg-[#1A3626] hover:bg-[#14281c] text-white rounded-lg transition-colors tooltip"
                       title="Set as Agent"
                       onClick={() => handleRoleChange(item.email, "agent", "approved")}
                       disabled={item.status === "approved" && item.role === "agent"}
                     >
                       <FaUserTie />
                     </button>
                     <button
                       className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-colors tooltip"
                       title="Block User"
                       onClick={() => handleRoleChange(item.email, item.role, "Blocked")}
                       disabled={item.status === "Blocked"}
                     >
                       <FaUserSlash />
                     </button>
                      <button
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this user?")) {
                            deleteUser.mutate(item.email);
                          }
                        }}
                      >
                        <FaTrash />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
