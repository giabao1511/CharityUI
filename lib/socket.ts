import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    // Get base URL and ensure it's properly formatted
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    console.log("🔌 Initializing socket connection to:", baseUrl);

    socket = io(baseUrl, {
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Add connection event listeners for debugging
    socket.on("connect", () => {
      console.log("✅ Socket connected! ID:", socket?.id);
      console.log("✅ Socket transport:", socket?.io.engine.transport.name);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        console.log("🔄 Server disconnected the socket, attempting reconnect...");
        socket?.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.error("❌ Error details:", error);
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Attempting to reconnect... (attempt", attemptNumber, ")");
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection error:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Failed to reconnect after maximum attempts");
    });

    // Expose socket to window for debugging
    if (typeof window !== 'undefined') {
      (window as any).__SOCKET__ = socket;
      console.log("💡 Socket exposed to window.__SOCKET__ for debugging");
    }
  }
  return socket;
}
