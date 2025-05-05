import { jwtDecode } from "jwt-decode";
import { queryClient } from "lib/react-query/queryClient";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
}

interface DecodedToken {
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expiryTimeout, setExpiryTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const navigate = useNavigate(); // <-- Moved inside the component

  const startAutoLogoutTimer = useCallback(
    (expiryTimeMs: number) => {
      if (expiryTimeout) clearTimeout(expiryTimeout);

      const remainingTime = expiryTimeMs - Date.now();
      console.log(`Token expires in: ${remainingTime / 1000} seconds`);

      if (remainingTime > 0) {
        const timeout = setTimeout(() => {
          logout();
          toast.error("Session expired. Please log in again.");
        }, remainingTime);

        setExpiryTimeout(timeout);

        // Session expiry warning
        const warningTime = remainingTime - 120_000;
        if (warningTime > 0) {
          setTimeout(
            () => toast.warning("Session expiring soon!"),
            warningTime
          );
        }
      } else {
        logout();
      }
    },
    [expiryTimeout]
  );

  const login = (userData: User, authToken: string) => {
    const decoded = jwtDecode<DecodedToken>(authToken);
    const expiryMinutes = (decoded.exp * 1000 - Date.now()) / (1000 * 60);
    console.log(`Token expires in: ${expiryMinutes.toFixed(2)} minutes`);
    const expiryTimeMs = decoded.exp * 1000;

    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    startAutoLogoutTimer(expiryTimeMs);
  };

  const logout = useCallback(() => {
    if (expiryTimeout) clearTimeout(expiryTimeout);
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    queryClient.clear();
    navigate("/login"); // Now works correctly
  }, [expiryTimeout, navigate]); // Added navigate to dependencies

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        const expiryMinutes = (decoded.exp * 1000 - Date.now()) / (1000 * 60);
        console.log(`Token expires in: ${expiryMinutes.toFixed(2)} minutes`);

        const expiryTimeMs = decoded.exp * 1000;

        if (expiryTimeMs > Date.now()) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          startAutoLogoutTimer(expiryTimeMs);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout();
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (expiryTimeout) clearTimeout(expiryTimeout);
    };
  }, []); // Empty dependency array - runs only once

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
