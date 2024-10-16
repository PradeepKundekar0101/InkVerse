import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from '../app/slices/authSlice'
import { BiMoon, BiSun } from "react-icons/bi";
import { toggleMode } from "../app/slices/modeSlice";
import { MdCancel, MdMenu } from "react-icons/md";

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const currentMode = useAppSelector((state) => state.mode.mode);
  const [mode, setMode] = useState<string>(currentMode);
  const dispatch = useAppDispatch();

  const handleThemeToggle = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    dispatch(toggleMode({ mode: newMode }));
  };

  return (
    <nav className="w-full flex py-2 lg:py-4 px-3.5 justify-between items-center navbar dark:bg-slate-800 z-50">
      <h1 className="text-md text-black dark:text-white">INKVERSE</h1>
      
      {/* Desktop Navigation */}
      <ul className="list-none sm:flex hidden justify-end items-center dark:text-white flex-1">
        <li>
          <Link
            to={"/"}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === "home" ? "text-blue-900 dark:text-blue-300" : "text-dimWhite"
            } `}
            onClick={() => setActive("home")}
          >
            Home
          </Link>
        </li>  

        <li onClick={() => setActive("exploreblogs")}>
          <Link to={"/blog/explore"}  className={`text-center font-medium cursor-pointer ml-3 text-[16px] ${
              active === "exploreblogs" ? "text-blue-800 dark:text-blue-300" : "text-dimWhite"
            } `} > Explore Blogs </Link>
        </li>

        <li onClick={() => setActive("postblog")}>
          <Link to={"/blog/addblog"}  className={`text-center ml-3 font-medium cursor-pointer text-[16px] ${
              active === "postblog" ? "text-blue-800 dark:text-blue-300" : "text-dimWhite"
            } `} > Post Blog </Link>
        </li>

        <li>
          <div className="flex items-center ml-3">
            <BiSun className={`mr-2 ${mode === 'light' ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div
              className="w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
              onClick={handleThemeToggle}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                  mode === 'dark' ? 'translate-x-7' : ''
                }`}
              />
            </div>
            <BiMoon className={`ml-2 ${mode === 'dark' ? 'text-blue-300' : 'text-gray-400'}`} />
          </div>
        </li>

        {user ? (
          <>
            <li onClick={() => { setActive("profile"); setToggle(!toggle) }}>
              <Link 
                to={`/user/${user._id}`}  
                className={`flex ml-3 items-center bg-slate-200 dark:bg-slate-700 dark:text-white px-2 rounded-md text-center font-medium cursor-pointer text-[16px]`}
              > 
                Profile &nbsp;  
                <img src={user.profile_picture} className="rounded-full h-8 w-8 object-cover" alt="Profile" />
              </Link>
            </li>
            <li>
              <button onClick={() => dispatch(logout())} className="bg-red-700 ml-3 text-white py-1 px-3 rounded-md">
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <div className="">
              <Link to={"/signin"} onClick={() => setToggle(!toggle)} className="mx-1  ml-3 border-3 border-black outline px-4 py-1.5">Login</Link>
              {/* <Link to={"/signup"} onClick={() => setToggle(!toggle)} className="mx-1 ml-3 bg-black text-white outline px-3 py-1.5">Create an Account</Link> */}
            </div>
          </li>
        )}
      </ul>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex flex-1 justify-end dark:bg-slate-800 items-center z-50">
        {toggle ? (
          <button onClick={() => setToggle(!toggle)}>
            <MdCancel size={30} fill={mode === "dark" ? "#fff" : "#000"} />
          </button>
        ) : (
          <button onClick={() => setToggle(!toggle)}>
            <MdMenu size={30} fill={mode === "dark" ? "#fff" : "#000"} />
          </button>
        )}
      
        {/* Sidebar */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } bg-white dark:bg-slate-800 absolute top-10 text-center right-0 py-52 min-w-full sidebar`}
        >
          <ul className="flex bg-white text-center dark:bg-slate-800 dark:text-white items-center space-y-10 justify-start flex-1 flex-col">
            <li onClick={() => { setActive("Home"); setToggle(!toggle) }}>
              <Link to={"/"} className={`text-center font-medium cursor-pointer text-[16px] ${
                  active === "Home" ? "text-blue-800 dark:text-blue-200" : "text-dimWhite"
                } `} > Home </Link>
            </li>

            <li onClick={() => { setActive("exploreblogs"); setToggle(!toggle) }}>
              <Link to={"/blog/explore"} className={`text-center font-medium cursor-pointer text-[16px] ${
                  active === "exploreblogs" ? "text-blue-800 dark:text-blue-200" : "text-dimWhite"
                } `} > Explore Blogs </Link>
            </li>

            <li>
              <div className="flex items-center">
                <BiSun className={`mr-2 ${mode === 'light' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <div
                  className="w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
                  onClick={handleThemeToggle}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
                      mode === 'dark' ? 'translate-x-7' : ''
                    }`}
                  />
                </div>
                <BiMoon className={`ml-2 ${mode === 'dark' ? 'text-blue-300' : 'text-gray-400'}`} />
              </div>
            </li>

            <li onClick={() => { setActive("postblog"); setToggle(!toggle) }}>
              <Link to={"/blog/addblog"} className={`text-center font-medium cursor-pointer text-[16px] ${
                  active === "postblog" ? "text-blue-800 dark:text-blue-200" : "text-dimWhite"
                } `} > Post Blog </Link>
            </li>
          
            {user ? (
              <>
                <li onClick={() => { setActive("profile"); setToggle(!toggle) }}>
                  <Link to={`/user/${user._id}`} className={`flex items-center text-center font-medium cursor-pointer text-[16px] ${
                    active === "postblog" ? "text-blue-800 dark:text-blue-200" : "text-dimWhite"
                  } `} > Profile &nbsp; <img src={user.profile_picture} className="rounded-full h-8 w-8 object-cover" alt="Profile" /></Link>
                </li>
                <li>
                  <button onClick={() => dispatch(logout())} className="bg-red-700 text-white py-1 px-3 rounded-md">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <div className="">
                  <Link to={"/signin"} onClick={() => setToggle(!toggle)} className="mx-1 border-3 border-black outline px-3 py-1">Login</Link>
                  <Link to={"/signup"} onClick={() => setToggle(!toggle)} className="mx-1 bg-black text-white outline px-3 py-1.5">Create an Account</Link>
                </div>
              </li> 
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;