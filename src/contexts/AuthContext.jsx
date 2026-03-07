import { createContext, useContext, useEffect, useState } from "react";

/**
 * AuthContext
 * - Keeps user in React state so consumers re-render immediately.
 * - Persists token/user to localStorage for reloads.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Persist user to localStorage for reloads
    if (user) {
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userObj, token) => {
    // Save token and user for persistence; update React state
    try {
      if (token) localStorage.setItem("token", token);
    } catch {
      // ignore
    }
    setUser(userObj);
  };

  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
