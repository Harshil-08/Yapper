import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
	const navigate = useNavigate();
  
	const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      localStorage.setItem('token', response.data.token);
      alert('Login successful');
      navigate('/');
    }catch (err) {
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: err.response?.data?.message || 'login failed' });
      } else {
        setMessage({ type: 'error', text: 'login failed. Please try again later.' });
      }
    }
  };

  return (
		<div className='flex items-center justify-center min-h-screen bg-gray-100'>
			<div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
				<h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
				<form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
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
						Login
					</button>
				</form>
				{message && (
					<div className={`mt-4 text-center text-red-600`}>
						<p>{message.text}</p>
					</div>
				)}
				<div className='mt-4 text-center'>
					<p className='text-gray-600'>Don't have an account?</p>
					<a href="/signup" className='text-blue-500 hover:underline'>Sign Up here</a>
				</div>
			</div>
		</div>
  );
};

export default Login;
