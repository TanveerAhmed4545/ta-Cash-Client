import { FiBell, FiCheckCircle, FiClock, FiTrash2 } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import useNotifications from "../../../hooks/useNotifications";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../Provider/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Notifications = () => {
  const { notifications, isLoading, markAllRead } = useNotifications();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const deleteNotification = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user?.email]);
      toast.success("Notification deleted");
    }
  });

  const markAsRead = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", user?.email]);
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-content font-black uppercase tracking-widest text-xs">Loading Notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-base-content tracking-tight">Notification Center</h2>
          <p className="text-neutral-content mt-1 font-medium italic">Stay updated with your latest account activities and alerts.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => markAllRead()}
            className="w-full md:w-auto px-6 py-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <FiCheckCircle />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl md:rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 overflow-hidden relative min-h-[400px]">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
        
        <div className="p-4 md:p-8 space-y-4">
          {notifications?.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`relative p-5 rounded-2xl border transition-all duration-300 ${!notif.isRead ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-base-200/30 border-base-300/50 hover:bg-base-200'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-primary/20 text-primary' : 'bg-base-300 text-neutral-content'}`}>
                      <FiBell size={18} />
                    </div>
                    <div>
                      <h3 className={`text-base md:text-lg ${!notif.isRead ? 'font-black text-base-content' : 'font-bold text-base-content/80'}`}>
                        {notif.title}
                      </h3>
                      <p className="text-sm text-neutral-content mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 mt-3 text-xs font-bold text-neutral-content/70 uppercase tracking-wider">
                        <FiClock size={12} />
                        {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead.mutate(notif._id)}
                        title="Mark as Read"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <FiCheckCircle size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification.mutate(notif._id)}
                      title="Delete Notification"
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-error/60 hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
                {!notif.isRead && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-1 h-12 bg-primary rounded-r-full"></div>
                )}
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6">
                <FiBell size={40} className="text-base-300" />
              </div>
              <h3 className="text-xl font-black text-base-content mb-2">You're All Caught Up!</h3>
              <p className="text-neutral-content max-w-sm">There are no new notifications or alerts for your account at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
