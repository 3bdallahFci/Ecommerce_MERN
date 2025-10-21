import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  login: (username: string, token: string) => void;
  isAuth:boolean;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  login: () => {},
  isAuth:false
});

export const useAuth = () => useContext(AuthContext);
