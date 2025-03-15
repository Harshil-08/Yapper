import { Plus, Bell, Search, Sun, Moon, Menu, Users } from "lucide-react"
import logo from "../../assets/logo.svg"
import { useTheme } from "../../contexts/ThemeContext"
import { useState } from "react"
import SearchUser from "../../modals/SearchUser"
import CreateGroup from "../../modals/CreateGroup"
import Notification from "../../modals/Notification"

const Header = ({ toggleSidebar, toggleMembers, showMembersToggle }) => {
  const { theme, toggleTheme } = useTheme()
  const [searchPeople, setSearchPeople] = useState(false)
  const [createGroup, setCreateGroup] = useState(false)
  const [notification, setNotification] = useState(false)

  return (
    <>
      <div
        className={`${theme && "dark"} 
        flex items-center justify-between gap-2 p-2 bg-teal-600 dark:bg-black text-white shadow-md`}
      >
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src={logo} alt="Yapper Logo" className="w-8 h-8 md:w-9 md:h-9" />
          <h1 className="text-xl md:text-2xl font-bold">Yapper</h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 dark:hover:bg-gray-800 transition-colors"
            aria-label="Search"
            onClick={() => setSearchPeople(true)}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 dark:hover:bg-gray-800 transition-colors"
            aria-label="Create new chat"
            onClick={() => setCreateGroup(true)}
          >
            <Plus className="w-5 h-5" />
          </button>

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 dark:hover:bg-gray-800 transition-colors"
            aria-label="Notifications"
            onClick={() => setNotification(true)}
          >
            <Bell className="w-5 h-5" />
          </button>

          {showMembersToggle && (
            <button
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMembers}
              aria-label="Toggle Members"
            >
              <Users className="w-5 h-5" />
            </button>
          )}

          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-teal-700 dark:hover:bg-gray-800 transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme ? <Sun className="w-5 h-5" /> : <Moon color="white" className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Modals */}
      <SearchUser isOpen={searchPeople} onClose={() => setSearchPeople(false)} />
      <CreateGroup isOpen={createGroup} onClose={() => setCreateGroup(false)} />
      <Notification isOpen={notification} onClose={() => setNotification(false)} />
    </>
  )
}

export default Header

