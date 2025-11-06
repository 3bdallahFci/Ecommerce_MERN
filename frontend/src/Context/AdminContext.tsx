import React, {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuth: boolean;
}

const AdminAuthContext = createContext<AuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuth:false
});

export const AdminAuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("adminToken")
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("adminToken");
  };

  const isAuth = !!token

  return (
    <AdminAuthContext.Provider value={{ token, login, logout,isAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
