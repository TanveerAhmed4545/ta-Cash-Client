/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
          isActive
            ? "bg-[#bbf7d0] text-[#1A3626] shadow-sm"
            : "text-gray-500 hover:bg-white/50 hover:text-[#1A3626]"
        }`
      }
    >
      <Icon className="w-5 h-5" />

      <span className="mx-4">{label}</span>
    </NavLink>
  );
};

export default MenuItem;
