import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import toast from "react-hot-toast";
import { FaCogs, FaTools, FaShieldAlt, FaPowerOff } from "react-icons/fa";
import Swal from "sweetalert2";

const SystemSettings = () => {
 const axiosSecure = useAxiosSecure();
 const queryClient = useQueryClient();

 const { data: config, isLoading } = useQuery({
 queryKey: ["system-config"],
 queryFn: async () => {
 const { data } = await axiosSecure.get("/admin/system-config");
 return data;
 },
 });

 const mutation = useMutation({
 mutationFn: async (status) => {
 const { data } = await axiosSecure.post("/admin/toggle-maintenance", { status });
 return data;
 },
 onSuccess: (data) => {
 queryClient.invalidateQueries(["system-config"]);
 Swal.fire({
 title: "Success!",
 text: data.message,
 icon: "success",
 confirmButtonColor: "#1A3626"
 });
 },
 onError: (err) => {
 toast.error(err.response?.data?.message || "Failed to update settings");
 }
 });

 const handleToggleMaintenance = () => {
 const nextStatus = !config?.maintenanceMode;
 Swal.fire({
 title: `${nextStatus ? 'Enable' : 'Disable'} Maintenance Mode?`,
 text: nextStatus 
 ? "Warning: This will disable all user and agent transactions except for Admins."
 : "The system will be fully operational for all users.",
 icon: "warning",
 showCancelButton: true,
 confirmButtonColor: nextStatus ? "#ef4444" : "#1A3626",
 cancelButtonColor: "#6b7280",
 confirmButtonText: nextStatus ? "Yes, Enable It" : "Yes, Disable It"
 }).then((result) => {
 if (result.isConfirmed) {
 mutation.mutate(nextStatus);
 }
 });
 };

 if (isLoading) return <LoadingSpinner />;

 return (
 <div className="container mx-auto px-4 py-8">
 <div className="mb-8">
 <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
 <FaCogs className="text-primary" /> System Settings
 </h1>
 <p className="text-neutral-content mt-1">Configure global application behavior and security protocols.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {/* Maintenance Mode Card */}
 <div className="bg-base-100 rounded-[2rem] p-8 shadow-sm border border-base-300 flex flex-col items-center text-center">
 <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
 config?.maintenanceMode ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
 }`}>
 <FaPowerOff className="text-2xl" />
 </div>
 <h3 className="text-xl font-bold text-base-content mb-2">Maintenance Mode</h3>
 <p className="text-neutral-content text-sm mb-8">
 Temporarily disable all financial activities for system updates or emergency fixes.
 </p>
 
 <div className="mt-auto w-full">
 <div className={`mb-6 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs ${
 config?.maintenanceMode ? 'text-red-500' : 'text-green-500'
 }`}>
 <div className={`w-2 h-2 rounded-full animate-pulse ${config?.maintenanceMode ? 'bg-red-500' : 'bg-primary'}`}></div>
 Status: {config?.maintenanceMode ? 'Active' : 'Offline'}
 </div>
 
 <button
 onClick={handleToggleMaintenance}
 disabled={mutation.isLoading}
 className={`w-full py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-md ${
 config?.maintenanceMode 
 ? 'bg-green-600 text-white hover:bg-green-700' 
 : 'bg-red-600 text-white hover:bg-red-700'
 }`}
 >
 {mutation.isLoading ? 'Processing...' : config?.maintenanceMode ? 'Disable Maintenance' : 'Enable Maintenance'}
 </button>
 </div>
 </div>

 {/* Security Policy Card (Mock) */}
 <div className="bg-base-100 rounded-[2rem] p-8 shadow-sm border border-base-300 flex flex-col items-center text-center opacity-70 cursor-not-allowed">
 <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
 <FaShieldAlt className="text-2xl" />
 </div>
 <h3 className="text-xl font-bold text-base-content mb-2">Security Hardening</h3>
 <p className="text-neutral-content text-sm mb-8">
 Advanced DDoS protection and IP whitelisting for administrative access.
 </p>
 <div className="mt-auto w-full py-4 rounded-2xl bg-gray-100 text-neutral-content font-bold uppercase tracking-widest text-xs">
 Coming Soon
 </div>
 </div>

 {/* System Logs Config Card (Mock) */}
 <div className="bg-base-100 rounded-[2rem] p-8 shadow-sm border border-base-300 flex flex-col items-center text-center opacity-70 cursor-not-allowed">
 <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
 <FaTools className="text-2xl" />
 </div>
 <h3 className="text-xl font-bold text-base-content mb-2">Debug Console</h3>
 <p className="text-neutral-content text-sm mb-8">
 Real-time server log streaming and environment variable management.
 </p>
 <div className="mt-auto w-full py-4 rounded-2xl bg-gray-100 text-neutral-content font-bold uppercase tracking-widest text-xs">
 Coming Soon
 </div>
 </div>
 </div>
 </div>
 );
};

export default SystemSettings;
