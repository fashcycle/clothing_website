import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // or { role: 'admin' } etc.
  const router = useRouter();

  useEffect(() => {
    // Example: check localStorage or fetch from API
    const token = localStorage.getItem("token");
    if (token) {
      // Decode token if needed (e.g., jwt-decode)
      setUser(localStorage.getItem("user-info")); // mock data
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser(localStorage.getItem("user-info"));
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
