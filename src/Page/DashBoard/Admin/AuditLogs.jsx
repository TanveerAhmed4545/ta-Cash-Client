import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FiShield, FiClock, FiActivity, FiKey, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

const AuditLogs = () => {
  const axiosSecure = useAxiosSecure();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/admin/audit-logs");
      return data.reverse(); // Show newest first
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-black uppercase tracking-widest text-xs">Decrypting Security Logs...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-base-content tracking-tight">Security Audit</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Unalterable history of all administrative and security-critical events.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <p className="text-xs font-black text-primary uppercase tracking-widest">
              Live Stream Active: <span className="ml-1 text-base-content">{logs.length}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-base-100 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Executor</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Action / Event</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Impact Path</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Details</th>
                <th className="py-6 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => {
                  const isMaintenance = log.action?.toLowerCase().includes('maintenance');
                  const isSecurity = log.action?.toLowerCase().includes('block') || log.action?.toLowerCase().includes('reject');
                  const isSuccess = log.action?.toLowerCase().includes('approved') || log.action?.toLowerCase().includes('set');

                  return (
                    <tr key={log._id} className="border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-primary font-black text-xs border border-base-300">
                            {log.adminEmail?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-base-content">{log.adminEmail}</span>
                            <span className="text-[10px] font-black text-neutral-content uppercase tracking-widest">Admin Authorization</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center w-max gap-2 ${
                          isSuccess ? 'bg-success/10 text-success' : 
                          isSecurity ? 'bg-error/10 text-error' :
                          isMaintenance ? 'bg-warning/10 text-warning' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {isSuccess && <FiCheckCircle />}
                          {isSecurity && <FiAlertCircle />}
                          {isMaintenance && <FiKey />}
                          {!isSuccess && !isSecurity && !isMaintenance && <FiActivity />}
                          {log.action}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        {log.targetEmail ? (
                          <div className="flex items-center gap-2">
                            <FiShield className="text-neutral-content" size={12} />
                            <span className="text-xs font-medium text-base-content">{log.targetEmail}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-neutral-content uppercase tracking-widest opacity-30">System Global</span>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <div className="group/detail relative">
                          <div className="flex items-center gap-2 text-xs font-medium text-neutral-content cursor-help">
                            <FiInfo size={14} className="text-primary/40" />
                            <span className="truncate max-w-[120px]">Payload View</span>
                          </div>
                          <div className="absolute bottom-full left-0 mb-2 hidden group-hover/detail:block z-50">
                             <div className="bg-base-300 text-base-content p-4 rounded-2xl shadow-2xl border border-base-content/10 text-[10px] font-mono whitespace-pre min-w-[200px]">
                               {JSON.stringify(log.details, null, 2)}
                             </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-base-content tracking-tight">{new Date(log.timestamp).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1.5 text-neutral-content font-bold text-[10px]">
                            <FiClock size={10} />
                            {new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-content">
                      <FiShield size={48} className="mb-4 opacity-20" />
                      <p className="text-xl font-black text-base-content tracking-tight">Logs Clear</p>
                      <p className="text-sm font-medium mt-1">No administrative events have been recorded yet.</p>
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

export default AuditLogs;
