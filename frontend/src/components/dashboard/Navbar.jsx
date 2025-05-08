import React from 'react';
import { useAuth } from './../../context/authContext';

const Navbar = () => {
    const { user } = useAuth();
    return (
        <div className="bg-[#2ec4b6] text-white p-4 flex justify-between items-center shadow-md">
            <p className="text-xl font-semibold">Welcome, {user?.name}</p>
            <button className="bg-white text-[#2ec4b6] px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                Logout
            </button>
        </div>
    );
};

export default Navbar;
