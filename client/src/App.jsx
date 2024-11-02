import React,{lazy} from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

const Home = lazy(()=> import("./pages/Home"))
const Login = lazy(()=> import("./pages/login"))
const Signup = lazy(()=> import("./pages/signup"))
const Chat = lazy(()=> import("./pages/Chat"))
const NotFound = lazy(()=> import("./pages/NotFound"))

const App = () => {
  return (
  <BrowserRouter>
			<Routes>
				<Route path="" element ={<Home/>} />
				<Route path="/login" element={<Login/>} />
				<Route path="/signup" element={<Signup/>} />
				<Route path="/about" element={<h1>about</h1>}/>
				<Route path="/chat" element={<Chat/>} />
				<Route path="*" element={<NotFound/>} />
			</Routes>
		</BrowserRouter>
	)
}

export default App
