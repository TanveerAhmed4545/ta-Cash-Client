/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";

const MenuItem = ({ label, address, icon: Icon }) => {
  return (
    <NavLink
      to={address}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-2 my-5 rounded-lg  transition-colors duration-300 transform  hover:bg-gray-300   hover:text-gray-700 ${
          isActive
            ? "bg-gray-300 rounded-lg  text-gray-700"
            : "text-gray-600 rounded-lg"
        }`
      }
    >
      <Icon className="w-5 h-5" />

      <span className="mx-4 font-medium">{label}</span>
    </NavLink>
  );
};

export default MenuItem;
