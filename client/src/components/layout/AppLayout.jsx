import { useState } from "react"
import { useLocation } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import MembersList from "./MembersList"
import { useChat } from "../../contexts/ChatContext.jsx"

const AppLayout = (WrappedComponent) => {
  const HOC = (props) => {
    const { selectedChat } = useChat()
    const location = useLocation()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [membersOpen, setMembersOpen] = useState(false)

    const isChatPage = location.pathname.startsWith("/chat")

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen)
      if (membersOpen) setMembersOpen(false)
    }

    const toggleMembers = () => {
      setMembersOpen(!membersOpen)
      if (sidebarOpen) setSidebarOpen(false)
    }

    return (
      <div className="flex flex-col h-screen dark:bg-gray-900">
        <Header
          toggleSidebar={toggleSidebar}
          toggleMembers={toggleMembers}
          showMembersToggle={isChatPage && selectedChat}
        />

        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile sidebar overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 lg:hidden ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div
            className={`absolute inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar closeSidebar={() => setSidebarOpen(false)} />
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            <WrappedComponent {...props} chat={selectedChat} toggleMembers={toggleMembers} />
          </div>

          {/* Members list */}
          {isChatPage && selectedChat && (
            <>
							{/* Mobile Members list overlay */}
              <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 lg:hidden ${
                  membersOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMembersOpen(false)}
              />
              <div
                className={`absolute inset-y-0 right-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                  membersOpen ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <MembersList chatId={selectedChat._id} closeMembers={() => setMembersOpen(false)} />
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  return HOC
}

export default AppLayout

