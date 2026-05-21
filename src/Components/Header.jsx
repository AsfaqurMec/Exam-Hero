import React, { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import img from "../assets/logo.jpg";

import {
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineFundProjectionScreen,
  AiOutlinePhone,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineBook,
  AiOutlineTeam,
  AiOutlineCaretDown,
} from "react-icons/ai";
import { AuthContext } from "../provider/AuthProvider";

// Sub-components for better organization
const DesktopNavigation = React.memo(({ 
  linkClass, 
  programCategories, 
  programsRef, 
  menuState, 
  setMenuState, 
  closeAllMenus 
}) => {
  return (
    <nav className="hidden lg:block">
      <ul className="flex space-x-1 items-center">
        <li>
          <NavLink to="/" className={linkClass}>
            <AiOutlineHome className="text-lg" />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={linkClass}>
            <AiOutlineInfoCircle className="text-lg" />
            About
          </NavLink>
        </li>
        <li
          className="relative"
          ref={programsRef}
          onMouseEnter={() => setMenuState(prev => ({ ...prev, isProgramsOpen: true }))}
          onMouseLeave={() => setMenuState(prev => ({ ...prev, isProgramsOpen: false }))}
        >
          <button
            className={`flex items-center gap-2 font-medium px-3 py-2 transition-all duration-200 rounded-md group ${
              menuState.isProgramsOpen
                ? "text-blue-700 bg-blue-50"
                : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
            }`}
            aria-expanded={menuState.isProgramsOpen}
            aria-haspopup="true"
          >
            <AiOutlineFundProjectionScreen className="text-lg" />
            <span>Programs</span>
            <AiOutlineCaretDown
              className={`w-3 h-3 transition-transform duration-200 ${
                menuState.isProgramsOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div
            className={`absolute top-full left-0 transform mt-1 bg-white shadow-xl rounded-lg w-96 p-4 grid grid-cols-2 gap-4 z-50 transition-all duration-200 border border-gray-100 ${
              menuState.isProgramsOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {programCategories.map((category, index) => (
              <div key={index}>
                <h3 className="font-semibold text-blue-800 text-sm uppercase tracking-wide pb-2 mb-2 border-b border-gray-200">
                  {category.title}
                </h3>
                <ul className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <NavLink
                        to={item.path}
                        className="block py-2 px-3 rounded-md text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                        onClick={closeAllMenus}
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
        <li>
          <NavLink to="/allteachers" className={linkClass}>
            <AiOutlineTeam className="text-lg" />
            Teachers
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={linkClass}>
            <AiOutlinePhone className="text-lg" />
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink to="/applyteacher" className={linkClass}>
            <AiOutlineUserAdd className="text-lg" />
            Teach With Us
          </NavLink>
        </li>
      </ul>
    </nav>
  );
});

const UserProfileDropdown = React.memo(({ 
  user, 
  imageError, 
  handleImageError, 
  menuState, 
  profileRef, 
  setMenuState, 
  closeAllMenus, 
  handleLogout 
}) => {
  return (
    <div
      className="relative"
      ref={profileRef}
      onMouseEnter={() => setMenuState(prev => ({ ...prev, isProfileOpen: true }))}
      onMouseLeave={() => setMenuState(prev => ({ ...prev, isProfileOpen: false }))}
    >
      <button
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="User profile menu"
        aria-expanded={menuState.isProfileOpen}
        aria-haspopup="true"
      >
        <div className="w-9 h-9 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center bg-gray-100">
          {imageError || !user.photoURL ? (
            <span className="text-blue-600 font-semibold text-sm">
              {user.displayName?.charAt(0).toUpperCase() || "U"}
            </span>
          ) : (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="w-full h-full object-cover"
              onError={handleImageError}
              loading="lazy"
            />
          )}
        </div>
        <AiOutlineCaretDown
          className={`w-3 h-3 transition-transform duration-200 ${
            menuState.isProfileOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`absolute -right-10 mt-0 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200 transition-all duration-200 ${
          menuState.isProfileOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user.displayName || "User"}
          </p>
          <p className="text-xs text-gray-500 truncate mt-1">
            {user.email}
          </p>
        </div>
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
          onClick={closeAllMenus}
        >
          <AiOutlineDashboard className="text-lg opacity-70" /> Dashboard
        </NavLink>
        <button
          onClick={() => {
            handleLogout();
            closeAllMenus();
          }}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-left border-t border-gray-100 mt-1"
        >
          <AiOutlineLogout className="text-lg opacity-70" /> Logout
        </button>
      </div>
    </div>
  );
});

const AuthButtons = React.memo(({ isMobile = false }) => {
  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-2 w-full' : 'gap-2'}`}>
      <NavLink
        to="/login"
        className={`px-4 py-2 text-sm font-medium text-blue-700 hover:text-white hover:bg-blue-700 border border-blue-700 rounded-md transition-colors duration-200 flex items-center justify-center ${isMobile ? 'w-full' : ''}`}
      >
        <AiOutlineLogin className="mr-1.5" /> Login
      </NavLink>
      <NavLink
        to="/register"
        className={`px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors duration-200 flex items-center justify-center ${isMobile ? 'w-full' : ''} shadow-sm`}
      >
        <AiOutlineUserAdd className="mr-1.5" /> Register
      </NavLink>
    </div>
  );
});

const MobileMenu = React.memo(({ 
  menuState, 
  mobileMenuRef, 
  closeAllMenus, 
  toggleMobileSubmenu, 
  programCategories, 
  mobileLinkClass, 
  user, 
  imageError, 
  handleImageError, 
  handleLogout 
}) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          menuState.isMobileMenuOpen
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeAllMenus}
        aria-hidden={!menuState.isMobileMenuOpen}
      />

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
          menuState.isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
            <NavLink
              to="/"
              className="flex items-center"
              onClick={closeAllMenus}
            >
              <div className="flex items-center">
                <img className="w-10 h-10 object-contain" src={img} alt="Exam Hero Logo" />
                 <span className="text-lg font-bold text-orange-500 leading-4"><span className="text-blue-500">Exam</span> Hero</span>
                
              </div>
            </NavLink>
            <button
              onClick={closeAllMenus}
              className="p-2 text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <AiOutlineClose className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/"
                  className={mobileLinkClass}
                  onClick={closeAllMenus}
                >
                  <AiOutlineHome className="text-xl" /> Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={mobileLinkClass}
                  onClick={closeAllMenus}
                >
                  <AiOutlineInfoCircle className="text-xl" /> About
                </NavLink>
              </li>
              <li>
                <div
                  className={`rounded-lg ${
                    menuState.activeMobileSubmenu === "programs"
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <button
                    onClick={() => toggleMobileSubmenu("programs")}
                    className="flex items-center justify-between w-full px-4 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-50"
                    aria-expanded={menuState.activeMobileSubmenu === "programs"}
                  >
                    <div className="flex items-center gap-3">
                      <AiOutlineFundProjectionScreen className="text-xl" />
                      <span>Programs</span>
                    </div>
                    <AiOutlineCaretDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        menuState.activeMobileSubmenu === "programs"
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      menuState.activeMobileSubmenu === "programs"
                        ? "max-h-96"
                        : "max-h-0"
                    }`}
                  >
                    <div className="pl-11 pr-4 py-2 space-y-1">
                      {programCategories.map((category, index) => (
                        <div key={index} className="mb-2">
                          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide pl-3 py-2">
                            {category.title}
                          </div>
                          <div className="space-y-1">
                            {category.items.map((item, itemIndex) => (
                              <NavLink
                                key={itemIndex}
                                to={item.path}
                                className="block py-2 px-3 rounded-md text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                                onClick={closeAllMenus}
                              >
                                {item.name}
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <NavLink
                  to="/allteachers"
                  className={mobileLinkClass}
                  onClick={closeAllMenus}
                >
                  <AiOutlineTeam className="text-xl" /> Teachers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={mobileLinkClass}
                  onClick={closeAllMenus}
                >
                  <AiOutlinePhone className="text-xl" /> Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/applyteacher"
                  className={mobileLinkClass}
                  onClick={closeAllMenus}
                >
                  <AiOutlineUserAdd className="text-xl" /> Teach With Us
                </NavLink>
              </li>
              {user && (
                <>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={mobileLinkClass}
                      onClick={closeAllMenus}
                    >
                      <AiOutlineDashboard className="text-xl" /> Dashboard
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/profile"
                      className={mobileLinkClass}
                      onClick={closeAllMenus}
                    >
                      <AiOutlineUser className="text-xl" /> Profile
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
          {/* Mobile Auth/User Section */}
          <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50">
            {user ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center bg-gray-100">
                  {imageError || !user.photoURL ? (
                    <span className="text-blue-600 font-semibold text-xl">
                      {user.displayName?.charAt(0).toUpperCase() || "U"}
                    </span>
                  ) : (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-900">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeAllMenus();
                  }}
                  className="w-full py-2.5 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <AiOutlineLogout className="mr-2" /> Logout
                </button>
              </div>
            ) : (
              <AuthButtons isMobile={true} />
            )}
          </div>
        </div>
      </div>
    </>
  );
});

// Mobile Auth Buttons Component for Header - শুধুমাত্র Login বোতাম থাকবে
const MobileAuthButtons = React.memo(() => {
  return (
    <div className="lg:hidden flex gap-2">
      {/* শুধুমাত্র Login বোতাম রাখা হয়েছে, Register বোতাম সরিয়ে দেওয়া হয়েছে */}
      <NavLink
        to="/login"
        className="px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-white hover:bg-blue-700 border border-blue-700 rounded-md transition-colors duration-200 flex items-center"
      >
        <AiOutlineLogin className="mr-1" /> Login
      </NavLink>
    </div>
  );
});

const Header = () => {
  const [menuState, setMenuState] = useState({
    isMobileMenuOpen: false,
    isProgramsOpen: false,
    isProfileOpen: false,
    activeMobileSubmenu: null,
  });

  const [scrolled, setScrolled] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { user, logOut } = useContext(AuthContext);
  const programsRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus and scroll to top when route changes
  useEffect(() => {
    closeAllMenus();
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Memoize the logout handler
  const handleLogout = useCallback(async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logOut, navigate]);

  // Toggle specific menu states
  const toggleMenuState = useCallback((key) => {
    setMenuState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
      // Close other menus when one is opened
      ...(key === "isProfileOpen" && { isProgramsOpen: false }),
      ...(key === "isProgramsOpen" && { isProfileOpen: false }),
      ...(key === "isMobileMenuOpen" && { activeMobileSubmenu: null }),
    }));
  }, []);

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setMenuState({
      isMobileMenuOpen: false,
      isProgramsOpen: false,
      isProfileOpen: false,
      activeMobileSubmenu: null,
    });
  }, []);

  // Toggle mobile submenus
  const toggleMobileSubmenu = useCallback((menu) => {
    setMenuState((prevState) => ({
      ...prevState,
      activeMobileSubmenu: prevState.activeMobileSubmenu === menu ? null : menu,
    }));
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (programsRef.current && !programsRef.current.contains(event.target)) {
        setMenuState((prev) => ({ ...prev, isProgramsOpen: false }));
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setMenuState((prev) => ({ ...prev, isProfileOpen: false }));
      }
      if (
        menuState.isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [menuState.isMobileMenuOpen, closeAllMenus]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuState.isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
    };
  }, [menuState.isMobileMenuOpen]);

  // CSS Classes
  const linkClass = useCallback(({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 transition-all duration-200 relative font-medium rounded-md ${
      isActive
        ? "text-blue-700 bg-blue-50 font-semibold"
        : "text-gray-600 hover:text-blue-700 hover:bg-gray-50"
    }`, []);

  const mobileLinkClass = useCallback(({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-lg ${
      isActive
        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-blue-700"
    }`, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  // Programs dropdown data
  const programCategories = useMemo(() => [
    {
      title: "SSC Programs",
      items: [
        { name: "SSC Science", path: "/sscscience" },
        { name: "SSC Humanities", path: "/sschumanities" },
        { name: "SSC Business Studies", path: "/sscbusiness" },
      ],
    },
    {
      title: "HSC Programs",
      items: [
        { name: "HSC Science", path: "/hscscience" },
        { name: "HSC Humanities", path: "/hschumanities" },
        { name: "HSC Business Studies", path: "/hscbusiness" },
      ],
    },
  ], []);

  return (
    <header
      className={`bg-white z-50 sticky top-0 transition-all duration-300 ${
        scrolled ? "shadow-lg py-0" : "shadow-md py-2"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              ref={mobileMenuButtonRef}
              onClick={() => toggleMenuState("isMobileMenuOpen")}
              className="lg:hidden text-gray-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 mr-2"
              aria-label="Toggle main menu"
              aria-expanded={menuState.isMobileMenuOpen}
            >
              {menuState.isMobileMenuOpen ? (
                <AiOutlineClose className="h-6 w-6" />
              ) : (
                <AiOutlineMenu className="h-6 w-6" />
              )}
            </button>
            <NavLink
              to="/"
              className="flex items-center"
              onClick={closeAllMenus}
            >
              <div className="flex items-center">
                <img className="w-10 h-10 object-contain md:w-12 md:h-12" src={img} alt="Exam Hero Logo" />
                <div className="flex flex-col ml-2">
                  <span className="text-lg font-bold text-orange-500 leading-4"><span className="text-blue-500">Exam</span> Hero</span>
                </div>
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <DesktopNavigation
            linkClass={linkClass}
            programCategories={programCategories}
            programsRef={programsRef}
            menuState={menuState}
            setMenuState={setMenuState}
            closeAllMenus={closeAllMenus}
          />

          {/* User/Auth Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Show profile dropdown on desktop */}
                <div className="hidden lg:block">
                  <UserProfileDropdown
                    user={user}
                    imageError={imageError}
                    handleImageError={handleImageError}
                    menuState={menuState}
                    profileRef={profileRef}
                    setMenuState={setMenuState}
                    closeAllMenus={closeAllMenus}
                    handleLogout={handleLogout}
                  />
                </div>
                {/* Show logout button on mobile */}
                <div className="lg:hidden">
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors flex items-center"
                  >
                    <AiOutlineLogout className="mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Desktop auth buttons */}
                <div className="hidden lg:block">
                  <AuthButtons />
                </div>
                {/* Mobile auth buttons - শুধুমাত্র Login বোতাম দেখাবে */}
                <div className="lg:hidden">
                  <MobileAuthButtons />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        menuState={menuState}
        mobileMenuRef={mobileMenuRef}
        closeAllMenus={closeAllMenus}
        toggleMobileSubmenu={toggleMobileSubmenu}
        programCategories={programCategories}
        mobileLinkClass={mobileLinkClass}
        user={user}
        imageError={imageError}
        handleImageError={handleImageError}
        handleLogout={handleLogout}
      />
    </header>
  );
};

export default React.memo(Header);