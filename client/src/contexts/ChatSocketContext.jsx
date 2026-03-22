import {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";

const SOCKET_URL =
	import.meta.env.VITE_SOCKET_URL ||
	(typeof window !== "undefined" ? window.location.origin : "");

export const ChatSocketContext = createContext(null);

export const useChatSocket = () => {
	const ctx = useContext(ChatSocketContext);
	if (!ctx) {
		throw new Error("useChatSocket must be used within ChatSocketProvider");
	}
	return ctx;
};

export const ChatSocketProvider = ({ children }) => {
	const { user } = useUser();
	const [socket, setSocket] = useState(null);
	const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());

	const shouldConnect = Boolean(user);

	useEffect(() => {
		if (!shouldConnect || !user?._id) {
			setOnlineUserIds(new Set());
			setSocket(null);
			return;
		}

		const uid = user._id;
		const s = io(SOCKET_URL, { transports: ["websocket"], withCredentials: true });
		setSocket(s);

		const identify = () => {
			s.emit("presence_identify", { userId: uid });
		};

		const onPresenceSnapshot = ({ onlineUserIds: ids }) => {
			setOnlineUserIds(new Set((ids || []).map(String)));
		};

		const onUserPresenceGlobal = ({ userId, online }) => {
			setOnlineUserIds((prev) => {
				const next = new Set(prev);
				const id = String(userId);
				if (online) next.add(id);
				else next.delete(id);
				return next;
			});
		};

		s.on("connect", identify);
		s.on("presence_snapshot_global", onPresenceSnapshot);
		s.on("user_presence_global", onUserPresenceGlobal);

		if (s.connected) {
			identify();
		}

		return () => {
			s.off("connect", identify);
			s.off("presence_snapshot_global", onPresenceSnapshot);
			s.off("user_presence_global", onUserPresenceGlobal);
			s.disconnect();
			setSocket(null);
		};
	}, [shouldConnect, user?._id]);

	const isUserOnline = useCallback(
		(userId) => {
			if (!userId) return false;
			return onlineUserIds.has(String(userId));
		},
		[onlineUserIds],
	);

	const value = useMemo(
		() => ({
			socket,
			onlineUserIds,
			isUserOnline,
		}),
		[socket, onlineUserIds, isUserOnline],
	);

	return (
		<ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>
	);
};
