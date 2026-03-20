# 💬 Yapper

**Yapper** is a real-time group and direct messaging web app built for people who actually want to stay connected. Whether you're coordinating with your team or catching up with friends, Yapper keeps conversations moving with a clean interface and instant updates.

---

## ✨ What It Does

- **Real-time messaging** powered by Socket.IO — no refreshing, no delays
- **Direct messages** between two users, and **group chats** with as many people as you need
- **Reply to specific messages** so conversations stay in context
- **Edit or delete** your own messages after sending
- **Join groups via invite code** — share a code and anyone can jump in
- **Dark mode** that actually looks good
- Responsive design that works on phones, tablets, and desktops

---

## 🛠️ Tech Stack

**Frontend**
- React 18 with React Router for navigation
- Tailwind CSS for styling (with dark mode support)
- Socket.IO client for live messaging
- Axios for API calls
- Lucide React for icons

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- Socket.IO for WebSocket communication
- JWT (JSON Web Tokens) for authentication
- Bcrypt for password hashing
- Multer for file handling

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local or a cloud instance like MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/yapper.git
   cd yapper
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies and build**
   ```bash
   npm run build
   ```
   This installs frontend dependencies and builds the React app into `/client/dist`.

4. **Set up your environment variables**

   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_URI=your_mongodb_connection_string
   TOKEN_SECRET=your_jwt_secret_key
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. Open your browser and head to `http://localhost:3000`

---

## 📁 Project Structure

```
yapper/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/      # Header, Sidebar, MembersList, AppLayout HOC
│   │   ├── contexts/        # React contexts (User, Chat, Theme)
│   │   ├── modals/          # SearchUser, CreateGroup, Notification
│   │   ├── pages/           # Landing, Login, Signup, Home, Chat, NotFound
│   │   └── assets/          # Logo and static assets
│   └── ...
├── server/
│   ├── controllers/         # Route handlers (auth, chat, user)
│   ├── middlewares/         # JWT auth, Multer
│   ├── models/              # Mongoose schemas (User, Chat, Message)
│   ├── routes/              # Express routers
│   ├── utils/               # Helper utilities
│   ├── socket.js            # All WebSocket event handling
│   └── app.js               # Express app entry point
└── package.json
```

---

## 🔐 How Authentication Works

Yapper uses **JWT tokens stored in HTTP-only cookies** — meaning your token is never exposed to JavaScript on the page, which keeps things secure.

When you log in:
1. The server verifies your credentials
2. A signed JWT is created and stored in a secure cookie
3. That cookie is sent automatically with every request
4. Protected routes check and verify the token on each request

You can optionally check **"Remember me"** at login to extend your session to 30 days instead of 1 day.

Logging out clears the cookie and ends the session.

---

## 💬 Features In Detail

### Direct Messages
Search for any user by username and start a one-on-one conversation instantly. If a chat between you two already exists, it opens right up instead of creating a duplicate.

### Group Chats
Create a group, give it a name, and add at least two other members. Once created, a unique **invite code** is generated. Share it with anyone — they can paste it into the "Join Group" tab to join directly.

### Real-Time Messaging
All messages are delivered via WebSockets. When you open a chat, the last 20 messages load immediately, and older messages load as you scroll up. New messages arrive instantly for everyone in the room.

### Replies
Hover over any message and click the dropdown arrow to reply. Your reply shows a preview of the original message inline, keeping the conversation thread readable.

### Edit & Delete
Made a typo? Hit the dropdown on your own message and choose Edit. Changed your mind? Delete it — it disappears for everyone in the chat immediately.

### Dark Mode
Toggle dark mode from the header. Your preference is saved locally and persists across sessions.

### Members List
In any group chat, a collapsible members panel shows everyone in the conversation, with the admin clearly labeled. On mobile, this is accessible via the people icon in the header.

---

## 🔌 API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new account |
| POST | `/login` | Log in and receive a session cookie |
| POST | `/logout` | Clear session and log out |

### Chat Routes (`/api/chats`) — requires auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user-chats` | Get all chats for the current user |
| POST | `/create-group` | Create a new group chat |
| POST | `/join?joinLink=...` | Join a group via invite code |
| GET | `/:chatId/members` | Get members list for a chat |

### User Routes (`/api/user`) — requires auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/newChat` | Start a direct message with a user |
| GET | `/search?name=...` | Search users by username |

### WebSocket Events
| Event (client → server) | Description |
|--------------------------|-------------|
| `join_room` | Join a chat room and load messages |
| `send_message` | Send a new message |
| `reply_message` | Send a reply to a specific message |
| `edit_message` | Edit an existing message |
| `delete_message` | Delete a message |
| `load_more` | Load older messages (scroll pagination) |

| Event (server → client) | Description |
|--------------------------|-------------|
| `load_messages` | Initial message batch on join |
| `receive_message` | New message arrived |
| `message_edited` | A message was updated |
| `message_deleted` | A message was removed |
| `load_more_messages` | Older message batch loaded |

---

## 🗄️ Data Models

**User**
- `name`, `username` (unique), `email` (unique), `password` (hashed)
- `avatar` (URL), `bio`, `accessToken`

**Chat**
- `name`, `groupChat` (boolean)
- `admin` (ref to User), `members` (array of User refs)
- `joinLink` (unique, group chats only)

**Message**
- `sender` (ref to User), `chat` (ref to Chat)
- `content`
- `replyTo` (ref to Message, optional)
- `deleted` (boolean)

---

## 🙌 Contributing

Pull requests are welcome. If you find a bug or have a feature idea, open an issue first so we can talk through it before diving into code.

---
