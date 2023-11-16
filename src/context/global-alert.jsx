import { createContext, useState } from "react"

export const GlobalErrorContext = createContext();

export default function GlobalErrorContextProvider ({children}) {
    const [globalalert, setglobalalert] = useState({error: false})
    return <GlobalErrorContext.Provider value={{globalalert, setglobalalert}}>{children}</GlobalErrorContext.Provider>
}