import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

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

  const handleRoleChange = (email, role, status) => {
    updateUserRole.mutate({ email, role, status });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="my-5">
        <input
          className="input input-bordered mb-3 w-full"
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-[#e5ebee]">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Set as User</th>
              <th>Set as Agent</th>
              <th>Block</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users.map((item, idx) => (
              <tr key={idx} className="hover">
                <th>{idx + 1}</th>
                <td className="font-medium">{item.name}</td>
                <td className="font-medium">{item.email}</td>
                <td className="font-medium">{item.role}</td>
                <td className="font-medium">{item.status}</td>
                <td>
                  <button
                    className="btn btn-sm bg-teal-400 text-white"
                    onClick={() =>
                      handleRoleChange(item.email, "user", "approved")
                    }
                    disabled={item.status === "approved"}
                  >
                    User
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm bg-emerald-400 text-white"
                    onClick={() =>
                      handleRoleChange(item.email, "agent", "approved")
                    }
                    disabled={item.status === "approved"}
                    // disabled={item.role === "agent"}
                  >
                    Agent
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm bg-red-400 text-white"
                    onClick={() =>
                      handleRoleChange(item.email, item.role, "Blocked")
                    }
                    disabled={item.status === "approved"}
                  >
                    Block
                  </button>
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
