import { createContext, useState } from "react"

export const GlobalLoadingContext = createContext();

export default function GlobalLoadingContextProvider ({children}) {
    const [globalloadingprogress, setgloballoadingprogress] = useState(0)
    return <GlobalLoadingContext.Provider value={{globalloadingprogress, setgloballoadingprogress}}>{children}</GlobalLoadingContext.Provider>
}