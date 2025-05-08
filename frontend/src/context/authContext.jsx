import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
const { VITE_API_URL } = import.meta.env;

const userContext = createContext();

const AuthContext = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    const response = await axios.get(
                        `${VITE_API_URL}/api/auth/verify`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    if (response.data.success) {
                        setUser(response.data.user);
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('autContext.jsx : Error verifying user:', error);
                if (error.response && !error.response.data.error) {
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        verifyUser();
    }, []);

    const login = user => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Clear user data from local storage
    };

    return (
        <userContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </userContext.Provider>
    );
};

export const useAuth = () => useContext(userContext);

export default AuthContext;
