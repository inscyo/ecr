import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export default function SocketContextProvider ({children}) {
    const [socketconnection, setsocketconnection] = useState();
    useEffect(() => {
        if(socketconnection) return;
        const socket = io.connect(import.meta.env[
        process.env.NODE_ENV === 'development'
            ? 'VITE_SOCKET_SERVER_NONPROD'
            : 'VITE_SOCKET_SERVER_PROD'
        ]);
        setsocketconnection(socket);
    }, [])
    return <SocketContext.Provider value={{socketconnection}}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext);