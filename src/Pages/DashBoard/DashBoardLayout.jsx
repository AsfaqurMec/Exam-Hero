import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet, Navigate, useLocation, useNavigate } from "react-router";
import useUserRole from "../../Hooks/UseUserRole";
import { AuthContext } from "../../Provider/AuthProvider";

const DashBoardLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const { role, roleLoading } = useUserRole();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePath, setActivePath] = useState("");

  // Active path + redirect logic
  useEffect(() => {
    setActivePath(location.pathname);

    if (location.pathname === "/dashboard" && !roleLoading) {
      if (role === "admin") {
        navigate("/dashboard/teacherapplications", { replace: true });
        setActivePath("/dashboard/teacherapplications");
      } else if (role === "user") {
        navigate("/dashboard/profile", { replace: true });
        setActivePath("/dashboard/profile");
      }
    }
  }, [location, role, roleLoading, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="h-8 w-8 bg-blue-600 rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading Dashboard</p>
          <p className="mt-2 text-gray-500">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleNavigation = () => {
    setIsSidebarOpen(false);
  };

  const isActiveLink = (path) => {
    return activePath === path
      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-600"
      : "";
  };

  // Sidebar menu items এক জায়গায় রাখলাম যাতে desktop + mobile দুই জায়গায় ব্যবহার করা যায়
  const sidebarMenu = (
    <nav className="flex-1 px-4 space-y-1">
      {role === "user" && (
        <Link
          to="/dashboard/profile"
          onClick={handleNavigation}
          className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
            "/dashboard/profile"
          )} hover:bg-gray-50 hover:text-gray-900`}
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <span>Profile</span>
        </Link>
      )}

      {role === "admin" && (
        <>
          <Link
            to="/dashboard/teacherapplications"
            onClick={handleNavigation}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
              "/dashboard/teacherapplications"
            )} hover:bg-gray-50 hover:text-gray-900`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <span>Teacher Applications</span>
          </Link>
          <Link
            to="/dashboard/changesbanners"
            onClick={handleNavigation}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
              "/dashboard/changesbanners"
            )} hover:bg-gray-50 hover:text-gray-900`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <span>Manage Banners</span>
          </Link>
          <Link
            to="/dashboard/contactmessages"
            onClick={handleNavigation}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
              "/dashboard/contactmessages"
            )} hover:bg-gray-50 hover:text-gray-900`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clipRule="evenodd"
              />
            </svg>
            <span>Contact Messages</span>
          </Link>
          <Link
            to="/dashboard/userroleupdate"
            onClick={handleNavigation}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
              "/dashboard/userroleupdate"
            )} hover:bg-gray-50 hover:text-gray-900`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>User Management</span>
          </Link>
          <Link
            to="/dashboard/examherohighlight"
            onClick={handleNavigation}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
              "/dashboard/examherohighlight"
            )} hover:bg-gray-50 hover:text-gray-900`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>Exam Hero Highlight</span>
          </Link>
          <Link
            to="/dashboard/applink"
            onClick={handleNavigation}
            className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 ${isActiveLink(
              "/dashboard/applink"
            )} hover:bg-gray-50 hover:text-gray-900`}
          >
            <svg
              className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span>App Links</span>
          </Link>
        </>
      )}

      <div className="pt-8 mt-8 border-t border-gray-200">
        <Link
          to="/"
          onClick={handleNavigation}
          className="group flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          <svg
            className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white pt-6 pb-4 overflow-y-auto border-r border-gray-200 shadow-sm">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">
                {role === "admin" ? "Admin Portal" : "My Dashboard"}
              </h1>
            </div>
          </div>
          <div className="flex-grow flex flex-col">{sidebarMenu}</div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center w-full">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.displayName || user.email}
                </p>
                <p className="text-xs font-medium text-gray-500 capitalize">
                  {role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
            <button
              className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 px-4 flex justify-between items-center">
              <h1 className="text-lg font-semibold text-gray-800">
                {role === "admin" ? "Admin Dashboard" : "User Dashboard"}
              </h1>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none py-6 bg-gradient-to-b from-blue-50/30 to-indigo-50/30">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 flex z-50">
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl transform transition duration-300 ease-in-out">
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h2 className="text-lg font-bold">{role === "admin" ? "Admin Menu" : "User Menu"}</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">{sidebarMenu}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashBoardLayout;
