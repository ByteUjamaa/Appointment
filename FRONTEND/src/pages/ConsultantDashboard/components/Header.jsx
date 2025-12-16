import { Bell, Menu, Moon, Sun, X, LogOut } from "lucide-react";
import React from "react";
import { logout } from "../../../utils/auth";
import { useTheme } from "../../../context/ThemeContext.jsx";

const Header = ({ isOpen, setIsOpen }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="fixed top-0 left-0 w-full flex justify-between items-center 
                    bg-white shadow p-5 z-[999]">

      {/* MOBILE MENU / X BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <h2 className="text-lg md:text-2xl font-bold text-gray-900">
        Consultant Portal
      </h2>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? (
            <Sun size={20} className="cursor-pointer" />
          ) : (
            <Moon size={20} className="cursor-pointer" />
          )}
        </button>
        <div className="relative">
          <Bell size={20} className="cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-sm hover:bg-gray-100"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Header;
