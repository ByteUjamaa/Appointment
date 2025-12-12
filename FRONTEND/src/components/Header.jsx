import { Bell, Menu, Moon, X } from "lucide-react";
import React from "react";

const Header = ({ isOpen, setIsOpen }) => {
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
        Student Consultation Portal
      </h2>

      <div className="flex gap-4">
        <Moon size={20} className="cursor-pointer" />
        <div className="relative">
          <Bell size={20} className="cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            1
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
