import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../features/authSlice";

export const Appbar = () => {
  const userData = useSelector((state: any) => state.auth?.userData?.userData);
  const [showUserInfo, setShowUserInfo] = useState(false);

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
  };

  return (
    <div className="border-b flex justify-between items-center px-20 py-2 bg-white fixed top-0 left-0 w-full z-10 shadow-md">
      <Link
        to={"/"}
        className="flex flex-col justify-center cursor-pointer font-bold text-2xl"
      >
        Medium
      </Link>
      <div className="flex items-center">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
          >
            New
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
        {}
        <button
          type="button"
          onClick={handleLogout}
          className="text-black border border-gray-500 bg-orange-300 hover:bg-orange-500 hover:text-black ml-4 font-medium rounded-full px-4 py-2 focus:outline-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
