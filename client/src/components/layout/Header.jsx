import { Plus, Bell} from "lucide-react"
import logo from '../../assets/logo.svg';
import SunIcon from '../../assets/sun.svg';
import MoonIcon from '../../assets/moon.svg';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<>
			<div className={`${theme && "dark"}`}>
				<div className="flex items-center justify-between gap-2 p-3 bg-teal-600 text-white shadow-md">
					<div className="flex items-center gap-2">
						<img src={logo} alt="Yapper Logo" className="w-10 h-10" />
						<h1 className="text-2xl font-bold">Yapper</h1>
					</div>
					<div className="flex items-center gap-4">
						<button 
							className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 transition-colors"
							aria-label="Create new chat"
						>
							<Plus className="w-5 h-5" />
						</button>

						<button 
							className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 transition-colors"
							aria-label="Notifications"
						>
							<Bell className="w-5 h-5" />
						</button>

						<button 
							className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 transition-colors"
							onClick={toggleTheme}
						>
							{theme ? (
								<img src={SunIcon} alt="Sun Icon" className="w-6 h-6" />
							) : (
									<img src={MoonIcon} alt="Moon Icon" className="w-6 h-6" />
								)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Header;
