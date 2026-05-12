import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiSearch, FiUser, FiShield, FiSlash, FiTrash2, FiCheckCircle, FiUserPlus, FiBriefcase } from "react-icons/fi";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const axiosSecure = useAxiosSecure();

  const { data: users = [], refetch, isLoading } = useQuery({
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
      toast.success("User configuration updated!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (email) => {
      const { data } = await axiosSecure.delete(`/users/${email}`);
      return data;
    },
    onSuccess: () => {
      refetch();
      Swal.fire({
        title: "Deactivated",
        text: "The user account has been permanently removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--base-100)',
        color: 'var(--base-content)'
      });
    },
  });

  const handleRoleChange = (email, role, status) => {
    updateUserRole.mutate({ email, role, status });
  };

  const handleDelete = (email) => {
    Swal.fire({
      title: "Confirm Deletion?",
      text: "This user will lose all access to the Ta-Cash platform.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1A3626",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Delete User",
      background: 'var(--base-100)',
      color: 'var(--base-content)'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(email);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-black uppercase tracking-widest text-xs">Scanning Directory...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">Identity Access</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Manage user roles, statuses, and platform security.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-content" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-base-100 rounded-2xl border border-base-300 outline-none focus:border-primary transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <div className="px-5 py-3 bg-base-200 rounded-2xl border border-base-300 text-xs font-black text-neutral-content uppercase tracking-widest hidden lg:block">
            Total Accounts: <span className="text-base-content ml-1">{users.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
        
        {/* Mobile Card View */}
        <div className="md:hidden p-3 space-y-3 stagger-children">
          {users.length > 0 ? users.map((item, idx) => {
            const isAgent = item.role === "agent";
            const isAdmin = item.role === "admin";
            const isApproved = item.status === "approved";
            const isBlocked = item.status === "Blocked";
            return (
              <div key={idx} className="p-4 bg-base-200/30 rounded-xl border border-base-300/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isAdmin ? 'bg-purple-500/10 text-purple-500' : isAgent ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'}`}>
                      {isAdmin ? <FiShield size={16} /> : isAgent ? <FiBriefcase size={16} /> : <FiUser size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-base-content">{item.name}</p>
                      <p className="text-[10px] text-neutral-content">{item.email}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${isApproved ? 'bg-success/10 text-success' : isBlocked ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'}`}>
                    {item.status || "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${isAdmin ? 'bg-purple-500/10 text-purple-500' : isAgent ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'}`}>{item.role}</span>
                  <div className="flex items-center gap-1.5">
                    <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center active:scale-90 transition-transform" onClick={() => handleRoleChange(item.email, "user", "approved")}><FiUser size={14} /></button>
                    <button className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-transform" onClick={() => handleRoleChange(item.email, "agent", "approved")}><FiBriefcase size={14} /></button>
                    <button className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center active:scale-90 transition-transform" onClick={() => handleRoleChange(item.email, item.role, "Blocked")}><FiSlash size={14} /></button>
                    <button className="w-8 h-8 rounded-lg bg-red-900/10 text-red-900 flex items-center justify-center active:scale-90 transition-transform" onClick={() => handleDelete(item.email)}><FiTrash2 size={14} /></button>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="py-12 text-center text-neutral-content">
              <FiUser size={32} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-bold text-base-content">No Accounts Found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto p-2">
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Profile</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Role</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Status</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((item, idx) => {
                  const isAgent = item.role === "agent";
                  const isAdmin = item.role === "admin";
                  const isApproved = item.status === "approved";
                  const isBlocked = item.status === "Blocked";

                  return (
                    <tr key={idx} className="border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${isAdmin ? 'bg-purple-500/10 text-purple-500' : isAgent ? 'bg-primary/10 text-primary' : 'bg-blue-500/10 text-blue-500'}`}>
                            {isAdmin ? <FiShield size={20} /> : isAgent ? <FiBriefcase size={20} /> : <FiUser size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-base-content">{item.name}</p>
                            <p className="text-xs text-neutral-content font-medium">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          isAdmin ? 'bg-purple-500/10 text-purple-500' : 
                          isAgent ? 'bg-primary/10 text-primary' : 
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center w-max gap-1.5 ${
                          isApproved ? "bg-success/10 text-success" :
                          isBlocked ? "bg-error/10 text-error" :
                          "bg-warning/10 text-warning"
                        }`}>
                          {isApproved ? <FiCheckCircle /> : isBlocked ? <FiSlash /> : <FiShield className="animate-pulse" />}
                          {item.status || "Pending"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <button
                            className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                            title="Set as User"
                            onClick={() => handleRoleChange(item.email, "user", "approved")}
                            disabled={isApproved && item.role === "user"}
                          >
                            <FiUser size={18} />
                          </button>
                          <button
                            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                            title="Set as Agent"
                            onClick={() => handleRoleChange(item.email, "agent", "approved")}
                            disabled={isApproved && item.role === "agent"}
                          >
                            <FiBriefcase size={18} />
                          </button>
                          <button
                            className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm"
                            title="Block User"
                            onClick={() => handleRoleChange(item.email, item.role, "Blocked")}
                            disabled={isBlocked}
                          >
                            <FiSlash size={18} />
                          </button>
                          <button
                            className="w-10 h-10 rounded-xl bg-red-900/10 text-red-900 flex items-center justify-center hover:bg-red-900 hover:text-white transition-all shadow-sm"
                            title="Delete Permanently"
                            onClick={() => handleDelete(item.email)}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-content">
                      <FiUser size={48} className="mb-4 opacity-20" />
                      <p className="text-xl font-black text-base-content tracking-tight">No Accounts Found</p>
                      <p className="text-sm font-medium mt-1">Try adjusting your search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
