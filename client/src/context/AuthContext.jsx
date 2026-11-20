import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const homeFor = (role) => (role === "ngo" ? "/ngo" : role === "admin" ? "/admin" : "/donor");

const readUser = () => {
    try {
        return JSON.parse(localStorage.getItem("baant_user"));
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(readUser);

    const startSession = ({ token, user }) => {
        localStorage.setItem("baant_token", token);
        localStorage.setItem("baant_user", JSON.stringify(user));
        setUser(user);
        return user;
    };

    const register = async (data) => startSession((await api.post("/auth/register", data)).data);
    const login = async (email, password) =>
        startSession((await api.post("/auth/login", { email, password })).data);

    const logout = () => {
        localStorage.removeItem("baant_token");
        localStorage.removeItem("baant_user");
        setUser(null);
    };

    const updateUser = (u) => {
        localStorage.setItem("baant_user", JSON.stringify(u));
        setUser(u);
    };

    return <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);