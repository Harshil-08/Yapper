import React,{lazy, Suspense} from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

const Landing = lazy(()=> import("./pages/Landing"))
const Home = lazy(()=> import("./pages/Home"))
const Login = lazy(()=> import("./pages/Login"))
const Signup = lazy(()=> import("./pages/Signup"))
const Chat = lazy(()=> import("./pages/Chat"))
const NotFound = lazy(()=> import("./pages/NotFound"))

const App = () => {
	return (
		<BrowserRouter>
			<Suspense fallback={<div>Loading...</div>}>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/home" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/about" element={<h1>About</h1>} />
					<Route path="/chat" element={<Chat />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}

export default App
