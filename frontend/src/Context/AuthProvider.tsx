import { useState, type FC, type PropsWithChildren } from "react";
import { AuthContext } from "./AuthContext";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setusername] = useState<string | null>(localStorage.getItem("username"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const login = (username: string, token: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    setusername(username)
    setToken(token)
  };

  const isAuth = !!token

  return (
    <AuthContext.Provider value={({username,token, login,isAuth})}>
      {children}
    </AuthContext.Provider>
  );
};



export default AuthProvider;
