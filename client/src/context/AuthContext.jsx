import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ========================================
    // Load saved login when application starts
    // ========================================

    useEffect(() => {
        const loadUser = async () => {
            const token =
                localStorage.getItem("shopez_token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response =
                    await api.get("/auth/me");

                setUser(response.data.user);
            } catch (error) {
                console.error(
                    "Could not restore login:",
                    error
                );

                localStorage.removeItem(
                    "shopez_token"
                );

                localStorage.removeItem(
                    "shopez_user"
                );

                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // ========================================
    // Register
    // ========================================

    const register = async (
        name,
        email,
        password
    ) => {
        const response = await api.post(
            "/auth/register",
            {
                name,
                email,
                password
            }
        );

        const {
            token,
            user: registeredUser
        } = response.data;

        localStorage.setItem(
            "shopez_token",
            token
        );

        localStorage.setItem(
            "shopez_user",
            JSON.stringify(registeredUser)
        );

        setUser(registeredUser);

        return response.data;
    };

    // ========================================
    // Login
    // ========================================

    const login = async (
        email,
        password
    ) => {
        const response = await api.post(
            "/auth/login",
            {
                email,
                password
            }
        );

        const {
            token,
            user: loggedInUser
        } = response.data;

        localStorage.setItem(
            "shopez_token",
            token
        );

        localStorage.setItem(
            "shopez_user",
            JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);

        return response.data;
    };

    // ========================================
    // Logout
    // ========================================

    const logout = () => {
        localStorage.removeItem(
            "shopez_token"
        );

        localStorage.removeItem(
            "shopez_user"
        );

        setUser(null);
    };

    // ========================================
    // Context value
    // ========================================

    const value = {
        user,
        loading,
        register,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ========================================
// Custom Auth Hook
// ========================================

export const useAuth = () => {
    return useContext(AuthContext);
};