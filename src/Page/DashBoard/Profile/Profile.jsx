import { useAuth } from "../../../Provider/AuthProvider";
import useBalance from "../../../hooks/useBalance";
import { FiUser, FiMail, FiPhone, FiShield, FiCreditCard } from "react-icons/fi";

const Profile = () => {
  const { user } = useAuth();
  const [balance] = useBalance();

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
            <div className="relative mb-6">
              <img
                src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1A3626&color=fff&size=128`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-green-50 shadow-md object-cover"
              />
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
                <button className="text-xs font-bold text-blue-600 hover:underline">Edit</button>
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
                <button className="text-xs font-bold text-blue-600 hover:underline">Update</button>
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
                    <p className="text-xs text-gray-500 mt-0.5">Last changed 3 months ago</p>
                 </div>
                 <button className="px-4 py-2 bg-white text-gray-700 text-xs font-bold rounded-lg border border-gray-200 group-hover:border-[#1A3626] transition-colors">
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
    </div>
  );
};

export default Profile;
