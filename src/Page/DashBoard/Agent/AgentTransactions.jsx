import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../Provider/AuthProvider";
import { FiArrowDownLeft, FiArrowUpRight, FiDollarSign, FiClock, FiDownload } from "react-icons/fi";
import { jsPDF } from "jspdf";

const AgentTransactions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["agentTransactionsHistory", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/history/${user.email}`);
      return res.data.reverse(); // Newest first
    },
  });

  const generatePDF = (item) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(26, 54, 38); // #1A3626
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("TA-CASH", 20, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL TRANSACTION RECEIPT", 20, 32);
    doc.text(`AGENT: ${user?.email}`, 20, 38);
    
    // Right-aligned header info
    doc.setFontSize(8);
    doc.text("SECURE BLOCKCHAIN SETTLED", 190, 25, { align: "right" });
    doc.text(`GENERATED: ${new Date().toLocaleString()}`, 190, 30, { align: "right" });
    
    // Main Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("TRANSACTION DETAILS", 20, 65);
    doc.line(20, 68, 190, 68);
    
    doc.setFont("helvetica", "normal");
    const details = [
      ["Transaction ID", item._id],
      ["Status", "SETTLED / CLEARED"],
      ["Date", new Date(item.time || Date.now()).toLocaleString()],
      ["Operation Type", item.type.toUpperCase()],
      ["Client Email", item.userEmail],
      ["Recipient Path", item.recipientEmail || "System Vault"]
    ];

    let y = 80;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(String(value), 60, y);
      y += 10;
    });
    
    // Amount Section
    doc.setFillColor(245, 247, 245);
    doc.rect(20, y + 5, 170, 30, 'F');
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("NET AMOUNT:", 30, y + 20);
    doc.setTextColor(26, 54, 38);
    doc.text(`$${item.amount}`, 180, y + 20, { align: "right" });
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(`Total Volume processed: $${item.totalAmount || item.amount}`, 30, y + 28);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(26, 54, 38);
    doc.setFont("helvetica", "italic");
    doc.text("This is a computer-generated receipt and does not require a physical signature.", 105, 180, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Ta-Cash MFS Platform - Authorized Agent Copy", 105, 190, { align: "center" });
    
    doc.save(`Agent_Receipt_${item._id.substring(0, 8)}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-500">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-bold uppercase tracking-widest text-xs">Loading Agent History...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">Agent Transactions</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Comprehensive log of all processed client requests.</p>
        </div>
        
        <div className="px-6 py-2 bg-base-200 rounded-2xl border border-base-300 shadow-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <p className="text-xs font-black text-neutral-content uppercase tracking-widest">
            Total Logs: <span className="text-base-content ml-1">{history.length}</span>
          </p>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary to-accent opacity-30 rounded-b-full"></div>
        
        {/* Mobile Card View */}
        <div className="md:hidden p-3 space-y-3 stagger-children">
          {history.length > 0 ? history.map((item) => {
            const isCashIn = item.type === "cash-in" || item.type === "agent-cash-in";
            return (
              <div key={item._id} className="flex items-center justify-between p-3.5 bg-base-200/30 rounded-xl border border-base-300/50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isCashIn ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {isCashIn ? <FiArrowDownLeft size={16} /> : <FiArrowUpRight size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-base-content capitalize">{item.type.replace('-', ' ')}</p>
                    <p className="text-[10px] text-neutral-content">${item.amount}</p>
                  </div>
                </div>
                <button onClick={() => generatePDF(item)} className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-transform"><FiDownload size={16} /></button>
              </div>
            );
          }) : (
            <div className="py-12 text-center"><FiDollarSign size={32} className="mx-auto mb-3 opacity-20" /><p className="text-sm font-bold text-base-content">No Transactions</p></div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto p-2">
          <table className="w-full text-left border-collapse mt-2">
            <thead>
              <tr className="border-b border-base-300">
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Transaction</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Counterparty</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Revenue / Flow</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em]">Status</th>
                <th className="py-5 px-6 text-[10px] font-black text-neutral-content uppercase tracking-[0.2em] text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item) => {
                  const isCashIn = item.type === "cash-in";
                  const isAgentCashIn = item.type === "agent-cash-in";
                  
                  return (
                    <tr key={item._id} className="border-b border-base-200 last:border-0 hover:bg-base-200/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${
                            isCashIn ? 'bg-blue-500/10 text-blue-500' : 
                            isAgentCashIn ? 'bg-purple-500/10 text-purple-500' : 
                            'bg-green-500/10 text-green-500'
                          }`}>
                            {isCashIn && <FiArrowDownLeft size={20} />}
                            {isAgentCashIn && <FiDollarSign size={20} />}
                            {!isCashIn && !isAgentCashIn && <FiArrowUpRight size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-base-content capitalize">{item.type.replace('-', ' ')}</p>
                            <p className="text-[10px] font-mono text-neutral-content mt-1">TXN: {item._id.substring(0,10).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-neutral-content uppercase tracking-wider w-12">Client:</span>
                            <span className="text-xs font-medium text-base-content">{item.userEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-neutral-content uppercase tracking-wider w-12">Target:</span>
                            <span className="text-xs font-medium text-base-content">{item.recipientEmail || "System"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-base-content tracking-tight">${item.amount}</span>
                          <p className="text-[10px] text-primary/80 font-bold mt-0.5">Flow: ${item.totalAmount || item.amount}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1.5 rounded-full bg-success/10 text-success text-[10px] font-black uppercase tracking-wider flex items-center w-max gap-1.5">
                          <FiClock className="text-success/50" />
                          Settled
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end">
                          <button
                            onClick={() => generatePDF(item)}
                            className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm opacity-50 group-hover:opacity-100"
                            title="Download Receipt"
                          >
                            <FiDownload size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-content">
                      <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6">
                        <FiClock size={32} className="opacity-20" />
                      </div>
                      <p className="text-xl font-black text-base-content tracking-tight">No Activity Found</p>
                      <p className="text-sm mt-2 font-medium">Completed agent transactions will be listed here.</p>
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

export default AgentTransactions;
