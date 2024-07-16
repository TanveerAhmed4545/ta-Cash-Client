import { useState } from "react";
import { AiOutlineBars } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Provider/AuthProvider";
import AdminMenu from "../Menu/AdminMenu/AdminMenu";
import MenuItem from "../Menu/MenuItem/MenuItem";

const SideBar = () => {
  const { logout } = useAuth();
  const [isActive, setActive] = useState(false);
  // const [role] = useRole();
  // // console.log(role,isLoading);

  const navigate = useNavigate();

  // Sidebar Responsive Handler
  const handleToggle = () => {
    setActive(!isActive);
  };
  return (
    <>
      {/* Small Screen Navbar */}
      <div className="bg-gray-100 text-gray-800 flex justify-between md:hidden">
        <div>
          <div className="block cursor-pointer p-4 font-bold">
            <Link to="/">
              <img
                className="rounded-lg"
                src="https://i.ibb.co/S0pnvyQ/Shadoww.png"
                alt="logo"
                width="100"
                height="100"
              />
            </Link>
          </div>
        </div>

        <button
          onClick={handleToggle}
          className="mobile-menu-button p-4 focus:outline-none focus:bg-gray-200"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-x-hidden bg-gray-100 w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform ${
          isActive && "-translate-x-full"
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          <div>
            <div className="w-full hidden md:flex px-4 py-2  justify-center items-center  mx-auto">
              <Link to="/">
                <img
                  className="w-full rounded-lg shadow-lg"
                  src="https://i.ibb.co/S0pnvyQ/Shadoww.png"
                  alt="logo"
                  width="100"
                  height="100"
                />
              </Link>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            {/* Conditional toggle button here.. */}

            {/*  Menu Items */}
            <nav>
              {/* Common */}
              {/* Statistics */}
              <MenuItem
                label={"Dashboard Home"}
                address={"/dashboard"}
                icon={FaHome}
              ></MenuItem>

              {/* {role === "tourist" && <TouristMenu></TouristMenu>}
              {role === "guide" && <GuideMenu></GuideMenu>}
              {role === "admin" && <AdminMenu></AdminMenu>} */}
              {/* Admin Menu */}
              <AdminMenu></AdminMenu>

              {/* Tourist Menu
          <TouristMenu></TouristMenu> */}
            </nav>
          </div>
        </div>

        <div>
          <hr />

          <button
            onClick={() => logout(navigate("/login"))}
            className="flex w-full items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-300   hover:text-gray-700 transition-colors duration-300 transform"
          >
            <GrLogout className="w-5 h-5" />

            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;