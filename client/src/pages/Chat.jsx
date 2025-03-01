import { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import AppLayout from "../components/layout/AppLayout"
import { useUser } from "../contexts/UserContext"

const Chat = ({ chat }) => {
	const [message, setMessage] = useState("")
	const [messages, setMessages] = useState([])
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(false)
	const containerRef = useRef(null)
	const messagesEndRef = useRef(null)
	const socketRef = useRef(null)
	const { user } = useUser()

	useEffect(() => {
		if (!chat) return

		socketRef.current = io("https://yapper-fm7z.onrender.com", { transports: ["websocket"] })
		socketRef.current.emit("join_room", { chatId: chat._id, page: 1 })
		socketRef.current.on("load_messages", ({ loadedMessages, hasMore: more }) => {
			setMessages(loadedMessages)
			setHasMore(more)
			setPage(1)
			scrollToBottom()
		})

		socketRef.current.on("receive_message", (newMessage) => {
			setMessages((prevMessages) => [...prevMessages, newMessage])
			scrollToBottom()
		})

		socketRef.current.on("load_more_messages", ({ loadedMessages, hasMore: more }) => {
			if (containerRef.current) {
				const container = containerRef.current
				const oldScrollHeight = container.scrollHeight
				setMessages((prevMessages) => [...loadedMessages, ...prevMessages])
				setHasMore(more)
				setTimeout(() => {
					container.scrollTop = container.scrollHeight - oldScrollHeight
				}, 100)
			}
		})

		return () => {
			socketRef.current.off("load_messages")
			socketRef.current.off("receive_message")
			socketRef.current.off("load_more_messages")
		}
	}, [chat])

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const handleScroll = () => {
			if (container.scrollTop === 0 && hasMore) {
				const nextPage = page + 1
				socketRef.current.emit("load_more", { chatId: chat._id, page: nextPage })
				setPage(nextPage)
			}
		}

		container.addEventListener("scroll", handleScroll)
		return () => container.removeEventListener("scroll", handleScroll)
	}, [page, hasMore, chat])

	const scrollToBottom = () => {
		setTimeout(() => {
			messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
		}, 100)
	}

	const handleSend = () => {
		if (message.trim() && chat && user) {
			const newMessage = {
				sender: user._id,
				content: message,
				chat: chat._id,
			}

			socketRef.current.emit("send_message", newMessage)
			setMessage("")
		}
	}

	if (!chat) {
		return (
			<div className="flex items-center justify-center flex-1 bg-gray-50 dark:bg-gray-900 h-full">
				<p className="text-teal-600 dark:text-teal-300 font-semibold">Select a chat to start messaging</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full flex-1 bg-white dark:bg-gray-800 shadow-md">
			<div className="p-4 text-lg font-bold border-b border-teal-300 dark:border-gray-700">
				<span className="text-teal-700 dark:text-teal-300">{chat.name}</span>
			</div>

			{/* Message Container */}
			<div ref={containerRef} className="flex-1 p-2 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-800">
				{messages.length === 0 ? (
					<p className="text-teal-600 dark:text-teal-300 italic text-center">
						No messages yet. Start the conversation!
					</p>
				) : (
						messages.map((msg, index) => (
							<div key={index} className={`flex items-start gap-2 ${msg.sender?._id === user?._id ? "justify-end" : ""}`}>
								{msg.sender?._id !== user?._id && (
									<img
										src={msg.sender?.avatar?.url || "https://via.placeholder.com/100"}
										alt="Avatar"
										className="w-8 h-8 md:w-10 md:h-10 rounded-full"
									/>
								)}

								<div
									className={`p-3 rounded-lg max-w-[75%] shadow-md ${
 										msg.sender?._id === user?._id
 										? "bg-teal-100 dark:bg-teal-900/30 text-left self-end"
										: "bg-gray-100 dark:bg-gray-700 self-start"
									}`}
								>
									{/* Sender Name */}
									<span className="block font-semibold text-teal-700 dark:text-teal-300 text-sm mb-1">
										{msg.sender?._id === user?._id ? "You" : msg.sender?.name}
									</span>

									{/* Message Content & Timestamp */}
									<div className="flex items-end justify-between">
										<p className="text-teal-900 dark:text-white break-all flex-1">
											{msg.content}
										</p>
										<span className="text-xs text-gray-500 dark:text-gray-400 ml-3 whitespace-nowrap">
											{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
										</span>
									</div>
								</div>

								{msg.sender?._id === user?._id && (
									<img
										src={user?.avatar?.url}
										alt="Avatar"
										className="w-8 h-8 md:w-10 md:h-10 rounded-full"
									/>
								)}
							</div>
						))
					)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Box */}
			<div className="flex items-center bottom-0 p-3 md:p-3 border-t border-teal-300 dark:border-gray-700 bg-white dark:bg-gray-900">
				<input
					type="text"
					className="flex-1 px-3 md:px-4 py-2 rounded-l-lg border border-teal-300 dark:border-gray-600 focus:outline-none dark:bg-gray-800 dark:text-white"
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>
				<button
					className="px-4 md:px-6 py-2 bg-teal-600 dark:bg-teal-700 text-white font-semibold rounded-r-lg hover:bg-teal-500 dark:hover:bg-teal-600 transition-colors"
					onClick={handleSend}
				>
					Send
				</button>
			</div>
		</div>
	)
}

export default AppLayout(Chat);

