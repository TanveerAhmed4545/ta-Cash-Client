import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../Provider/AuthProvider";
import { IoClose, IoSend } from "react-icons/io5";
import { FiMail, FiInbox, FiUser } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

const InboxModal = ({ isOpen, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("inbox"); // inbox, send
  const [compose, setCompose] = useState({ recipient: "", subject: "", message: "" });

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/messages/${user?.email}`);
      return data;
    },
    enabled: !!user?.email && isOpen,
  });

  const sendMessage = useMutation({
    mutationFn: async (msgData) => {
      await axiosSecure.post("/messages", msgData);
    },
    onSuccess: () => {
      toast.success("Message sent!");
      setCompose({ recipient: "", subject: "", message: "" });
      setTab("inbox");
      queryClient.invalidateQueries(["messages", user?.email]);
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-[#f8fafc] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#1A3626] p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FiInbox className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Secure Inbox</h2>
              <p className="text-xs text-green-200/70">Messages & Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white px-6 shrink-0">
          <button 
            onClick={() => setTab("inbox")}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${tab === "inbox" ? "border-[#1A3626] text-[#1A3626]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            Messages
          </button>
          <button 
            onClick={() => setTab("send")}
            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 ${tab === "send" ? "border-[#1A3626] text-[#1A3626]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            Compose
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === "inbox" ? (
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-400 py-10">Loading messages...</p>
              ) : messages.length === 0 ? (
                <div className="text-center py-20">
                  <FiMail className="mx-auto text-5xl text-gray-200 mb-4" />
                  <p className="text-gray-400">No messages yet.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-[#1A3626]">
                          <FiUser size={14} />
                        </div>
                        <span className="text-sm font-bold text-gray-800">{msg.senderName}</span>
                        <span className="text-[10px] text-gray-400 font-medium px-2 py-0.5 bg-gray-50 rounded-full">
                          {msg.sender === user?.email ? "Sent" : "Received"}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{msg.subject}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
                  </div>
                ))
              )}
            </div>
          ) : (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage.mutate(compose);
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Recipient Email</label>
                <input 
                  required
                  type="email" 
                  placeholder="agent@tacash.com"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                  value={compose.recipient}
                  onChange={(e) => setCompose({...compose, recipient: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                <input 
                  required
                  type="text" 
                  placeholder="Query about cash-in"
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none"
                  value={compose.subject}
                  onChange={(e) => setCompose({...compose, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                <textarea 
                  required
                  rows="5"
                  placeholder="Write your message here..."
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none resize-none"
                  value={compose.message}
                  onChange={(e) => setCompose({...compose, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={sendMessage.isLoading}
                className="w-full py-4 bg-[#1A3626] text-white font-bold rounded-xl hover:bg-[#14281c] hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <IoSend />
                {sendMessage.isLoading ? "Sending..." : "Send Secure Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxModal;
