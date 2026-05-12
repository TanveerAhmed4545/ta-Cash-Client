import { useState } from "react";
import { FiBell, FiCheckCircle, FiAlertCircle, FiInfo, FiArrowDown, FiArrowUp, FiSend, FiRotateCw } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

const NotificationDropdown = ({ notifications, onMarkAllRead, onRefetch }) => {
 const [isOpen, setIsOpen] = useState(false);
 const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

 const getIcon = (type) => {
 switch (type) {
 case 'cash-in': return <FiArrowDown className="text-green-500" />;
 case 'cash-out': return <FiArrowUp className="text-orange-500" />;
 case 'send-money': return <FiSend className="text-blue-500" />;
 case 'security': return <FiAlertCircle className="text-red-500" />;
 default: return <FiInfo className="text-neutral-content" />;
 }
 };

 return (
 <div className="relative">
 {/* Bell Icon */}
 <button 
 onClick={() => setIsOpen(!isOpen)}
 className="relative p-2 bg-base-100 rounded-full text-neutral-content hover:text-primary transition-colors shadow-sm border border-base-300 focus:outline-none"
 >
 <FiBell className="text-sm md:text-base" />
 {unreadCount > 0 && (
 <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
 {unreadCount}
 </span>
 )}
 </button>

 {/* Dropdown Menu */}
 {isOpen && (
 <>
 <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
 <div className="absolute -right-12 md:right-0 top-full mt-3 w-[calc(100vw-32px)] md:w-96 bg-base-100 rounded-2xl shadow-xl border border-base-300 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
 {/* Header */}
 <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-base-200/50">
 <h4 className="font-bold text-base-content">Notifications</h4>
 <div className="flex items-center gap-3">
 <button 
 onClick={(e) => {
 e.stopPropagation();
 onRefetch();
 }}
 className="text-neutral-content hover:text-primary transition-colors"
 title="Refresh"
 >
 <FiRotateCw className="text-[10px]" />
 </button>
 {unreadCount > 0 && (
 <button 
 onClick={onMarkAllRead}
 className="text-[11px] font-bold text-primary hover:underline"
 >
 Mark all as read
 </button>
 )}
 </div>
 </div>

 {/* List */}
 <div className="max-h-[400px] overflow-y-auto">
 {notifications && notifications.length > 0 ? (
 notifications.map((notif) => (
 <div 
 key={notif._id} 
 className={`p-4 flex gap-4 border-b border-gray-50 last:border-0 hover:bg-base-200 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
 >
 <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
 notif.type === 'security' ? 'bg-red-50' : 
 notif.type === 'cash-in' ? 'bg-green-50' : 
 'bg-base-200'
 }`}>
 {getIcon(notif.type)}
 </div>
 <div className="flex-1 min-w-0">
 <p className={`text-sm ${!notif.isRead ? 'font-bold text-base-content' : 'text-base-content'}`}>
 {notif.title}
 </p>
 <p className="text-xs text-neutral-content mt-0.5 line-clamp-2 leading-relaxed">
 {notif.message}
 </p>
 <p className="text-[10px] text-neutral-content mt-2 font-medium">
 {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
 </p>
 </div>
 {!notif.isRead && (
 <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
 )}
 </div>
 ))
 ) : (
 <div className="p-12 text-center">
 <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
 <FiBell className="text-2xl text-gray-300" />
 </div>
 <p className="text-sm font-medium text-base-content">All caught up!</p>
 <p className="text-xs text-neutral-content mt-1">No new notifications at the moment.</p>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="p-3 border-t border-gray-50 text-center bg-base-200/50">
 <Link 
   to="/dashboard/notifications" 
   onClick={() => setIsOpen(false)}
   className="text-xs font-bold text-neutral-content hover:text-primary transition-colors block w-full py-1"
 >
 View All Notifications
 </Link>
 </div>
 </div>
 </>
 )}
 </div>
 );
};

export default NotificationDropdown;
