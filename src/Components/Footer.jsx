import React, { useMemo } from "react";
import { NavLink } from "react-router";
import {
  AiOutlineFacebook,
  AiOutlineTwitter,
  AiOutlineInstagram,
  AiOutlineLinkedin,
  AiOutlineYoutube,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
  AiOutlineHeart,
  AiOutlineArrowUp,
  AiOutlineFundProjectionScreen,
  AiOutlineIdcard,
} from "react-icons/ai";
import img from "../assets/logo.jpg";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Use same data as Header for consistency
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
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4">
              <NavLink to="/" className="flex items-center">
                <img src={img} alt="Exam Hero Logo" className="w-16 h-auto mr-2" />
                <span className="text-2xl font-bold">
                  <span className="text-blue-600">Exam</span>
                  <span className="text-orange-400">Hero</span>
                </span>
              </NavLink>
            </div>
            <p className="text-gray-300 mb-4 max-w-sm">
              ExamHero is your premier platform for academic excellence. 
              We provide comprehensive educational resources and expert guidance 
              to help students excel in SSC and HSC examinations.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: AiOutlineFacebook, href: "https://www.facebook.com/profile.php?id=61580635798139", color: "hover:bg-blue-600" },
                { icon: AiOutlineTwitter, href: "https://twitter.com", color: "hover:bg-blue-400" },
                { icon: AiOutlineInstagram, href: "https://instagram.com", color: "hover:bg-pink-600" },
                { icon: AiOutlineLinkedin, href: "https://linkedin.com", color: "hover:bg-blue-700" },
                { icon: AiOutlineYoutube, href: "https://youtube.com", color: "hover:bg-red-600" },
              ].map(({ icon: Icon, href, color }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-800 p-2 rounded-full ${color} transition-colors duration-300`}
                  aria-label={Icon.displayName || "Social"}
                >
                  <Icon className="text-xl" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-blue-500">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Teachers", path: "/allteachers" },
                { name: "Contact Us", path: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <NavLink
                    to={link.path}
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-blue-500">
              <AiOutlineFundProjectionScreen className="text-blue-400" /> Programs
            </h3>
            {programCategories.map((category, index) => (
              <div key={index} className="mb-4">
                <h4 className="text-sm font-semibold text-blue-400 uppercase mb-2">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.items.map((item, i) => (
                    <li key={i}>
                      <NavLink
                        to={item.path}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-300 block"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative pb-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-12 after:bg-blue-500">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <AiOutlineEnvironment className="text-blue-400 text-4xl mt-1 mr-3" />
                <span className="text-gray-300">
                  Holding #439, Jankikhila, Sreebordi, Sherpur
                  Mymensingh, Bangladesh
                </span>
              </li>
              <li className="flex items-center">
                <AiOutlinePhone className="text-blue-400 text-xl mr-3" />
                <a href="tel:+8801817337750" className="hover:text-blue-400">
                +880 1817-337750
                </a>
              </li>
              <li className="flex items-center">
                <AiOutlineMail className="text-blue-400 text-xl mr-3" />
                <a href="mailto:support@examhero.app" className="hover:text-blue-400">
                  support@examhero.app
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-gray-200">Subscribe to our Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-3 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* License Information Row - Contact Info এর পরে, ডান পাশে */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 rounded-lg p-4 mb-8">
          <div className="mb-4 md:mb-0">
            <h4 className="text-lg font-semibold mb-2 flex items-center">
              <AiOutlineIdcard className="text-blue-400 mr-2" /> 
              Official Licenses & Registrations
            </h4>
            <p className="text-gray-300 text-sm">
              ExamHero is a fully registered and licensed educational platform
            </p>
          </div>
          
          <div className="flex flex-col md:items-end space-y-2">
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-2">Trade License:</span>
              <span className="font-medium">43 | Book No.- 01</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-2">BIN:</span>
              <span className="font-medium">007401091-0107</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-2">DUNS:</span>
              <span className="font-medium">Processing</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0 flex flex-row items-center ">
            © {new Date().getFullYear()} ExamHero. All rights reserved. Made with <AiOutlineHeart className="text-red-500 mx-1" /> by ExamHero Team.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <NavLink to="/privicrpolicy" className="hover:text-blue-400">
              Privacy Policy
            </NavLink>
            <NavLink to="/termsandconditions" className="hover:text-blue-400">
              Terms & Conditions
            </NavLink>
            <button
              onClick={scrollToTop}
              className="flex items-center hover:text-blue-400"
              aria-label="Scroll to top"
            >
              Back to Top <AiOutlineArrowUp className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;