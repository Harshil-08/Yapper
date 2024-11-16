import React from 'react';
import logo from '../../assets/logo.svg';
import SunIcon from '../../assets/sun.svg';
import MoonIcon from '../../assets/moon.svg';

const Header = () => {
  //const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between gap-2 p-3 bg-teal-600 text-white shadow-md">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Yapper Logo" className="w-10 h-10" />
        <h1 className="text-2xl font-bold">Yapper</h1>
      </div>
      <div>
        <button className="w-8 h-8 flex items-center justify-center rounded-full">
          <img src={SunIcon} alt="Toggle Theme" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
