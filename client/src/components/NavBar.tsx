import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { MdMenu } from "react-icons/md";
import { Link } from "react-router-dom";


export const navLinks = [
  {
    id: "home",
    title: "Home",
  },
  {
    id: "features",
    title: "Features",
  },
  {
    id: "product",
    title: "Product",
  },
  {
    id: "clients",
    title: "Clients",
  },
];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      {/* Logo */}
      <h1 className="text-3xl text-black">Logo</h1>
      
      {/* Desktop Navigation */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              active === nav.title ? "text-blue-900" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
            onClick={() => setActive(nav.title)}
          >
            <Link to="/">{nav.title} </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Navigation */}
      <div className="sm:hidden flex flex-1 justify-end items-center" >
        
        <img src={toggle ? "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-512.png" : "https://w7.pngwing.com/pngs/451/380/png-transparent-hamburger-button-computer-icons-menu-menu-rectangle-desktop-wallpaper-button.png" }
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)} />

        {/* Sidebar */}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          }  bg-black-gradient absolute top-20 text-center right-0  my-2 min-w-full rounded-xl sidebar`}
        >
          <ul className="list-none flex bg-white text-center items-center  justify-end  flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={` text-center font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-blue-800" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      
     </div>
    </nav>
  );
};

export default Navbar;