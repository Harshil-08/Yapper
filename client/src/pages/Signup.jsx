import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
	const [name, setname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/auth/signup', { name, email, password });
			setMessage({ type: 'success', text: 'Signup successful!' });
			setTimeout(() => navigate('/login'), 2000);
		} catch (err) {
			if (err.response?.status === 403) {
				setMessage({ type: 'error', text: err.response?.data?.message || 'Signup failed' });
			} else {
				setMessage({ type: 'error', text: 'Signup failed. Please try again later.' });
			}
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-teal-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
				<h2 className='text-2xl font-bold mb-6 text-center text-teal-600'>Signup</h2>
				<form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setname(e.target.value)}
						required
						className='p-2 border border-teal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
					/>
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
					<button
						type="submit"
						className='bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300'
					>
						Signup
					</button>
				</form>
				{message && (
					<div className={`mt-4 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
						<p>{message.text}</p>
					</div>
				)}
				<div className='mt-4 text-center'>
					<p className='text-teal-700'>Already have an account?</p>
					<a href='/login' className='text-teal-500 hover:underline'>Login</a>
				</div>
			</div>
		</div>
	);
};

export default Signup;
