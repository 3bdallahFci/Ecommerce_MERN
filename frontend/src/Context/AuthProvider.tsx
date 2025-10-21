import { useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";
const USERNAME_KEY = "username";
const TOKEN_KEY = "token";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setusername] = useState<string | null>(
    localStorage.getItem("username")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (username: string, token: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setusername(username);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setusername(null);
    setToken(null);
  };

  const isAuth = !!token;

  return (
    <AuthContext.Provider value={{ username, token, login, isAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
