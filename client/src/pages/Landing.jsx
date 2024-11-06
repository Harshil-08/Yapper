import React from 'react';
import { useNavigate} from 'react-router-dom';

const Landing = () => {
	const navigate = useNavigate();
	return (
		<div className="font-sans bg-gradient-to-r from-teal-500 to-teal-800 text-white">

			{/* Hero Section */}
			<section className="flex items-center justify-center h-screen text-center bg-cover bg-center relative">
				<div className="absolute inset-0 bg-black opacity-50"></div>
				<div className="z-10">
					<h1 className="text-5xl sm:text-6xl font-bold mb-4">
						Welcome to Yapper
					</h1>
					<p className="text-xl sm:text-2xl mb-6">
						Connect, chat, and share with your community in real time.
					</p>
					<button
						className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-xl font-semibold rounded-lg shadow-lg transform transition-all duration-300"
						onClick={() => navigate('/signup')}
						role="button"
						aria-label="Sign up for Yapper"
					>
						Get Started
					</button>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-white text-gray-900">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h2 className="text-4xl font-semibold mb-12">Features</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
						<div className="bg-teal-50 p-8 rounded-lg shadow-lg">
							<h3 className="text-2xl font-semibold mb-4">Real-time Messaging</h3>
							<p className="text-lg text-gray-600">
								Stay connected with friends and colleagues through fast, secure messaging that happens in real time.
							</p>
						</div>
						<div className="bg-teal-50 p-8 rounded-lg shadow-lg">
							<h3 className="text-2xl font-semibold mb-4">Easy Group Chats</h3>
							<p className="text-lg text-gray-600">
								Create and manage group chats with ease, so you can collaborate or simply catch up with friends.
							</p>
						</div>
						<div className="bg-teal-50 p-8 rounded-lg shadow-lg">
							<h3 className="text-2xl font-semibold mb-4">Private Conversations</h3>
							<p className="text-lg text-gray-600">
								Have one-on-one private chats with anyone in your network, securely and effortlessly.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="bg-teal-800 py-20 text-white">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<h2 className="text-4xl font-semibold mb-12">What People Are Saying</h2>
					<div className="space-y-12">
						<div className="flex flex-col items-center">
							<div className="bg-white p-8 rounded-lg shadow-xl w-96">
								<p className="text-lg text-gray-700 mb-4">"Yapper is a game changer! It's incredibly easy to use, and the real-time chat feature is fantastic for collaboration."</p>
								<p className="font-semibold text-gray-800">John Doe</p>
								<p className="text-gray-500">Software Engineer</p>
							</div>
						</div>
						<div className="flex flex-col items-center">
							<div className="bg-white p-8 rounded-lg shadow-xl w-96">
								<p className="text-lg text-gray-700 mb-4">"I love how intuitive Yapper is. My team is more productive than ever thanks to its seamless communication tools."</p>
								<p className="font-semibold text-gray-800">Jane Smith</p>
								<p className="text-gray-500">Project Manager</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Footer Section */}
			<footer className="bg-teal-900 text-white py-6">
				<div className="max-w-7xl mx-auto text-center">
					<p>&copy; 2024 Yapper, Inc. All Rights Reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default Landing;
