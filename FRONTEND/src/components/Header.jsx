import { Bell, Menu, Moon, Sun, X, LogOut } from "lucide-react";
import React from "react"; // is required to use JSX
import { logout } from "../utils/auth"; //Enable to use custom logout function
import { useTheme } from "../context/ThemeContext.jsx"; //import react context hook which is customized 


// header is a functional component that receivees two props isOPen when the sidebar is opened and setIsOpen function to update state
const Header = ({ isOpen, setIsOpen }) => {
  const { theme, toggleTheme } = useTheme();//uses theme context and toggleTheme switches between light or dark

  return (

    //this sticks the header to the top with ful width and display items horizontal with white background and z-999 keeps the header above other elements 
    <div className="fixed top-0 left-0 w-full flex justify-between items-center 
                    bg-white shadow p-5 z-[999]">


      {/* toggles sidebar/menu to open and close the button will be hidden in large screens and sp this is mainly used in mobiles */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden"
      >

        {/* conditional rendering if the menu is open the show the x menu and otherwise show the humberger menu */}
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>


{/* text is sized according to screens */}
      <h2 className="text-lg md:text-2xl font-bold text-gray-900">
        Student Consultation Portal
      </h2>
  
    {/* this holds the toggle theme notifications buton and logout button all in horizontal position and wiith gap between them */}
      <div className="flex items-center gap-4">

        {/* this button calls the toggle theme() when clicked  */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Toggle dark mode"
        >
          {/* if the theme is dark the show the moon otherwise the sun */}
          {theme === "dark" ? (
            <Sun size={20} className="cursor-pointer" />
          ) : (
            <Moon size={20} className="cursor-pointer" />
          )}
        </button>
        {/* this is for notification icon */}
        <div className="relative">
          <Bell size={20} className="cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        </div>
        {/* logout button calls logout() when clicked and  */}
        <button
          onClick={logout}
          className="flex items-center gap-4 px-3 py-2 rounded-md border border-gray-300 text-white text-sm bg-red-500 hover:bg-red-600"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};


//makes the header component reusable throughout the project
export default Header;
