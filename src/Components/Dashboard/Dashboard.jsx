import { useContext, useState } from "react";
import "./Dashboard.css";
import { CiMenuFries } from "react-icons/ci";
import { RxAvatar, RxCross1 } from "react-icons/rx";
import { FaBell, FaCity, FaDashcube, FaDev, FaHome, FaLocationArrow, FaUserCircle } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";
import { MdFormatQuote, MdMiscellaneousServices, MdOutlineHandshake, MdOutlineLibraryAdd, MdOutlineRealEstateAgent, MdReviews } from "react-icons/md";
import { LuTableProperties } from "react-icons/lu";
import { GiConvergenceTarget } from "react-icons/gi";
import { RiBloggerLine, RiContactsLine, RiErrorWarningLine, RiGridLine, RiQuestionLine } from "react-icons/ri";
import { IoAddCircleOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { TbLayoutBottombar, TbLayoutNavbar } from "react-icons/tb";
import { FaPeopleGroup, FaStarHalfStroke } from "react-icons/fa6";
// import { AuthContext } from "../../AuthContext/AuthContext";

const Dashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPropertiesSubMenuOpen, setIsPropertiesSubMenuOpen] = useState(false);
  const [isBlogsSubMenuOpen, setIsBlogsSubMenuOpen] = useState(false);
  const [isTestimonialsSubMenuOpen, setIsTestimonialsSubMenuOpen] = useState(false);
  const [isHomeSubMenuOpen, setIsHomeSubMenuOpen] = useState(false);
//   const { logout } = useContext(AuthContext);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handlePropertiesSubMenuToggle = () => {
    setIsPropertiesSubMenuOpen(!isPropertiesSubMenuOpen);
    if (isBlogsSubMenuOpen) setIsBlogsSubMenuOpen(false);
    if (isTestimonialsSubMenuOpen) setIsTestimonialsSubMenuOpen(false);
    if (isHomeSubMenuOpen) setIsHomeSubMenuOpen(false);
  };

  const handleBlogsSubMenuToggle = () => {
    setIsBlogsSubMenuOpen(!isBlogsSubMenuOpen);
    if (isHomeSubMenuOpen) setIsHomeSubMenuOpen(false);
    if (isTestimonialsSubMenuOpen) setIsTestimonialsSubMenuOpen(false);
    if (isPropertiesSubMenuOpen) setIsPropertiesSubMenuOpen(false);
  };
  const handleTestimonialsSubMenuToggle = () => {
    setIsTestimonialsSubMenuOpen(!isTestimonialsSubMenuOpen);
    if (isHomeSubMenuOpen) setIsHomeSubMenuOpen(false);
    if (isBlogsSubMenuOpen) setIsBlogsSubMenuOpen(false);
    if (isPropertiesSubMenuOpen) setIsPropertiesSubMenuOpen(false);
  };
  const handleHomeSubMenuToggle = () => {
    setIsHomeSubMenuOpen(!isHomeSubMenuOpen);
    if (isTestimonialsSubMenuOpen) setIsTestimonialsSubMenuOpen(false);
    if (isPropertiesSubMenuOpen) setIsPropertiesSubMenuOpen(false);if (isBlogsSubMenuOpen) setIsBlogsSubMenuOpen(false);
  };

  const dashNav = (
    <ul className="menu bg-[#fff] text-base-content min-h-full w-full md:p-4 gap-2 align-middle">
      <li>
        <img
          src="https://i.ibb.co/55MrgtV/18a006575c097b8b99494b75da063caf.jpg"
          className="w-1/2"
        />
      </li>
      <li>
        <Link
          to={"/"}
          className="mt-6 p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li "
        >
          <FaDashcube />
          <span className="sidebar-text">Dashboard</span>
        </Link>
      </li>
      <li>
        <a
          className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li cursor-pointer justify-center"
          onClick={handlePropertiesSubMenuToggle}
        >
          <LuTableProperties />
          <span className="sidebar-text">Works</span>
          <span className="ml-auto">
            {isPropertiesSubMenuOpen ? (
              <span className="text-[5px]">▲</span>
            ) : (
              <span className="text-[5px]">▼</span>
            )}
          </span>
        </a>
        {isPropertiesSubMenuOpen && (
          <ul>
            <li>
              <Link
                to={"/work"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <MdOutlineLibraryAdd />
                <span className="sidebar-text">Add Work</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/manageworks"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2"
              >
                <LuTableProperties />
                <span className="sidebar-text">Manage Works</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/techCategory"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <FaDev />
                <span className="sidebar-text">Tech Category</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/techStack"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <GiConvergenceTarget />
                <span className="sidebar-text">Tech Stacks</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/status"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <MdOutlineRealEstateAgent />
                <span className="sidebar-text">Status</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/amenities"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <FaCity />
                <span className="sidebar-text">Amenities</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/cities"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <FaLocationArrow />
                <span className="sidebar-text">Cities</span>
              </Link>
            </li>
          </ul>
        )}
      </li>

      <li>
        <a
          className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li cursor-pointer justify-center"
          onClick={handleBlogsSubMenuToggle}
        >
          <RiBloggerLine />
          <span className="sidebar-text">Blogs</span>
          <span className="ml-auto">
            {isBlogsSubMenuOpen ? (
              <span className="text-[5px]">▲</span>
            ) : (
              <span className="text-[5px]">▼</span>
            )}
          </span>
        </a>
        {isBlogsSubMenuOpen && (
          <ul>
            <li>
              <Link
                to={"/addBlog"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <IoAddCircleOutline />
                <span className="sidebar-text">Add Blog</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/blogs"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2"
              >
                <RiGridLine />
                <span className="sidebar-text">Manage Blogs</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/blogCategories"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <BiCategory />
                <span className="sidebar-text">Blog Categories</span>
              </Link>
            </li>
          </ul>
        )}
      </li>

      <li>
        <a
          className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li cursor-pointer justify-center"
          onClick={handleHomeSubMenuToggle}
        >
          <FaHome />
          <span className="sidebar-text">Home</span>
          <span className="ml-auto">
            {isHomeSubMenuOpen ? (
              <span className="text-[5px]">▲</span>
            ) : (
              <span className="text-[5px]">▼</span>
            )}
          </span>
        </a>
        {isHomeSubMenuOpen && (
          <ul>
            <li>
              <Link
                to={"/hero"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <TbLayoutNavbar />
                <span className="sidebar-text">Hero</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/founder"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <RxAvatar />
                <span className="sidebar-text">Founder</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/team"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <FaPeopleGroup />
                <span className="sidebar-text">Team</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/faq"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2"
              >
                <MdFormatQuote />
                <span className="sidebar-text">Faq</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/inquiries"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2"
              >
                <RiContactsLine />
                <span className="sidebar-text">Inquiries</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/footer"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
              >
                <TbLayoutBottombar />

                <span className="sidebar-text">Footer</span>
              </Link>
            </li>
          </ul>
        )}
      </li>

      <li>
        <a
          className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li cursor-pointer justify-center"
          onClick={handleTestimonialsSubMenuToggle}
        >
          <FaStarHalfStroke />
          <span className="sidebar-text">Testimonials</span>
          <span className="ml-auto">
            {isTestimonialsSubMenuOpen ? (
              <span className="text-[5px]">▲</span>
            ) : (
              <span className="text-[5px]">▼</span>
            )}
          </span>
        </a>
        {isTestimonialsSubMenuOpen && (
          <ul>
          <li>
            <Link
              to={"/addTestimonial"}
              className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2 "
            >
              <MdReviews />
              <span className="sidebar-text">Add Testimonial</span>
            </Link>
          </li>
            <li>
              <Link
                to={"/testimonials"}
                className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li mt-2"
              >
                <RiGridLine />
                <span className="sidebar-text">Manage Testimonials</span>
              </Link>
            </li>
            
          </ul>
        )}
      </li>


      <li>
        <Link
          to={"/about"}
          className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li "
        >
          <RiErrorWarningLine />
          <span className="sidebar-text">About</span>
        </Link>
      </li>
      <li>
      <Link
        to={"/services"}
        className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li "
      >
       <MdMiscellaneousServices />
        <span className="sidebar-text">Services</span>
      </Link>
    </li>
      <li>
      <Link
        to={"/howwework"}
        className="p-3 bg-[#7e7e7e1a] rounded flex items-center gap-2 side-li "
      >
        <RiQuestionLine />
        <span className="sidebar-text">How We Work</span>
      </Link>
    </li>
      
    </ul>
  );
  const handleLogOut =()=>{
    logout()
  }
  return ( <div className="drawer bg-slate-100">
    <input
      id="my-drawer"
      type="checkbox"
      className="drawer-toggle"
      checked={isDrawerOpen}
      onChange={handleDrawerToggle}
    />
    <div className="drawer-content overflow-x-auto">
      {/* Page content here */}
      <nav className="navbar bg-[#fff] justify-between">
        <label
          htmlFor="my-drawer"
          className="drawer-button text-black text-2xl"
        >
          {isDrawerOpen ? <RxCross1 /> : <CiMenuFries />}
        </label>
        <div className="flex gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered w-24 md:w-auto"
            />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="click avatar  flex items-center justify-center"
            >
              <div className="w-full text-center">
              <FaUserCircle className="text-4xl" />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li onClick={handleLogOut}>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Your page content */}
      <Outlet />
    </div>
    <div className="drawer-side">
      <label
        htmlFor="my-drawer"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      {/* Sidebar content here */}
      {dashNav}
    </div>
  </div>
  );
};

export default Dashboard;