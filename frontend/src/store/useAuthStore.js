import { create } from "zustand";
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast";
import { data } from "react-router";
import { connect } from "node:quic";
import { io } from "socket.io-client";


const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://chik-chat-backend.onrender.com";
    
export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingInUp: false,
    isUpdatingProfile: false,
    socket: null,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in auth check",)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data }); // data cpming from backend
            toast.success("Account created successfully!");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingInUp: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data }); // data cpming from backend
            toast.success("Login successfully!");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingInUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out")
            console.log("Logout error", error);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("Error in update profile", error)
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, { withCredentials: true })

        socket.connect();

        set({ socket: socket })

        //listen for online users event

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {
        if (get().socket.connected) get().socket.disconnect();
    }
}));