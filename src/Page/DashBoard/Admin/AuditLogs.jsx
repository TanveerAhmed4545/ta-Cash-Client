import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { FaHistory, FaUserShield, FaExternalLinkAlt } from "react-icons/fa";

const AuditLogs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/audit-logs");
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FaUserShield className="text-[#1A3626]" /> System Audit Logs
          </h1>
          <p className="text-gray-500 mt-1">Track all administrative actions and security events.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Admin / Executor</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1A3626]/10 flex items-center justify-center text-[#1A3626] font-bold text-xs">
                        {log.adminEmail?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{log.adminEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      log.action.includes('Approved') ? 'bg-green-100 text-green-700' : 
                      log.action.includes('Rejected') ? 'bg-red-100 text-red-700' :
                      log.action.includes('Maintenance') ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.targetEmail || <span className="text-gray-300">N/A</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 max-w-[200px] truncate">
                      {JSON.stringify(log.details)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium">
                    <FaHistory className="text-4xl mx-auto mb-4 opacity-20" />
                    No audit logs found yet.
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

export default AuditLogs;
