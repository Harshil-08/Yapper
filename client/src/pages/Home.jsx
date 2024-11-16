import React from 'react';
import AppLayout from '../components/layout/AppLayout';

const Home = () => {
  return (
    <div className="flex items-center justify-center h-screen text-center p-8 w-full">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-teal-700">Welcome to Yapper!</h1>
        <p className="text-lg text-teal-600">Click on a chat to start a conversation.</p>
        <p className="text-sm text-gray-500">We’re glad to have you here. Connect, share, and stay in touch with your friends and groups effortlessly.</p>
      </div>
    </div>
  );
};

export default AppLayout(Home);
