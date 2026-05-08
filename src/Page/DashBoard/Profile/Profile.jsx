import { useState } from "react";
import { useAuth } from "../../../Provider/AuthProvider";
import useBalance from "../../../hooks/useBalance";
import { FiUser, FiMail, FiPhone, FiShield, FiCreditCard, FiCamera } from "react-icons/fi";
import ChangePinModal from "../../../components/Dashboard/Modals/ChangePinModal";
import EditProfileModal from "../../../components/Dashboard/Modals/EditProfileModal";
import { formatDistanceToNow } from "date-fns";
import { uploadImage } from "../../../utils/uploadImage";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [balance] = useBalance();
  const [isChangePinOpen, setChangePinOpen] = useState(false);
  const [isEditProfileOpen, setEditProfileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-500 mt-1">Manage your account settings and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <div className="relative mb-6 group">
              <div className="relative w-32 h-32">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1A3626&color=fff&size=128`}
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1A3626&color=fff&size=128`;
                  }}
                  className={`w-full h-full rounded-full border-4 border-green-50 shadow-md object-cover transition-all ${uploading ? 'opacity-50 grayscale' : 'group-hover:brightness-75'}`}
                />
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#1A3626] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                   <div className="p-2 bg-black/40 rounded-full text-white">
                      <FiCamera size={20} />
                   </div>
                   <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                </label>
              </div>
              <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{user?.name || "Ta-Cash User"}</h3>
            <p className="text-sm text-gray-500 capitalize px-3 py-1 bg-gray-50 rounded-full mt-2 font-medium">
              {user?.role || "User Account"}
            </p>
          </div>

          <div className="bg-[#1A3626] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-green-200/70 text-xs uppercase tracking-wider font-bold mb-1">Available Balance</p>
              <h4 className="text-3xl font-bold mb-6">${Number(balance || 0).toLocaleString()}</h4>
              <div className="flex justify-between items-end">
                 <p className="text-[10px] text-green-200/50 uppercase">Active Account</p>
                 <FiCreditCard className="text-2xl text-green-200/30" />
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          </div>
        </div>

        {/* Right Column - Details & Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiUser className="text-[#1A3626]" /> Account Details
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <FiUser />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Full Name</p>
                    <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditProfileOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                    <FiMail />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                    <p className="text-sm font-bold text-gray-800">{user?.email}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase">Verified</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                    <p className="text-sm font-bold text-gray-800">{user?.phone || "+880 1XXX-XXXXXX"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditProfileOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FiShield className="text-[#1A3626]" /> Security Settings
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer group">
                 <div>
                    <p className="text-sm font-bold text-gray-800">Account PIN</p>
                    <p className="text-xs text-gray-500 mt-0.5">{pinChangeText}</p>
                 </div>
                 <button 
                    onClick={() => setChangePinOpen(true)}
                    className="px-4 py-2 bg-white text-gray-700 text-xs font-bold rounded-lg border border-gray-200 group-hover:border-[#1A3626] transition-colors"
                  >
                    Change PIN
                  </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors cursor-pointer group">
                 <div>
                    <p className="text-sm font-bold text-gray-800">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500 mt-0.5">Extra layer of security</p>
                 </div>
                 <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePinModal 
        isOpen={isChangePinOpen} 
        onClose={() => setChangePinOpen(false)} 
      />
      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setEditProfileOpen(false)} 
      />
    </div>
  );
};

export default Profile;
