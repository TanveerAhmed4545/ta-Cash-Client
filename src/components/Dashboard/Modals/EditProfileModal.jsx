import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../Provider/AuthProvider";
import { IoClose } from "react-icons/io5";
import { FiUser, FiPhone, FiEdit3 } from "react-icons/fi";

const EditProfileModal = ({ isOpen, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const { user, setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const response = await axiosSecure.patch("/update-profile", data);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        
        // Update local user state
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        onClose();
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#1A3626] p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FiEdit3 className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <p className="text-xs text-green-200/70">Update your account details</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Your full name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none font-medium"
                {...register("name", { required: "Name is required" })}
              />
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="+880 1XXX-XXXXXX"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#1A3626]/20 focus:border-[#1A3626] transition-all outline-none font-medium"
                {...register("phone", { required: "Phone number is required" })}
              />
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1A3626] text-white font-bold rounded-xl hover:bg-[#14281c] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving Changes..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full mt-3 py-3 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
