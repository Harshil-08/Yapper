import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [message, setMessage] = useState("");
	const navigate = useNavigate();
  
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/auth/login', { email, password, remember });
			navigate('/home');
		} catch (err) {
			if (err.response?.status === 401) {
				setMessage({ type: 'error', text: err.response?.data?.message || 'Login failed' });
			} else {
				setMessage({ type: 'error', text: 'Login failed. Please try again later.' });
			}
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-teal-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
				<h2 className='text-2xl font-bold mb-6 text-center text-teal-600'>Login</h2>
				<form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
					<input 
						type="email"
						placeholder="E-mail"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className='p-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className='p-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
					/>
					<div className="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={remember}
							onChange={() => setRemember(!remember)}
							className="form-checkbox h-4 w-4 text-teal-600"
						/>
						<label className="text-teal-700">Remember me</label>
					</div>
					<button
						type="submit"
						className='bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300'
					>
						Login
					</button>
				</form>
				{message && (
					<div className={`mt-4 text-center ${message.type === 'error' ? 'text-red-600' : 'text-teal-600'}`}>
						<p>{message.text}</p>
					</div>
				)}
				<div className='mt-4 text-center'>
					<p className='text-teal-700'>Don't have an account?</p>
					<a href="/signup" className='text-teal-500 hover:underline'>Sign Up here</a>
				</div>
			</div>
		</div>
	);
};

export default Login;
