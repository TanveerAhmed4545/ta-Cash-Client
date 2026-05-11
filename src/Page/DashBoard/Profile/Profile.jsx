import { useState } from "react";
import { useAuth } from "../../../Provider/AuthProvider";
import useBalance from "../../../hooks/useBalance";
import { FiUser, FiMail, FiPhone, FiShield, FiCamera } from "react-icons/fi";
import ChangePinModal from "../../../components/Dashboard/Modals/ChangePinModal";
import EditProfileModal from "../../../components/Dashboard/Modals/EditProfileModal";
import { formatDistanceToNow } from "date-fns";
import { uploadImage } from "../../../utils/uploadImage";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

const Profile = () => {
 const { user, setUser } = useAuth();
 const [balance] = useBalance();
 const [isChangePinOpen, setChangePinOpen] = useState(false);
 const [isEditProfileOpen, setEditProfileOpen] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [isCardFlipped, setIsCardFlipped] = useState(false);
 const axiosSecure = useAxiosSecure();

 const generateCardDetails = (email) => {
 if (!email) return { number: "**** **** **** ****", expiry: "**/**", cvv: "***" };
 let hash = 0;
 for (let i = 0; i < email.length; i++) hash = email.charCodeAt(i) + ((hash << 5) - hash);
 const absHash = Math.abs(hash).toString();
 const num = absHash.padEnd(16, '4').substring(0, 16);
 const formattedNum = `${num.substring(0,4)} ${num.substring(4,8)} ${num.substring(8,12)} ${num.substring(12,16)}`;
 const cvv = absHash.substring(0,3).padEnd(3, '1');
 return { number: formattedNum, expiry: "12/28", cvv };
 };
 const cardDetails = generateCardDetails(user?.email);

 const pinChangeText = user?.lastPinChange 
 ? `Last changed ${formatDistanceToNow(new Date(user.lastPinChange))} ago`
 : "PIN has not been changed recently";

 const handleImageChange = async (e) => {
 const file = e.target.files[0];
 if (!file) return;

 setUploading(true);
 const toastId = toast.loading("Uploading image...");
 try {
 const photoURL = await uploadImage(file);
 if (photoURL) {
 const response = await axiosSecure.patch("/update-profile", { photoURL });
 if (response.status === 200) {
 const updatedUser = response.data.user;
 setUser(updatedUser);
 localStorage.setItem("user", JSON.stringify(updatedUser));
 toast.success("Profile picture updated!", { id: toastId });
 }
 } else {
 toast.error("Failed to upload image", { id: toastId });
 }
 } catch (error) {
 toast.error("Error updating profile picture", { id: toastId });
 } finally {
 setUploading(false);
 }
 };

 return (
 <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="mb-8">
 <h2 className="text-3xl font-black text-base-content tracking-tight">My Profile</h2>
 <p className="text-neutral-content text-neutral-content mt-1 font-medium italic">Manage your account settings and security</p>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Left Column - User Info Card */}
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-base-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-base-300 flex flex-col items-center text-center relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
 <div className="relative mb-6">
 <div className="relative w-32 h-32">
 <img
 src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1A3626&color=fff&size=128`}
 alt="Profile"
 className={`w-full h-full rounded-full border-4 border-base-200 shadow-lg object-cover transition-all ${uploading ? 'opacity-50 grayscale' : 'group-hover:brightness-90'}`}
 />
 {uploading && (
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
 </div>
 )}
 <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity z-10">
 <div className="p-3 bg-primary/80 rounded-full text-white shadow-xl">
 <FiCamera size={24} />
 </div>
 <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
 </label>
 </div>
 <div className="absolute bottom-1 right-1 bg-primary w-6 h-6 rounded-full border-4 border-base-100"></div>
 </div>
 <h3 className="text-xl font-bold text-base-content">{user?.name || "Ta-Cash User"}</h3>
 <p className="text-[10px] text-primary uppercase tracking-[0.2em] px-4 py-1.5 bg-primary/10 rounded-full mt-3 font-black">
 {user?.role || "User Account"}
 </p>
 </div>

 {/* Virtual Debit Card */}
 <div 
 className="relative w-full h-52 cursor-pointer group"
 style={{ perspective: '1200px' }}
 onClick={() => setIsCardFlipped(!isCardFlipped)}
 >
 <div 
 className="w-full h-full absolute transition-transform duration-700 ease-in-out"
 style={{ transformStyle: 'preserve-3d', transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
 >
 {/* Front of Card */}
 <div 
 className="absolute w-full h-full bg-gradient-to-br from-[#1A3626] to-[#2d5a3f] rounded-3xl p-6 text-white shadow-2xl overflow-hidden border border-white/10"
 style={{ backfaceVisibility: 'hidden' }}
 >
 <div className="relative z-10 h-full flex flex-col justify-between">
 <div className="flex justify-between items-start">
 <div>
 <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-black mb-1">Available Balance</p>
 <h4 className="text-2xl font-black">${Number(balance || 0).toLocaleString()}</h4>
 </div>
 <div className="flex gap-1.5 mt-1">
 <div className="w-5 h-5 rounded-full bg-red-500 shadow-sm"></div>
 <div className="w-5 h-5 rounded-full bg-yellow-400 -ml-2 shadow-sm"></div>
 </div>
 </div>
 <div>
 <p className="font-mono tracking-[0.2em] text-lg mb-3 text-white drop-shadow-md">{cardDetails.number}</p>
 <div className="flex justify-between items-end">
 <div className="uppercase text-[10px] font-black text-white/80 tracking-[0.1em] truncate max-w-[150px]">{user?.name || "User"}</div>
 <div className="font-mono text-[10px] text-white/80 font-bold">{cardDetails.expiry}</div>
 </div>
 </div>
 </div>
 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
 <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 pointer-events-none"></div>
 </div>

 {/* Back of Card */}
 <div 
 className="absolute w-full h-full bg-gradient-to-br from-[#12261b] to-[#1A3626] rounded-3xl text-white shadow-2xl overflow-hidden border border-white/10"
 style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
 >
 <div className="w-full h-12 bg-black/80 mt-6 shadow-inner"></div>
 <div className="px-6 mt-6">
 <div className="w-full bg-white/90 h-10 rounded-lg flex items-center justify-end px-4 border border-white/20">
 <span className="text-black font-mono italic text-sm font-black tracking-widest">{cardDetails.cvv}</span>
 </div>
 <p className="text-[9px] text-white/40 mt-6 leading-relaxed text-center px-4 font-medium uppercase tracking-tighter">
 This virtual card is for Ta-Cash testing. Do not share your CVV or PIN with anyone.
 </p>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-base-100 rounded-3xl p-6 shadow-sm border border-base-300 flex flex-col items-center text-center">
 <h4 className="text-[10px] font-black text-neutral-content mb-4 uppercase tracking-[0.2em]">Personal QR Code</h4>
 <div className="p-4 bg-white rounded-2xl shadow-xl border border-base-300">
 <QRCode value={user?.email || "ta-cash-user"} size={140} fgColor="#1A3626" bgColor="#ffffff" />
 </div>
 <p className="text-[10px] text-neutral-content mt-4 font-bold max-w-[150px] leading-relaxed uppercase">Scan to send money instantly</p>
 </div>
 </div>

 {/* Right Column - Details & Settings */}
 <div className="lg:col-span-2 space-y-6">
 <div className="bg-base-100 rounded-3xl p-8 shadow-sm border border-base-300">
 <h4 className="text-lg font-black text-base-content mb-8 flex items-center gap-3">
 <div className="p-2 bg-primary/10 rounded-lg text-primary"><FiUser /></div>
 Account Details
 </h4>
 
 <div className="space-y-6">
 {[
 { label: "Full Name", value: user?.name, icon: <FiUser />, color: "blue", action: "Edit", onClick: () => setEditProfileOpen(true) },
 { label: "Email Address", value: user?.email, icon: <FiMail />, color: "purple", status: "Verified" },
 { label: "Phone Number", value: user?.phone || "+880 1XXX-XXXXXX", icon: <FiPhone />, color: "orange", action: "Update", onClick: () => setEditProfileOpen(true) }
 ].map((item, idx) => (
 <div key={idx} className="flex items-center justify-between py-4 border-b border-base-300 last:border-0 group">
 <div className="flex items-center gap-5">
 <div className={`p-4 rounded-2xl transition-all duration-300 ${
 item.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
 item.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
 'bg-orange-500/10 text-orange-500'
 }`}>
 {item.icon}
 </div>
 <div>
 <p className="text-[10px] text-neutral-content font-black uppercase tracking-[0.1em] mb-1">{item.label}</p>
 <p className="text-base font-bold text-base-content tracking-tight">{item.value}</p>
 </div>
 </div>
 {item.action ? (
 <button 
 onClick={item.onClick}
 className="px-4 py-2 text-xs font-black text-primary hover:bg-primary/5 rounded-xl transition-all uppercase tracking-wider"
 >
 {item.action}
 </button>
 ) : item.status && (
 <span className="text-[10px] bg-primary/10 text-green-500 px-3 py-1 rounded-full font-black uppercase tracking-wider">
 {item.status}
 </span>
 )}
 </div>
 ))}
 </div>
 </div>

 <div className="bg-base-100 rounded-3xl p-8 shadow-sm border border-base-300">
 <h4 className="text-lg font-black text-base-content mb-8 flex items-center gap-3">
 <div className="p-2 bg-primary/10 rounded-lg text-primary"><FiShield /></div>
 Security Settings
 </h4>
 
 <div className="grid grid-cols-1 gap-4">
 <div className="p-6 bg-base-200/50 rounded-2xl border border-base-300 hover:border-primary/30 transition-all group">
 <div className="flex justify-between items-start mb-4">
 <div className="p-3 bg-base-100 rounded-xl text-primary shadow-sm"><FiShield /></div>
 <button 
 onClick={() => setChangePinOpen(true)}
 className="text-[10px] font-black text-primary hover:underline uppercase tracking-wider px-4 py-2 bg-primary/10 rounded-xl"
 >
 Change PIN
 </button>
 </div>
 <p className="text-base font-bold text-base-content mb-1">Account PIN</p>
 <p className="text-[10px] text-neutral-content font-medium leading-relaxed italic">{pinChangeText}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <ChangePinModal isOpen={isChangePinOpen} onClose={() => setChangePinOpen(false)} />
 <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setEditProfileOpen(false)} />
 </div>
 );
};

export default Profile;
