import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import LoadingSpinner from './pages/LoadinSpinner';
import ProtectedRoute from './components/ProtectedRoute';

const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Chat = lazy(() => import('./pages/Chat'));
const NotFound = lazy(() => import('./pages/NotFound'));

const App = () => {
	return (
		<BrowserRouter>
			<UserProvider>
				<ChatProvider>
					<ThemeProvider>
						<Suspense fallback={<LoadingSpinner />}>
							<Routes>
								<Route path="/" element={<Landing />} />
								<Route path="/login" element={<Login />} />
								<Route path="/signup" element={<Signup />} />
								<Route path="*" element={<NotFound />} />

								<Route element={<ProtectedRoute />}>
									<Route path="/home" element={<Home />} />
									<Route path="/chat/:group_name" element={<Chat />} />
								</Route>	
							</Routes>
						</Suspense>
					</ThemeProvider>
				</ChatProvider>
			</UserProvider>
		</BrowserRouter>
	);
};

export default App;
