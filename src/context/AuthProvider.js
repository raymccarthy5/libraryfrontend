import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

console.log(localStorage.getItem('isLoggedIn'))


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem('isLoggedIn') === 'true'
    );

    const [isAdmin, setIsAdmin] = useState(
      localStorage.getItem('isAdmin') === 'true'
    );
    
    const [auth, setAuth] = useState(
      localStorage.getItem('auth')
    );

    const [id, setId] = useState(
      localStorage.getItem('userId')
    );

    console.log(auth);
  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, auth, setAuth, id, setId }}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;