import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";

export const Appbar = () => {
  const userData = useSelector((state: any) => state.auth?.userData?.userData);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setShowUserInfo(true);
  };

  const handleMouseLeave = () => {
    setShowUserInfo(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <div className="bg-white fixed top-0 left-0 w-full z-10 shadow-md">
      {/* Mobile Menu Icon */}
      <div className="md:hidden flex justify-between items-center px-4 py-2 border-b">
        <Link to={"/"} className="cursor-pointer font-bold text-2xl">
          Medium
        </Link>
        <button onClick={toggleMobileMenu} className="focus:outline-none">
          {showMobileMenu ? (
            // Close icon when menu is open
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon when menu is closed
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Container */}
      {showMobileMenu && (
        <div className="md:hidden bg-white w-full shadow-md border-b">
          <div className="flex flex-col items-center py-4">
            <Link to={`/publish`}>
              <button
                type="button"
                className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-4"
                onClick={toggleMobileMenu}
              >
                + Add blog
              </button>
            </Link>

            {userData && userData.thumbnail && (
              <div
                className="relative flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative rounded-full overflow-hidden h-10 w-10">
                  <img
                    src={userData.thumbnail}
                    alt="User Thumbnail"
                    className="object-cover w-full h-full"
                  />
                </div>
                {showUserInfo && (
                  <div className="absolute top-8 right-1 w-auto mt-2 bg-white border border-gray-200 shadow-md p-2 rounded-md">
                    <p className="font-semibold">{userData.name}</p>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="text-black border border-gray-500 bg-orange-300 hover:bg-orange-500 hover:text-black mt-4 font-medium rounded-full px-4 py-2 focus:outline-none"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-between items-center px-10 py-2">
        <Link to={"/"} className="cursor-pointer font-bold text-2xl">
          Medium
        </Link>
        <div className="flex items-center">
          <Link to={`/publish`}>
            <button
              type="button"
              className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            >
              + Add blog
            </button>
          </Link>

          {userData && userData.thumbnail && (
            <div
              className="relative flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative rounded-full overflow-hidden h-10 w-10">
                <img
                  src={userData.thumbnail}
                  alt="User Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
              {showUserInfo && (
                <div className="absolute top-8 right-1 w-auto mt-2 bg-white border border-gray-200 shadow-md p-2 rounded-md">
                  <p className="font-semibold">{userData.name}</p>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="text-black border border-gray-500 bg-orange-300 hover:bg-orange-500 hover:text-black ml-4 font-medium rounded-full px-4 py-2 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
