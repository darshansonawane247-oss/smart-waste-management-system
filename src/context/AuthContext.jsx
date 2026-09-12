import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/mockData';
import { getStorageData, setStorageData, KEYS } from '../services/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStorageData(KEYS.CURRENT_USER, DEMO_USERS.citizen);
  });

  useEffect(() => {
    if (user) {
      setStorageData(KEYS.CURRENT_USER, user);
    }
  }, [user]);

  const login = (role, email, password) => {
    let selectedUser = DEMO_USERS[role] || DEMO_USERS.citizen;
    if (email) {
      selectedUser = { ...selectedUser, email };
    }
    setUser(selectedUser);
    return selectedUser;
  };

  const register = (userData) => {
    const newUser = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      area: userData.area || 'Panchavati',
      address: userData.address || '',
      role: 'citizen'
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(KEYS.CURRENT_USER);
  };

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      setUser(DEMO_USERS[newRole]);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user ? user.role : null, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
