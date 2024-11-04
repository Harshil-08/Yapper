import React from 'react';
import logo from '../../assets/logo.svg';
import SunIcon from '../../assets/sun.svg';
import MoonIcon from '../../assets/moon.svg';

const Header = () => {
	//const { theme, toggleTheme } = useTheme();

	return (
		<div className="flex items-center justify-between gap-2 p-2 bg-teal-600 text-white">
			<div className="flex gap-2 items-center">
				<img src={logo} alt="Yapper Logo" className="w-10 h-10" />
				<h1 className="text-2xl font-bold">Yapper</h1>
			</div>
			<div className="">
				<button
					className="w-8 h-8 items-center rounded-full"
					//onClick={toggleTheme}
					>
					<img src={SunIcon} alt="Sun Icon" className="w-6 h-6" />
				</button>
			</div>
		</div>
	);
}

export default Header;
