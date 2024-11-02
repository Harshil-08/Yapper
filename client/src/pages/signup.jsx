import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/signup', { username, email, password });
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'Signup failed' });
      } else {
        setMessage({ type: 'error', text: 'Signup failed. Please try again later.' });
      }
    }
  };

  return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
				<h2 className='text-2xl font-bold mb-6 text-center'>Signup</h2>
				<form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<input 
						type="email"
						placeholder="E-mail"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className='p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					<button
						type="submit"
						className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
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
					<p className='text-gray-600'>Already have an account?</p>
					<a href='/login' className='text-blue-500 hover:underline'>Login</a>
				</div>
			</div>
		</div>
  );
};

export default Signup;
